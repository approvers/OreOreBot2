import { Link } from 'gatsby';
import React from 'react';

import { Heading, Page } from '../types';
import * as styles from './side-bar.module.css';

function HeadingLink({ title, url, items }: Heading): JSX.Element {
  return (
    <li className={styles.neighborPage} key={url}>
      <a className={styles.neighborLink} href={url}>
        <div>{title}</div>
      </a>
      {items && (
        <ol className={styles.neighborPageList}>{items.map(HeadingLink)}</ol>
      )}
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
        <p>目次</p>
        <ol className={styles.neighborPageList} onClick={onClickItem}>
          {headings?.map(HeadingLink)}
        </ol>
        <hr />
        <p>隣のページ</p>
        <ul className={styles.neighborPageList}>
          {siblings.map(({ title, uri }) => (
            <li className={styles.neighborPage} key={uri}>
              <Link className={styles.neighborLink} to={uri}>
                <div>{title}</div>
              </Link>
            </li>
          ))}
        </ul>
        <hr />
        <p>子のページ</p>
        <ul className={styles.neighborPageList}>
          {childrenPages.map(({ title, uri }) => (
            <li key={uri}>
              <Link className={styles.neighborLink} to={uri}>
                <div>{title}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.themeSwitch}>Light to Dark</div>
    </div>
  );
}
