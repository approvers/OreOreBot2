import React from 'react';

import { Badge } from '../atoms/badge';
import * as style from './version-badge.module.css';

export interface VersionProps {
  children: React.ReactNode;
}

/**
 * OreOreBot2 の特定のバージョンを表す緑色のバッジ
 */
export const VersionBadge = ({ children }: VersionProps): JSX.Element => {
  return (
    <span className={style.version}>
      <Badge>{children}</Badge>
    </span>
  );
};
