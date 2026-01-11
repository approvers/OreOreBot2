import React from 'react';

import type { Page } from '../types';
import * as styles from './side-bar.module.css';

export type SideBarProps = {
  shown: boolean;
  siblings: Page[];
  childrenPages: Page[];
};

export function SideBar({
  shown,
  siblings,
  childrenPages
}: SideBarProps): React.JSX.Element {
  return (
    <div className={styles.container} data-shown={shown}>
      <div className={styles.neighborPages}>
        <p>隣のページ</p>
        <ul className={styles.neighborPageList}>
          {siblings.map(({ title, uri }) => (
            <li className={styles.neighborPage} key={uri}>
              <a className={styles.neighborLink} href={uri}>
                <div>{title}</div>
              </a>
            </li>
          ))}
        </ul>
        <hr />
        <p>子のページ</p>
        <ul className={styles.neighborPageList}>
          {childrenPages.map(({ title, uri }) => (
            <li key={uri}>
              <a className={styles.neighborLink} href={uri}>
                <div>{title}</div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
