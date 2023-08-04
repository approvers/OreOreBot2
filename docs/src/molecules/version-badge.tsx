import React from 'react';

import { Badge } from '../atoms/badge';
import style from './version-badge.module.css';

export interface VersionProps {
  children: React.ReactNode;
}

export const VersionBadge = ({ children }: VersionProps): JSX.Element => {
  return (
    <span className={style.version}>
      <Badge>{children}</Badge>
    </span>
  );
};
