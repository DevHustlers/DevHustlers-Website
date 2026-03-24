import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Copy,
  Calendar,
  Play,
  StopCircle,
  Clock,
  Timer,
  Trophy,
  Users,
  UserCheck,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { CompetitionForm } from "./components/CompetitionForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { ManualReview } from "./components/ManualReview";
import { useLanguage } from "@/i18n/LanguageContext";
import { getCompetitions, createCompetition, updateCompetition, deleteCompetition } from "@/services/competitions.service";
import { toast } from "sonner";
import type { Tables } from "@/types/database";

interface CompetitionQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
}

interface CompetitionData {
  id: string;
  title: string;
  description: string;
  status: "draft" | "scheduled" | "live" | "ended";
  scheduledDate: string;
  timePerQuestion: number;
  prize: string;
  questions: CompetitionQuestion[];
  participants: number;
}

// Helper to map DB competition to UI CompetitionData
const mapDBCompToCompData = (c: Tables<'competitions'>): CompetitionData => ({
  id: c.id,
  title: c.title,
  description: c.description || "",
  status: (c.status as any) || "draft",
  scheduledDate: c.scheduled_date ? new Date(c.scheduled_date).toLocaleString() : "TBD",
  timePerQuestion: c.time_per_question || 20,
  prize: c.prize || "N/A",
  questions: (c.questions as any) || [],
  participants: 0, // In a real app, you'd join with room_participants
});

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
    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-xl hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
  >
    {children}
  </button>
);

export default function Competitions() {
  const { t } = useLanguage();
  const [competitions, setCompetitions] = useState<CompetitionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [compFormMode, setCompFormMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingComp, setEditingComp] = useState<CompetitionData | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    setLoading(true);
    const { data, error } = await getCompetitions();
    if (!error && data) {
      setCompetitions(data.map(mapDBCompToCompData));
    }
    setLoading(false);
  };

  const deleteComp = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this competition?")) return;
    
    const { error } = await deleteCompetition(id);
    if (!error) {
      setCompetitions((prev) => prev.filter((c) => c.id !== id));
      toast.success("Competition deleted");
    } else {
      toast.error(error);
    }
  };

  const saveCompetition = async (comp: CompetitionData) => {
    if (isSubmitting) return;

    const dbPayload = {
      title: comp.title,
      description: comp.description,
      status: comp.status,
      scheduled_date: comp.scheduledDate === "TBD" ? null : new Date(comp.scheduledDate).toISOString(),
      time_per_question: comp.timePerQuestion,
      prize: comp.prize,
      questions: comp.questions as any,
    };

    setIsSubmitting(true);
    try {
      if (compFormMode === "edit") {
        const { data, error } = await updateCompetition(comp.id, dbPayload);
        if (!error && data) {
          setCompetitions((prev) => prev.map((c) => (c.id === comp.id ? mapDBCompToCompData(data) : c)));
          toast.success("Competition updated");
          setCompFormMode("none");
          setEditingComp(undefined);
        } else {
          toast.error(error || "Failed to update competition");
        }
      } else {
        const { data, error } = await createCompetition(dbPayload as any);
        if (!error && data) {
          setCompetitions((prev) => [mapDBCompToCompData(data), ...prev]);
          toast.success("Competition created");
          setCompFormMode("none");
          setEditingComp(undefined);
        } else {
          toast.error(error || "Failed to create competition");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCompStatus = async (
    id: string,
    newStatus: CompetitionData["status"],
  ) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await updateCompetition(id, { status: newStatus });
      if (!error && data) {
        setCompetitions((prev) =>
          prev.map((c) => (c.id === id ? mapDBCompToCompData(data) : c)),
        );
        toast.success(`Competition status changed to ${newStatus}`);
      } else {
        toast.error(error || "Failed to change status");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const duplicateComp = async (comp: CompetitionData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await createCompetition({
        title: `${comp.title} (Copy)`,
        description: comp.description,
        status: "draft",
        scheduled_date: null,
        time_per_question: comp.timePerQuestion,
        prize: comp.prize,
        questions: comp.questions as any,
      });
      if (!error && data) {
        setCompetitions((prev) => [mapDBCompToCompData(data), ...prev]);
        toast.success("Competition duplicated as draft");
      } else {
        toast.error(error || "Failed to duplicate");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-4">
            <p className="text-[12px] sm:text-[13px] text-muted-foreground">
              {t("dash.managing")}{" "}
              <span className="text-foreground font-medium">
                {competitions.length}
              </span>{" "}
              {t("dash.competitions")}
            </p>
            <button 
              onClick={() => setShowReview(true)}
              className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" /> Review Submissions
            </button>
          </div>
          <PrimaryBtn
            onClick={() => {
              setCompFormMode("create");
              setEditingComp(undefined);
            }}
          >
            <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t("add new competition ")}</span><span className="sm:hidden">New</span>
          </PrimaryBtn>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {competitions.map((comp) => (
            <div
              className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-3 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h4 className="text-[13px] sm:text-[14px] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {comp.title}
                </h4>
              </div>

              <p className="text-[11px] sm:text-[12px] text-muted-foreground mb-3 sm:mb-4 line-clamp-2 group-hover:text-foreground/70 transition-colors">
                {comp.description}
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${statusBadge(comp.status)}`}
                >
                  {comp.status}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-muted-foreground font-mono mb-3 sm:mb-4 flex-wrap group-hover:text-foreground/70 transition-colors">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {comp.timePerQuestion}s/q
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> {comp.prize}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border group-hover:border-primary/20 transition-colors">
                <div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                    Participants
                  </p>
                  <p className="text-[14px] sm:text-[16px] font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                    {comp.participants}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 mt-auto pt-3 border-t border-border group-hover:border-primary/20 transition-colors">
                  {comp.status === "draft" && (
                    <button
                      onClick={() => toggleCompStatus(comp.id, "scheduled")}
                      disabled={isSubmitting}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all duration-200 group/btn disabled:opacity-50"
                      title="Schedule"
                    >
                      <Calendar className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                  {comp.status === "scheduled" && (
                    <button
                      onClick={() => toggleCompStatus(comp.id, "live")}
                      disabled={isSubmitting}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 group/btn disabled:opacity-50"
                      title="Go Live"
                    >
                      <Play className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                  {comp.status === "live" && (
                    <button
                      onClick={() => toggleCompStatus(comp.id, "ended")}
                      disabled={isSubmitting}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/btn disabled:opacity-50"
                      title="End"
                    >
                      <StopCircle className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                  <button
                    onClick={() => duplicateComp(comp)}
                    disabled={isSubmitting}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 group/btn disabled:opacity-50"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      setCompFormMode("edit");
                      setEditingComp(comp);
                    }}
                    disabled={isSubmitting}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all duration-200 group/btn disabled:opacity-50"
                  >
                    <Pencil className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button 
                    disabled={isSubmitting}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 group/btn disabled:opacity-50"
                  >
                    <Eye className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => deleteComp(comp.id)}
                    disabled={isSubmitting}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/btn disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <BottomDrawer
          open={showReview}
          onClose={() => setShowReview(false)}
          title="Manual Review Queue"
        >
          <ManualReview />
        </BottomDrawer>

        <BottomDrawer
          open={compFormMode !== "none"}
          onClose={() => {
            setCompFormMode("none");
            setEditingComp(undefined);
          }}
          title={
            compFormMode === "edit" ? t("dash.edit_competition") : t("add new competition")
          }
        >
          <CompetitionForm
            initial={editingComp}
            isEdit={compFormMode === "edit"}
            loading={isSubmitting}
            onSave={saveCompetition}
            onCancel={() => {
              setCompFormMode("none");
              setEditingComp(undefined);
            }}
          />
        </BottomDrawer>
      </div>
    </PageTransition>
  );
}
