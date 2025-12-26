import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: '1-2 sentences summarizing the article',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: (Rule) => Rule.required(),
        })
      ]
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
      validation: (Rule) => Rule.required().min(1).max(2),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this post in the "Start Here" section on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Image for article header (1200x630px recommended)',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Social Sharing',
      type: 'object',
      description: 'Search engine and social media optimization',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'SEO title (50-60 chars). Should be different from post title - make it clearer/shorter for search.',
          validation: (Rule) => Rule.required().max(60).custom((value, context) => {
            const postTitle = (context.document as any)?.title;
            if (value && postTitle && value === postTitle) {
              return 'Meta title should be different from post title (make it clearer/shorter for search)';
            }
            return true;
          }),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'SEO description (150-160 chars). Write for humans, not search engines.',
          validation: (Rule) => Rule.required().min(150).max(160),
        }),
        defineField({
          name: 'ogImage',
          title: 'Social Sharing Image',
          type: 'image',
          description: 'Image for social media sharing (1200x630px). Falls back to Featured Image if empty.',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            })
          ]
        }),
        defineField({
          name: 'noIndex',
          title: 'Hide from Search Engines',
          type: 'boolean',
          description: 'Enable to prevent search engines from indexing this post',
          initialValue: false,
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      categories: 'categories',
      featured: 'featured',
      status: 'status',
    },
    prepare(selection) {
      const {author, categories, featured, status} = selection
      const category = categories && categories.length > 0 ? categories[0].title : null
      const subtitle = [
        status === 'draft' && '📝 Draft',
        featured && '⭐ Featured',
        category,
        author && `by ${author}`,
      ].filter(Boolean).join(' • ')
      
      return {...selection, subtitle}
    },
  },
})
