import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play, Clock, Users, Trophy, Calendar, ArrowRight,
  ChevronRight, MapPin, Sparkles, Timer
} from "lucide-react";
import { useRealtimeCompetitions } from "@/hooks/useRealtimeCompetitions";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { useEventAttendance } from "@/hooks/useEventAttendance";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Tables } from "@/types/database";

const NEWS_FEED: any[] = [];

const useCountdown = (targetDate: Date | null) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });

  useEffect(() => {
    if (!targetDate) return;
    
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

const CompetitionCard = ({ comp }: { comp: Tables<'competitions'> }) => {
  const scheduledDate = comp.scheduled_date ? new Date(comp.scheduled_date) : null;
  const countdown = useCountdown(scheduledDate);
  const isLive = comp.status === "live";

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
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-4 line-clamp-2">{comp.description}</p>

        {!isLive && scheduledDate && (
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
          <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> {comp.prize || "Recognition"}</span>
          <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {comp.time_per_question}s/q</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Multiple Players</span>
        </div>
      </div>

      <div className="mt-4">
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

const EventItem = ({ event }: { event: Tables<'events'> }) => {
  const { attending, count, toggleAttendance } = useEventAttendance(event.id);

  return (
    <div className="px-6 sm:px-7 py-5 hover:bg-accent/40 transition-colors duration-300 group/event">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="text-[15px] font-semibold text-foreground">{event.title}</h4>
          <span className="text-[10px] font-mono px-1.5 py-0.5 border border-border text-muted-foreground uppercase tracking-wider">{event.type}</span>
        </div>
        <button
          onClick={toggleAttendance}
          className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
            attending 
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/40" 
              : "bg-foreground text-background hover:bg-foreground/90"
          }`}
        >
          {attending ? "Going ✅" : "Join Network"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground font-mono">
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground font-mono mt-1">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
        <span className="flex items-center gap-1 text-foreground transition-colors">
          <Users className={`w-3 h-3 ${attending ? "text-emerald-500" : ""}`} /> 
          <span className="font-bold">{count}</span> developers are going
        </span>
      </div>
    </div>
  );
};

const LiveSection = () => {
  const { t } = useLanguage();
  const { competitions, loading: compsLoading } = useRealtimeCompetitions();
  const { events, loading: eventsLoading } = useRealtimeEvents();

  if (compsLoading || eventsLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center font-mono animate-pulse text-muted-foreground">
        SYNCHRONIZING_LIVE_DATA...
      </div>
    );
  }

  const liveComp = competitions.find(c => c.status === "live");
  const upcomingComp = competitions.find(c => c.status === "scheduled" || c.status === "upcoming");
  const upcomingEvents = events
    .filter(e => e.status === "upcoming" || e.status === "scheduled")
    .slice(0, 3);

  return (
    <section>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
        <div className="px-3 sm:px-4 lg:px-6 pt-20 sm:pt-24 pb-14">
          <p className="text-[15px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            Happening Now
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Competitions{" "}
            <span className="font-serif text-muted-foreground font-normal">& Events</span>
          </h2>
        </div>

        <div className="px-3 sm:px-4 lg:px-6 flex items-center justify-between pb-3">
          <h3 className="text-[15px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Play className="w-4 h-4" /> Live Competitions
          </h3>
          <Link to="/challenges" className="text-[13px] text-muted-foreground hover:text-foreground font-mono flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border-t border-border">
          {liveComp ? (
            <CompetitionCard comp={liveComp} />
          ) : (
            <div className="bg-background p-12 flex flex-col items-center justify-center text-center border-r border-border">
              <Trophy className="w-12 h-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-mono text-[13px]">NO_LIVE_COMPETITIONS</p>
              <Link to="/challenges" className="mt-4 text-[13px] text-primary hover:underline">View Upcoming</Link>
            </div>
          )}

          <div className="bg-background group/feed">
            <div className="px-6 sm:px-7 pt-6 pb-3">
              <h3 className="text-[15px] font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-2 transition-colors duration-300 group-hover/feed:text-feed">
                <Sparkles className="w-4 h-4" /> Live Feed
              </h3>
            </div>
            <div className="divide-y divide-border min-h-[220px] flex flex-col justify-center">
              {NEWS_FEED.length > 0 ? (
                NEWS_FEED.map(item => (
                  <div
                    key={item.id}
                    className="group/feeditem px-6 sm:px-7 py-4 flex items-start gap-3 hover:bg-accent/40 transition-all duration-300"
                  >
                    <item.icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground transition-colors duration-300" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <p className="text-[15px] text-foreground leading-snug">{item.text}</p>
                      <p className="text-[13px] text-muted-foreground font-mono mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground/10 mx-auto mb-4" />
                  <p className="text-muted-foreground font-mono text-[12px] uppercase">NO_RECENT_ACTIVITY</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border-t border-border mt-0">
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
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <EventItem key={event.id} event={event} />
                ))
              ) : (
                <div className="p-12 text-center text-muted-foreground font-mono text-[12px]">NO_UPCOMING_EVENTS</div>
              )}
            </div>
          </div>

          {upcomingComp ? (
            <CompetitionCard comp={upcomingComp} />
          ) : (
             <div className="bg-background p-12 flex flex-col items-center justify-center text-center">
              <Clock className="w-12 h-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-mono text-[13px]">NO_UPCOMING_COMPETITIONS</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LiveSection;
