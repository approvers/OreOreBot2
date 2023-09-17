import React from 'react';

import { Badge } from '../atoms/badge';
import style from './feature-badge.module.css';

export interface FeatureProps {
  children: React.ReactNode;
}

export const FeatureBadge = ({ children }: FeatureProps): JSX.Element => {
  return (
    <span className={style.feature}>
      <Badge>{children}</Badge>
    </span>
  );
};
