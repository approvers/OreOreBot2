import { MDXProvider } from '@mdx-js/react';
import type { PageProps } from 'gatsby';
import React from 'react';

import { NavHeader } from '../organisms/nav-header';
import { SideBar } from '../organisms/side-bar';
import { Page } from '../types';
import './theme.css';

export default function Layout({
  children,
  pageContext
}: PageProps<
  unknown,
  {
    body: string;
    title: string;
    siblings: Page[];
    children: Page[];
  }
>): JSX.Element {
  return (
    <>
      <title>{pageContext.title} - OreOreBot2 Documents</title>
      <div>
        <header>
          <NavHeader />
        </header>
        <main>
          <MDXProvider>{children}</MDXProvider>
        </main>
        <aside>
          <SideBar
            siblings={pageContext.siblings}
            childrenPages={pageContext.children}
          />
        </aside>
        <footer>Copyright 2021 Approvers</footer>
      </div>
    </>
  );
}
