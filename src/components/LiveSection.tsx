import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play, Clock, Users, Trophy, Calendar, ArrowRight,
  Flame, Zap, Star, ChevronRight, MapPin, Sparkles
} from "lucide-react";

const LIVE_COMPETITIONS = [
  {
    id: "comp-1",
    title: "Frontend Mastery Showdown",
    description: "Test your frontend knowledge in this fast-paced quiz battle. Compete against the best developers in real-time.",
    startsAt: new Date("2026-03-09T20:00:00"),
    participants: 128,
    prize: "500 pts + Gold Badge",
    status: "live" as const,
    questionsCount: 10,
  },
  {
    id: "comp-2",
    title: "Backend Brain Battle",
    description: "API and server-side knowledge quiz. Prove your backend expertise across databases, APIs and architecture.",
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
  { id: 1, text: "Frontend Mastery Showdown is LIVE now!", time: "Just now", icon: Play, hoverColor: "hsl(var(--live))" },
  { id: 2, text: "Sarah Chen earned the Titan badge 🏆", time: "5m ago", icon: Trophy, hoverColor: "hsl(var(--upcoming))" },
  { id: 3, text: "New challenge: Build a Real-Time Chat UI", time: "1h ago", icon: Flame, hoverColor: "hsl(var(--destructive))" },
  { id: 4, text: "Ahmed Hassan reached 11,000 points", time: "2h ago", icon: Zap, hoverColor: "hsl(var(--feed))" },
  { id: 5, text: "Frontend Hackathon registrations open", time: "3h ago", icon: Calendar, hoverColor: "hsl(var(--upcoming))" },
  { id: 6, text: "Leaderboard updated — new #1 this week", time: "4h ago", icon: Star, hoverColor: "hsl(var(--feed))" },
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
    <span className="text-2xl sm:text-3xl font-bold font-mono text-foreground leading-none tabular-nums transition-colors duration-300 group-hover/upcoming:text-upcoming">
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">{label}</span>
  </div>
);

const CompetitionCard = ({ comp }: { comp: typeof LIVE_COMPETITIONS[0] }) => {
  const countdown = useCountdown(comp.startsAt);
  const isLive = comp.status === "live" || countdown.expired;

  return (
    <div className={`bg-background p-6 sm:p-7 transition-all duration-300 h-full flex flex-col justify-between ${
      isLive ? "group/live hover:bg-accent/40" : "group/upcoming hover:bg-accent/40"
    }`}>
      <div>
        <div className="flex items-center gap-3 mb-3">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-foreground border border-border bg-accent transition-colors duration-300 group-hover/live:text-live group-hover/live:border-live/40 group-hover/live:bg-live/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75 group-hover/live:bg-live" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-foreground group-hover/live:bg-live" />
              </span>
              Live Now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground border border-border bg-accent/50 transition-colors duration-300 group-hover/upcoming:text-upcoming group-hover/upcoming:border-upcoming/40 group-hover/upcoming:bg-upcoming/10">
              <Clock className="w-3 h-3" /> Upcoming
            </span>
          )}
        </div>

        <h3 className="font-semibold text-foreground text-[17px] mb-1.5">{comp.title}</h3>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">{comp.description}</p>

        {!isLive && (
          <div className="flex items-center gap-4 sm:gap-6 mb-4 py-3 px-4 border border-border bg-accent/30 transition-colors duration-300 group-hover/upcoming:border-upcoming/30 group-hover/upcoming:bg-upcoming/5">
            <CountdownUnit value={countdown.days} label="Days" />
            <span className="text-muted-foreground/30 text-xl font-mono">:</span>
            <CountdownUnit value={countdown.hours} label="Hrs" />
            <span className="text-muted-foreground/30 text-xl font-mono">:</span>
            <CountdownUnit value={countdown.minutes} label="Min" />
            <span className="text-muted-foreground/30 text-xl font-mono">:</span>
            <CountdownUnit value={countdown.seconds} label="Sec" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground font-mono mb-4">
          <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {comp.prize}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {comp.participants} joined</span>
          <span>{comp.questionsCount} questions</span>
        </div>
      </div>

      <div>
        <Link
          to={`/competition/${comp.id}`}
          className={`inline-flex items-center gap-2 px-7 py-3 font-medium text-[16px] transition-colors duration-300 bg-foreground text-background ${
            isLive
              ? "group-hover/live:bg-live group-hover/live:text-live-foreground"
              : "group-hover/upcoming:bg-upcoming group-hover/upcoming:text-upcoming-foreground"
          }`}
        >
          {isLive ? "Join Now" : "Register"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

const LiveSection = () => {
  return (
    <section>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
        {/* Section header */}
        <div className="px-3 sm:px-4 lg:px-6 pt-20 sm:pt-24 pb-14">
          <p className="text-[15px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            Happening Now
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Competitions{" "}
            <span className="font-serif text-muted-foreground font-normal">& Events</span>
          </h2>
        </div>

        {/* Row 1: Live Now card + Live Feed */}
        <div className="px-3 sm:px-4 lg:px-6 flex items-center justify-between pb-3">
          <h3 className="text-[15px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Play className="w-4 h-4" /> Live Competitions
          </h3>
          <Link to="/challenges" className="text-[13px] text-muted-foreground hover:text-foreground font-mono flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border-t border-border">
          <CompetitionCard comp={LIVE_COMPETITIONS[0]} />

          {/* Live Feed */}
          <div className="bg-background group/feed">
            <div className="px-6 sm:px-7 pt-6 pb-3">
              <h3 className="text-[15px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2 transition-colors duration-300 group-hover/feed:text-feed">
                <Sparkles className="w-4 h-4" /> Live Feed
              </h3>
            </div>
            <div className="divide-y divide-border">
              {NEWS_FEED.map(item => (
                <div
                  key={item.id}
                  className="group/feeditem px-6 sm:px-7 py-4 flex items-start gap-3 hover:bg-accent/40 transition-colors duration-300"
                  onMouseEnter={(e) => {
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = item.hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) icon.style.color = '';
                  }}
                >
                  <item.icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground transition-colors duration-300" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-[15px] text-foreground leading-snug">{item.text}</p>
                    <p className="text-[13px] text-muted-foreground font-mono mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Upcoming card + Upcoming Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border-t border-border mt-0">
          {/* Upcoming Events */}
          <div className="bg-background group/events">
            <div className="px-6 sm:px-7 pt-6 pb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2 transition-colors duration-300 group-hover/events:text-upcoming">
                <Calendar className="w-4 h-4" /> Upcoming Events
              </h3>
              <Link to="/events" className="text-[13px] text-muted-foreground hover:text-foreground font-mono flex items-center gap-1 transition-colors">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {UPCOMING_EVENTS.map(event => (
                <div key={event.id} className="px-6 sm:px-7 py-5 hover:bg-accent/40 transition-colors duration-300">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-[15px] font-semibold text-foreground">{event.title}</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 border border-border text-muted-foreground uppercase tracking-wider">{event.type}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground font-mono mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.registered}/{event.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CompetitionCard comp={LIVE_COMPETITIONS[1]} />
        </div>
      </div>
    </section>
  );
};

export default LiveSection;
