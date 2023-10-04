import type { ReactNode } from 'react';

import style from './badge.module.css';

export interface BadgeProps {
  children: ReactNode;
}

/**
 * 文字を入れて使う丸角のバッジ
 */
export const Badge = ({ children }: BadgeProps): JSX.Element => {
  return <span className={style.badge}>{children}</span>;
};
