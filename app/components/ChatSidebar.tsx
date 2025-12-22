import styles from '@/styles/ChatSidebar.module.css';
import { MessageSquare, Zap } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';

interface ChatSidebarProps {
  messages: ChatMessage[];
  connected: boolean;
  channel: string;
  title: string;
  waitingMessage: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  messages,
  connected,
  channel,
  title,
  waitingMessage,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <MessageSquare size={20} className={styles.headerIcon} />
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.status}>
          <span
            className={`${styles.statusDot} ${
              connected
                ? styles.statusDotConnected
                : styles.statusDotDisconnected
            }`}
          ></span>
          <span className={styles.statusChannel}>{channel}</span>
        </div>
      </div>

      <div className={`${styles.messages} custom-scrollbar`}>
        {messages.length === 0 && (
          <div className={styles.empty}>
            <Zap size={32} className={styles.emptyIcon} />
            <span className={styles.emptyText}>{waitingMessage}</span>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.isCorrectGuess ? styles.messageCorrect : ''
            }`}
          >
            <div className={styles.messageContent}>
              <span
                className={styles.messageUsername}
                style={{ color: msg.color }}
              >
                {msg.username}
              </span>
              <span className={styles.messageSeparator}>:</span>
              <span
                className={`${styles.messageText} ${
                  msg.isCorrectGuess ? styles.messageTextCorrect : ''
                }`}
              >
                {msg.message}
              </span>
            </div>
            {msg.isCorrectGuess && (
              <div className={styles.messageBadge}>
                <Zap size={12} fill='currentColor' /> Acertou!
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatSidebar;
