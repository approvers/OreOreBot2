import type { GatsbyNode } from 'gatsby';
import path from 'node:path';

import { Page } from './src/types';

export const createPages: GatsbyNode['createPages'] = async (api) => {
  // get mdx pages
  type Content = {
    url: string;
    title: string;
    items?: Content[];
  };
  const res = await api.graphql<{
    allMdx: {
      nodes: {
        body: string;
        tableOfContents: {
          items?: Content[];
        };
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
          tableOfContents
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
      frontmatter: { title },
      tableOfContents
    }): Page => ({
      body,
      dir,
      uri: '/' + relativePath.replace(/(index)?\.mdx$/, ''),
      absolutePath,
      title,
      headings: tableOfContents.items
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
  const childrenDirsByPath: Record<string, string[]> = {};
  for (const page of pages) {
    const superPath = page.absolutePath.endsWith('/index.mdx')
      ? path.dirname(path.dirname(page.absolutePath)) + '/index.mdx'
      : path.basename(page.absolutePath) + '/index.mdx';
    console.log({ path: page.absolutePath, superPath });
    if (!childrenDirsByPath[superPath]) {
      childrenDirsByPath[superPath] = [];
    }
    childrenDirsByPath[superPath].push(page.dir);
  }

  const componentPath = path.resolve('src/templates/layout.tsx');
  for (const page of pages) {
    const { body, dir, uri, absolutePath, title, headings } = page;

    const siblings = pagesByDir[dir] ?? [];
    const children = (childrenDirsByPath[absolutePath] ?? []).flatMap(
      (childrenDirs) => pagesByDir[childrenDirs] ?? []
    );
    api.actions.createPage({
      path: uri,
      component: `${componentPath}?__contentFilePath=${absolutePath}`,
      context: {
        body,
        title,
        siblings,
        children,
        headings
      }
    });
  }
};
