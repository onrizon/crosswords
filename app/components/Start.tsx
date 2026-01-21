import FullscreenButton from '@/components/FullscreenButton';
import SoundButton from '@/components/SoundButton';
import styles from '@/styles/Start.module.css';
import classNames from 'classnames';
import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

const Start: React.FC = () => {
  const qrcodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    QRCode.toCanvas(
      qrcodeRef.current,
      `https://jogo.tv/play`,
      {
        width: 326,
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
      <div className={styles.btnleft}>
        <SoundButton />
      </div>
      <div className={styles.btnright}>
        <FullscreenButton />
      </div>

      <div className={styles.qrcodeContainer}>
        <div className={classNames(styles.corners, styles.cornersLeft)}>
          <div className={classNames(styles.light, styles.lightLeft)}></div>
        </div>

        <div className={classNames(styles.box, styles.pb)}>
          <div className={styles.qrcodeBox}>
            <div className={styles.qrcode}>
              <canvas ref={qrcodeRef} />
            </div>
          </div>
          <p>SCAN THE QR CODE<br />TO PLAY</p>
        </div>

        <div className={styles.box}>
          <div className={styles.or}>or</div>
          <p>ACCESS THE LINK</p>
          <div className={styles.input}>
            <span />
            <p>https://jogo.tv/play</p>
          </div>
        </div>

        <div className={classNames(styles.corners, styles.cornersRight)}>
          <div className={classNames(styles.light, styles.lightRight)}></div>
        </div>
      </div>

    </div>
  );
};

export default Start;
