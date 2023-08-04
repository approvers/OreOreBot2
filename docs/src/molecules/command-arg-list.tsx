import { ReactNode } from 'react';

import style from './command-arg-list.module.css';
import { VersionBadge } from './version-badge';

export interface CommandArg {
  name: string;
  about: ReactNode;
  versionAvailableFrom?: string;
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
