import {defineType, defineField} from 'sanity'

const PLATFORMS = [
  {title: 'Instagram', value: 'instagram'},
  {title: 'Facebook', value: 'facebook'},
  {title: 'Bluesky', value: 'bluesky'},
  {title: 'X (Twitter)', value: 'x'},
]

const PLATFORM_DOMAINS = {
  instagram: 'instagram.com',
  facebook: 'facebook.com',
  bluesky: 'bsky.app',
  x: ['x.com', 'twitter.com'],
}

export const socialEmbedType = defineType({
  name: 'socialEmbed',
  title: 'Social Media Embed',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: PLATFORMS,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Post URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required()
          .uri({scheme: ['http', 'https']})
          .custom((url, context) => {
            if (!url) return true;
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const platform = (context.parent as any)?.platform;
            if (!platform) return 'Please select a platform first';
            
            const domains = PLATFORM_DOMAINS[platform as keyof typeof PLATFORM_DOMAINS];
            const domainList = Array.isArray(domains) ? domains : [domains];
            
            const isValid = domainList.some(domain => url.includes(domain));
            
            return isValid || `Please enter a valid ${platform} URL`;
          }),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
      description: 'Optional context or note about this post',
    }),
  ],
  preview: {
    select: {
      platform: 'platform',
      url: 'url',
    },
    prepare({platform, url}) {
      const platformTitle = PLATFORMS.find(p => p.value === platform)?.title || platform;
      
      return {
        title: `Embed: ${platformTitle}`,
        subtitle: url,
      };
    },
  },
})
