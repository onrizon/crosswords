import answer from '@/public/lotties/answer.json';
import styles from '@/styles/mobile/Game.module.css';
import classNames from 'classnames';
import Lottie from 'lottie-react';

export default function Game() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={classNames(styles.hit, styles.hitRound)}>
          <div className={styles.top}>
            <div className={styles.icon}></div>
            <span>10</span>
          </div>
          <p>Rodada</p>
        </div>
        <div className={classNames(styles.hit, styles.hitTotal)}>
          <div className={styles.top}>
            <div className={styles.icon}></div>
            <span>10</span>
          </div>
          <p>Total</p>
        </div>
      </div>
      <div className={styles.content}>
        <h2>Começou!</h2>
        <div className={styles.lottie}>
          <Lottie animationData={answer} loop={true} />
        </div>
        <p>Encontre as palavras e envie abaixo</p>
      </div>
      <div className={styles.footer}>
        <input type="text" placeholder="Escreva seu palpite" className={styles.input} />
      </div>
    </div>
  );
}