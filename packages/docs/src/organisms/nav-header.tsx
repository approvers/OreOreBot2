import React from 'react';

import * as styles from './nav-header.module.css';

export type NavHeaderProps = {
  onClickMenu?: () => void;
};

export function NavHeader({ onClickMenu }: NavHeaderProps): React.JSX.Element {
  return (
    <div className={styles.navBarContainer}>
      <nav className={styles.navBar}>
        <a href="/" className={styles.topLink}>
          <img
            className={styles.rounded}
            src="/haracho-transmission.png"
            alt=""
            width="50"
            height="50"
          />
          <span className={styles.siteName}>OreOreBot2 Documents</span>
        </a>
        <a href="/references" className={styles.showOnWide}>
          リファレンス
        </a>
        <a href="/development" className={styles.showOnWide}>
          開発ガイド
        </a>
        <a href="https://github.com/approvers/OreOreBot2">GitHub</a>
        <button className={styles.menuButton} onClick={onClickMenu}>
          <span>≡</span>
        </button>
      </nav>
    </div>
  );
}
