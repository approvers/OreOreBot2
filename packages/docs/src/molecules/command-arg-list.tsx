import React, { type ReactNode } from 'react';

import * as style from './command-arg-list.module.css';
import { VersionBadge } from './version-badge';

/**
 * コマンド引数の定義
 */
export interface CommandArg {
  /**
   * 引数名
   */
  name: string;
  /**
   * 説明に用いる要素
   */
  about: ReactNode;
  /**
   * その引数がはじめて利用可能になったバージョン
   */
  versionAvailableFrom?: string;
  /**
   * その引数が未指定だったときの既定値
   */
  defaultValue?: ReactNode;
}

const CommandArgListItem = ({
  name,
  about,
  versionAvailableFrom,
  defaultValue
}: CommandArg) => (
  <>
    {name}
    {': '}
    {about}
    <ul className={style.parameter}>
      {versionAvailableFrom && (
        <li>
          <VersionBadge>{versionAvailableFrom}</VersionBadge> から利用可能
        </li>
      )}
      {defaultValue && (
        <li>
          デフォルト値: <code>{defaultValue}</code>
        </li>
      )}
    </ul>
  </>
);

/**
 * コマンド引数リスト
 */
export const CommandArgList = ({
  args
}: {
  args: readonly CommandArg[];
}): JSX.Element => (
  <ul className={style.args}>
    {args.map((arg) => (
      <li key={arg.name}>
        <CommandArgListItem {...arg} />
      </li>
    ))}
  </ul>
);
