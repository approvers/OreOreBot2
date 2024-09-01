import React, { ReactElement, ReactNode, useEffect, useState } from 'react';

import * as styles from './tabs.module.css';

export type TabProps = {
  children: ReactNode;
};

export function Tab({ children }: TabProps): JSX.Element {
  return <div className={styles.tab}>{children}</div>;
}

export type TabsProps = {
  choiceKey: string;
  items: readonly ReactNode[];
  children: ReactElement<TabProps>[];
};

export function Tabs({ choiceKey, items, children }: TabsProps): JSX.Element {
  const storageKey = 'tabs__' + choiceKey;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectTab = (index: number) => () => {
    if (!(0 <= index && index < items.length)) {
      return;
    }

    setSelectedIndex(index);
    localStorage.setItem(storageKey, index.toString());
  };

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      setSelectedIndex(parseInt(stored, 10));
    }

    const onStorageUpdate = (e: StorageEvent) => {
      if (e.key === storageKey) {
        setSelectedIndex(parseInt(e.newValue, 10));
      }
    };

    window.addEventListener('storage', onStorageUpdate);
    return () => {
      window.removeEventListener('storage', onStorageUpdate);
    };
  }, [storageKey]);

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList}>
        {items.map((item, index) => (
          <button
            className={styles.tabButton}
            data-selected={index === selectedIndex}
            onClick={selectTab(index)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className={styles.tabBody}>{children[selectedIndex]}</div>
    </div>
  );
}
