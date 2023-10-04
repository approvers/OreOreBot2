import React from 'react';

import { CommandArg, CommandArgList } from '../molecules/command-arg-list';
import { CommandFormat } from '../molecules/command-format';
import { VersionBadge } from '../molecules/version-badge';

/**
 * コマンドを説明するための情報の定義
 */
export interface CommandArgsProps {
  /**
   * コマンドがはじめて利用可能になったバージョン
   */
  versionAvailableFrom: string;
  /**
   * コマンド名
   */
  commandName: string;
  /**
   * コマンドの引数の定義
   */
  args?: readonly CommandArg[];
}

/**
 * コマンドを入力する時の形式の文字列を構築します。
 *
 * @param commandName - コマンド名
 * @param args - 引数の定義
 * @returns コマンドの入力形式
 */
export const buildCommandFormat = (
  commandName: string,
  args?: readonly CommandArg[]
): string => {
  let formatted = '!' + commandName;
  if (args) {
    for (const arg of args) {
      formatted += ' ';
      if (arg.defaultValue === undefined) {
        formatted += `<${arg.name}>`;
      } else {
        formatted += `[${arg.name}]`;
      }
    }
  }
  return formatted;
};

/**
 * コマンドとその引数の説明の章節
 */
export const CommandArgs = ({
  versionAvailableFrom,
  commandName,
  args
}: CommandArgsProps) => (
  <>
    <VersionBadge>{versionAvailableFrom}</VersionBadge> から利用可能
    <CommandFormat>{buildCommandFormat(commandName, args)}</CommandFormat>
    {args && <CommandArgList args={args} />}
  </>
);
