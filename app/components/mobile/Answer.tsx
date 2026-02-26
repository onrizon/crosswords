import anim from '@/public/lotties/effect_hit_large.json';
import styles from '@/styles/mobile/Answer.module.css';
import classNames from 'classnames';
import Lottie from 'lottie-react';

export default function Answer({ data }: { data: { word: string, hit: boolean } }) {

  return (
    <div
      className={classNames(styles.answer, {
        [styles.hit]: data.hit,
      })}
    >
      {data.hit && (
        <span>
          <Lottie animationData={anim} loop={false} />
        </span>
      )}
      {data.word.split('').map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
}