import { useMemo } from "react";
import type { IconType } from "react-icons";
import {
  SiReact, SiRust, SiGo, SiRuby, SiCplusplus,
  SiC, SiSharp, SiPython, SiTypescript, SiJavascript,
  SiGnubash, SiZig,
} from "react-icons/si";
import { TbBrackets, TbCode } from "react-icons/tb";
import {
  GiPlanetCore, GiPlanetConquest, GiMoonOrbit,
  GiEarthAfricaEurope, GiEarthAmerica, GiRingedPlanet,
} from "react-icons/gi";
import { FaGlobeAmericas, FaGlobeEurope } from "react-icons/fa";

const ALL_ICONS: IconType[] = [
  SiReact, GiPlanetCore, SiRust, GiRingedPlanet, SiGo, GiMoonOrbit,
  SiRuby, GiEarthAfricaEurope, SiCplusplus, GiPlanetConquest,
  SiC, GiEarthAmerica, SiSharp, FaGlobeAmericas, SiPython, FaGlobeEurope,
  SiTypescript, SiJavascript, SiGnubash, SiZig, TbBrackets, TbCode,
];

const POSITIONS = [
  // left side (12)
  { top: 2, left: 2 }, { top: 10, left: 5 }, { top: 18, left: 3 },
  { top: 27, left: 6 }, { top: 36, left: 2 }, { top: 45, left: 5 },
  { top: 54, left: 3 }, { top: 63, left: 6 }, { top: 72, left: 2 },
  { top: 81, left: 5 }, { top: 90, left: 3 }, { top: 96, left: 6 },
  // right side (12)
  { top: 4, left: 91 }, { top: 12, left: 94 }, { top: 20, left: 92 },
  { top: 29, left: 93 }, { top: 38, left: 91 }, { top: 47, left: 94 },
  { top: 56, left: 92 }, { top: 65, left: 93 }, { top: 74, left: 91 },
  { top: 83, left: 94 }, { top: 92, left: 92 }, { top: 98, left: 93 },
];

const FloatingIcons = () => {
  const items = useMemo(() => {
    return POSITIONS.map((pos, i) => ({
      id: i,
      Icon: ALL_ICONS[i % ALL_ICONS.length],
      top: pos.top + Math.random() * 3 - 1.5,
      left: pos.left + Math.random() * 3 - 1.5,
      size: 40 + Math.random() * 24,
      rotation: Math.random() * 24 - 12,
      opacity: 0.09 + Math.random() * 0.07,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {items.map(({ id, Icon, top, left, size, rotation, opacity }) => (
        <Icon
          key={id}
          className="absolute text-muted-foreground dark:text-muted-foreground/70"
          style={{
            top: `${top}%`,
            left: `${left}%`,
            width: size,
            height: size,
            transform: `rotate(${rotation}deg)`,
            opacity,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingIcons;
