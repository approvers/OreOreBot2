import style from './command-format.module.css';

export interface CommandFormatProps {
  children: string;
}

export const CommandFormat = ({
  children
}: CommandFormatProps): JSX.Element => (
  <div className={style.command}>
    <code>{children}</code>
  </div>
);
