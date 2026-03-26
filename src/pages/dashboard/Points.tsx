import { useEffect, useState } from "react";
import { Plus, Zap, Pencil, Trash2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { PointRuleForm } from "./components/PointRuleForm";
import { AwardPointsForm } from "./components/AwardPointsForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";
import { 
  getPointRules, 
  createPointRule, 
  updatePointRule, 
  deletePointRule as removePointRule,
  getPointsLog 
} from "@/services/points.service";
import { getUsers } from "@/services/users.service";
import { awardPoints as awardPointsDb } from "@/services/gamification.service";
import type { Tables } from "@/types/database";

interface UserData {
  id: string;
  name: string;
  email: string;
  joined: string;
  points: number;
  status: "active" | "inactive" | "banned";
  role: "member" | "moderator" | "admin";
  bio: string;
}

interface PointRule {
  id: string;
  action: string;
  points: number;
  active: boolean;
}

interface PointAward {
  id: string;
  user: string;
  action: string;
  points: string;
  time: string;
}

// Helper maps
const mapDBRuleToRule = (r: Tables<'point_rules'>): PointRule => ({
  id: r.id,
  action: r.action,
  points: r.points,
  active: r.active ?? true,
});

const mapDBLogToAward = (l: any): PointAward => ({
  id: l.id,
  user: l.profiles?.full_name || "Unknown",
  action: l.reason || "Manual award",
  points: `+${l.amount}`,
  time: new Date(l.created_at).toLocaleString(),
});

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

const SecondaryBtn = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground text-[13px] font-medium rounded-xl hover:bg-accent hover:border-primary/50 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
  >
    {children}
  </button>
);

export default function Points() {
  const { t } = useLanguage();
  const [pointRules, setPointRules] = useState<PointRule[]>([]);
  const [pointLog, setPointLog] = useState<PointAward[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [ruleFormMode, setRuleFormMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingRule, setEditingRule] = useState<PointRule | undefined>();
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [rulesRes, logRes, usersRes] = await Promise.all([
      getPointRules(),
      getPointsLog(),
      getUsers()
    ]);

    if (rulesRes.data) setPointRules(rulesRes.data.map(mapDBRuleToRule));
    if (logRes.data) setPointLog(logRes.data.map(mapDBLogToAward));
    if (usersRes.data) {
      setUsers(usersRes.data.map(u => ({
        id: u.id,
        name: u.full_name || u.email || "Anonymous",
        email: u.email || "",
        joined: u.created_at ? new Date(u.created_at).toLocaleDateString() : "",
        points: u.points || 0,
        status: (u.status as any) || "active",
        role: u.role === 'admin' ? 'admin' : u.role === 'mod' ? 'moderator' : 'member',
        bio: u.bio || "",
      })));
    }
    setLoading(false);
  };

  const savePointRule = async (rule: PointRule) => {
    if (isSubmitting) return;

    const dbPayload = {
      action: rule.action,
      points: rule.points,
      active: rule.active,
    };

    setIsSubmitting(true);
    try {
      if (ruleFormMode === "edit") {
        const { data, error } = await updatePointRule(rule.id, dbPayload);
        if (!error && data) {
          setPointRules((prev) => prev.map((r) => (r.id === rule.id ? mapDBRuleToRule(data) : r)));
          toast.success("Rule updated successfully");
          setRuleFormMode("none");
          setEditingRule(undefined);
        } else {
          toast.error(error || "Failed to update rule");
        }
      } else {
        const { data, error } = await createPointRule(dbPayload as any);
        if (!error && data) {
          setPointRules((prev) => [...prev, mapDBRuleToRule(data)]);
          toast.success("Rule created successfully");
          setRuleFormMode("none");
          setEditingRule(undefined);
        } else {
          toast.error(error || "Failed to create rule");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePointRule = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) return;
    
    const { error } = await removePointRule(id);
    if (!error) {
      setPointRules((prev) => prev.filter((r) => r.id !== id));
      toast.success("Rule deleted successfully");
    } else {
      toast.error(error || "Failed to delete rule");
    }
  };

  const togglePointRule = async (id: string) => {
    const rule = pointRules.find(r => r.id === id);
    if (!rule) return;
    const { data, error } = await updatePointRule(id, { active: !rule.active });
    if (!error && data) {
      setPointRules((prev) =>
        prev.map((r) => (r.id === id ? mapDBRuleToRule(data) : r)),
      );
      toast.success(`Rule ${!rule.active ? 'activated' : 'deactivated'}`);
    } else {
      toast.error(error || "Failed to update rule status");
    }
  };

  const awardPoints = async (
    userId: string,
    userName: string,
    points: number,
    reason: string,
  ) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await awardPointsDb(userId, points, reason);
      if (!error) {
        const newAward: PointAward = {
          id: `pl-${Date.now()}`,
          user: userName,
          action: reason,
          points: `+${points}`,
          time: "Just now",
        };
        setPointLog((prev) => [newAward, ...prev]);
        // Update points in user list locally
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, points: u.points + points } : u));
        setShowAwardForm(false);
        toast.success(`Awarded ${points} points to ${userName}`);
      } else {
        // Log suspicious duplicate attempts if backend rejected it
        if (error.includes("Duplicate")) {
          console.warn("Suspicious duplicate point award blocked:", { userId, points, reason });
        }
        toast.error(error || "Failed to award points");
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
              {t("dash.point_mgmt")}
            </p>
            <div className="flex items-center gap-2">
              <SecondaryBtn
                onClick={() => {
                  setRuleFormMode("create");
                  setEditingRule(undefined);
                }}
              >
                <Plus className="w-3.5 h-3.5" /> {t("dash.add_rule")}
              </SecondaryBtn>
              <PrimaryBtn onClick={() => setShowAwardForm(true)}>
                <Zap className="w-3.5 h-3.5" /> {t("dash.award_points")}
              </PrimaryBtn>
            </div>
          </div>
        </div>

        <BottomDrawer
          open={showAwardForm}
          onClose={() => setShowAwardForm(false)}
          title={t("dash.award_points")}
        >
          <AwardPointsForm
            users={users}
            loading={isSubmitting}
            onAward={awardPoints}
            onCancel={() => setShowAwardForm(false)}
          />
        </BottomDrawer>

        <BottomDrawer
          open={ruleFormMode !== "none"}
          onClose={() => {
            setRuleFormMode("none");
            setEditingRule(undefined);
          }}
          title={ruleFormMode === "edit" ? t("dash.edit_rule") : t("dash.add_rule")}
        >
          <PointRuleForm
            initial={editingRule}
            isEdit={ruleFormMode === "edit"}
            loading={isSubmitting}
            onSave={savePointRule}
            onCancel={() => {
              setRuleFormMode("none");
              setEditingRule(undefined);
            }}
          />
        </BottomDrawer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
                {t("dash.auto_rules")}
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground">
                {pointRules.length} {t("dash.rules")}
              </span>
            </div>
            <div className="divide-y divide-border">
              {pointRules.map((rule) => (
                <div
                  key={rule.id}
                  className="px-4 sm:px-5 py-3 flex items-center justify-between group/item hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePointRule(rule.id)}
                      className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${rule.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                      title={
                        rule.active
                          ? t("dash.active_rule")
                          : t("dash.inactive_rule")
                      }
                    />
                    <span
                      className={`text-[13px] ${rule.active ? "text-foreground" : "text-muted-foreground line-through"}`}
                    >
                      {rule.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-mono font-bold text-emerald-500">
                      +{rule.points}
                    </span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setRuleFormMode("edit");
                          setEditingRule(rule);
                        }}
                        disabled={isSubmitting}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deletePointRule(rule.id)}
                        disabled={isSubmitting}
                        className="p-1 text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
                {t("dash.recent_awards")}
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground">
                {pointLog.length} {t("dash.entries")}
              </span>
            </div>
            <div className="divide-y divide-border">
              {pointLog.map((log) => (
                <div
                  key={log.id}
                  className="px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-accent/30 transition-colors"
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      {log.user}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {log.action}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-[13px] font-mono font-bold text-emerald-500">
                      {log.points}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border">
            <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
              {t("dash.channel_stats")}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4">
            {[
              { name: "Discord", followers: 1842 },
              { name: "Twitter/X", followers: 2156 },
              { name: "LinkedIn", followers: 1567 },
              { name: "GitHub", followers: 1923 },
              { name: "Telegram", followers: 987 },
              { name: "WhatsApp", followers: 654 },
            ].map((ch, i) => (
              <div
                key={i}
                className="bg-background border border-border rounded-xl p-3 sm:p-4 hover:border-primary/30 hover:bg-accent/20 transition-all duration-200"
              >
                <p className="text-[12px] sm:text-[13px] font-medium text-foreground mb-1">
                  {ch.name}
                </p>
                <p className="font-mono font-bold text-foreground text-[16px] sm:text-[18px]">
                  {ch.followers.toLocaleString()}
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                  followers
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
