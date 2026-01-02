import styles from '@/styles/Input.module.css';
import classNames from 'classnames';
import { Nunito_Sans } from 'next/font/google';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-nunito-sans',
});

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={classNames(styles.input, nunitoSans.className)}
    />
  );
};
