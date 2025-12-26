import {defineType, defineArrayMember, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * This is the schema type for block content used in the post document type
 * Configured for editorial content with custom "Practical Prague" blocks
 */

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    // Standard rich text block
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              defineField({
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (Rule) => Rule.required().uri({
                  scheme: ['http', 'https', 'mailto'],
                }),
              }),
              defineField({
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),

    // Image block
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
      ],
    }),

    // Custom block: Place recommendation
    defineArrayMember({
      type: 'object',
      name: 'place',
      title: 'Place',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'category',
          title: 'Category',
          type: 'string',
          options: {
            list: [
              {title: 'Café', value: 'cafe'},
              {title: 'Restaurant', value: 'restaurant'},
              {title: 'Bar', value: 'bar'},
              {title: 'Bakery', value: 'bakery'},
              {title: 'Market', value: 'market'},
              {title: 'Shop', value: 'shop'},
              {title: 'Other', value: 'other'},
            ],
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'neighborhood',
          title: 'Neighborhood',
          type: 'string',
        }),
        defineField({
          name: 'price',
          title: 'Price',
          type: 'string',
          options: {
            list: [
              {title: '€ (Budget)', value: '€'},
              {title: '€€ (Moderate)', value: '€€'},
              {title: '€€€ (Expensive)', value: '€€€'},
            ],
          },
        }),
        defineField({
          name: 'whyGo',
          title: 'Why Go',
          type: 'text',
          rows: 2,
          description: '1-2 sentences',
          validation: (Rule) => Rule.required().max(200),
        }),
        defineField({
          name: 'whatToGet',
          title: 'What to Get',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'practical',
          title: 'Practical Info',
          type: 'array',
          of: [{type: 'string'}],
          description: 'E.g. "Cash only", "Book ahead", "Best before 10am"',
        }),
        defineField({
          name: 'mapLink',
          title: 'Map Link',
          type: 'url',
        }),
      ],
      preview: {
        select: {
          name: 'name',
          category: 'category',
          neighborhood: 'neighborhood',
        },
        prepare({name, category, neighborhood}) {
          const emoji = {
            cafe: '☕',
            restaurant: '🍽️',
            bar: '🍺',
            bakery: '🥖',
            market: '🛒',
            shop: '🏪',
            other: '📍',
          }[category] || '📍'
          
          return {
            title: `${emoji} ${name}`,
            subtitle: neighborhood || category,
          }
        },
      },
    }),

    // Custom block: Practical Tip
    defineArrayMember({
      type: 'object',
      name: 'practicalTip',
      title: 'Practical Tip',
      fields: [
        defineField({
          name: 'variant',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              {title: 'Tip', value: 'tip'},
              {title: 'Warning', value: 'warning'},
              {title: 'Avoid', value: 'avoid'},
              {title: 'Logistics', value: 'logistics'},
            ],
          },
          initialValue: 'tip',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [{title: 'Normal', value: 'normal'}],
              lists: [],
              marks: {
                decorators: [
                  {title: 'Strong', value: 'strong'},
                  {title: 'Emphasis', value: 'em'},
                ],
                annotations: [],
              },
            },
          ],
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: {
          variant: 'variant',
          title: 'title',
        },
        prepare({variant, title}) {
          const emoji = {
            tip: '💡',
            warning: '⚠️',
            avoid: '🚫',
            logistics: '📋',
          }[variant] || '💡'
          
          return {
            title: `${emoji} ${variant.charAt(0).toUpperCase() + variant.slice(1)}`,
            subtitle: title || 'Practical tip',
          }
        },
      },
    }),

    // Custom block: Quick Summary
    defineArrayMember({
      type: 'object',
      name: 'quickSummary',
      title: 'Quick Summary',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'In short',
        }),
        defineField({
          name: 'bullets',
          title: 'Bullets',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(2).max(6),
        }),
      ],
      preview: {
        select: {
          title: 'title',
          bullets: 'bullets',
        },
        prepare({title, bullets}) {
          return {
            title: `📝 ${title}`,
            subtitle: `${bullets?.length || 0} bullets`,
          }
        },
      },
    }),

    // Custom block: Pros & Cons
    defineArrayMember({
      type: 'object',
      name: 'prosCons',
      title: 'Pros & Cons',
      fields: [
        defineField({
          name: 'pros',
          title: 'Pros',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
          name: 'cons',
          title: 'Cons',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
      preview: {
        select: {
          pros: 'pros',
          cons: 'cons',
        },
        prepare({pros, cons}) {
          return {
            title: '⚖️ Pros & Cons',
            subtitle: `${pros?.length || 0} pros, ${cons?.length || 0} cons`,
          }
        },
      },
    }),

    // YouTube embed
    defineArrayMember({
      type: 'youtubeEmbed',
    }),

    // Social media embed
    defineArrayMember({
      type: 'socialEmbed',
    }),
  ],
})
