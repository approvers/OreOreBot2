import type { ReactNode } from 'react';

import style from './badge.module.css';

export interface BadgeProps {
  children: ReactNode;
}

export const Badge = ({ children }: BadgeProps): JSX.Element => {
  return <span className={style.badge}>{children}</span>;
};
