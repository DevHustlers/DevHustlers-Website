import { Link } from "react-router-dom";
import dvhLogo from "@/assets/dvh-logo.png";

interface LogoProps {
  size?: "sm" | "md";
}

const Logo = ({ size = "sm" }: LogoProps) => {
  const imgSize = size === "sm" ? "h-7" : "h-9";
  const textSize = size === "sm" ? "text-[15px]" : "text-lg";

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <img
        src={dvhLogo}
        alt="DevHustlers logo"
        className={`${imgSize} w-auto group-hover:scale-105 transition-transform duration-200`}
      />
      <span className={`font-bold text-foreground tracking-tight ${textSize}`}>
        Dev<span className="font-serif font-normal text-muted-foreground">Hustlers</span>
      </span>
    </Link>
  );
};

export default Logo;
