import React from 'react';
import { motion } from 'framer-motion';

interface GamifiedTimerProps {
  timeLeft: number;
  totalTime: number;
  size?: number;
  strokeWidth?: number;
}

const GamifiedTimer: React.FC<GamifiedTimerProps> = ({ 
  timeLeft, 
  totalTime, 
  size = 120, 
  strokeWidth = 10 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = timeLeft / totalTime;
  const offset = circumference - progress * circumference;

  const getColor = () => {
    if (progress > 0.6) return '#10b981'; // Green
    if (progress > 0.3) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "linear" }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${getColor()}44)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span 
          key={timeLeft}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-3xl font-black font-mono tabular-nums ${progress <= 0.3 ? 'text-red-500 animate-pulse' : 'text-foreground'}`}
        >
          {timeLeft}
        </motion.span>
        <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground opacity-50">Seconds</span>
      </div>
    </div>
  );
};

export default GamifiedTimer;
