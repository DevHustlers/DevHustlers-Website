import { Rocket } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-32 px-4 text-center overflow-hidden">
      <div className="absolute inset-0 gradient-cyber opacity-20" />
      <div className="relative max-w-3xl mx-auto">
        <div className="font-mono text-sm text-muted-foreground mb-6 tracking-widest">
          {"// READY TO JOIN THE HIVEMIND?"}
        </div>
        <h2 className="font-display text-4xl md:text-7xl font-bold text-foreground text-glow mb-8 leading-tight">
          STOP CODING
          <br />
          <span className="text-cyber-blue text-glow-blue">ALONE</span>
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
          Join 50K+ developers who ship code, break things, and build the future together. No gatekeeping. No BS.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="group relative px-10 py-4 font-mono text-sm font-bold tracking-wider overflow-hidden">
            <div className="absolute inset-0 animate-border-dance" />
            <div className="absolute inset-[2px] bg-background" />
            <span className="relative flex items-center gap-3 text-foreground">
              <Rocket className="w-5 h-5 group-hover:animate-pulse-neon" />
              JACK_IN( )
            </span>
          </button>
          <button className="px-10 py-4 font-mono text-sm font-bold tracking-wider border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:box-glow transition-all duration-300">
            VIEW_SOURCE( )
          </button>
        </div>
        <div className="mt-12 font-mono text-xs text-muted-foreground/50">
          {">"} no credit card · no meetings · just vibes and version control
        </div>
      </div>
    </section>
  );
};

export default CTASection;
