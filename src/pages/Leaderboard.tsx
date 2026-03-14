import { useState } from "react";
import { Trophy, Medal, Star, TrendingUp, ArrowUp, ArrowDown, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import HonorBadge, { BADGE_TIERS } from "@/components/HonorBadge";
import { useLanguage } from "@/i18n/LanguageContext";

const MOCK_USERS = [
  { rank: 1, name: "Sarah Chen", username: "@sarachen", points: 12450, change: 2, challenges: 34, streak: 15, tracks: ["Frontend", "UI/UX"] },
  { rank: 2, name: "Ahmed Hassan", username: "@ahmedh", points: 11200, change: -1, challenges: 29, streak: 12, tracks: ["Backend", "Network"] },
  { rank: 3, name: "Maria Rodriguez", username: "@mariar", points: 10800, change: 1, challenges: 31, streak: 8, tracks: ["AI / ML", "Data Science"] },
  { rank: 4, name: "James Park", username: "@jamesp", points: 9650, change: 0, challenges: 27, streak: 20, tracks: ["Cybersecurity"] },
  { rank: 5, name: "Fatima Al-Sayed", username: "@fatimas", points: 8900, change: 3, challenges: 25, streak: 6, tracks: ["Mobile Dev", "Frontend"] },
  { rank: 6, name: "Liam O'Brien", username: "@liamob", points: 8200, change: -2, challenges: 22, streak: 9, tracks: ["Backend", "OS"] },
  { rank: 7, name: "Yuki Tanaka", username: "@yukit", points: 7800, change: 1, challenges: 20, streak: 11, tracks: ["Data Science", "AI / ML"] },
  { rank: 8, name: "Noah Williams", username: "@noahw", points: 7350, change: 0, challenges: 19, streak: 5, tracks: ["Frontend"] },
  { rank: 9, name: "Priya Patel", username: "@priyap", points: 6900, change: -1, challenges: 18, streak: 7, tracks: ["UI/UX", "Mobile Dev"] },
  { rank: 10, name: "Alex Kim", username: "@alexk", points: 6500, change: 4, challenges: 16, streak: 3, tracks: ["Network", "Cybersecurity"] },
  { rank: 11, name: "Emma Brown", username: "@emmab", points: 6100, change: 0, challenges: 15, streak: 14, tracks: ["Backend"] },
  { rank: 12, name: "Omar Farooq", username: "@omarf", points: 5800, change: -3, challenges: 14, streak: 2, tracks: ["OS", "Network"] },
];

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <div className="w-10 h-10 flex items-center justify-center border border-amber-500/30 bg-amber-500/10"><Trophy className="w-5 h-5 text-amber-500" /></div>;
  if (rank === 2) return <div className="w-10 h-10 flex items-center justify-center border border-zinc-400/30 bg-zinc-400/10"><Medal className="w-5 h-5 text-zinc-400" /></div>;
  if (rank === 3) return <div className="w-10 h-10 flex items-center justify-center border border-amber-700/30 bg-amber-700/10"><Medal className="w-5 h-5 text-amber-700" /></div>;
  return <div className="w-10 h-10 flex items-center justify-center border border-border font-mono text-[14px] font-bold text-muted-foreground">{rank}</div>;
};

const ChangeIndicator = ({ change }: { change: number }) => {
  if (change > 0) return <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-500 font-mono"><ArrowUp className="w-3 h-3" />{change}</span>;
  if (change < 0) return <span className="inline-flex items-center gap-0.5 text-[11px] text-red-500 font-mono"><ArrowDown className="w-3 h-3" />{Math.abs(change)}</span>;
  return <span className="inline-flex items-center text-[11px] text-muted-foreground/50 font-mono"><Minus className="w-3 h-3" /></span>;
};

const UserRow = ({ user }: { user: typeof MOCK_USERS[0] }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <RankBadge rank={user.rank} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-0.5">
          <p className="font-semibold text-foreground text-[14px] sm:text-[15px] truncate">{user.name}</p>
          <ChangeIndicator change={user.change} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[11px] sm:text-[12px] text-muted-foreground font-mono">{user.username}</p>
          <HonorBadge points={user.points} size="sm" showLabel={true} />
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-1 flex-wrap justify-end max-w-[200px]">
        {user.tracks.map(track => (
          <span key={track} className="text-[10px] font-mono px-2 py-0.5 border border-border text-muted-foreground">{track}</span>
        ))}
      </div>
      <div className="text-right shrink-0">
        <p className="font-mono font-bold text-foreground text-[15px] sm:text-[16px]">{user.points.toLocaleString()}</p>
        <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">{user.challenges} {t("leaderboard.challenges")}</p>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState("all_time");
  const { t } = useLanguage();

  const FILTERS = [
    { key: "all_time", label: t("leaderboard.all_time") },
    { key: "this_month", label: t("leaderboard.this_month") },
    { key: "this_week", label: t("leaderboard.this_week") },
  ];

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
            {FILTERS.map(f => (
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

      {/* Badge Tiers */}
      <ScrollReveal>
        <section className="py-10 sm:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
            <p className="text-[12px] sm:text-[13px] font-mono text-muted-foreground mb-4 uppercase tracking-widest">
              {t("badge.title")}
            </p>
            <div className="flex border border-border divide-x divide-border">
              {BADGE_TIERS.map((tier) => (
                <div key={tier.id} className="flex-1 bg-background py-4 px-2 flex flex-col items-center text-center gap-1.5">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border ${tier.borderClass} ${tier.bgClass}`}>
                    <tier.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${tier.colorClass}`} />
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-mono font-bold ${tier.colorClass} uppercase`}>{t(tier.nameKey)}</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground font-mono">{tier.minPoints.toLocaleString()}+</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />

      {/* Full Rankings */}
      <section className="pb-0">
        {MOCK_USERS.map((user, i) => (
          <ScrollReveal key={user.rank} delay={i * 30}>
            <div className="group">
              <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6 py-5 sm:py-6 hover:bg-accent/30 transition-colors duration-300 cursor-pointer">
                <UserRow user={user} />
              </div>
              {i < MOCK_USERS.length - 1 && <SectionDivider />}
            </div>
          </ScrollReveal>
        ))}
      </section>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Leaderboard;
