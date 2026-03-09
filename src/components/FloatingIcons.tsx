import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Globe, Moon, Sun, Atom, Orbit,
  Code, Terminal, Database, Cpu, Binary,
  Braces, FileCode, Server, Webhook, CircuitBoard,
} from "lucide-react";

const ALL_ICONS: LucideIcon[] = [
  Globe, Moon, Sun, Atom, Orbit,
  Code, Terminal, Database, Cpu, Binary,
  Braces, FileCode, Server, Webhook, CircuitBoard,
];

const POSITIONS = [
  { top: 5, left: 2 }, { top: 18, left: 5 }, { top: 32, left: 3 },
  { top: 48, left: 6 }, { top: 62, left: 2 }, { top: 78, left: 5 }, { top: 90, left: 3 },
  { top: 8, left: 91 }, { top: 22, left: 94 }, { top: 36, left: 92 },
  { top: 50, left: 93 }, { top: 65, left: 91 }, { top: 80, left: 94 }, { top: 92, left: 92 },
];

const FloatingIcons = () => {
  const items = useMemo(() => {
    return POSITIONS.map((pos, i) => ({
      id: i,
      Icon: ALL_ICONS[i % ALL_ICONS.length],
      top: pos.top + Math.random() * 4 - 2,
      left: pos.left + Math.random() * 3 - 1.5,
      size: 32 + Math.random() * 20,
      rotation: Math.random() * 30 - 15,
      opacity: 0.08 + Math.random() * 0.07,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {items.map(({ id, Icon, top, left, size, rotation, opacity }) => (
        <Icon
          key={id}
          className="absolute text-muted-foreground"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: size,
            height: size,
            transform: `rotate(${rotation}deg)`,
            opacity,
          }}
          strokeWidth={1.2}
        />
      ))}
    </div>
  );
};

export default FloatingIcons;
