import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import tmi from 'tmi.js';

interface UseTwitchProps {
  onMessage: (user: string, message: string) => void;
}

export const useTwitch = ({ onMessage }: UseTwitchProps) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>(
    'connecting'
  );
  const clientRef = useRef<tmi.Client | null>(null);
  const { data: session } = useSession();

  // Keep the latest callback in a ref to avoid reconnecting when the handler function identity changes
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const channelToConnect = session?.user?.twitchLogin || '';
    if (channelToConnect) {
      const client = new tmi.Client({
        channels: [channelToConnect],
        connection: {
          secure: true,
          reconnect: true,
        },
      });

      clientRef.current = client;

      // Set up listeners BEFORE connecting to ensure we catch early events if any
      client.on('message', (channel, tags, message, self) => {
        if (self) return;
        const username = tags['display-name'] || tags.username || 'Anonymous';

        // Invoke the latest callback
        if (onMessageRef.current) {
          onMessageRef.current(username, message);
        }
      });

      const connect = async () => {
        try {
          setStatus('connecting');
          await client.connect();
          setStatus('connected');
          console.log(`Connected to ${channelToConnect}`);
        } catch (err) {
          console.error('Failed to connect to Twitch:', err);
          setStatus('error');
        }
      };

      connect();

      return () => {
        if (clientRef.current) {
          clientRef.current.removeAllListeners();
          clientRef.current.disconnect().catch(console.error);
          clientRef.current = null;
        }
      };
    }
  }, [session?.user?.twitchLogin]); // Depend only on stable addMessage

  return { status };
};
