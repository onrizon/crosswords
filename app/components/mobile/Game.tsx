import { ModalContext, withData } from '@/lib/Context';
import answer from '@/public/lotties/answer.json';
import exit from '@/public/lotties/exit.json';
import styles from '@/styles/mobile/Game.module.css';
import { ModalContextProps } from '@/types/modalTypes';
import classNames from 'classnames';
import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import { useContext, useRef, useState } from 'react';
import Answer from './Answer';
import Scroll from './Scroll';

interface GameProps {
  isOwner: boolean;
}

function Game({ isOwner }: GameProps) {
  const router = useRouter();
  const setModal = useContext(ModalContext) as ModalContextProps["setModal"];
  const [list, setList] = useState<{ word: string, hit: boolean }[]>([
    { word: 'teste', hit: false },
    { word: 'teste2', hit: false },
    { word: 'qweqwe', hit: false },
    { word: 'teste4', hit: false },
    { word: 'WMWMWMWMWMWM', hit: true },
    { word: 'teste', hit: false },
    { word: 'teste2', hit: false },
    { word: 'asdasdasd', hit: false },
    { word: 'teste4', hit: false },
    { word: 'WMWMWMWM', hit: true },
    { word: 'teste', hit: false },
    { word: 'teste2', hit: false },
    { word: 'tesdsfsdfste', hit: true },
    { word: 'teste4', hit: false },
    { word: 'WMWMWMWMWMWM', hit: false },
    { word: 'teste', hit: false },
    { word: 'teste2', hit: false },
    { word: 'qweqwe', hit: false },
    { word: 'teste4', hit: false },
    { word: 'WMWMWMWMWMWM', hit: true },
    { word: 'teste', hit: false },
    { word: 'teste2', hit: false },
    { word: 'asdasdasd', hit: false },
    { word: 'teste4', hit: false },
    { word: 'WMWMWMWM', hit: true },
    { word: 'teste', hit: false },
    { word: 'teste2', hit: false },
    { word: 'tesdsfsdfste', hit: true },
    { word: 'teste4', hit: false },
    { word: 'WMWMWMWMWMWM', hit: false },
  ]);
  const [word, setWord] = useState('');
  const wordRef = useRef<HTMLInputElement>(null);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const value = word.toLocaleLowerCase().trim().replace(/\s/g, '');
    if (value) {
      setList((prev) => [...prev, { word: value, hit: false }]);
      setWord('');
      document.getElementById('answers')?.scrollTo({
        top: document.getElementById('answers')?.scrollHeight,
        behavior: 'smooth',
      });
    }
    wordRef.current?.focus();
  }

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
        {isOwner && (
          <button className={styles.exit} onClick={() => {
            setModal({
              title: 'Sair',
              lottie: exit,
              description: 'Deseja realmente sair da sala?',
              button: () => {
                router.push('/mobile');
              },
            });
          }} />
        )}
      </div>

      {list.length > 0 ? (
        <div id="answers" className={styles.answers}>
          <Scroll scrollBottom={true}>
            {list.map((word, index) => (
              <Answer data={word} key={index} />
            ))}
          </Scroll>
        </div>
      ) : (
        <div className={styles.content}>
          <h2>Começou!</h2>
          <div className={styles.lottie}>
            <Lottie animationData={answer} loop={true} />
          </div>
          <p>Encontre as palavras e envie abaixo</p>
        </div>
      )}

      <form className={styles.footer} onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Escreva seu palpite"
          className={styles.input}
          ref={wordRef}
          value={word}
          name="word"
          maxLength={12}
          required
          autoComplete="off"
          enterKeyHint="send"
          onChange={(e) => setWord(e.target.value)}
        />
      </form>
    </div>
  );
}

function mapStateToProps(state: GameProps): GameProps {
  return {
    isOwner: state.isOwner,
  };
}

export default withData(Game, mapStateToProps);