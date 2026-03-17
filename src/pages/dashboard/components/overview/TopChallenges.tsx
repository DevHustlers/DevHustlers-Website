import { Trophy, Users, ArrowRight } from "lucide-react";
import { useRealtimeChallenges } from "@/hooks/useRealtimeChallenges";

interface ChallengeData {
  id: string;
  title: string;
  participants: number;
  status: "draft" | "upcoming" | "live" | "ended";
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    live: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    upcoming: "text-amber-500 border-amber-500/30 bg-amber-500/10",
    ended: "text-muted-foreground border-border bg-muted/10",
    draft: "text-muted-foreground border-border bg-muted/10",
  };
  return map[status] || "text-muted-foreground border-border bg-muted/10";
};

export const TopChallenges = () => {
  const { challenges: dbChallenges, loading } = useRealtimeChallenges();
  
  const challenges: ChallengeData[] = dbChallenges
    .slice(0, 4)
    .map(c => ({
      id: c.id,
      title: c.title,
      participants: 0, // Placeholder until joins are implemented
      status: (c.status as any) || "live"
    }));
  return (
    <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
          Top Challenges
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <Trophy className="w-4 h-4" />
        </div>
      </div>
      <div className="divide-y divide-border last:rounded-b-2xl">
        {loading ? (
          <div className="px-3 sm:px-5 py-4 text-[12px] text-muted-foreground animate-pulse">
            Loading challenges...
          </div>
        ) : challenges.length === 0 ? (
          <div className="px-3 sm:px-5 py-4 text-[12px] text-muted-foreground">
            No challenges found
          </div>
        ) : (
          challenges.map((challenge, idx) => (
            <div
              key={challenge.id}
              className="px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between hover:bg-accent/50 hover:ps-6 sm:hover:ps-6 transition-all duration-200 group/challenge cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[10px] sm:text-[11px] font-bold font-mono shrink-0 rounded-lg group-hover/challenge:scale-110 transition-transform duration-200 ${
                    idx === 0 ? "bg-amber-500/20 text-amber-500" :
                    idx === 1 ? "bg-slate-400/20 text-slate-400" :
                    idx === 2 ? "bg-orange-600/20 text-orange-600" :
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-medium text-foreground line-clamp-1 group-hover/challenge:text-primary transition-colors">
                    {challenge.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1 group-hover/challenge:text-foreground/70 transition-colors">
                    <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {challenge.participants} participants
                  </p>
                </div>
              </div>
              <span
                className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider shrink-0 ${statusBadge(challenge.status)}`}
              >
                {challenge.status}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-border">
        <button className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-all duration-200 hover:gap-2 group/btn">
          View all challenges{" "}
          <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
