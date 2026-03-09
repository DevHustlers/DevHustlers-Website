import { Flame, Rocket, Gem, Crown, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export interface BadgeTier {
  id: string;
  nameKey: string;
  minPoints: number;
  icon: React.ElementType;
  colorClass: string;
  borderClass: string;
  bgClass: string;
}

export const BADGE_TIERS: BadgeTier[] = [
  { id: "spark", nameKey: "badge.spark", minPoints: 0, icon: Sparkles, colorClass: "text-zinc-400", borderClass: "border-zinc-400/30", bgClass: "bg-zinc-400/10" },
  { id: "igniter", nameKey: "badge.igniter", minPoints: 1000, icon: Flame, colorClass: "text-emerald-500", borderClass: "border-emerald-500/30", bgClass: "bg-emerald-500/10" },
  { id: "voyager", nameKey: "badge.voyager", minPoints: 5000, icon: Rocket, colorClass: "text-blue-500", borderClass: "border-blue-500/30", bgClass: "bg-blue-500/10" },
  { id: "titan", nameKey: "badge.titan", minPoints: 10000, icon: Gem, colorClass: "text-purple-500", borderClass: "border-purple-500/30", bgClass: "bg-purple-500/10" },
  { id: "legend", nameKey: "badge.legend", minPoints: 20000, icon: Crown, colorClass: "text-amber-500", borderClass: "border-amber-500/30", bgClass: "bg-amber-500/10" },
];

export const getBadgeForPoints = (points: number): BadgeTier => {
  for (let i = BADGE_TIERS.length - 1; i >= 0; i--) {
    if (points >= BADGE_TIERS[i].minPoints) return BADGE_TIERS[i];
  }
  return BADGE_TIERS[0];
};

interface HonorBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const HonorBadge = ({ points, size = "sm", showLabel = true }: HonorBadgeProps) => {
  const { t } = useLanguage();
  const badge = getBadgeForPoints(points);
  const Icon = badge.icon;

  const sizeMap = {
    sm: { box: "w-6 h-6", icon: "w-3 h-3", text: "text-[10px]" },
    md: { box: "w-8 h-8", icon: "w-4 h-4", text: "text-[11px]" },
    lg: { box: "w-10 h-10", icon: "w-5 h-5", text: "text-[12px]" },
  };

  const s = sizeMap[size];

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className={`${s.box} flex items-center justify-center border ${badge.borderClass} ${badge.bgClass}`}>
        <Icon className={`${s.icon} ${badge.colorClass}`} />
      </div>
      {showLabel && (
        <span className={`${s.text} font-mono font-medium ${badge.colorClass} uppercase tracking-wider`}>
          {t(badge.nameKey)}
        </span>
      )}
    </div>
  );
};

export default HonorBadge;
