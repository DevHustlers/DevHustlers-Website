import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Link as LinkIcon,
  CheckCircle2,
  Play,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { EventForm } from "./components/EventForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/services/events.service";
import { toast } from "sonner";
import type { Tables } from "@/types/database";

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type:
    | "hackathon"
    | "workshop"
    | "competition"
    | "meetup"
    | "webinar"
    | "system";
  status: "draft" | "upcoming" | "live" | "ended" | "scheduled";
  capacity: number;
  registered: number;
  link: string;
}

// Helper to map DB event to UI EventData
const mapDBEventToEventData = (e: any, existingEvents: EventData[] = []): EventData => {
  const existing = existingEvents.find(item => item.id === e.id);
  return {
    id: e.id,
    title: e.title,
    description: e.description || "",
    date: e.date || "",
    time: e.time || "",
    location: e.location || "",
    type: (e.type as any) || "workshop",
    status: (e.status as any) || "upcoming",
    capacity: e.capacity || 0,
    registered: e.registered_count ?? existing?.registered ?? 0,
    link: e.event_link || "",
  };
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: "text-emerald-500 border-emerald-500/30",
    inactive: "text-muted-foreground border-border",
    banned: "text-red-500 border-red-500/30",
    live: "text-emerald-500 border-emerald-500/30",
    upcoming: "text-amber-500 border-amber-500/30",
    ended: "text-muted-foreground border-border",
    scheduled: "text-blue-500 border-blue-500/30",
    draft: "text-muted-foreground border-border",
  };
  return map[status] || "text-muted-foreground border-border";
};

const PrimaryBtn = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-xl hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
  >
    {children}
  </button>
);

export default function Events() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventFormMode, setEventFormMode] = useState<
    "none" | "create" | "edit"
  >("none");
  const [editingEvent, setEditingEvent] = useState<EventData | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();

    // Real-time subscription for events and attendees
    const eventsChannel = supabase
      .channel('dashboard-events-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => fetchEvents()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'event_attendees' },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
    };
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await getEvents();
    if (!error && data) {
      setEvents(data.map((e) => mapDBEventToEventData(e)));
    }
    setLoading(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    const { error } = await deleteEvent(id);
    if (!error) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted successfully");
    } else {
      toast.error(error || "Failed to delete event");
    }
  };

  const saveEvent = async (event: EventData) => {
    if (isSubmitting) return;

    const dbPayload = {
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      status: event.status,
      capacity: event.capacity,
      event_link: event.link,
    };

    setIsSubmitting(true);
    try {
      if (eventFormMode === "edit") {
        const { data, error } = await updateEvent(event.id, dbPayload);
        if (!error && data) {
          setEvents((prev) => prev.map((e) => (e.id === event.id ? mapDBEventToEventData(data, prev) : e)));
          toast.success("Event updated successfully");
          setEventFormMode("none");
          setEditingEvent(undefined);
        } else {
          toast.error(error || "Failed to update event");
        }
      } else {
        const { data, error } = await createEvent(dbPayload as any);
        if (!error && data) {
          setEvents((prev) => [mapDBEventToEventData(data, prev), ...prev]);
          toast.success("Event created successfully");
          setEventFormMode("none");
          setEditingEvent(undefined);
        } else {
          toast.error(error || "Failed to create event");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEventStatus = async (
    id: string,
    newStatus: EventData["status"],
  ) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await updateEvent(id, { status: newStatus });
      if (!error && data) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? mapDBEventToEventData(data, prev) : e)),
        );
        toast.success(`Event status marked as ${newStatus}`);
      } else {
        toast.error(error || "Failed to toggle status");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex items-center justify-between">
          <p className="text-[13px] text-muted-foreground">
            {t("dash.managing")}{" "}
            <span className="text-foreground font-medium">{events.length}</span>{" "}
            {t("dash.events")}
          </p>
          <PrimaryBtn
            onClick={() => {
              setEventFormMode("create");
              setEditingEvent(undefined);
            }}
          >
            <Plus className="w-3.5 h-3.5" /> {t("dash.new_event")}
          </PrimaryBtn>
        </div>
        </div>

        <BottomDrawer
          open={eventFormMode !== "none"}
          onClose={() => {
            setEventFormMode("none");
            setEditingEvent(undefined);
          }}
          title={eventFormMode === "edit" ? t("dash.edit_event") : t("dash.new_event")}
        >
          <EventForm
            initial={editingEvent}
            isEdit={eventFormMode === "edit"}
            loading={isSubmitting}
            onSave={saveEvent}
            onCancel={() => {
              setEventFormMode("none");
              setEditingEvent(undefined);
            }}
          />
        </BottomDrawer>

        <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
              {t("dash.event_timeline")}
            </h3>
          </div>
          <div className="relative p-3 sm:p-4 space-y-3">
            <div className="absolute start-4 sm:start-6 top-3 bottom-3 w-px bg-border rtl:start-auto rtl:end-4 sm:rtl:end-6 group-hover:bg-primary/20 transition-colors duration-300" />
            {events.map((event) => (
              <div
                key={event.id}
                className="relative flex gap-3 sm:gap-4"
              >
                <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 border border-border bg-background flex items-center justify-center rounded-xl shrink-0 mt-0.5">
                  {event.status === "upcoming" ? (
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  ) : event.status === "live" ? (
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 animate-pulse" />
                  ) : event.status === "scheduled" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                  ) : (
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-3 sm:pb-4 last:pb-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                    <h4 className="text-[12px] sm:text-[14px] font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider shrink-0 ${statusBadge(event.status)}`}
                    >
                      {event.status}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border border-border text-muted-foreground uppercase tracking-wider shrink-0">
                      {event.type}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-[12px] text-muted-foreground mb-2 line-clamp-2 group-hover:text-foreground/70 transition-colors">
                    {event.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[12px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {event.location}
                    </span>
                    {event.capacity > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {event.registered}/
                        {event.capacity}
                      </span>
                    )}
                    {event.link && (
                      <span className="flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {t("dash.link")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-1 shrink-0">
                  {event.status === "draft" && (
                    <button
                      onClick={() => toggleEventStatus(event.id, "scheduled")}
                      disabled={isSubmitting}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Schedule"
                    >
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                  {(event.status === "scheduled" || event.status === "upcoming") && (
                    <button
                      onClick={() => toggleEventStatus(event.id, "live")}
                      disabled={isSubmitting}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Go Live"
                    >
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                  {event.status === "live" && (
                    <button
                      onClick={() => toggleEventStatus(event.id, "ended")}
                      disabled={isSubmitting}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="End Event"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEventFormMode("edit");
                      setEditingEvent(event);
                    }}
                    disabled={isSubmitting}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-lg disabled:opacity-50"
                    title={t("dash.edit")}
                  >
                    <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    disabled={isSubmitting}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg disabled:opacity-50"
                    title={t("dash.delete")}
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
