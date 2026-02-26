import { useSocket } from '@/hooks/useSocket';
import styles from '@/styles/Index.module.css';
import QRCode from 'qrcode';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const App: React.FC = () => {
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [roomCode, setRoomCode] = useState('');
  const hasCreated = useRef(false);
  const qrcodeRef = useRef<HTMLCanvasElement>(null);

  // Auto-create room as soon as connected
  useEffect(() => {
    if (!socket || !isConnected || hasCreated.current) return;
    hasCreated.current = true;
    socket.emit('display:createRoom', { language: 'pt' });
  }, [socket, isConnected]);

  // Listen for room created → show QR code
  // Listen for owner assigned → redirect to /system
  useEffect(() => {
    if (!socket) return;

    function onRoomCreated({ roomCode: code }: { roomCode: string }) {
      setRoomCode(code);
      sessionStorage.setItem('roomCode', code);
    }

    function onOwnerAssigned({ roomCode: code }: { roomCode: string }) {
      router.replace(`/system?room=${code}`);
    }

    socket.on('display:roomCreated', onRoomCreated);
    socket.on('display:ownerAssigned', onOwnerAssigned);

    return () => {
      socket.off('display:roomCreated', onRoomCreated);
      socket.off('display:ownerAssigned', onOwnerAssigned);
    };
  }, [socket, router]);

  // Render QR code when room code is available
  useEffect(() => {
    if (!roomCode || !qrcodeRef.current) return;

    const createUrl = `https://jogo.tv/mobile?room=${roomCode}`;
    QRCode.toCanvas(qrcodeRef.current, createUrl, {
      width: 320,
      margin: 2,
      color: { dark: '#26146D', light: '#FFFFFF' },
      errorCorrectionLevel: 'L',
    });
  }, [roomCode]);

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.loginTitle}>Crosswords</h1>

      {!isConnected ? (
        <p className={styles.loginSubtitle}>Connecting to server...</p>
      ) : !roomCode ? (
        <p className={styles.loginSubtitle}>Creating room...</p>
      ) : (
        <>
          <p className={styles.loginSubtitle}>Scan to create the room</p>
          <canvas ref={qrcodeRef} style={{ borderRadius: '12px' }} />
          <p style={{ color: '#fff', fontSize: '32px', fontWeight: 700, letterSpacing: '10px', marginTop: '8px' }}>
            {roomCode}
          </p>
          <p style={{ color: 'rgb(156, 163, 175)', fontSize: '14px' }}>
            Waiting for host...
          </p>
        </>
      )}
    </div>
  );
};

export default App;
