import { withData } from '@/lib/Context';
import styles from '@/styles/mobile/End.module.css';
import { UserScores } from '@/types/types';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { Socket } from 'socket.io-client';

interface EndProps {
  isOwner: boolean;
  socket: Socket;
  roomCode: string;
  playerScores: UserScores;
}

function End({ isOwner, socket, roomCode, playerScores }: EndProps) {
  const router = useRouter();
  const playerName = typeof window !== 'undefined' ? sessionStorage.getItem('playerName') || '' : '';
  const myTotal = playerScores?.[playerName]?.total || 0;

  // Calculate ranking
  const sortedPlayers = Object.entries(playerScores || {})
    .sort(([, a], [, b]) => b.total - a.total);
  const myRank = sortedPlayers.findIndex(([name]) => name === playerName) + 1;

  function handleRestart() {
    if (!socket || !isOwner) return;
    socket.emit('game:reset', { roomCode });
  }

  function handleLeave() {
    if (!socket) return;
    socket.emit('room:leave', { roomCode });
    sessionStorage.removeItem('roomCode');
    sessionStorage.removeItem('playerId');
    router.push('/mobile');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>Fim de jogo</h2>
        </div>
        {isOwner && <button className={styles.exit} onClick={handleLeave} />}
      </div>
      <div className={styles.content}>
        <div className={classNames(styles.hit, styles.hitRanking)}>
          <div className={styles.icon}></div>
          <span>{myRank > 0 ? `${myRank}º` : '-'}</span>
          <p>POSIÇÃO NO RANKING</p>
        </div>
        <div className={classNames(styles.hit, styles.hitTotal)}>
          <div className={styles.icon}></div>
          <span>{myTotal}</span>
          <p>ACERTOS<br />TOTAIS</p>
        </div>
      </div>
      <div className={styles.footer}>
        {isOwner ?
          <button
            onClick={handleRestart}
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

function mapStateToProps(state: EndProps): EndProps {
  return {
    isOwner: state.isOwner,
    socket: state.socket,
    roomCode: state.roomCode,
    playerScores: state.playerScores,
  };
}

export default withData(End, mapStateToProps);
