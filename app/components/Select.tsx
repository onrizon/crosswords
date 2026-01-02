import styles from '@/styles/Select.module.css';
import classNames from 'classnames';
import { Nunito_Sans } from 'next/font/google';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-nunito-sans',
});

export const Select = (
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) => {
  return (
    <div className={classNames(styles.select, nunitoSans.className)}>
      <select {...props} className={nunitoSans.className}>
        <option value='pt'>Português (PT-BR)</option>
        <option value='en'>English (US)</option>
        <option value='fr'>Français</option>
        <option value='de'>Deutsch</option>
        <option value='it'>Italiano</option>
        <option value='es'>Español</option>
      </select>
    </div>
  );
};
