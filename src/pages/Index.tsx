import GlitchText from "@/components/GlitchText";
import MatrixRain from "@/components/MatrixRain";
import FeaturesGrid from "@/components/FeaturesGrid";
import StatsSection from "@/components/StatsSection";
import TerminalWindow from "@/components/TerminalWindow";
import CTASection from "@/components/CTASection";
import Navbar from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";
import { ChevronDown } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

        <MatrixRain />

        <div className="relative text-center max-w-5xl mx-auto">
          <div className="font-mono text-sm text-muted-foreground mb-8 tracking-[0.3em]">
            {">"} INITIALIZING DEVHIVE PROTOCOL...
          </div>

          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-8">
            <span className="text-foreground">WE</span>
            <br />
            <span className="text-glow">
              <GlitchText text="CODE" />
            </span>
            <br />
            <span className="text-cyber-blue text-glow-blue">CHAOS</span>
          </h1>

          <p className="font-mono text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            The underground tech collective for devs who ship fast, think different, and refuse to read the docs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button className="group relative px-10 py-4 bg-primary text-primary-foreground font-mono text-sm font-bold tracking-wider hover:box-glow transition-all duration-300">
              <span className="flex items-center gap-2">
                {">"} JOIN_THE_HIVE( )
              </span>
            </button>
            <button className="px-10 py-4 border border-border text-muted-foreground font-mono text-sm tracking-wider hover:text-foreground hover:border-primary/30 transition-all duration-300">
              EXPLORE_PROJECTS( )
            </button>
          </div>

          <ChevronDown className="w-6 h-6 text-muted-foreground mx-auto animate-float" />
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none scanline-overlay" />
      </section>

      {/* Features */}
      <FeaturesGrid />

      {/* Stats */}
      <StatsSection />

      {/* Terminal */}
      <TerminalWindow />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-mono text-xs text-muted-foreground">
            © 2026 DEVHIVE // ALL RIGHTS HACKED
          </div>
          <div className="font-mono text-xs text-muted-foreground flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">/privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">/terms</a>
            <a href="#" className="hover:text-foreground transition-colors">/status</a>
          </div>
          <div className="font-mono text-xs text-muted-foreground/40">
            built with mass_hysteria && caffeine
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
