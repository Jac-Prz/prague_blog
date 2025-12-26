import {defineType, defineField} from 'sanity'

export const youtubeEmbedType = defineType({
  name: 'youtubeEmbed',
  title: 'YouTube',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      validation: (Rule) =>
        Rule.required()
          .uri({scheme: ['http', 'https']})
          .custom((url) => {
            if (!url) return true;
            
            // Accept youtube.com and youtu.be URLs
            const isYouTube = 
              url.includes('youtube.com/watch') || 
              url.includes('youtu.be/') ||
              url.includes('youtube.com/embed/');
            
            return isYouTube || 'Please enter a valid YouTube URL';
          }),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Used for accessibility (optional)',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      url: 'url',
      title: 'title',
    },
    prepare({url, title}) {
      // Extract video ID for preview
      let videoId = '';
      if (url) {
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
        videoId = match ? match[1] : '';
      }
      
      return {
        title: 'YouTube',
        subtitle: title || videoId || url,
      };
    },
  },
})
