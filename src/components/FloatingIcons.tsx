import { useEffect, useState } from "react";
import { Globe, Moon, Sun, Atom, Orbit } from "lucide-react";
import { IconReact, IconTypeScript, IconGo, IconPython, IconNode, IconRust } from "./PixelIcons";

const LUCIDE_ICONS = [Globe, Moon, Sun, Atom, Orbit];

const LANG_ICONS = [IconReact, IconTypeScript, IconGo, IconPython, IconNode, IconRust];

interface FloatingItem {
  id: number;
  type: "lucide" | "lang";
  index: number;
  top: number;
  left: number;
  size: number;
  rotation: number;
  opacity: number;
}

const FloatingIcons = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const all: FloatingItem[] = [];
    // 4 per side = 8 total
    const positions = [
      // left side
      { top: 10, left: 3 }, { top: 35, left: 5 }, { top: 58, left: 2 }, { top: 82, left: 6 },
      // right side
      { top: 12, left: 92 }, { top: 38, left: 94 }, { top: 60, left: 91 }, { top: 85, left: 93 },
    ];

    const shuffledLucide = [...LUCIDE_ICONS].sort(() => Math.random() - 0.5);
    const shuffledLang = [...LANG_ICONS].sort(() => Math.random() - 0.5);

    positions.forEach((pos, i) => {
      const isLang = i % 2 === 0;
      all.push({
        id: i,
        type: isLang ? "lang" : "lucide",
        index: isLang ? i % shuffledLang.length : i % shuffledLucide.length,
        top: pos.top + Math.random() * 6 - 3,
        left: pos.left + Math.random() * 4 - 2,
        size: 28 + Math.random() * 16,
        rotation: Math.random() * 30 - 15,
        opacity: 0.07 + Math.random() * 0.06,
      });
    });

    // Assign actual shuffled indices
    let lucideIdx = 0, langIdx = 0;
    all.forEach(item => {
      if (item.type === "lang") { item.index = langIdx++ % shuffledLang.length; }
      else { item.index = lucideIdx++ % shuffledLucide.length; }
    });

    setItems(all);
  }, []);

  const shuffledLucide = LUCIDE_ICONS;
  const shuffledLang = LANG_ICONS;

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {items.map((item) => {
        const style = {
          top: `${item.top}%`,
          left: `${item.left}%`,
          width: item.size,
          height: item.size,
          transform: `rotate(${item.rotation}deg)`,
          opacity: item.opacity,
        };

        if (item.type === "lucide") {
          const LucideIcon = shuffledLucide[item.index % shuffledLucide.length];
          return <LucideIcon key={item.id} className="absolute text-muted-foreground" style={style} strokeWidth={1.2} />;
        }

        const LangIcon = shuffledLang[item.index % shuffledLang.length];
        return (
          <div key={item.id} className="absolute text-muted-foreground" style={style}>
            <LangIcon className="w-full h-full" />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingIcons;
