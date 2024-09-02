import type { GatsbyNode } from 'gatsby';
import path from 'node:path';

import { Page } from './src/types';

export const createPages: GatsbyNode['createPages'] = async (api) => {
  // get mdx pages
  const res = await api.graphql<{
    allMdx: {
      nodes: {
        body: string;
        parent: {
          dir: string;
          relativePath: string;
          absolutePath: string;
        };
        frontmatter: {
          title: string;
        };
      }[];
    };
  }>(`
    {
      allMdx {
        nodes {
          body
          parent {
            ... on File {
              dir
              relativePath
              absolutePath
            }
          }
          frontmatter {
            title
          }
        }
      }
    }
  `);
  if (res.errors) {
    api.reporter.panicOnBuild('querying mdx pages failed');
    return;
  }

  const pages = res.data?.allMdx.nodes!.map(
    ({
      body,
      parent: { dir, relativePath, absolutePath },
      frontmatter: { title }
    }): Page => ({
      body,
      dir,
      relativePath,
      absolutePath,
      title
    })
  );

  // group pages by its directory
  const pagesByDir: Record<string, Page[]> = {};
  for (const page of pages) {
    if (!pagesByDir[page.dir]) {
      pagesByDir[page.dir] = [];
    }
    pagesByDir[page.dir].push(page);
  }

  const componentPath = path.resolve('src/templates/layout.tsx');
  for (const page of pages) {
    const { body, dir, absolutePath, relativePath, title } = page;
    const path = '/' + relativePath.replace(/(index)?\.mdx$/, '');
    api.actions.createPage({
      path,
      component: `${componentPath}?__contentFilePath=${absolutePath}`,
      context: {
        body,
        title,
        siblings: pagesByDir[dir] ?? []
      }
    });
  }
};
