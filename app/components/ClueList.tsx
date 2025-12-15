import React from 'react';
import { WordData } from '../types';
import { Check, Lock } from 'lucide-react';

interface ClueListProps {
  words: WordData[];
}

const ClueItem: React.FC<{ word: WordData }> = ({ word }) => (
  <div className={`
    flex items-start gap-3 p-2 rounded-lg transition-all
    ${word.isRevealed ? 'bg-green-900/20 text-green-100 opacity-60' : 'bg-slate-700/30 text-slate-300'}
  `}>
    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-slate-700 rounded text-xs font-bold text-slate-200 mt-0.5">
      {word.id}
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium leading-tight mb-1">
        {word.isRevealed ? (
          <span className="line-through decoration-green-500/50 text-green-200/70">{word.clue}</span>
        ) : (
          word.clue
        )}
      </div>
      
      {word.isRevealed ? (
         <div className="flex items-center gap-1 text-xs text-green-400 font-mono">
           <Check size={10} strokeWidth={4} />
           <span>SOLVED by {word.revealedBy || 'Admin'}</span>
         </div>
      ) : (
        <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
           <Lock size={10} />
           <span>{word.word.length} letters</span>
         </div>
      )}
    </div>
  </div>
);

const ClueList: React.FC<ClueListProps> = ({ words }) => {
  const horizontal = words.filter(w => w.direction === 'H').sort((a,b) => a.id - b.id);
  const vertical = words.filter(w => w.direction === 'V').sort((a,b) => a.id - b.id);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-700 pb-2">Across</h3>
        <div className="space-y-2">
          {horizontal.map(w => <ClueItem key={w.id} word={w} />)}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-700 pb-2">Down</h3>
        <div className="space-y-2">
          {vertical.map(w => <ClueItem key={w.id} word={w} />)}
        </div>
      </div>
    </div>
  );
};

export default ClueList;