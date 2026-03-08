import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md";
}

const Logo = ({ size = "sm" }: LogoProps) => {
  const iconSize = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const boxSize = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const textSize = size === "sm" ? "text-[15px]" : "text-lg";

  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className={`${boxSize} rounded-lg bg-foreground flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
        <Zap className={`${iconSize} text-background fill-background`} strokeWidth={2.5} />
      </div>
      <span className={`font-bold text-foreground tracking-tight ${textSize}`}>
        Dev<span className="font-serif italic font-normal text-muted-foreground">Hustle</span>
      </span>
    </Link>
  );
};

export default Logo;
