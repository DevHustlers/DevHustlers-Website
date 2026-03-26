import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Users,
  Zap,
  Trophy,
  ArrowRight,
  Circle,
  Play,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRealtimeChallenges } from "@/hooks/useRealtimeChallenges";
import { useRealtimeCompetitions } from "@/hooks/useRealtimeCompetitions";
import { useRealtimeTracks } from "@/hooks/useRealtimeTracks";
import type { Tables } from "@/types/database";

const difficultyColor = (d: string) => {
  switch (d) {
    case "Easy":
      return "text-emerald-500 border-emerald-500/30";
    case "Medium":
      return "text-amber-500 border-amber-500/30";
    case "Hard":
      return "text-orange-500 border-orange-500/30";
    case "Expert":
      return "text-red-500 border-red-500/30";
    default:
      return "text-muted-foreground border-border";
  }
};

const statusIndicator = (s: string) => {
  switch (s) {
    case "live":
      return "bg-emerald-500";
    case "upcoming":
      return "bg-amber-500";
    case "ended":
      return "bg-muted-foreground/40";
    default:
      return "bg-muted-foreground";
  }
};

const Challenges = () => {
  const [activeTrack, setActiveTrack] = useState("All");
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "ended">(
    "live",
  );
  const { t } = useLanguage();
  const { challenges, loading: challengesLoading } = useRealtimeChallenges();
  const { competitions, loading: compsLoading } = useRealtimeCompetitions();
  const { tracks: dbTracks, loading: tracksLoading } = useRealtimeTracks();

  const loading = challengesLoading || compsLoading || tracksLoading;

  const tracks = ["All", ...dbTracks.map((t) => t.name)];

  const liveComp = competitions.find(c => c.status === "live");

  const tabLabels: Record<string, string> = {
    live: t("challenges.live"),
    upcoming: t("challenges.upcoming"),
    ended: t("challenges.ended"),
  };

  const combinedItems = useMemo(() => {
    const list = [
        ...challenges.map(c => ({
            ...c,
            isCompetition: false,
            link: `/challenges/${c.id}`
        })),
        ...competitions.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description || "",
            track: "Tournament",
            difficulty: "Medium",
            status: c.status === "scheduled" ? "upcoming" : (c.status === "ended" ? "ended" : c.status),
            points: c.prize || "---",
            duration: `${c.time_per_question}s/round`,
            isCompetition: true,
            link: `/competition/${c.id}`
        }))
    ];
    return list;
  }, [challenges, competitions]);

  const filtered = combinedItems.filter((c) => {
    const trackMatch = activeTrack === "All" || c.track === activeTrack;
    const statusMatch = c.status === activeTab;
    return trackMatch && statusMatch;
  });

  if (loading) {
    return (
      <PageLayout>
        <Navbar />
        <div className="pt-40 text-center font-mono animate-pulse">
          FETCHING_CHALLENGES...
        </div>
        <Footer />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Navbar />

      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto pl-3 sm:pl-6 lg:pl-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-4">
                {t("challenges.label")}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
                {t("challenges.title")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg">
                {t("challenges.desc")}
              </p>
            </div>

            {/* Live Competition Banner - right side of header */}
            {liveComp && (
              <Link
                to={`/competition/${liveComp.id}`}
                className="hidden sm:block group shrink-0 w-[320px]"
              >
                <div className="border border-emerald-500/30 bg-emerald-500/5 p-5 hover:border-emerald-500/50 transition-colors h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[11px] font-mono text-emerald-500 uppercase tracking-widest">
                      {t("challenges.live_now")}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-foreground mb-2">
                    {liveComp.title}
                  </h3>
                  <div className="flex flex-col gap-1 text-[11px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" /> {liveComp.time_per_question}s per question
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> Multiple Players
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" /> {liveComp.prize || "Recognition & Points"}
                    </span>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium text-emerald-500 group-hover:text-emerald-400 transition-colors">
                    Join Now <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Filters - full width aligned */}
      <div className="border-b border-border">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
          <div className="flex items-center">
            {/* Status filters */}
            {(["live", "upcoming", "ended"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[13px] font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusIndicator(tab)}`}
                />
                {tabLabels[tab]}
              </button>
            ))}

            {/* Vertical separator */}
            <div className="w-px h-10 bg-border" />

            {/* Category filters */}
            <div className="flex items-center overflow-x-auto">
              {tracks.map((track) => (
                <button
                  key={track}
                  onClick={() => setActiveTrack(track)}
                  className={`px-3 py-3 text-[12px] font-mono transition-colors whitespace-nowrap ${
                    activeTrack === track
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {track === "All" ? t("challenges.all") : track}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SectionDivider />

      <ScrollReveal>
        <section className="py-0">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Circle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-[15px]">
                  {t("challenges.no_results")}
                </p>
              </div>
            ) : (
              <div>
                {filtered.map((challenge) => (
                  <Link key={challenge.id} to={challenge.link}>
                    <div className="bg-background p-6 sm:p-8 hover:bg-accent/30 transition-colors group cursor-pointer">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                              {challenge.track}
                            </span>
                            <span
                              className={`text-[11px] font-mono px-2 py-0.5 border ${difficultyColor(challenge.difficulty)}`}
                            >
                              {challenge.difficulty}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:underline">
                            {challenge.title}
                          </h3>
                          <p className="text-muted-foreground text-[14px] max-w-lg">
                            {challenge.description}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0">
                          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                            <Trophy className="w-3.5 h-3.5" />
                            <span className="font-mono font-bold text-foreground">
                              {challenge.points}
                            </span>{" "}
                            {t("challenges.pts")}
                          </div>
                          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            {/* participants not in schema */}
                            0
                          </div>
                          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {challenge.duration || "---"}
                          </div>
                        </div>
                      </div>

                      {challenge.status === "live" && (
                        <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-[12px] font-mono text-emerald-500 uppercase tracking-wider">
                              {t("challenges.live_now")}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground hover:underline">
                            {t("challenges.enter")}{" "}
                            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </PageLayout>
  );
};

export default Challenges;
