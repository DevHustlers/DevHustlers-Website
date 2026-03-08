import { useEffect, useState } from "react";

const codeLines = [
  { text: "$ git clone https://github.com/devhive/core", color: "text-neon" },
  { text: "Cloning into 'core'...", color: "text-muted-foreground" },
  { text: "remote: Enumerating objects: 42069, done.", color: "text-muted-foreground" },
  { text: "$ cd core && npm install", color: "text-neon" },
  { text: "added 1337 packages in 4.2s", color: "text-cyber-blue" },
  { text: "$ npm run dev", color: "text-neon" },
  { text: "🚀 Server running at http://localhost:3000", color: "text-cyber-pink" },
  { text: "✓ Ready to hack the planet.", color: "text-neon" },
];

const TerminalWindow = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setVisibleLines(i);
            if (i >= codeLines.length) clearInterval(interval);
          }, 400);
        }
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById("terminal-section");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="terminal-section" className="py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="border border-border bg-card overflow-hidden box-glow">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-cyber-blue/50" />
            <div className="w-3 h-3 rounded-full bg-neon/50" />
            <span className="ml-4 text-xs text-muted-foreground font-mono">devhive@matrix:~/core</span>
          </div>
          {/* Terminal body */}
          <div className="p-6 font-mono text-sm md:text-base space-y-1 min-h-[280px]">
            {codeLines.slice(0, visibleLines).map((line, i) => (
              <div key={i} className={`${line.color} opacity-0 animate-[fade-in_0.3s_ease-out_forwards]`}>
                {line.text}
              </div>
            ))}
            {visibleLines < codeLines.length && (
              <span className="inline-block w-2.5 h-5 bg-primary animate-pulse-neon" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TerminalWindow;
