
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { MessageSquare, Zap } from 'lucide-react';

interface ChatSidebarProps {
  messages: ChatMessage[];
  connected: boolean;
  channel: string;
  title: string;
  waitingMessage: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ messages, connected, channel, title, waitingMessage }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl">
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <MessageSquare size={20} className="text-purple-400" />
          <h2 className="font-bold text-sm tracking-widest text-slate-200 uppercase">{title}</h2>
        </div>
        <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
          <span className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
          <span className="text-xs font-bold text-slate-400 uppercase">{channel}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-base min-h-0 custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 opacity-60">
            <Zap size={32} className="mb-3 text-slate-600" />
            <span className="text-sm italic">{waitingMessage}</span>
          </div>
        )}
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`
              p-3 rounded-xl break-words transition-all text-sm border
              ${msg.isCorrectGuess 
                ? 'bg-emerald-900/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] translate-x-1' 
                : 'bg-slate-800/40 border-white/5 hover:bg-slate-700/40 hover:border-white/10'}
            `}
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-bold text-sm shadow-black drop-shadow-sm" style={{ color: msg.color }}>{msg.username}</span>
              <span className="text-slate-500 text-xs">:</span>
              <span className={`flex-1 font-medium leading-snug ${msg.isCorrectGuess ? 'text-emerald-300 font-bold tracking-wide' : 'text-slate-200'}`}>
                {msg.message}
              </span>
            </div>
            {msg.isCorrectGuess && (
               <div className="mt-2 text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                 <Zap size={12} fill="currentColor" /> Acertou!
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
