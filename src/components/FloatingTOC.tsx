import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  text: string;
  id: string;
  level: "h2" | "h3";
}

interface FloatingTOCProps {
  items: TocItem[];
  activeId: string;
}

const FloatingTOC = ({ items, activeId }: FloatingTOCProps) => {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeItem = items.find((item) => item.id === activeId);
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      {/* Expanded TOC */}
      {open && (
        <div className="absolute bottom-14 right-0 w-64 bg-background border border-border shadow-lg mb-2 animate-fade-in">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest font-mono">
              On this page
            </p>
          </div>
          <nav className="p-2 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "block text-[13px] leading-snug py-2 px-3 transition-colors",
                  item.level === "h3" ? "pl-6" : "",
                  activeId === item.id
                    ? "text-foreground font-medium bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-background border border-border px-3 py-2.5 shadow-lg hover:bg-accent transition-colors"
      >
        {/* Progress circle */}
        <svg width="34" height="34" className="shrink-0 -rotate-90">
          <circle cx="17" cy="17" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
          <circle
            cx="17"
            cy="17"
            r={radius}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-150"
          />
        </svg>
        <span className="text-[12px] text-foreground font-medium max-w-32 truncate">
          {activeItem?.text || "Introduction"}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
    </div>
  );
};

export default FloatingTOC;
