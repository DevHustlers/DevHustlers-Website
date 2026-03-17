import { Calendar, ArrowRight } from "lucide-react";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";

interface EventData {
  id: string;
  title: string;
  date: string;
  status: "draft" | "upcoming" | "live" | "ended" | "scheduled";
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    inactive: "text-muted-foreground border-border bg-muted/10",
    banned: "text-red-500 border-red-500/30 bg-red-500/10",
    live: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    upcoming: "text-amber-500 border-amber-500/30 bg-amber-500/10",
    ended: "text-muted-foreground border-border bg-muted/10",
    scheduled: "text-blue-500 border-blue-500/30 bg-blue-500/10",
    draft: "text-muted-foreground border-border bg-muted/10",
  };
  return map[status] || "text-muted-foreground border-border bg-muted/10";
};

export const UpcomingTimeline = () => {
  const { events: dbEvents, loading } = useRealtimeEvents();
  
  const events: EventData[] = dbEvents
    .filter(e => ["upcoming", "live", "scheduled", "draft"].includes(e.status || ""))
    .map(e => ({
      id: e.id,
      title: e.title,
      date: e.date || "",
      status: (e.status as any) || "upcoming"
    }))
    .slice(0, 5);
  return (
    <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
          Upcoming Timeline
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <Calendar className="w-4 h-4" />
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="relative">
          <div className="absolute start-3 top-0 bottom-0 w-px bg-border rtl:start-auto rtl:end-3 group-hover:bg-primary/20 transition-colors duration-300" />
          {loading ? (
            <div className="ps-6 sm:ps-8 py-4 text-[12px] text-muted-foreground animate-pulse">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="ps-6 sm:ps-8 py-4 text-[12px] text-muted-foreground">
              No upcoming events
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="relative ps-6 sm:ps-8 pb-3 sm:pb-4 last:pb-0 group/event hover:ps-7 sm:hover:ps-9 transition-all duration-200"
              >
                <div
                  className={`absolute start-[9px] sm:start-[11px] top-2 w-2 h-2 rounded-full border-2 border-background rtl:start-auto group-hover/event:scale-150 group-hover/event:shadow-lg group-hover/event:shadow-current transition-all duration-300 ${
                    event.status === "live"
                      ? "bg-emerald-500"
                      : event.status === "upcoming"
                        ? "bg-amber-500"
                        : event.status === "scheduled"
                          ? "bg-blue-500"
                          : "bg-muted-foreground"
                  }`}
                />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[12px] sm:text-[13px] font-medium text-foreground line-clamp-1 group-hover/event:text-primary transition-colors">
                      {event.title}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono group-hover/event:text-foreground/70 transition-colors">
                      {event.date}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider shrink-0 group-hover/event:border-primary/50 transition-colors ${statusBadge(event.status)}`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-border">
        <button className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-all duration-200 hover:gap-2 group/btn">
          View all events{" "}
          <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
