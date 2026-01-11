import type { Command, Page } from '@/types';
import React, { type JSX, type ReactNode, useState } from 'react';

import { CommandArgs } from './command-args';
import { NavHeader } from './nav-header';
import { SideBar } from './side-bar';

export interface LayoutProps {
  title: string;
  command?: Command;
  siblings: Page[];
  childrenPages: Page[];
  children: ReactNode;
}

export function Layout({
  title,
  command,
  siblings,
  childrenPages,
  children
}: LayoutProps): JSX.Element {
  const [sideMenuShown, setSideMenuShown] = useState(false);
  function toggleMenu() {
    setSideMenuShown((flag) => !flag);
  }
  return (
    <>
      <header>
        <NavHeader onClickMenu={toggleMenu} />
      </header>
      <main>
        <h1>{title}</h1>
        {command && <CommandArgs {...command} />}
        {children}
      </main>
      <aside>
        <SideBar
          shown={sideMenuShown}
          siblings={siblings}
          childrenPages={childrenPages}
        />
      </aside>
      <footer>Copyright 2021 Approvers</footer>
    </>
  );
}
