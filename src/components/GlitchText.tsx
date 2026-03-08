import { useEffect, useState } from "react";

const GlitchText = ({ text, className = "" }: { text: string; className?: string }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={isGlitching ? "animate-glitch" : ""}>{text}</span>
      {isGlitching && (
        <>
          <span className="absolute top-0 left-0.5 text-cyber-blue opacity-70 clip-glitch-1" aria-hidden>
            {text}
          </span>
          <span className="absolute top-0 -left-0.5 text-cyber-pink opacity-70 clip-glitch-2" aria-hidden>
            {text}
          </span>
        </>
      )}
    </span>
  );
};

export default GlitchText;
