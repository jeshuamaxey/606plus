import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'item',
  title: 'Item',
  type: 'document',
  fields: [
    defineField({
      name: 'number',
      title: '#',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'designer',
      title: 'Designer',
      type: 'reference',
      to: [{type: 'designer'}],
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{type: 'brand'}],
    }),
    defineField({
      name: 'yearStart',
      title: 'Year Start',
      type: 'number',
      description: 'Start year (optional)',
    }),
    defineField({
      name: 'yearEnd',
      title: 'Year End',
      type: 'number',
      description: 'End year (optional)',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      number: 'number',
    },
    prepare({title, subtitle, number}) {
      return {
        title: `${number ? `#${number}: ` : ''}${title}`,
        subtitle: subtitle,
      }
    },
  },
  orderings: [
    {
      title: 'Number',
      name: 'numberAsc',
      by: [{field: 'number', direction: 'asc'}],
    },
  ],
})

