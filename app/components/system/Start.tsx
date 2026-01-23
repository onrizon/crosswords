import { useTranslation } from '@/hooks/useTranslation';
import styles from '@/styles/Start.module.css';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import QRCode from 'qrcode';
import { useEffect, useRef, useState } from 'react';
import FullscreenButton from './common/FullscreenButton';
import SoundButton from './common/SoundButton';

const STEP_TIME = 6000;

const Start: React.FC = () => {
  const { t } = useTranslation();
  const qrcodeRef = useRef<HTMLCanvasElement>(null);
  const [stepCont, setStepCont] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStepCont((prevStepCont: number) => (prevStepCont + 1) % 3);
    }, STEP_TIME);

    return () => {
      clearTimeout(timer);
    };
  }, [stepCont]);

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
          <p>{t('scanTheQrCode')}</p>
        </div>

        <div className={styles.box}>
          <div className={styles.or}>
            {t('or')}
          </div>
          <p>{t('accessLink')}</p>
          <div className={styles.input}>
            <span />
            <p>https://jogo.tv/play</p>
          </div>
        </div>

        <div className={classNames(styles.corners, styles.cornersRight)}>
          <div className={classNames(styles.light, styles.lightRight)}></div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.logo}></div>
        <div className={styles.howToPlay}>
          <div className={styles.title}>
            {t('howToPlay')}
          </div>
          <div className={classNames(styles.steps, styles[`step_${stepCont}`])}>
            <div className={styles.data}>
              <AnimatePresence>
                {stepCont === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    key='step_1'
                    className={styles.step}
                  >
                    <div className={styles.lottie}></div>
                    <p>{t('howToPlayItem1')}</p>
                  </motion.div>
                )}
                {stepCont === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    key='step_2'
                    className={styles.step}
                  >
                    <div className={styles.lottie}></div>
                    <p>{t('howToPlayItem2')}</p>
                  </motion.div>
                )}
                {stepCont === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    key='step_3'
                    className={styles.step}
                  >
                    <div className={styles.lottie}></div>
                    <p>{t('howToPlayItem3')}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ul>
              <li onClick={() => { setStepCont(0) }}>
                <span />
              </li>
              <li onClick={() => { setStepCont(1) }}>
                <span />
              </li>
              <li onClick={() => { setStepCont(2) }}>
                <span />
              </li>
            </ul>
          </div>
        </div>
        <p>{t('waitHost')}</p>
      </div>

    </div>
  );
};

export default Start;
