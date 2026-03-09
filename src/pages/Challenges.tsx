import { useState } from "react";
import { Clock, Users, Zap, Trophy, ArrowRight, Circle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const TRACKS = [
  "All", "Frontend", "Backend", "Data Science", "AI / ML",
  "Cybersecurity", "Mobile Dev", "OS", "UI/UX", "Network"
];

const MOCK_CHALLENGES = [
  { id: 1, title: "Build a Real-Time Chat UI", track: "Frontend", difficulty: "Medium", points: 500, participants: 128, timeLeft: "2d 14h", status: "live" as const, description: "Create a responsive chat interface with message threading and reactions." },
  { id: 2, title: "REST API Rate Limiter", track: "Backend", difficulty: "Hard", points: 750, participants: 89, timeLeft: "1d 6h", status: "live" as const, description: "Implement a distributed rate limiter using sliding window algorithm." },
  { id: 3, title: "Neural Network from Scratch", track: "AI / ML", difficulty: "Expert", points: 1000, participants: 45, timeLeft: "5d 0h", status: "live" as const, description: "Build a multi-layer perceptron without any ML framework." },
  { id: 4, title: "XSS Detection Scanner", track: "Cybersecurity", difficulty: "Hard", points: 800, participants: 67, timeLeft: "3d 8h", status: "live" as const, description: "Create an automated tool that detects XSS vulnerabilities in web apps." },
  { id: 5, title: "Predictive Analytics Dashboard", track: "Data Science", difficulty: "Medium", points: 600, participants: 92, timeLeft: "4d 12h", status: "upcoming" as const, description: "Build a dashboard with predictive models for sales data." },
  { id: 6, title: "Cross-Platform Widget", track: "Mobile Dev", difficulty: "Medium", points: 550, participants: 0, timeLeft: "Starts in 2d", status: "upcoming" as const, description: "Create a reusable widget that works on both iOS and Android." },
  { id: 7, title: "Custom Shell Implementation", track: "OS", difficulty: "Expert", points: 1200, participants: 34, timeLeft: "Ended", status: "ended" as const, description: "Build a Unix-like shell with piping, redirection, and job control." },
  { id: 8, title: "Design System from Scratch", track: "UI/UX", difficulty: "Medium", points: 500, participants: 156, timeLeft: "Ended", status: "ended" as const, description: "Create a comprehensive design system with tokens, components, and docs." },
  { id: 9, title: "Packet Sniffer Tool", track: "Network", difficulty: "Hard", points: 700, participants: 41, timeLeft: "6d 0h", status: "live" as const, description: "Build a network packet analyzer with protocol decoding." },
];

const difficultyColor = (d: string) => {
  switch (d) {
    case "Easy": return "text-emerald-500 border-emerald-500/30";
    case "Medium": return "text-amber-500 border-amber-500/30";
    case "Hard": return "text-orange-500 border-orange-500/30";
    case "Expert": return "text-red-500 border-red-500/30";
    default: return "text-muted-foreground border-border";
  }
};

const statusIndicator = (s: string) => {
  switch (s) {
    case "live": return "bg-emerald-500";
    case "upcoming": return "bg-amber-500";
    case "ended": return "bg-muted-foreground/40";
    default: return "bg-muted-foreground";
  }
};

const Challenges = () => {
  const [activeTrack, setActiveTrack] = useState("All");
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "ended">("live");
  const { t } = useLanguage();

  const filtered = MOCK_CHALLENGES.filter(c => {
    const trackMatch = activeTrack === "All" || c.track === activeTrack;
    const statusMatch = c.status === activeTab;
    return trackMatch && statusMatch;
  });

  const tabLabels: Record<string, string> = {
    live: t("challenges.live"),
    upcoming: t("challenges.upcoming"),
    ended: t("challenges.ended"),
  };

  return (
    <PageLayout>
      <Navbar />

      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
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
      </section>

      <SectionDivider />

      <section className="py-6 border-b border-border">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
          <div className="flex items-center gap-1 mb-6">
            {(["live", "upcoming", "ended"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[13px] font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusIndicator(tab)}`} />
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            {TRACKS.map(track => (
              <button
                key={track}
                onClick={() => setActiveTrack(track)}
                className={`px-3 py-1.5 text-[12px] font-mono transition-colors border ${
                  activeTrack === track
                    ? "border-foreground text-foreground bg-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {track === "All" ? t("challenges.all") : track}
              </button>
            ))}
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Circle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-[15px]">{t("challenges.no_results")}</p>
              </div>
            ) : (
              <div className="grid gap-px bg-border">
                {filtered.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-background p-6 sm:p-8 hover:bg-accent/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                            {challenge.track}
                          </span>
                          <span className={`text-[11px] font-mono px-2 py-0.5 border ${difficultyColor(challenge.difficulty)}`}>
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
                          <span className="font-mono font-bold text-foreground">{challenge.points}</span> {t("challenges.pts")}
                        </div>
                        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          {challenge.participants}
                        </div>
                        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          {challenge.timeLeft}
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
                          <span className="text-[12px] font-mono text-emerald-500 uppercase tracking-wider">{t("challenges.live_now")}</span>
                        </div>
                        <button className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground hover:underline">
                          {t("challenges.enter")} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Challenges;
