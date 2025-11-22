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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
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
      media: 'image',
    },
    prepare({title, subtitle, number, media}) {
      return {
        title: `${number ? `#${number}: ` : ''}${title}`,
        subtitle: subtitle,
        media: media,
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

