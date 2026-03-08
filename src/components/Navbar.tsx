import { Terminal, Github, Twitter } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-6 h-6 text-neon" />
          <span className="font-display text-lg font-bold text-foreground">
            DEV<span className="text-neon">HIVE</span>
          </span>
          <span className="text-xs text-muted-foreground font-mono ml-2 hidden sm:inline">v4.2.0</span>
        </div>

        <div className="hidden md:flex items-center gap-8 font-mono text-sm">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">/about</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">/projects</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">/events</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">/blog</a>
        </div>

        <div className="flex items-center gap-4">
          <Github className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          <button className="px-4 py-1.5 border border-primary/50 text-foreground text-xs font-mono hover:bg-primary/10 hover:box-glow transition-all duration-300">
            LOGIN
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
