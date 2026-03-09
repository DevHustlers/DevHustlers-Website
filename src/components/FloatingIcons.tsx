import { useEffect, useState } from "react";
import {
  Globe, Rocket, Terminal, Code, Database, Cpu,
  Monitor, Smartphone, Cloud, Wifi, Lock, Zap,
  Star, Moon, Sun, Atom, Binary, Braces,
  FileCode, GitBranch, Hash, Layers, Server, Settings,
} from "lucide-react";

const ALL_ICONS = [
  Globe, Rocket, Terminal, Code, Database, Cpu,
  Monitor, Smartphone, Cloud, Wifi, Lock, Zap,
  Star, Moon, Sun, Atom, Binary, Braces,
  FileCode, GitBranch, Hash, Layers, Server, Settings,
];

interface FloatingIcon {
  id: number;
  Icon: typeof Globe;
  top: number;
  left: number;
  size: number;
  rotation: number;
  opacity: number;
  side: "left" | "right";
}

const FloatingIcons = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    const shuffled = [...ALL_ICONS].sort(() => Math.random() - 0.5);
    const items: FloatingIcon[] = shuffled.slice(0, 14).map((Icon, i) => {
      const side = i < 7 ? "left" : "right";
      return {
        id: i,
        Icon,
        top: 8 + (i % 7) * 13 + Math.random() * 5,
        left: side === "left"
          ? 2 + Math.random() * 8
          : 90 + Math.random() * 8,
        size: 16 + Math.random() * 10,
        rotation: Math.random() * 40 - 20,
        opacity: 0.06 + Math.random() * 0.07,
        side,
      };
    });
    setIcons(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {icons.map((item) => (
        <item.Icon
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
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

export default FloatingIcons;
