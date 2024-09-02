// @ts-check
// NOTE: this file must be a `.mjs` file due to that `remark-gfm` supports only ES Modules and the limitations of `gatsby-config`: https://www.gatsbyjs.com/docs/how-to/custom-configuration/es-modules/#current-limitations
import { dirname } from 'path';
import remarkGfm from 'remark-gfm';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('gatsby').GatsbyConfig}
 */
const config = {
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
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm]
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/pages`
      }
    }
  ]
};

export default config;
