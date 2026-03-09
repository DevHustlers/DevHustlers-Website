import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";
import {
  Play, Clock, Users, Trophy, Calendar, ArrowRight,
  Flame, Zap, Star, ChevronRight, MapPin, Sparkles
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const LIVE_COMPETITIONS = [
  {
    id: "comp-1",
    title: "Frontend Mastery Showdown",
    description: "Test your frontend knowledge in this fast-paced quiz battle",
    startsAt: new Date("2026-03-09T20:00:00"),
    participants: 128,
    prize: "500 pts + Gold Badge",
    status: "live" as const,
    questionsCount: 10,
  },
  {
    id: "comp-2",
    title: "Backend Brain Battle",
    description: "API and server-side knowledge quiz",
    startsAt: new Date("2026-03-15T19:00:00"),
    participants: 0,
    prize: "750 pts + Silver Badge",
    status: "upcoming" as const,
    questionsCount: 15,
  },
];

const UPCOMING_EVENTS = [
  { id: "ev-1", title: "Frontend Hackathon", date: "Mar 15, 2026", time: "10:00 AM", type: "hackathon", location: "Online — Discord", registered: 142, capacity: 200 },
  { id: "ev-2", title: "AI Workshop", date: "Mar 22, 2026", time: "2:00 PM", type: "workshop", location: "Online — Zoom", registered: 67, capacity: 100 },
  { id: "ev-3", title: "Cybersecurity CTF", date: "Apr 10, 2026", time: "6:00 PM", type: "competition", location: "Online — Platform", registered: 0, capacity: 150 },
];

const NEWS_FEED = [
  { id: 1, type: "competition", text: "Frontend Mastery Showdown is LIVE now!", time: "Just now", icon: Play },
  { id: 2, type: "achievement", text: "Sarah Chen earned the Titan badge 🏆", time: "5m ago", icon: Trophy },
  { id: 3, type: "challenge", text: "New challenge: Build a Real-Time Chat UI", time: "1h ago", icon: Flame },
  { id: 4, type: "points", text: "Ahmed Hassan reached 11,000 points", time: "2h ago", icon: Zap },
  { id: 5, type: "event", text: "Frontend Hackathon registrations open", time: "3h ago", icon: Calendar },
  { id: 6, type: "leaderboard", text: "Leaderboard updated — new #1 this week", time: "4h ago", icon: Star },
];

const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      };
    };
    setTimeLeft(calc());
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground leading-none tabular-nums">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">{label}</span>
  </div>
);

const CompetitionCard = ({ comp, index }: { comp: typeof LIVE_COMPETITIONS[0]; index: number }) => {
  const countdown = useCountdown(comp.startsAt);
  const isLive = comp.status === "live" || countdown.expired;

  return (
    <ScrollReveal delay={index * 80}>
      <div className="bg-background p-6 sm:p-8 flex flex-col justify-between hover:bg-accent/30 transition-colors duration-300 h-full">
        <div>
          <div className="flex items-center gap-3 mb-3">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-foreground border border-border bg-accent">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground" />
                </span>
                Live Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground border border-border bg-accent/50">
                <Clock className="w-3 h-3" /> Upcoming
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">{comp.title}</h3>
          <p className="text-[13px] text-muted-foreground mb-4">{comp.description}</p>

          {!isLive && (
            <div className="flex items-center gap-4 sm:gap-6 mb-4 py-3 px-4 border border-border bg-accent/30">
              <CountdownUnit value={countdown.days} label="Days" />
              <span className="text-muted-foreground/30 text-xl font-mono">:</span>
              <CountdownUnit value={countdown.hours} label="Hrs" />
              <span className="text-muted-foreground/30 text-xl font-mono">:</span>
              <CountdownUnit value={countdown.minutes} label="Min" />
              <span className="text-muted-foreground/30 text-xl font-mono">:</span>
              <CountdownUnit value={countdown.seconds} label="Sec" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground font-mono mb-4">
            <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {comp.prize}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {comp.participants} joined</span>
            <span>{comp.questionsCount} questions</span>
          </div>
        </div>

        <div>
          <Link
            to={`/competition/${comp.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 font-medium text-[14px] transition-colors bg-foreground text-background hover:bg-foreground/90"
          >
            {isLive ? "Join Now" : "Register"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
};

const LiveSection = () => {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
        {/* Section header */}
        <div className="mb-10">
          <ScrollReveal>
            <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
              Happening Now
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
              Competitions{" "}
              <span className="font-serif text-muted-foreground font-normal">& Events</span>
            </h2>
            <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg max-w-lg">
              Jump into live competitions, register for upcoming events, and stay updated with the latest activity.
            </p>
          </ScrollReveal>
        </div>

        {/* Competitions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-0 py-4">
            <h3 className="text-[13px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Play className="w-3.5 h-3.5" /> Live Competitions
            </h3>
            <Link to="/challenges" className="text-[12px] text-muted-foreground hover:text-foreground font-mono flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="border border-border bg-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px">
              {LIVE_COMPETITIONS.map((comp, i) => (
                <CompetitionCard key={comp.id} comp={comp} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Events + Feed grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-0 py-4">
              <h3 className="text-[13px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Upcoming Events
              </h3>
              <Link to="/events" className="text-[12px] text-muted-foreground hover:text-foreground font-mono flex items-center gap-1 transition-colors">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="border border-border bg-border">
              <div className="grid grid-cols-1 gap-px">
                {UPCOMING_EVENTS.map((event, i) => (
                  <ScrollReveal key={event.id} delay={i * 80}>
                    <div className="bg-background p-5 sm:p-6 hover:bg-accent/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-[13px] font-semibold text-foreground">{event.title}</h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 border border-border text-muted-foreground uppercase tracking-wider bg-accent/50">{event.type}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {event.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {event.time}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-mono mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {event.location}</span>
                        <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" /> {event.registered}/{event.capacity}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>

          {/* Live Feed */}
          <div>
            <div className="flex items-center justify-between mb-0 py-4">
              <h3 className="text-[13px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Live Feed
              </h3>
            </div>
            <div className="border border-border bg-border">
              <div className="grid grid-cols-1 gap-px">
                {NEWS_FEED.map((item, i) => (
                  <ScrollReveal key={item.id} delay={i * 60}>
                    <div className="bg-background px-5 py-3.5 flex items-start gap-3 hover:bg-accent/30 transition-colors">
                      <item.icon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-[12px] text-foreground leading-snug">{item.text}</p>
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSection;
