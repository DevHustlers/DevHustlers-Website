import { Terminal, Code2, Cpu, Zap, Users, GitBranch, Rocket, Shield } from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Terminal First",
    desc: "CLI tools, shell scripts, and automation. We breathe the command line.",
    color: "text-neon",
  },
  {
    icon: Code2,
    title: "Open Source DNA",
    desc: "Every project, every snippet — open by default. Fork it, break it, ship it.",
    color: "text-cyber-blue",
  },
  {
    icon: Cpu,
    title: "Low-Level Chaos",
    desc: "From kernel hacking to WebAssembly. We go deep where others fear.",
    color: "text-cyber-purple",
  },
  {
    icon: Zap,
    title: "Ship Fast, Break Things",
    desc: "Weekly hackathons, midnight deploys, and zero bureaucracy.",
    color: "text-cyber-pink",
  },
  {
    icon: Users,
    title: "Global Hivemind",
    desc: "50K+ devs across 120 countries. Your next co-founder is here.",
    color: "text-neon",
  },
  {
    icon: GitBranch,
    title: "Merge Conflicts Welcome",
    desc: "Pair programming, code reviews, and collaborative chaos.",
    color: "text-cyber-blue",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-6xl font-bold text-center mb-4">
          <span className="text-foreground">{">"}</span>
          <span className="text-glow"> what_we_do</span>
          <span className="text-muted-foreground animate-pulse-neon">_</span>
        </h2>
        <p className="text-muted-foreground text-center mb-20 text-lg font-mono">
          // not your average tech community
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative border border-border bg-card p-8 hover:box-glow transition-all duration-500 hover:border-primary/50"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50 group-hover:border-primary transition-colors" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50 group-hover:border-primary transition-colors" />

              <feature.icon className={`w-10 h-10 ${feature.color} mb-6 group-hover:animate-pulse-neon`} />
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.desc}
              </p>
              <div className="mt-6 text-xs text-muted-foreground font-mono opacity-50">
                [{String(i).padStart(2, "0")}]
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
