import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  markdown: {
    syntaxHighlight: 'prism',
    gfm: true,
    rehypePlugins: [
      [
        rehypeHeadingIds,
        {
          headingIdCompat: true
        }
      ],
      [
        rehypeAutolinkHeadings,
        {
          test: ['h2', 'h3']
        }
      ]
    ]
  },
  integrations: [
    starlight({
      title: 'OreOreBot2 Documents',
      logo: {
        src: './public/haracho-transmission.png'
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/approvers/OreOreBot2'
        }
      ],
      editLink: {
        baseUrl:
          'https://github.com/approvers/OreOreBot2/edit/main/packages/docs/src/content/docs/'
      }
    }),
    react(),
    mdx({})
  ]
});
