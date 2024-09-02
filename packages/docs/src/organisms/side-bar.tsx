import React from 'react';

import { Heading, Page } from '../types';
import * as styles from './side-bar.module.css';

function HeadingLink({ title, url, items }: Heading): JSX.Element {
  return (
    <li>
      <a href={url}>
        <div>{title}</div>
      </a>
      {items && <ol>{items.map(HeadingLink)}</ol>}
    </li>
  );
}

export type SideBarProps = {
  shown: boolean;
  siblings: Page[];
  childrenPages: Page[];
  headings?: Heading[];
  onClickItem?: () => void;
};

export function SideBar({
  shown,
  siblings,
  childrenPages,
  headings,
  onClickItem
}: SideBarProps): JSX.Element {
  return (
    <div className={styles.container} data-shown={shown}>
      <div className={styles.neighborPages}>
        <ol onClick={onClickItem}>{headings?.map(HeadingLink)}</ol>
        <hr />
        <ol className={styles.neighborPageList}>
          {siblings.map(({ title, uri }) => (
            <li key={uri}>
              <a href={uri}>
                <div>{title}</div>
              </a>
            </li>
          ))}
        </ol>
        <hr />
        <ol className={styles.neighborPageList}>
          {childrenPages.map(({ title, uri }) => (
            <li key={uri}>
              <a href={uri}>
                <div>{title}</div>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.themeSwitch}>Light to Dark</div>
    </div>
  );
}
