import { ReactElement, ReactNode } from 'react';

export type TabProps = {
  label: ReactNode;
  children: ReactNode;
};

export function Tab({ label, children }: TabProps): JSX.Element {
  return (
    <div>
      {label}
      {children}
    </div>
  );
}

export type TabsProps = { children: ReactElement<TabProps>[] };

export function Tabs({ children }: TabsProps): JSX.Element {
  return (
    <div>
      Tabs
      {children}
    </div>
  );
}
