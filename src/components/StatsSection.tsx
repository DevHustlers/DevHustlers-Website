import { useEffect, useState } from "react";

const stats = [
  { label: "DEVS_ONLINE", value: 52847, suffix: "" },
  { label: "REPOS_SHIPPED", value: 184293, suffix: "" },
  { label: "LINES_OF_CODE", value: 9847523, suffix: "" },
  { label: "BUGS_SQUASHED", value: 420069, suffix: "" },
];

const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.5 }
    );

    const el = document.getElementById(`counter-${target}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <span id={`counter-${target}`}>
      {count.toLocaleString()}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="relative py-24 px-4 border-y border-border">
      <div className="absolute inset-0 gradient-cyber opacity-30" />
      <div className="max-w-6xl mx-auto relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="font-display text-3xl md:text-5xl font-bold text-foreground text-glow mb-2">
                <AnimatedCounter target={stat.value} />
              </div>
              <div className="font-mono text-xs md:text-sm text-muted-foreground tracking-widest">
                {stat.label}
              </div>
              <div className="w-12 h-0.5 bg-primary/30 mx-auto mt-4 group-hover:w-24 group-hover:bg-primary transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
