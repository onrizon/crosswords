import styles from '@/styles/Select.module.css';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const Select = ({ options, ...props }: SelectProps) => {
  return (
    <div className={styles.select}>
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
