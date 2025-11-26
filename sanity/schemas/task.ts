import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'task',
  title: 'Task',
  type: 'document',
  fields: [
    defineField({
      name: 'item',
      title: 'Item',
      type: 'reference',
      to: [{type: 'item'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'missingFields',
      title: 'Missing Fields',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Images', value: 'images'},
          {title: 'Name', value: 'name'},
          {title: 'Description', value: 'description'},
          {title: 'Brand', value: 'brand'},
          {title: 'Category', value: 'category'},
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'completed',
      title: 'Completed',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'completedAt',
      title: 'Completed At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      itemName: 'item.name',
      itemNumber: 'item.number',
      missingFields: 'missingFields',
      completed: 'completed',
    },
    prepare({itemName, itemNumber, missingFields, completed}) {
      const missingCount = missingFields?.length || 0
      const status = completed ? '✓ Completed' : 'Incomplete'
      return {
        title: `${itemNumber ? `#${itemNumber}: ` : ''}${itemName || 'Unknown Item'}`,
        subtitle: `${status} - ${missingCount} missing field${missingCount !== 1 ? 's' : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Created Date',
      name: 'createdAtDesc',
      by: [{field: '_createdAt', direction: 'desc'}],
    },
    {
      title: 'Completed Date',
      name: 'completedAtDesc',
      by: [{field: 'completedAt', direction: 'desc'}],
    },
  ],
})

