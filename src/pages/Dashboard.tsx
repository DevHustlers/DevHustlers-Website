import { useState } from "react";
import {
  Users, Trophy, Zap, Calendar, Settings, BarChart3,
  Plus, Search, MoreHorizontal, ArrowRight, Clock,
  TrendingUp, Activity, Eye, ChevronRight, Star,
  Shield, Globe, Pencil, Trash2, CheckCircle2, Award,
  Flame, Rocket, Gem, Crown, Sparkles, Heart, Target,
  Swords, CircleDot, Diamond, Hexagon, Pentagon, Compass,
  Anchor, Lightbulb, Bolt, Medal, BadgeCheck, X, Check,
  Play, StopCircle, Timer, CirclePlus, GripVertical,
  Circle, ArrowLeft, Copy, ChevronDown, ChevronUp
} from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import PageLayout from "@/components/PageLayout";
import { BADGE_TIERS, type BadgeTier } from "@/components/HonorBadge";

const AVAILABLE_ICONS = [
  { name: "Sparkles", icon: Sparkles },
  { name: "Flame", icon: Flame },
  { name: "Rocket", icon: Rocket },
  { name: "Gem", icon: Gem },
  { name: "Crown", icon: Crown },
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Trophy", icon: Trophy },
  { name: "Shield", icon: Shield },
  { name: "Target", icon: Target },
  { name: "Swords", icon: Swords },
  { name: "Diamond", icon: Diamond },
  { name: "Hexagon", icon: Hexagon },
  { name: "Compass", icon: Compass },
  { name: "Anchor", icon: Anchor },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Bolt", icon: Bolt },
  { name: "Medal", icon: Medal },
  { name: "BadgeCheck", icon: BadgeCheck },
  { name: "Zap", icon: Zap },
];

const SIDEBAR_ITEMS = [
  { label: "Overview", icon: BarChart3, id: "overview" },
  { label: "Users", icon: Users, id: "users" },
  { label: "Challenges", icon: Trophy, id: "challenges" },
  { label: "Competitions", icon: Play, id: "competitions" },
  { label: "Events", icon: Calendar, id: "events" },
  { label: "Points", icon: Zap, id: "points" },
  { label: "Badges", icon: Award, id: "badges" },
  { label: "Settings", icon: Settings, id: "settings" },
];

// ─── Types ───
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

// ─── Mock Data ───
const MOCK_COMPETITIONS: CompetitionData[] = [
  {
    id: "comp-1",
    title: "Frontend Mastery Showdown",
    description: "Test your frontend knowledge",
    status: "live",
    scheduledDate: "Mar 9, 2026 — 8:00 PM",
    timePerQuestion: 15,
    prize: "500 pts + Gold Badge",
    participants: 128,
    questions: [
      { id: 1, question: "Which CSS property is used to create a flexible box layout?", options: ["display: grid", "display: flex", "display: block", "display: inline"], correctIndex: 1, timeLimit: 15 },
      { id: 2, question: "What does the 'useEffect' hook do in React?", options: ["Manages state", "Creates a component", "Performs side effects after render", "Optimizes re-renders"], correctIndex: 2, timeLimit: 15 },
    ],
  },
  {
    id: "comp-2",
    title: "Backend Brain Battle",
    description: "API and server-side quiz",
    status: "scheduled",
    scheduledDate: "Mar 15, 2026 — 7:00 PM",
    timePerQuestion: 20,
    prize: "750 pts + Silver Badge",
    participants: 0,
    questions: [
      { id: 1, question: "Which HTTP method is idempotent?", options: ["POST", "PATCH", "PUT", "DELETE"], correctIndex: 2, timeLimit: 20 },
    ],
  },
  {
    id: "comp-3",
    title: "JS Fundamentals Sprint",
    description: "Core JavaScript knowledge",
    status: "ended",
    scheduledDate: "Mar 1, 2026 — 6:00 PM",
    timePerQuestion: 10,
    prize: "300 pts",
    participants: 95,
    questions: [],
  },
];

const MOCK_CHALLENGES: ChallengeData[] = [
  { id: "ch-1", title: "Build a Real-Time Chat UI", description: "Create a responsive chat interface with message bubbles, typing indicators, and emoji support.", track: "Frontend", difficulty: "Medium", status: "live", participants: 128, points: 500, duration: "7 days", requirements: "Must use WebSocket or SSE for real-time updates. Responsive design required." },
  { id: "ch-2", title: "REST API Rate Limiter", description: "Implement a rate limiting middleware that supports multiple strategies.", track: "Backend", difficulty: "Hard", status: "live", participants: 89, points: 750, duration: "5 days", requirements: "Support token bucket and sliding window algorithms." },
  { id: "ch-3", title: "Neural Network from Scratch", description: "Build a simple neural network without using ML frameworks.", track: "AI / ML", difficulty: "Expert", status: "live", participants: 45, points: 1000, duration: "14 days", requirements: "Implement backpropagation, support at least 2 activation functions." },
  { id: "ch-4", title: "XSS Detection Scanner", description: "Create a tool that detects common XSS vulnerabilities.", track: "Cybersecurity", difficulty: "Hard", status: "ended", participants: 67, points: 800, duration: "10 days", requirements: "Must detect reflected and stored XSS patterns." },
  { id: "ch-5", title: "Predictive Analytics Dashboard", description: "Build a dashboard with interactive charts and predictive models.", track: "Data Science", difficulty: "Medium", status: "upcoming", participants: 0, points: 600, duration: "7 days", requirements: "Use at least 2 chart types. Include a simple prediction model." },
];

const TRACK_OPTIONS = ["Frontend", "Backend", "AI / ML", "Cybersecurity", "Data Science", "DevOps", "Mobile", "Full Stack"];
const DIFFICULTY_OPTIONS: ChallengeData["difficulty"][] = ["Easy", "Medium", "Hard", "Expert"];

const MOCK_STATS = [
  { label: "Total Users", value: "2,847", change: "+12%", icon: Users },
  { label: "Active Challenges", value: "14", change: "+3", icon: Trophy },
  { label: "Points Awarded", value: "184K", change: "+8.2%", icon: Zap },
  { label: "Upcoming Events", value: "6", change: "+2", icon: Calendar },
];

const MOCK_RECENT_USERS = [
  { name: "Sarah Chen", email: "sarah@example.com", joined: "2h ago", points: 12450, status: "active" },
  { name: "Ahmed Hassan", email: "ahmed@example.com", joined: "5h ago", points: 11200, status: "active" },
  { name: "Maria Rodriguez", email: "maria@example.com", joined: "1d ago", points: 10800, status: "active" },
  { name: "James Park", email: "james@example.com", joined: "2d ago", points: 9650, status: "inactive" },
  { name: "Fatima Al-Sayed", email: "fatima@example.com", joined: "3d ago", points: 8900, status: "active" },
];

const MOCK_EVENTS_TIMELINE = [
  { title: "Frontend Hackathon", date: "Mar 15, 2026", status: "upcoming", type: "hackathon" },
  { title: "AI Workshop", date: "Mar 22, 2026", status: "upcoming", type: "workshop" },
  { title: "Monthly Challenge Reset", date: "Apr 1, 2026", status: "scheduled", type: "system" },
  { title: "Cybersecurity CTF", date: "Apr 10, 2026", status: "draft", type: "competition" },
  { title: "Community Meetup", date: "Apr 15, 2026", status: "draft", type: "meetup" },
];

const MOCK_POINT_LOG = [
  { user: "Sarah Chen", action: "Completed challenge", points: "+500", time: "10m ago" },
  { user: "Ahmed Hassan", action: "Followed Discord", points: "+50", time: "25m ago" },
  { user: "Maria Rodriguez", action: "Daily login streak (12d)", points: "+120", time: "1h ago" },
  { user: "James Park", action: "Referral bonus", points: "+200", time: "2h ago" },
  { user: "Fatima Al-Sayed", action: "Manual award (Admin)", points: "+300", time: "3h ago" },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: "text-emerald-500 border-emerald-500/30",
    inactive: "text-muted-foreground border-border",
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

// ─── Reusable input field ───
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">{children}</label>
);

const FieldInput = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full h-9 px-3 bg-background border border-border text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/40 ${className}`}
  />
);

const FieldTextarea = ({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2 bg-background border border-border text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/40 min-h-[80px] resize-y ${className}`}
  />
);

const FieldSelect = ({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full h-9 px-3 bg-background border border-border text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring ${className}`}
  >
    {children}
  </select>
);

const PrimaryBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50">{children}</button>
);

const SecondaryBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="inline-flex items-center gap-2 px-4 py-2 border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">{children}</button>
);

// ─── Question Form Component ───
const QuestionForm = ({
  onAdd,
  onCancel,
  defaultTimeLimit = 15,
}: {
  onAdd: (q: CompetitionQuestion) => void;
  onCancel: () => void;
  defaultTimeLimit?: number;
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [timeLimit, setTimeLimit] = useState(defaultTimeLimit);

  const canAdd = question.trim() && options.every(o => o.trim());

  return (
    <div className="p-4 bg-accent/20 space-y-3 border-t border-border">
      <div>
        <FieldLabel>Question</FieldLabel>
        <FieldInput value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter question..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setCorrectIdx(i)}
              className={`w-7 h-7 shrink-0 flex items-center justify-center border text-[11px] font-mono font-bold transition-colors ${
                correctIdx === i
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-border text-muted-foreground hover:border-foreground/40"
              }`}
            >
              {["A", "B", "C", "D"][i]}
            </button>
            <FieldInput
              value={opt}
              onChange={e => {
                const u = [...options];
                u[i] = e.target.value;
                setOptions(u);
              }}
              placeholder={`Option ${["A", "B", "C", "D"][i]}`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="w-32">
          <FieldLabel>Time (s)</FieldLabel>
          <FieldInput type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} min={5} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-4">Click A/B/C/D to mark correct answer (green = correct)</p>
      </div>
      <div className="flex items-center gap-2">
        <PrimaryBtn onClick={() => { if (canAdd) onAdd({ id: Date.now(), question, options: [...options], correctIndex: correctIdx, timeLimit }); }} disabled={!canAdd}>
          <Check className="w-3 h-3" /> Add
        </PrimaryBtn>
        <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
      </div>
    </div>
  );
};

// ─── Question List Component ───
const QuestionList = ({
  questions,
  onRemove,
  onEdit,
  onReorder,
}: {
  questions: CompetitionQuestion[];
  onRemove: (idx: number) => void;
  onEdit: (idx: number, q: CompetitionQuestion) => void;
  onReorder: (from: number, to: number) => void;
}) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  return (
    <div>
      {questions.map((q, i) => (
        <div key={q.id} className="px-4 py-3 border-b border-border last:border-b-0">
          {editingIdx === i ? (
            <QuestionEditInline
              question={q}
              onSave={(updated) => { onEdit(i, updated); setEditingIdx(null); }}
              onCancel={() => setEditingIdx(null)}
            />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-[11px] font-mono text-muted-foreground w-6 shrink-0">Q{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{q.question}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Correct: {q.options[q.correctIndex]} · {q.timeLimit}s
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {i > 0 && (
                  <button onClick={() => onReorder(i, i - 1)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                )}
                {i < questions.length - 1 && (
                  <button onClick={() => onReorder(i, i + 1)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => setEditingIdx(i)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onRemove(i)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Inline question edit ───
const QuestionEditInline = ({
  question,
  onSave,
  onCancel,
}: {
  question: CompetitionQuestion;
  onSave: (q: CompetitionQuestion) => void;
  onCancel: () => void;
}) => {
  const [q, setQ] = useState(question.question);
  const [opts, setOpts] = useState([...question.options]);
  const [correct, setCorrect] = useState(question.correctIndex);
  const [time, setTime] = useState(question.timeLimit);

  return (
    <div className="space-y-3">
      <FieldInput value={q} onChange={e => setQ(e.target.value)} />
      <div className="grid grid-cols-2 gap-2">
        {opts.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setCorrect(i)}
              className={`w-6 h-6 shrink-0 flex items-center justify-center border text-[10px] font-mono font-bold transition-colors ${
                correct === i ? "border-emerald-500 bg-emerald-500 text-white" : "border-border text-muted-foreground"
              }`}
            >
              {["A","B","C","D"][i]}
            </button>
            <FieldInput value={o} onChange={e => { const u = [...opts]; u[i] = e.target.value; setOpts(u); }} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24">
          <FieldLabel>Time (s)</FieldLabel>
          <FieldInput type="number" value={time} onChange={e => setTime(Number(e.target.value))} min={5} />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <PrimaryBtn onClick={() => onSave({ ...question, question: q, options: opts, correctIndex: correct, timeLimit: time })}>
            <Check className="w-3 h-3" /> Save
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};

// ─── Competition Form (create/edit) ───
const CompetitionForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
}: {
  initial?: CompetitionData;
  onSave: (data: CompetitionData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [scheduledDate, setScheduledDate] = useState(initial?.scheduledDate || "");
  const [timePerQuestion, setTimePerQuestion] = useState(initial?.timePerQuestion || 15);
  const [prize, setPrize] = useState(initial?.prize || "");
  const [status, setStatus] = useState<CompetitionData["status"]>(initial?.status || "draft");
  const [questions, setQuestions] = useState<CompetitionQuestion[]>(initial?.questions || []);
  const [showAddQ, setShowAddQ] = useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initial?.id || `comp-${Date.now()}`,
      title,
      description,
      status,
      scheduledDate: scheduledDate || "Not scheduled",
      timePerQuestion,
      prize: prize || "TBD",
      participants: initial?.participants || 0,
      questions,
    });
  };

  const removeQuestion = (idx: number) => setQuestions(prev => prev.filter((_, i) => i !== idx));
  const editQuestion = (idx: number, q: CompetitionQuestion) => setQuestions(prev => prev.map((old, i) => i === idx ? q : old));
  const reorderQuestion = (from: number, to: number) => {
    setQuestions(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  return (
    <div className="border-2 border-foreground">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">{isEdit ? "Edit Competition" : "Create Competition"}</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        {/* Info fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Title</FieldLabel>
            <FieldInput value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Frontend Mastery Showdown" />
          </div>
          <div>
            <FieldLabel>Prize</FieldLabel>
            <FieldInput value={prize} onChange={e => setPrize(e.target.value)} placeholder="e.g. 500 pts + Gold Badge" />
          </div>
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the competition..." />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Scheduled Date</FieldLabel>
            <FieldInput value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} placeholder="e.g. Mar 15, 2026 — 8:00 PM" />
          </div>
          <div>
            <FieldLabel>Time per Question (s)</FieldLabel>
            <FieldInput type="number" value={timePerQuestion} onChange={e => setTimePerQuestion(Number(e.target.value))} min={5} />
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <FieldSelect value={status} onChange={e => setStatus(e.target.value as CompetitionData["status"])}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </FieldSelect>
          </div>
        </div>

        {/* Questions */}
        <div className="border border-border">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h4 className="text-[13px] font-bold text-foreground">
              Questions <span className="text-muted-foreground font-normal">({questions.length})</span>
            </h4>
            <button
              onClick={() => setShowAddQ(true)}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <CirclePlus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>

          {questions.length === 0 && !showAddQ && (
            <div className="px-4 py-8 text-center">
              <p className="text-[13px] text-muted-foreground">No questions added yet</p>
            </div>
          )}

          <QuestionList questions={questions} onRemove={removeQuestion} onEdit={editQuestion} onReorder={reorderQuestion} />

          {showAddQ && (
            <QuestionForm
              defaultTimeLimit={timePerQuestion}
              onAdd={(q) => { setQuestions(prev => [...prev, q]); setShowAddQ(false); }}
              onCancel={() => setShowAddQ(false)}
            />
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={handleSave} disabled={!title.trim()}>
            <Check className="w-3.5 h-3.5" /> {isEdit ? "Save Changes" : "Create Competition"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};

// ─── Challenge Form (create/edit) ───
const ChallengeForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
}: {
  initial?: ChallengeData;
  onSave: (data: ChallengeData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [track, setTrack] = useState(initial?.track || TRACK_OPTIONS[0]);
  const [difficulty, setDifficulty] = useState<ChallengeData["difficulty"]>(initial?.difficulty || "Medium");
  const [status, setStatus] = useState<ChallengeData["status"]>(initial?.status || "draft");
  const [points, setPoints] = useState(initial?.points || 500);
  const [duration, setDuration] = useState(initial?.duration || "7 days");
  const [requirements, setRequirements] = useState(initial?.requirements || "");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initial?.id || `ch-${Date.now()}`,
      title,
      description,
      track,
      difficulty,
      status,
      participants: initial?.participants || 0,
      points,
      duration,
      requirements,
    });
  };

  return (
    <div className="border-2 border-foreground">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">{isEdit ? "Edit Challenge" : "Create Challenge"}</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <FieldLabel>Title</FieldLabel>
          <FieldInput value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Build a Real-Time Chat UI" />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the challenge objective..." />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <FieldLabel>Track</FieldLabel>
            <FieldSelect value={track} onChange={e => setTrack(e.target.value)}>
              {TRACK_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Difficulty</FieldLabel>
            <FieldSelect value={difficulty} onChange={e => setDifficulty(e.target.value as ChallengeData["difficulty"])}>
              {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Points</FieldLabel>
            <FieldInput type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={0} />
          </div>
          <div>
            <FieldLabel>Duration</FieldLabel>
            <FieldInput value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 7 days" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Status</FieldLabel>
            <FieldSelect value={status} onChange={e => setStatus(e.target.value as ChallengeData["status"])}>
              <option value="draft">Draft</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </FieldSelect>
          </div>
        </div>
        <div>
          <FieldLabel>Requirements</FieldLabel>
          <FieldTextarea value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="List submission requirements..." />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={handleSave} disabled={!title.trim()}>
            <Check className="w-3.5 h-3.5" /> {isEdit ? "Save Changes" : "Create Challenge"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Badges state
  const [badges, setBadges] = useState(() =>
    BADGE_TIERS.map(b => ({
      ...b,
      iconName: b.id === "spark" ? "Sparkles" : b.id === "igniter" ? "Flame" : b.id === "voyager" ? "Rocket" : b.id === "titan" ? "Gem" : "Crown",
    }))
  );
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMinPoints, setEditMinPoints] = useState(0);
  const [showIconPicker, setShowIconPicker] = useState<string | null>(null);

  // Competitions state
  const [competitions, setCompetitions] = useState<CompetitionData[]>(MOCK_COMPETITIONS);
  const [compFormMode, setCompFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingComp, setEditingComp] = useState<CompetitionData | undefined>();

  // Challenges state
  const [challenges, setChallenges] = useState<ChallengeData[]>(MOCK_CHALLENGES);
  const [chalFormMode, setChalFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingChal, setEditingChal] = useState<ChallengeData | undefined>();

  // Competition handlers
  const saveCompetition = (comp: CompetitionData) => {
    if (compFormMode === "edit") {
      setCompetitions(prev => prev.map(c => c.id === comp.id ? comp : c));
    } else {
      setCompetitions(prev => [comp, ...prev]);
    }
    setCompFormMode("none");
    setEditingComp(undefined);
  };

  const toggleCompStatus = (id: string, newStatus: CompetitionData["status"]) => {
    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const duplicateCompetition = (comp: CompetitionData) => {
    const dup: CompetitionData = {
      ...comp,
      id: `comp-${Date.now()}`,
      title: `${comp.title} (Copy)`,
      status: "draft",
      participants: 0,
    };
    setCompetitions(prev => [dup, ...prev]);
  };

  // Challenge handlers
  const saveChallenge = (chal: ChallengeData) => {
    if (chalFormMode === "edit") {
      setChallenges(prev => prev.map(c => c.id === chal.id ? chal : c));
    } else {
      setChallenges(prev => [chal, ...prev]);
    }
    setChalFormMode("none");
    setEditingChal(undefined);
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-border bg-background fixed top-0 left-0 bottom-0 z-40 flex flex-col">
          <div className="h-14 border-b border-border flex items-center px-5">
            <Logo />
          </div>
          <nav className="flex-1 py-4 px-3 space-y-0.5">
            {SIDEBAR_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent border border-border flex items-center justify-center text-[11px] font-bold font-mono text-foreground">
                AD
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground">Admin</p>
                <p className="text-[11px] text-muted-foreground font-mono">admin@dvh.dev</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 ml-56">
          {/* Top bar */}
          <div className="sticky top-0 z-30 h-14 border-b border-border bg-background/90 backdrop-blur-xl flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-foreground capitalize">{activeTab}</h2>
              <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest">Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search..."
                  className="h-9 pl-9 pr-4 w-56 bg-accent/50 border border-border text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="p-6">
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-px bg-border border border-border">
                  {MOCK_STATS.map(stat => (
                    <div key={stat.label} className="bg-background p-5">
                      <div className="flex items-center justify-between mb-3">
                        <stat.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-[11px] font-mono text-emerald-500">{stat.change}</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
                      <p className="text-[12px] text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-border">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-[14px] font-bold text-foreground">Recent Points Activity</h3>
                      <Activity className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="divide-y divide-border">
                      {MOCK_POINT_LOG.map((log, i) => (
                        <div key={i} className="px-5 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{log.user}</p>
                            <p className="text-[11px] text-muted-foreground">{log.action}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-mono font-bold text-emerald-500">{log.points}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-border">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-[14px] font-bold text-foreground">Upcoming Timeline</h3>
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="divide-y divide-border">
                      {MOCK_EVENTS_TIMELINE.map((event, i) => (
                        <div key={i} className="px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                            <div>
                              <p className="text-[13px] font-medium text-foreground">{event.title}</p>
                              <p className="text-[11px] text-muted-foreground font-mono">{event.date}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider ${statusBadge(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-muted-foreground">Showing <span className="text-foreground font-medium">2,847</span> users</p>
                  <PrimaryBtn><Plus className="w-3.5 h-3.5" /> Add User</PrimaryBtn>
                </div>

                <div className="border border-border">
                  <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                    <span>User</span><span>Email</span><span>Points</span><span>Status</span><span>Actions</span>
                  </div>
                  {MOCK_RECENT_USERS.map((user, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-4 border-b border-border last:border-b-0 items-center hover:bg-accent/30 transition-colors">
                      <div>
                        <p className="text-[14px] font-medium text-foreground">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">Joined {user.joined}</p>
                      </div>
                      <p className="text-[13px] text-muted-foreground">{user.email}</p>
                      <p className="font-mono font-bold text-foreground text-[14px] w-20 text-right">{user.points.toLocaleString()}</p>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider w-20 text-center ${statusBadge(user.status)}`}>{user.status}</span>
                      <div className="flex items-center gap-1 w-20 justify-end">
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHALLENGES */}
            {activeTab === "challenges" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-muted-foreground">Managing <span className="text-foreground font-medium">{challenges.length}</span> challenges</p>
                  <PrimaryBtn onClick={() => { setChalFormMode("create"); setEditingChal(undefined); }}>
                    <Plus className="w-3.5 h-3.5" /> New Challenge
                  </PrimaryBtn>
                </div>

                {chalFormMode !== "none" && (
                  <ChallengeForm
                    initial={editingChal}
                    isEdit={chalFormMode === "edit"}
                    onSave={saveChallenge}
                    onCancel={() => { setChalFormMode("none"); setEditingChal(undefined); }}
                  />
                )}

                <div className="border border-border divide-y divide-border">
                  {challenges.map((c) => (
                    <div key={c.id} className="p-5 flex items-center justify-between hover:bg-accent/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h4 className="text-[14px] font-bold text-foreground">{c.title}</h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider ${statusBadge(c.status)}`}>{c.status}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider ${difficultyBadge(c.difficulty)}`}>{c.difficulty}</span>
                        </div>
                        <p className="text-[12px] text-muted-foreground mb-1 line-clamp-1">{c.description}</p>
                        <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-mono">
                          <span>{c.track}</span>
                          <span>{c.participants} participants</span>
                          <span>{c.points} pts</span>
                          <span>{c.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => { setChalFormMode("edit"); setEditingChal(c); }}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                        <button
                          onClick={() => setChallenges(prev => prev.filter(x => x.id !== c.id))}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* COMPETITIONS */}
            {activeTab === "competitions" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-muted-foreground">
                    Managing <span className="text-foreground font-medium">{competitions.length}</span> competitions
                  </p>
                  <PrimaryBtn onClick={() => { setCompFormMode("create"); setEditingComp(undefined); }}>
                    <Plus className="w-3.5 h-3.5" /> New Competition
                  </PrimaryBtn>
                </div>

                {compFormMode !== "none" && (
                  <CompetitionForm
                    initial={editingComp}
                    isEdit={compFormMode === "edit"}
                    onSave={saveCompetition}
                    onCancel={() => { setCompFormMode("none"); setEditingComp(undefined); }}
                  />
                )}

                {/* Competition list */}
                <div className="border border-border divide-y divide-border">
                  {competitions.map((comp) => (
                    <div key={comp.id} className="p-5 hover:bg-accent/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-[14px] font-bold text-foreground">{comp.title}</h4>
                            <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider ${statusBadge(comp.status)}`}>
                              {comp.status}
                            </span>
                          </div>
                          <p className="text-[12px] text-muted-foreground mb-2">{comp.description}</p>
                          <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-mono flex-wrap">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {comp.scheduledDate}</span>
                            <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {comp.timePerQuestion}s/q</span>
                            <span className="flex items-center gap-1"><Trophy className="w-3 h-3" /> {comp.prize}</span>
                            <span>{comp.questions.length} questions</span>
                            {comp.participants > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {comp.participants}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {comp.status === "draft" && (
                            <button onClick={() => toggleCompStatus(comp.id, "scheduled")} className="p-2 text-muted-foreground hover:text-blue-500 transition-colors" title="Schedule">
                              <Calendar className="w-4 h-4" />
                            </button>
                          )}
                          {comp.status === "scheduled" && (
                            <button onClick={() => toggleCompStatus(comp.id, "live")} className="p-2 text-muted-foreground hover:text-emerald-500 transition-colors" title="Go Live">
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          {comp.status === "live" && (
                            <button onClick={() => toggleCompStatus(comp.id, "ended")} className="p-2 text-muted-foreground hover:text-red-500 transition-colors" title="End">
                              <StopCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => duplicateCompetition(comp)}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors" title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setCompFormMode("edit"); setEditingComp(comp); }}
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                          <button
                            onClick={() => setCompetitions(prev => prev.filter(c => c.id !== comp.id))}
                            className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EVENTS */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-muted-foreground"><span className="text-foreground font-medium">6</span> events planned</p>
                  <PrimaryBtn><Plus className="w-3.5 h-3.5" /> New Event</PrimaryBtn>
                </div>
                <div className="border border-border">
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-foreground">Event Timeline</h3>
                  </div>
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
                    {MOCK_EVENTS_TIMELINE.map((event, i) => (
                      <div key={i} className="flex items-start gap-6 px-5 py-5 hover:bg-accent/30 transition-colors relative">
                        <div className="w-6 h-6 border border-border bg-background flex items-center justify-center z-10 shrink-0 mt-0.5">
                          {event.status === "upcoming" ? (
                            <Clock className="w-3 h-3 text-amber-500" />
                          ) : event.status === "scheduled" ? (
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          ) : (
                            <Circle className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-[14px] font-bold text-foreground">{event.title}</h4>
                            <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider ${statusBadge(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-mono">
                            <span>{event.date}</span>
                            <span>{event.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* POINTS */}
            {activeTab === "points" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-muted-foreground">Point system management</p>
                  <PrimaryBtn><Plus className="w-3.5 h-3.5" /> Award Points</PrimaryBtn>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-border">
                    <div className="px-5 py-4 border-b border-border">
                      <h3 className="text-[14px] font-bold text-foreground">Auto Point Rules</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {[
                        { action: "Complete a challenge", points: "+500", active: true },
                        { action: "Daily login", points: "+10", active: true },
                        { action: "Login streak (7d)", points: "+50", active: true },
                        { action: "Follow Discord", points: "+50", active: true },
                        { action: "Follow Twitter/X", points: "+50", active: true },
                        { action: "Follow LinkedIn", points: "+30", active: false },
                        { action: "Follow GitHub", points: "+40", active: true },
                        { action: "Follow Telegram", points: "+30", active: true },
                        { action: "Follow WhatsApp", points: "+20", active: false },
                        { action: "Refer a friend", points: "+200", active: true },
                      ].map((rule, i) => (
                        <div key={i} className="px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${rule.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                            <span className="text-[13px] text-foreground">{rule.action}</span>
                          </div>
                          <span className="text-[13px] font-mono font-bold text-emerald-500">{rule.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-border">
                    <div className="px-5 py-4 border-b border-border">
                      <h3 className="text-[14px] font-bold text-foreground">Recent Awards</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {MOCK_POINT_LOG.map((log, i) => (
                        <div key={i} className="px-5 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-[13px] font-medium text-foreground">{log.user}</p>
                            <p className="text-[11px] text-muted-foreground">{log.action}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-mono font-bold text-emerald-500">{log.points}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border border-border">
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-foreground">Channel Follow Stats</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-border">
                    {[
                      { name: "Discord", followers: 1842 },
                      { name: "Twitter/X", followers: 2156 },
                      { name: "LinkedIn", followers: 1567 },
                      { name: "GitHub", followers: 1923 },
                      { name: "Telegram", followers: 987 },
                      { name: "WhatsApp", followers: 654 },
                    ].map((ch, i) => (
                      <div key={i} className="bg-background p-5 flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-medium text-foreground">{ch.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">followers</p>
                        </div>
                        <p className="font-mono font-bold text-foreground text-[18px]">{ch.followers.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BADGES */}
            {activeTab === "badges" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-muted-foreground">Manage <span className="text-foreground font-medium">{badges.length}</span> badge tiers</p>
                </div>

                <div className="border border-border divide-y divide-border">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    const isEditing = editingBadgeId === badge.id;

                    return (
                      <div key={badge.id} className="p-5 hover:bg-accent/30 transition-colors">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="shrink-0">
                                <button
                                  onClick={() => setShowIconPicker(showIconPicker === badge.id ? null : badge.id)}
                                  className={`w-14 h-14 flex items-center justify-center border-2 border-dashed ${badge.borderClass} ${badge.bgClass} hover:border-foreground/40 transition-colors relative`}
                                >
                                  <Icon className={`w-7 h-7 ${badge.colorClass}`} />
                                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-foreground text-background flex items-center justify-center">
                                    <Pencil className="w-2.5 h-2.5" />
                                  </span>
                                </button>
                              </div>
                              <div className="flex-1 space-y-3">
                                <div>
                                  <FieldLabel>Badge Name</FieldLabel>
                                  <FieldInput value={editName} onChange={(e) => setEditName(e.target.value)} />
                                </div>
                                <div>
                                  <FieldLabel>Min Points</FieldLabel>
                                  <FieldInput type="number" value={editMinPoints} onChange={(e) => setEditMinPoints(Number(e.target.value))} />
                                </div>
                              </div>
                            </div>

                            {showIconPicker === badge.id && (
                              <div className="border border-border p-4">
                                <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Choose Icon</p>
                                <div className="grid grid-cols-10 gap-1">
                                  {AVAILABLE_ICONS.map((iconOption) => {
                                    const OptionIcon = iconOption.icon;
                                    const isSelected = badge.iconName === iconOption.name;
                                    return (
                                      <button
                                        key={iconOption.name}
                                        onClick={() => {
                                          setBadges(prev => prev.map(b =>
                                            b.id === badge.id ? { ...b, icon: iconOption.icon, iconName: iconOption.name } : b
                                          ));
                                          setShowIconPicker(null);
                                        }}
                                        className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                                          isSelected
                                            ? "border-foreground bg-accent text-foreground"
                                            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                                        }`}
                                      >
                                        <OptionIcon className="w-4 h-4" />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <PrimaryBtn onClick={() => {
                                setBadges(prev => prev.map(b =>
                                  b.id === badge.id ? { ...b, nameKey: editName, minPoints: editMinPoints } : b
                                ));
                                setEditingBadgeId(null);
                                setShowIconPicker(null);
                              }}>
                                <Check className="w-3.5 h-3.5" /> Save
                              </PrimaryBtn>
                              <SecondaryBtn onClick={() => { setEditingBadgeId(null); setShowIconPicker(null); }}>
                                <X className="w-3.5 h-3.5" /> Cancel
                              </SecondaryBtn>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 flex items-center justify-center border ${badge.borderClass} ${badge.bgClass}`}>
                                <Icon className={`w-6 h-6 ${badge.colorClass}`} />
                              </div>
                              <div>
                                <h4 className="text-[14px] font-bold text-foreground">{badge.nameKey}</h4>
                                <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-mono">
                                  <span>{badge.minPoints.toLocaleString()} pts minimum</span>
                                  <span className={`${badge.colorClass}`}>●</span>
                                  <span className="capitalize">{badge.id}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setEditingBadgeId(badge.id);
                                setEditName(badge.nameKey);
                                setEditMinPoints(badge.minPoints);
                                setShowIconPicker(null);
                              }}
                              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="border border-border">
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-foreground">Badge Preview</h3>
                  </div>
                  <div className="grid grid-cols-5 gap-px bg-border">
                    {badges.map((badge) => {
                      const Icon = badge.icon;
                      return (
                        <div key={badge.id} className="bg-background p-5 flex flex-col items-center text-center gap-2">
                          <div className={`w-10 h-10 flex items-center justify-center border ${badge.borderClass} ${badge.bgClass}`}>
                            <Icon className={`w-5 h-5 ${badge.colorClass}`} />
                          </div>
                          <p className={`text-[11px] font-mono font-medium ${badge.colorClass} uppercase tracking-wider`}>{badge.nameKey}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{badge.minPoints.toLocaleString()}+ pts</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6 max-w-2xl">
                <div className="border border-border">
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-foreground">General Settings</h3>
                  </div>
                  <div className="p-5 space-y-5">
                    <div>
                      <FieldLabel>Community Name</FieldLabel>
                      <FieldInput defaultValue="DevHustlers" className="h-10" />
                    </div>
                    <div>
                      <FieldLabel>Max Points per Day</FieldLabel>
                      <FieldInput defaultValue="1000" type="number" className="h-10" />
                    </div>
                    <div>
                      <FieldLabel>Challenge Duration (days)</FieldLabel>
                      <FieldInput defaultValue="7" type="number" className="h-10" />
                    </div>
                    <PrimaryBtn><Check className="w-3.5 h-3.5" /> Save Settings</PrimaryBtn>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
