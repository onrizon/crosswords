import { useEffect, useState, useRef, useCallback } from 'react';
import tmi from 'tmi.js';
import { CHANNEL_NAME } from '../constants';
import { ChatMessage } from '../types';

interface UseTwitchProps {
  onMessage: (user: string, message: string) => void;
}

export const useTwitch = ({ onMessage }: UseTwitchProps) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const clientRef = useRef<tmi.Client | null>(null);
  
  // Keep the latest callback in a ref to avoid reconnecting when the handler function identity changes
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => {
      // Prevent duplicates based on unique message ID from Twitch
      if (prev.some((m) => m.id === msg.id)) {
        return prev;
      }
      const newHistory = [...prev, msg];
      if (newHistory.length > 50) newHistory.shift(); // Keep last 50 messages
      return newHistory;
    });
  }, []);

  useEffect(() => {
    const client = new tmi.Client({
      channels: [CHANNEL_NAME],
      // We don't need identity for read-only anonymous access usually,
      // but providing an empty object helps some versions.
    });

    clientRef.current = client;

    const connect = async () => {
      try {
        setStatus('connecting');
        await client.connect();
        setStatus('connected');
        console.log(`Connected to ${CHANNEL_NAME}`);
      } catch (err) {
        console.error('Failed to connect to Twitch:', err);
        setStatus('error');
      }
    };

    connect();

    client.on('message', (channel, tags, message, self) => {
      if (self) return;
      const username = tags['display-name'] || tags.username || 'Anonymous';
      const color = tags.color || '#a855f7'; // Default purple
      const id = tags.id || Math.random().toString(36);
      
      // Invoke the latest callback
      if (onMessageRef.current) {
        onMessageRef.current(username, message);
      }

      addMessage({
        id,
        username,
        message,
        color,
        isCorrectGuess: false, // Updated by parent if needed, but here we just log raw
      });
    });

    return () => {
      if (clientRef.current) {
        clientRef.current.removeAllListeners();
        clientRef.current.disconnect().catch(console.error);
        clientRef.current = null;
      }
    };
  }, [addMessage]); // Depend only on stable addMessage, not onMessage

  return { status, messages, addMessage };
};