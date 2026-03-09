import { useEffect, useState } from "react";
import {
  Globe, Moon, Sun, Atom, Orbit,
  Code, Terminal, Database, Cpu, Binary,
  Braces, FileCode, Server, Webhook, CircuitBoard,
} from "lucide-react";

const ALL_ICONS = [
  Globe, Moon, Sun, Atom, Orbit,
  Code, Terminal, Database, Cpu, Binary,
  Braces, FileCode, Server, Webhook, CircuitBoard,
];

interface FloatingItem {
  id: number;
  iconIndex: number;
  top: number;
  left: number;
  size: number;
  rotation: number;
  opacity: number;
}

const FloatingIcons = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const positions = [
      // left side
      { top: 5, left: 2 }, { top: 18, left: 5 }, { top: 32, left: 3 },
      { top: 48, left: 6 }, { top: 62, left: 2 }, { top: 78, left: 5 }, { top: 90, left: 3 },
      // right side
      { top: 8, left: 91 }, { top: 22, left: 94 }, { top: 36, left: 92 },
      { top: 50, left: 93 }, { top: 65, left: 91 }, { top: 80, left: 94 }, { top: 92, left: 92 },
    ];

    const shuffled = [...ALL_ICONS].sort(() => Math.random() - 0.5);

    setItems(
      positions.map((pos, i) => ({
        id: i,
        iconIndex: i % shuffled.length,
        top: pos.top + Math.random() * 4 - 2,
        left: pos.left + Math.random() * 3 - 1.5,
        size: 32 + Math.random() * 20,
        rotation: Math.random() * 30 - 15,
        opacity: 0.08 + Math.random() * 0.07,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {items.map((item) => {
        const Icon = ALL_ICONS[item.iconIndex];
        return (
          <Icon
            key={item.id}
            className="absolute text-muted-foreground"
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              width: item.size,
              height: item.size,
              transform: `rotate(${item.rotation}deg)`,
              opacity: item.opacity,
            }}
            strokeWidth={1.2}
          />
        );
      })}
    </div>
  );
};

export default FloatingIcons;
