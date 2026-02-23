import Settings from '@/components/mobile/Settings';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/mobile/System.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function System() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/mobile');
    }
  }, [isAuthenticated, router]);

  return <div className={styles.container}>
    {status === 1 && <Settings />}
  </div>;
}