import React from 'react';

import * as style from './command-format.module.css';

export interface CommandFormatProps {
  children: string;
}

/**
 * コマンドの入力形式を表す等幅フォントのテキスト
 */
export const CommandFormat = ({
  children
}: CommandFormatProps): React.JSX.Element => (
  <div className={style.command}>
    <code>{children}</code>
  </div>
);
