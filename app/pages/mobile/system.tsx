import Create from '@/components/mobile/Create';
import styles from '@/styles/mobile/System.module.css';
import { useState } from 'react';
import Settings from './settings';

export default function System() {

  const [status, setStatus] = useState(2);

  return <div className={styles.container}>
    {status === 1 && <Create />}
    {status === 2 && <Settings />}
  </div>;
}