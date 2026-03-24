import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Radio, Users } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { useEventAttendance } from "@/hooks/useEventAttendance";
import type { Tables } from "@/types/database";

const EventCard = ({ event, isPast }: { event: Tables<'events'>; isPast?: boolean }) => {
  const { attending, count, toggleAttendance } = useEventAttendance(event.id);

  return (
    <div className={`bg-background p-6 sm:p-8 flex flex-col justify-between hover:bg-accent/30 transition-colors duration-300 h-full ${
      event.status === 'live' ? "border-l-2 border-emerald-500" : ""
    }`}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {event.status === 'live' && (
              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest border border-emerald-500/30 px-2 py-0.5">
                Live
              </span>
            )}
            <h3 className="font-semibold text-foreground text-base sm:text-lg">
              {event.title}
            </h3>
          </div>
          {!isPast && (
            <button
              onClick={toggleAttendance}
              className={`px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                attending 
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/40" 
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {attending ? "Going ✅" : "Join Network"}
            </button>
          )}
        </div>
        <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed mb-4">
          {event.description}
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground font-mono">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {event.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {event.location}
          </span>
        </div>
        <div className="text-[12px] font-mono text-foreground flex items-center gap-1.5">
          <Users className={`w-3.5 h-3.5 ${attending ? "text-emerald-500" : "text-muted-foreground"}`} />
          <span className="font-bold">{count}</span> developers are going
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const { t } = useLanguage();
  const { events, loading } = useRealtimeEvents();

  const live = events.filter((e) => e.status === "live");
  const upcoming = events.filter((e) => e.status === "upcoming" || e.status === "scheduled");
  const past = events.filter((e) => e.status === "completed" || e.status === "past");

  if (loading) {
    return (
      <PageLayout>
        <Navbar />
        <div className="pt-40 text-center font-mono animate-pulse">
          FETCHING_COMMUNITY_EVENTS...
        </div>
        <Footer />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Navbar />
      <section className="pt-28 sm:pt-36 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
                {t("events.label")}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
                {t("events.title.1")}{" "}
                <span className="font-serif text-muted-foreground font-normal">
                  {t("events.title.2")}
                </span>
              </h1>
              <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg">
                {t("events.desc")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {live.length > 0 && (
        <>
          <SectionDivider />
          <section>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-[13px] font-medium text-muted-foreground mb-0 uppercase tracking-widest p-4 md:p-6 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Radio className="w-3.5 h-3.5 text-emerald-500" />
                Happening Now
              </h2>
              <div className="border-b-0 border-t border-border bg-border">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px">
                  {live.map((event, i) => (
                    <ScrollReveal key={i} delay={i * 80}>
                      <EventCard event={event} />
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <SectionDivider />
      <section>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[13px] font-medium text-muted-foreground mb-0 uppercase tracking-widest p-4 md:p-6">
            {t("events.upcoming")}
          </h2>
          <div className="border-b-0 border-t border-border bg-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px">
              {upcoming.map((event, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <EventCard event={event} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[13px] font-medium text-muted-foreground mb-0 uppercase tracking-widest p-4 md:p-6">
            {t("events.past")}
          </h2>
          <div className="border-b-0 border-t border-border bg-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-px opacity-60">
              {past.map((event, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <EventCard event={event} isPast />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Events;
