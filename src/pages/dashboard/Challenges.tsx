import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { ChallengeForm } from "./components/ChallengeForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";
import { getChallenges, createChallenge, updateChallenge, deleteChallenge } from "@/services/challenges.service";
import { toast } from "sonner";
import type { Tables } from "@/types/database";

interface ChallengeData {
  id: string;
  title: string;
  description: string;
  track: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  status: "draft" | "upcoming" | "live" | "ended";
  participants: number;
  points: number;
  duration: string;
  requirements: string;
}

// Helper to map DB challenge to UI ChallengeData
const mapDBChallengeToChallengeData = (c: Tables<'challenges'>): ChallengeData => ({
  id: c.id,
  title: c.title,
  description: c.description,
  track: c.track || "General",
  difficulty: (c.difficulty as any) || "Medium",
  status: (c.status as any) || "live",
  participants: 0, // In a real app, you'd aggregate submissions or join
  points: c.points || 0,
  duration: c.duration || "N/A",
  requirements: c.requirements || "",
});

const TRACK_OPTIONS = [
  "Frontend",
  "Backend",
  "AI / ML",
  "Cybersecurity",
  "Data Science",
  "DevOps",
  "Mobile",
  "Full Stack",
];
const DIFFICULTY_OPTIONS: ChallengeData["difficulty"][] = [
  "Easy",
  "Medium",
  "Hard",
  "Expert",
];

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

const difficultyBadge = (d: string) => {
  const map: Record<string, string> = {
    Easy: "text-emerald-500 border-emerald-500/30",
    Medium: "text-amber-500 border-amber-500/30",
    Hard: "text-orange-500 border-orange-500/30",
    Expert: "text-red-500 border-red-500/30",
  };
  return map[d] || "text-muted-foreground border-border";
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

export default function Challenges() {
  const { t } = useLanguage();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chalFormMode, setChalFormMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingChal, setEditingChal] = useState<ChallengeData | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    const { data, error } = await getChallenges();
    if (!error && data) {
      setChallenges(data.map(mapDBChallengeToChallengeData));
    }
    setLoading(false);
  };

  const toggleChallengeStatus = async (
    id: string,
    newStatus: ChallengeData["status"],
  ) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await updateChallenge(id, { status: newStatus });
      if (!error && data) {
        setChallenges((prev) =>
          prev.map((c) => (c.id === id ? mapDBChallengeToChallengeData(data) : c)),
        );
        toast.success(`Challenge marked as ${newStatus}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChallenge = async (id: string, title: string) => {
    if (isSubmitting) return;
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    setIsSubmitting(true);
    try {
      const { error } = await deleteChallenge(id);
      if (!error) {
        setChallenges((prev) => prev.filter((c) => c.id !== id));
        toast.success("Challenge deleted successfully");
      } else {
        toast.error("Failed to delete challenge");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveChallenge = async (chal: ChallengeData) => {
    if (isSubmitting) return;

    const dbPayload = {
      title: chal.title,
      description: chal.description,
      track: chal.track,
      difficulty: chal.difficulty as any,
      status: chal.status,
      points: chal.points,
      duration: chal.duration,
      requirements: chal.requirements,
    };

    setIsSubmitting(true);
    try {
      if (chalFormMode === "edit") {
        const { data, error } = await updateChallenge(chal.id, dbPayload);
        if (!error && data) {
          setChallenges((prev) => prev.map((c) => (c.id === chal.id ? mapDBChallengeToChallengeData(data) : c)));
          setChalFormMode("none");
          setEditingChal(undefined);
          toast.success("Challenge updated");
        }
      } else {
        const { data, error } = await createChallenge(dbPayload as any);
        if (!error && data) {
          setChallenges((prev) => [mapDBChallengeToChallengeData(data), ...prev]);
          setChalFormMode("none");
          setEditingChal(undefined);
          toast.success("Challenge created");
        }
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
          <p className="text-[12px] sm:text-[13px] text-muted-foreground">
            {t("dash.managing")}{" "}
            <span className="text-foreground font-medium">
              {challenges.length}
            </span>{" "}
            {t("dash.active_label")}
          </p>
          <PrimaryBtn
            onClick={() => {
              setChalFormMode("create");
              setEditingChal(undefined);
            }}
          >
            <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t("dash.new_challenge")}</span><span className="sm:hidden">New</span>
          </PrimaryBtn>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {challenges.map((c) => (
            <div
              key={c.id}
              className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-3 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h4 className="text-[13px] sm:text-[14px] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {c.title}
                </h4>
              </div>

              <p className="text-[11px] sm:text-[12px] text-muted-foreground mb-3 sm:mb-4 line-clamp-2 group-hover:text-foreground/70 transition-colors">
                {c.description}
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${statusBadge(c.status)}`}
                >
                  {c.status}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${difficultyBadge(c.difficulty)}`}
                >
                  {c.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-muted-foreground font-mono mb-3 sm:mb-4 group-hover:text-foreground/70 transition-colors">
                <span className="flex items-center gap-1">{c.track}</span>
                <span>{c.participants} pts</span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border group-hover:border-primary/20 transition-colors">
                <div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                    Points
                  </p>
                  <p className="text-[14px] sm:text-[16px] font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                    {c.points}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {c.status !== "live" && (
                    <button
                      onClick={() => toggleChallengeStatus(c.id, "live")}
                      disabled={isSubmitting}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 group/btn disabled:opacity-50"
                      title="Go Live"
                    >
                      <Plus className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                  {c.status === "live" && (
                    <button
                      onClick={() => toggleChallengeStatus(c.id, "ended")}
                      disabled={isSubmitting}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/btn disabled:opacity-50"
                      title="End Challenge"
                    >
                      <Trash2 className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setChalFormMode("edit");
                      setEditingChal(c);
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChallenge(c.id, c.title);
                    }}
                    disabled={isSubmitting}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Delete Challenge"
                  >
                    <Trash2 className="w-3.5 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <BottomDrawer
          open={chalFormMode !== "none"}
          onClose={() => {
            setChalFormMode("none");
            setEditingChal(undefined);
          }}
          title={chalFormMode === "edit" ? t("dash.edit_challenge") : t("dash.new_challenge")}
        >
          <ChallengeForm
            initial={editingChal}
            isEdit={chalFormMode === "edit"}
            loading={isSubmitting}
            onSave={saveChallenge}
            onCancel={() => {
              setChalFormMode("none");
              setEditingChal(undefined);
            }}
          />
        </BottomDrawer>
      </div>
    </PageTransition>
  );
}

