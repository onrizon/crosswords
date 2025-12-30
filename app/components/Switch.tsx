import styles from '@/styles/Switch.module.css';
import classNames from 'classnames';
import { Asap_Condensed } from 'next/font/google';

const asapCondensed = Asap_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-asap-condensed',
});

export const Switch = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <div
      className={classNames(styles.switch, asapCondensed.className, {
        [styles.checked]: checked,
      })}
    >
      <input
        type='checkbox'
        id='switch'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor='switch'>
        <span>{checked ? 'ON' : 'OFF'}</span>
      </label>
    </div>
  );
};
