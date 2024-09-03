import { Link } from 'gatsby';
import React from 'react';

import iconImg from '../../assets/haracho-transmission.png';
import * as styles from './nav-header.module.css';

export type NavHeaderProps = {
  onClickMenu?: () => void;
};

export function NavHeader({ onClickMenu }: NavHeaderProps): JSX.Element {
  return (
    <div className={styles.navBarContainer}>
      <nav className={styles.navBar}>
        <Link to="/" className={styles.topLink}>
          <img
            className={styles.rounded}
            src={iconImg}
            alt=""
            loading="lazy"
            width="50"
            height="50"
          />
          <span className={styles.siteName}>OreOreBot2 Documents</span>
        </Link>
        <Link to="/references" className={styles.showOnWide}>
          リファレンス
        </Link>
        <Link to="/development" className={styles.showOnWide}>
          開発ガイド
        </Link>
        <a href="https://github.com/approvers/OreOreBot2">GitHub</a>
        <button className={styles.menuButton} onClick={onClickMenu}>
          <span>≡</span>
        </button>
      </nav>
    </div>
  );
}
