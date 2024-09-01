import { Link } from 'gatsby';
import React from 'react';

import iconImg from '../../assets/haracho-transmission.png';
import * as styles from './nav-header.module.css';

export function NavHeader(): JSX.Element {
  return (
    <nav className={styles.navBar}>
      <Link to="/" className={styles.topLink}>
        <img src={iconImg} alt="" loading="lazy" width="50" height="50" />
        <span className={styles.siteName}>OreOreBot2 Documents</span>
      </Link>
      <Link to="/references">リファレンス</Link>
      <Link to="/development">開発ガイド</Link>
      search-bar
      <a href="https://github.com/approvers/OreOreBot2">GitHub</a>
    </nav>
  );
}
