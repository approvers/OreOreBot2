import type { GatsbyConfig } from 'gatsby';

export default {
  siteMetadata: {
    title: 'OreOreBot2 Documents',
    siteUrl: 'https://haracho.approvers.dev/'
  },
  graphqlTypegen: true,
  plugins: [
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'assets/haracho.png'
      }
    },
    'gatsby-transformer-remark'
  ]
} satisfies GatsbyConfig;
