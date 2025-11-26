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
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            // Add 4:3 aspect ratio preset to the cropper
            preview: [
              {
                title: '4:3',
                aspectRatio: 4 / 3,
              },
            ],
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Alternative text for the image (required for accessibility)',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'credit',
              title: 'Credit',
              type: 'string',
              description: 'Image credit or attribution (e.g., photographer name, source)',
            }),
          ],
          preview: {
            select: {
              title: 'alt',
              media: 'asset',
            },
            prepare({title, media}) {
              return {
                title: title || 'Image',
                media: media,
              }
            },
          },
        },
      ],
      description: 'Additional images to display on the item detail page (displayed as 4:3 landscape). After uploading, set the hotspot (focal point) by clicking and dragging on each image. Recommended: upload as 4:3 landscape and set hotspot on the main subject.',
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
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'string',
      description: 'Materials used in the object (e.g., "Porcelain", "Oak and steel")',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      description: 'Dimensions of the object (e.g., "240×180×280", "Ø 34mm")',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      number: 'number',
      media: 'images.0.asset',
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

