import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/QrCode.module.css';
import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

const QrCode: React.FC = () => {
  const { t } = useTranslation();
  const qrcodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    QRCode.toCanvas(
      qrcodeRef.current,
      `https://jogo.tv/play`,
      {
        width: 123,
        margin: 2,
        color: {
          dark: '#26146D',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'L',
      }
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.containerEdge}>
        <div className={styles.header}>
          <div className={styles.icon} />
          <h3 className={styles.title}>
            {t('play')}
          </h3>
        </div>
        <div className={styles.body}>
          <p>{t('qrCodeDescription')}</p>
          <div className={styles.row}>
            <div className={styles.qrcode}>
              <canvas ref={qrcodeRef} />
            </div>
            <div className={styles.text}>
              <span>jogo.tv/play</span>
              <p>{t('code')}</p>
              <div className={styles.code}>
                <span>X</span>
                <span>G</span>
                <span>N</span>
                <span>M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCode;