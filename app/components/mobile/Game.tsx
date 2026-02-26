import { ModalContext, withData } from '@/lib/Context';
import answer from '@/public/lotties/answer.json';
import exit from '@/public/lotties/exit.json';
import styles from '@/styles/mobile/Game.module.css';
import { ModalContextProps } from '@/types/modalTypes';
import { GuessResult, UserScores } from '@/types/types';
import classNames from 'classnames';
import Lottie from 'lottie-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import Answer from './Answer';
import Scroll from './Scroll';

interface GameProps {
  isOwner: boolean;
  socket: Socket;
  roomCode: string;
  playerScores: UserScores;
  roundNumber: number;
}

function Game({ isOwner, socket, roomCode, playerScores, roundNumber }: GameProps) {
  const setModal = useContext(ModalContext) as ModalContextProps["setModal"];
  const [list, setList] = useState<{ word: string; hit: boolean }[]>([]);
  const [word, setWord] = useState('');
  const wordRef = useRef<HTMLInputElement>(null);
  const playerName = typeof window !== 'undefined' ? sessionStorage.getItem('playerName') || '' : '';

  // Get current player scores
  const myScores = playerScores?.[playerName] || { round: 0, total: 0 };

  // Listen for guess results and word reveals
  useEffect(() => {
    if (!socket) return;

    function onGuessResult(result: GuessResult) {
      if (result.hit && result.word) {
        // Mark the matching guess as a hit
        setList((prev) => {
          const updated = [...prev];
          for (let i = updated.length - 1; i >= 0; i--) {
            if (updated[i].word.toUpperCase().replace(/\s/g, '') === result.word && !updated[i].hit) {
              updated[i] = { ...updated[i], hit: true };
              break;
            }
          }
          return updated;
        });
      }
    }

    function onNewLevel() {
      setList([]);
    }

    socket.on('game:guessResult', onGuessResult);
    socket.on('game:newLevel', onNewLevel);

    return () => {
      socket.off('game:guessResult', onGuessResult);
      socket.off('game:newLevel', onNewLevel);
    };
  }, [socket]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const value = word.toLocaleLowerCase().trim().replace(/\s/g, '');
    if (value && socket) {
      setList((prev) => [...prev, { word: value, hit: false }]);
      setWord('');
      socket.emit('game:guess', { roomCode, word: value });
      document.getElementById('answers')?.scrollTo({
        top: document.getElementById('answers')?.scrollHeight,
        behavior: 'smooth',
      });
    }
    wordRef.current?.focus();
  }

  function handleReset() {
    if (!socket) return;
    socket.emit('game:reset', { roomCode });
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={classNames(styles.hit, styles.hitRound)}>
          <div className={styles.top}>
            <div className={styles.icon}></div>
            <span>{myScores.round}</span>
          </div>
          <p>Rodada</p>
        </div>
        <div className={classNames(styles.hit, styles.hitTotal)}>
          <div className={styles.top}>
            <div className={styles.icon}></div>
            <span>{myScores.total}</span>
          </div>
          <p>Total</p>
        </div>
        {isOwner && (
          <button className={styles.exit} onClick={() => {
            setModal({
              title: 'Reiniciar',
              lottie: exit,
              description: 'Deseja reiniciar a partida?',
              button: () => handleReset(),
            });
          }} />
        )}
      </div>

      {list.length > 0 ? (
        <div id="answers" className={styles.answers}>
          <Scroll scrollBottom={true}>
            {list.map((item, index) => (
              <Answer data={item} key={index} />
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
    socket: state.socket,
    roomCode: state.roomCode,
    playerScores: state.playerScores,
    roundNumber: state.roundNumber,
  };
}

export default withData(Game, mapStateToProps);
