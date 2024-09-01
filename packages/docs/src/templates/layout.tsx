import React, { ReactNode } from 'react';

import { NavHeader } from '../organisms/nav-header';
import './theme.css';

export function Layout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div>
      <header>
        <NavHeader />
      </header>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
}
