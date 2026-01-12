import styles from '@/styles/Switch.module.css';
import classNames from 'classnames';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <div
      className={classNames(styles.switch, {
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
