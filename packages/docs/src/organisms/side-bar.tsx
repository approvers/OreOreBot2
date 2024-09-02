import React from 'react';

import { Page } from '../types';
import * as styles from './side-bar.module.css';

export type SideBarProps = {
  siblings: Page[];
  childrenPages: Page[];
};

export function SideBar({
  siblings,
  childrenPages
}: SideBarProps): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.neighborPages}>
        <li className={styles.neighborPageList}>
          {siblings.map(({ title, uri }) => (
            <a key={uri} href={uri}>
              <div>{title}</div>
            </a>
          ))}
          <hr />
          {childrenPages.map(({ title, uri }) => (
            <a key={uri} href={uri}>
              <div>{title}</div>
            </a>
          ))}
        </li>
      </div>
      <div className={styles.themeSwitch}>Light to Dark</div>
    </div>
  );
}
