import { MDXProvider } from '@mdx-js/react';
import type { PageProps } from 'gatsby';
import React, { useState } from 'react';

import { Heading, Page } from '../types';
import { NavHeader } from './nav-header';
import { SideBar } from './side-bar';

export function Layout({
  children,
  pageContext
}: PageProps<
  unknown,
  {
    body: string;
    title: string;
    siblings: Page[];
    children: Page[];
    headings?: Heading[];
  }
>): JSX.Element {
  const [sideMenuShown, setSideMenuShown] = useState(false);
  function toggleMenu() {
    setSideMenuShown((flag) => !flag);
  }
  return (
    <>
      <title>{pageContext.title} - OreOreBot2 Documents</title>
      <div>
        <header>
          <NavHeader onClickMenu={toggleMenu} />
        </header>
        <main>
          <MDXProvider>{children}</MDXProvider>
        </main>
        <aside>
          <SideBar
            shown={sideMenuShown}
            onClickItem={toggleMenu}
            siblings={pageContext.siblings}
            childrenPages={pageContext.children}
            headings={pageContext.headings}
          />
        </aside>
        <footer>Copyright 2021 Approvers</footer>
      </div>
    </>
  );
}
