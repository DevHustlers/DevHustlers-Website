import { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import HonorBadge, { BADGE_TIERS } from "@/components/HonorBadge";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRealtimeLeaderboard } from "@/hooks/useRealtimeLeaderboard";
import type { LeaderboardUser } from "@/services/leaderboard.service";

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1)
    return (
      <div className="w-10 h-10 flex items-center justify-center border border-amber-500/30 bg-amber-500/10">
        <Trophy className="w-5 h-5 text-amber-500" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="w-10 h-10 flex items-center justify-center border border-zinc-400/30 bg-zinc-400/10">
        <Medal className="w-5 h-5 text-zinc-400" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="w-10 h-10 flex items-center justify-center border border-amber-700/30 bg-amber-700/10">
        <Medal className="w-5 h-5 text-amber-700" />
      </div>
    );
  return (
    <div className="w-10 h-10 flex items-center justify-center border border-border font-mono text-[14px] font-bold text-muted-foreground">
      {rank}
    </div>
  );
};

const ChangeIndicator = ({ change }: { change: number }) => {
  if (change > 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-500 font-mono">
        <ArrowUp className="w-3 h-3" />
        {change}
      </span>
    );
  if (change < 0)
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] text-red-500 font-mono">
        <ArrowDown className="w-3 h-3" />
        {Math.abs(change)}
      </span>
    );
  return (
    <span className="inline-flex items-center text-[11px] text-muted-foreground/50 font-mono">
      <Minus className="w-3 h-3" />
    </span>
  );
};

const UserRow = ({ user, isCurrentUser }: { user: LeaderboardUser; isCurrentUser?: boolean }) => {
  const { t } = useLanguage();
  const hasFullName = !!user.full_name;
  
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <div className="flex-1 min-w-0 flex items-center gap-4 sm:gap-6">
        <RankBadge rank={user.rank} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-0.5">
            <p className="font-semibold text-foreground text-[14px] sm:text-[15px] truncate">
              {user.full_name || user.username || "Anonymous"}
              {isCurrentUser && (
                <span className="ms-2 text-[10px] font-mono text-primary uppercase tracking-tighter">
                  (YOU)
                </span>
              )}
            </p>
            <ChangeIndicator change={0} />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasFullName && (
              <p className="text-[11px] sm:text-[12px] text-muted-foreground font-mono">
                @{user.username || "user"}
              </p>
            )}
            <HonorBadge points={user.points || 0} size="sm" showLabel={true} />
          </div>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1 flex-wrap justify-end max-w-[200px]">
        <span className="text-[10px] font-mono px-2 py-0.5 border border-border text-muted-foreground">
          Member
        </span>
      </div>
      <div className="text-right shrink-0">
        <p className="font-mono font-bold text-foreground text-[15px] sm:text-[16px]">
          {(user.points || 0).toLocaleString()}
        </p>
        <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
          0 {t("leaderboard.challenges")}
        </p>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState("all_time");
  const { t } = useLanguage();
  const { leaderboard, loading } = useRealtimeLeaderboard(20);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    import("@/lib/supabase").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        setCurrentUserId(data.session?.user?.id || null);
      });
    });
  }, []);

  const FILTERS = [
    { key: "all_time", label: t("leaderboard.all_time") },
    { key: "this_month", label: t("leaderboard.this_month") },
    { key: "this_week", label: t("leaderboard.this_week") },
  ];

  if (loading) {
    return (
      <PageLayout>
        <Navbar />
        <div className="pt-40 text-center font-mono animate-pulse">
          LOADING_DATABASE_RECORDS...
        </div>
        <Footer />
      </PageLayout>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);
  
  // Pad topThree if less than 3
  const first = topThree[0] || null;
  const second = topThree[1] || null;
  const third = topThree[2] || null;

  return (
    <PageLayout>
      <Navbar />

      {/* Header */}
      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
          <p className="text-[12px] sm:text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            {t("leaderboard.label")}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
            {t("leaderboard.title")}
          </h1>
          <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg max-w-lg">
            {t("leaderboard.desc")}
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-8">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setTimeFilter(f.key)}
                className={`px-3 py-1 text-[12px] font-medium border transition-colors ${
                  timeFilter === f.key
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono ms-auto">
              <TrendingUp className="w-3.5 h-3.5" />
              {t("leaderboard.updated")}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Top 3 Podium */}
      <ScrollReveal>
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
            <p className="text-[12px] sm:text-[13px] font-mono text-muted-foreground mb-6 uppercase tracking-widest">
              {t("leaderboard.top_players") || "Top Players"}
            </p>
            <div className="grid grid-cols-3 gap-px bg-border border border-border">
              {/* 2nd Place */}
              <div className="bg-background flex flex-col items-center justify-end py-6 sm:py-10 px-3 order-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border border-zinc-400/30 bg-zinc-400/10 mb-3">
                  <Medal className="w-6 h-6 sm:w-7 sm:h-7 text-zinc-400" />
                </div>
                <span className="font-mono text-[20px] sm:text-[24px] font-bold text-zinc-400 mb-1">
                  2
                </span>
                <p className="font-semibold text-foreground text-[13px] sm:text-[15px] text-center truncate max-w-full">
                  {second?.full_name || second?.username || "---"}
                </p>
                {second?.full_name && (
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono mt-0.5">
                    @{second?.username || "user"}
                  </p>
                )}
                <p className="font-mono font-bold text-foreground text-[14px] sm:text-[16px] mt-2">
                  {(second?.points || 0).toLocaleString()}
                </p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono">
                  0 {t("leaderboard.challenges")}
                </p>
                <div className="mt-3">
                  <HonorBadge
                    points={second?.points || 0}
                    size="sm"
                    showLabel={true}
                  />
                </div>
              </div>

              {/* 1st Place */}
              <div className="bg-background flex flex-col items-center justify-end py-8 sm:py-12 px-3 order-2 relative">
                <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2">
                  <Star className="w-4 h-4 text-amber-500/40" />
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border border-amber-500/30 bg-amber-500/10 mb-3">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500" />
                </div>
                <span className="font-mono text-[24px] sm:text-[28px] font-bold text-amber-500 mb-1">
                  1
                </span>
                <p className="font-semibold text-foreground text-[14px] sm:text-[16px] text-center truncate max-w-full">
                  {first?.full_name || first?.username || "---"}
                </p>
                {first?.full_name && (
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono mt-0.5">
                    @{first?.username || "user"}
                  </p>
                )}
                <p className="font-mono font-bold text-foreground text-[16px] sm:text-[18px] mt-2">
                  {(first?.points || 0).toLocaleString()}
                </p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono">
                  0 {t("leaderboard.challenges")}
                </p>
                <div className="mt-3">
                  <HonorBadge
                    points={first?.points || 0}
                    size="sm"
                    showLabel={true}
                  />
                </div>
              </div>

              {/* 3rd Place */}
              <div className="bg-background flex flex-col items-center justify-end py-6 sm:py-10 px-3 order-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border border-amber-700/30 bg-amber-700/10 mb-3">
                  <Medal className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700" />
                </div>
                <span className="font-mono text-[20px] sm:text-[24px] font-bold text-amber-700 mb-1">
                  3
                </span>
                <p className="font-semibold text-foreground text-[13px] sm:text-[15px] text-center truncate max-w-full">
                  {third?.full_name || third?.username || "---"}
                </p>
                {third?.full_name && (
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono mt-0.5">
                    @{third?.username || "user"}
                  </p>
                )}
                <p className="font-mono font-bold text-foreground text-[14px] sm:text-[16px] mt-2">
                  {(third?.points || 0).toLocaleString()}
                </p>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono">
                  0 {t("leaderboard.challenges")}
                </p>
                <div className="mt-3">
                  <HonorBadge
                    points={third?.points || 0}
                    size="sm"
                    showLabel={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />

      {/* Badge Tiers */}
      <ScrollReveal>
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
            <p className="text-[12px] sm:text-[13px] font-mono text-muted-foreground mb-4 uppercase tracking-widest">
              {t("badge.title")}
            </p>
            <div className="flex border border-border divide-x divide-border">
              {BADGE_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="flex-1 bg-background py-4 px-2 flex flex-col items-center text-center gap-1.5"
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border ${tier.borderClass} ${tier.bgClass}`}
                  >
                    <tier.icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${tier.colorClass}`}
                    />
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-mono font-bold ${tier.colorClass} uppercase`}
                  >
                    {t(tier.nameKey)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground font-mono">
                    {tier.minPoints.toLocaleString()}+
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />

      {/* Full Rankings (4th onward) */}
      <section className="pb-0">
        {remaining.map((user, i) => {
          const isMe = user.id === currentUserId;
          return (
            <ScrollReveal key={user.id} delay={i * 30}>
              <div className="group">
                <div className={`max-w-5xl mx-auto px-4 sm:px-8 lg:px-6 py-5 sm:py-6 transition-all duration-300 cursor-pointer hover:bg-accent/30 ${
                  isMe ? "bg-primary/[0.03] border-s-2 border-primary/50" : ""
                }`}>
                  <UserRow user={user} isCurrentUser={isMe} />
                </div>
                {i < remaining.length - 1 && <SectionDivider />}
              </div>
            </ScrollReveal>
          );
        })}
      </section>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Leaderboard;
