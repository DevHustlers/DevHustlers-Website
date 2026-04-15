import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Medal, TrendingUp, Star } from 'lucide-react';

interface Entry {
  id: string;
  name: string;
  score: number;
  isYou?: boolean;
  lastPoints?: number;
}

interface LiveLeaderboardProps {
  entries: Entry[];
  limit?: number;
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ entries, limit = 10 }) => {
  const displayEntries = entries.slice(0, limit);

  return (
    <div className="w-full space-y-3">
      <AnimatePresence mode="popLayout">
        {displayEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 1
            }}
            className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all group ${
              entry.isYou 
                ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.15)] z-10' 
                : 'bg-background border-border hover:border-primary/30'
            }`}
          >
             <div className="flex items-center gap-4">
                <div className="w-8 flex justify-center">
                    {index === 0 ? <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500/20" /> :
                     index === 1 ? <Medal className="w-6 h-6 text-zinc-400" /> :
                     index === 2 ? <Medal className="w-6 h-6 text-amber-600" /> :
                     <span className="font-mono text-sm font-bold text-muted-foreground/50">{index + 1}</span>}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] border-2 uppercase ${
                    entry.isYou ? 'bg-primary text-white border-primary' : 'bg-accent/50 border-border'
                }`}>
                    {entry.name.substring(0, 2)}
                </div>
                <div className="flex flex-col">
                    <span className={`font-black tracking-tight flex items-center gap-2 ${entry.isYou ? 'text-primary' : 'text-foreground'}`}>
                        {entry.name}
                        {entry.isYou && <span className="text-[8px] bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">YOU</span>}
                        {index === 0 && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 animate-pulse" />}
                    </span>
                    {entry.lastPoints !== undefined && entry.lastPoints > 0 && (
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"
                        >
                            <TrendingUp className="w-3 h-3" /> +{entry.lastPoints} XP
                        </motion.span>
                    )}
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <motion.span 
                  key={entry.score}
                  initial={{ scale: 1.2, color: '#10b981' }}
                  animate={{ scale: 1, color: entry.isYou ? '#var(--primary)' : 'inherit' }}
                  className="font-black font-mono text-xl tabular-nums"
                >
                  {entry.score.toLocaleString()}
                </motion.span>
             </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LiveLeaderboard;
