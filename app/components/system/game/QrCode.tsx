import { useTranslation } from '@/hooks/useTranslation';
import { withData } from '@/lib/Context';
import styles from '@/styles/QrCode.module.css';
import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

interface QrCodeProps {
  roomCode: string;
}

const QrCode: React.FC<QrCodeProps> = ({ roomCode }) => {
  const { t } = useTranslation();
  const qrcodeRef = useRef<HTMLCanvasElement>(null);
  const joinUrl = roomCode
    ? `https://jogo.tv/mobile/join?room=${roomCode}`
    : 'https://jogo.tv/play';

  useEffect(() => {
    QRCode.toCanvas(
      qrcodeRef.current,
      joinUrl,
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
  }, [joinUrl]);

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
              {roomCode && (
                <>
                  <p>{t('code')}</p>
                  <div className={styles.code}>
                    {roomCode.split('').map((char, i) => (
                      <span key={i}>{char}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: QrCodeProps): QrCodeProps {
  return {
    roomCode: state.roomCode,
  };
}

export default withData(QrCode, mapStateToProps);
