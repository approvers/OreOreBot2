import React from 'react';

import { Page } from '../types';
import * as styles from './side-bar.module.css';

export type SideBarProps = {
  siblings: Page[];
};

export function SideBar({ siblings }: SideBarProps): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.neighborPages}>
        <li className={styles.neighborPageList}>
          {siblings.map(({ title, relativePath }) => (
            <a key={relativePath} href={'/' + relativePath}>
              <div>{title}</div>
            </a>
          ))}
        </li>
      </div>
      <div className={styles.themeSwitch}>Light to Dark</div>
    </div>
  );
}
