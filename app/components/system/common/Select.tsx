import styles from '@/styles/Select.module.css';
import classNames from 'classnames';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  small?: boolean;
}

export const Select = ({ options, small = false, ...props }: SelectProps) => {
  return (
    <div className={classNames(styles.select, small && styles.small)}>
      <select {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
