import { Flame, ArrowRight } from "lucide-react";
import { useRealtimeLeaderboard } from "@/hooks/useRealtimeLeaderboard";

export const LeaderboardSmall = () => {
  const { leaderboard: dbLeaderboard, loading } = useRealtimeLeaderboard(4);
  
  const users = dbLeaderboard.map(u => ({
    name: u.full_name || u.name || "Anonymous",
    points: u.points || 0,
    streak: 0 // Placeholder
  }));
  return (
    <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
          Leaderboard
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <Flame className="w-4 h-4" />
        </div>
      </div>
      <div className="divide-y divide-border last:rounded-b-2xl">
        {loading ? (
          <div className="px-3 sm:px-5 py-4 text-[12px] text-muted-foreground animate-pulse">
            Loading rankings...
          </div>
        ) : users.length === 0 ? (
          <div className="px-3 sm:px-5 py-4 text-[12px] text-muted-foreground">
            No rankings found
          </div>
        ) : (
          users.map((user, idx) => (
            <div
              key={idx}
              className="px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between hover:bg-accent/50 hover:ps-6 sm:hover:ps-6 transition-all duration-200 group/user cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent border border-border flex items-center justify-center text-[10px] sm:text-[11px] font-bold font-mono text-foreground shrink-0 rounded-lg group-hover/user:scale-110 group-hover/user:border-primary/30 transition-all duration-200">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-medium text-foreground line-clamp-1 group-hover/user:text-primary transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1 group-hover/user:text-foreground/70 transition-colors">
                    <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" /> {user.streak} day streak
                  </p>
                </div>
              </div>
              <p className="font-mono font-bold text-foreground text-[12px] sm:text-[14px] shrink-0 group-hover/user:text-primary transition-colors">
                {user.points.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-border">
        <button className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-all duration-200 hover:gap-2 group/btn">
          View all rankings{" "}
          <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
