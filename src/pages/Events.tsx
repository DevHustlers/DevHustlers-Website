import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { useLanguage } from "@/i18n/LanguageContext";

const events = [
  {
    title: "Weekly Hackathon #127",
    date: "Mar 10–16, 2026",
    location: "Online",
    desc: "This week's theme: Build a developer tool that solves a real problem.",
    status: "upcoming" as const,
  },
  {
    title: "DevHustlers Meetup — London",
    date: "Mar 22, 2026",
    location: "London, UK",
    desc: "In-person networking and lightning talks at Shoreditch Works.",
    status: "upcoming" as const,
  },
  {
    title: "Open Source Sprint",
    date: "Apr 1–7, 2026",
    location: "Online",
    desc: "A week-long sprint to contribute to community open source projects.",
    status: "upcoming" as const,
  },
  {
    title: "DevHustlers Conference 2026",
    date: "May 15–16, 2026",
    location: "San Francisco, CA",
    desc: "Our annual conference. Two days of talks, workshops, and community.",
    status: "upcoming" as const,
  },
  {
    title: "Weekly Hackathon #126",
    date: "Mar 3–9, 2026",
    location: "Online",
    desc: "Theme: AI-powered tools. 48 submissions, 12 finalist projects.",
    status: "past" as const,
  },
  {
    title: "DevHustlers Meetup — Berlin",
    date: "Feb 20, 2026",
    location: "Berlin, DE",
    desc: "Community meetup with 60+ developers. Talks on Rust and WebAssembly.",
    status: "past" as const,
  },
];

const Events = () => {
  const { t } = useLanguage();
  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  return (
    <PageLayout>
      <Navbar />
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">{t("events.label")}</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
            {t("events.title.1")}{" "}
            <span className="font-serif italic text-muted-foreground font-normal">{t("events.title.2")}</span>
          </h1>
          <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg">
            {t("events.desc")}
          </p>
        </div>
      </section>

      {/* Upcoming — bento grid flush against dividers */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-[13px] font-medium text-muted-foreground mb-0 uppercase tracking-widest py-4">
            {t("events.upcoming")}
          </h2>
        </div>
        <div className="max-w-5xl mx-auto border border-border bg-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px">
            {upcoming.map((event, i) => (
              <div
                key={i}
                className="bg-background p-6 sm:p-8 flex flex-col justify-between hover:bg-accent/30 transition-colors duration-300"
              >
                <div>
                  <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">{event.title}</h3>
                  <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed mb-4">{event.desc}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {event.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Past events — same grid, muted */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-[13px] font-medium text-muted-foreground mb-0 uppercase tracking-widest py-4">
            {t("events.past")}
          </h2>
        </div>
        <div className="max-w-5xl mx-auto border border-border bg-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px opacity-60">
            {past.map((event, i) => (
              <div
                key={i}
                className="bg-background p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-foreground text-base sm:text-lg mb-2">{event.title}</h3>
                  <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed mb-4">{event.desc}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {event.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {event.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Events;
