import styles from '@/styles/mobile/End.module.css';
import classNames from 'classnames';
import { useState } from 'react';

export default function End() {
  const [isOwner, setIsOwner] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>Fim de jogo</h2>
        </div>
        {isOwner && <button className={styles.exit} onClick={() => { }} />}
      </div>
      <div className={styles.content}>
        <div className={classNames(styles.hit, styles.hitRanking)}>
          <div className={styles.icon}></div>
          <span>5º</span>
          <p>POSIÇÃO NO RANKING</p>
        </div>
        <div className={classNames(styles.hit, styles.hitTotal)}>
          <div className={styles.icon}></div>
          <span>10</span>
          <p>ACERTOS<br />TOTAIS</p>
        </div>
      </div>
      <div className={styles.footer}>
        {isOwner ?
          <button
            onClick={() => { }}
            className={styles.btn}
          >
            Reiniciar
          </button>
          :
          <p className={styles.notOwner}>Aguardando o host</p>
        }
      </div>
    </div>
  );
}