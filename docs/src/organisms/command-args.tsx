import React from 'react';

import { CommandArg, CommandArgList } from '../molecules/command-arg-list';
import { CommandFormat } from '../molecules/command-format';
import { VersionBadge } from '../molecules/version-badge';

export interface CommandArgsProps {
  versionAvailableFrom: string;
  commandName: string;
  args?: readonly CommandArg[];
}

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
