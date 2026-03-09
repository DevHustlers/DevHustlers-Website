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
  Circle, ArrowLeft, Copy, ChevronDown, ChevronUp, Mail,
  MapPin, Link, UserPlus, UserMinus
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
  { label: "Tracks", icon: Globe, id: "tracks" },
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

interface TrackData {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "hackathon" | "workshop" | "competition" | "meetup" | "webinar" | "system";
  status: "draft" | "upcoming" | "live" | "ended" | "scheduled";
  capacity: number;
  registered: number;
  link: string;
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

// ─── Mock Data ───
const MOCK_TRACKS: TrackData[] = [
  { id: "tr-1", name: "Frontend", slug: "frontend", description: "Master the art of building beautiful, responsive user interfaces.", iconName: "Sparkles" },
  { id: "tr-2", name: "Backend", slug: "backend", description: "Build robust server-side systems, APIs, and microservices.", iconName: "Shield" },
  { id: "tr-3", name: "AI / ML", slug: "ai-ml", description: "Explore machine learning, deep learning, and AI applications.", iconName: "Lightbulb" },
  { id: "tr-4", name: "Cybersecurity", slug: "cybersecurity", description: "Defend systems, discover vulnerabilities, and master ethical hacking.", iconName: "Shield" },
  { id: "tr-5", name: "Data Science", slug: "data-science", description: "Extract insights from data through statistical analysis and modeling.", iconName: "Target" },
  { id: "tr-6", name: "DevOps", slug: "devops", description: "Automate deployments, CI/CD pipelines, and infrastructure management.", iconName: "Bolt" },
  { id: "tr-7", name: "Mobile", slug: "mobile", description: "Create native and cross-platform mobile applications.", iconName: "Rocket" },
  { id: "tr-8", name: "Full Stack", slug: "full-stack", description: "End-to-end development spanning frontend and backend.", iconName: "Crown" },
];

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

const MOCK_USERS: UserData[] = [
  { id: "u-1", name: "Sarah Chen", email: "sarah@example.com", joined: "2h ago", points: 12450, status: "active", role: "admin", bio: "Full-stack developer passionate about React and TypeScript." },
  { id: "u-2", name: "Ahmed Hassan", email: "ahmed@example.com", joined: "5h ago", points: 11200, status: "active", role: "moderator", bio: "Backend engineer specializing in Node.js and Python." },
  { id: "u-3", name: "Maria Rodriguez", email: "maria@example.com", joined: "1d ago", points: 10800, status: "active", role: "member", bio: "UI/UX designer turned frontend developer." },
  { id: "u-4", name: "James Park", email: "james@example.com", joined: "2d ago", points: 9650, status: "inactive", role: "member", bio: "Data scientist exploring ML and AI." },
  { id: "u-5", name: "Fatima Al-Sayed", email: "fatima@example.com", joined: "3d ago", points: 8900, status: "active", role: "member", bio: "Cybersecurity enthusiast and CTF player." },
];

const MOCK_EVENTS: EventData[] = [
  { id: "ev-1", title: "Frontend Hackathon", description: "Build innovative frontend projects in 48 hours.", date: "Mar 15, 2026", time: "10:00 AM", location: "Online — Discord", type: "hackathon", status: "upcoming", capacity: 200, registered: 142, link: "https://discord.gg/hackathon" },
  { id: "ev-2", title: "AI Workshop", description: "Hands-on workshop on building AI-powered applications.", date: "Mar 22, 2026", time: "2:00 PM", location: "Online — Zoom", type: "workshop", status: "upcoming", capacity: 100, registered: 67, link: "" },
  { id: "ev-3", title: "Monthly Challenge Reset", description: "New challenges released for the month.", date: "Apr 1, 2026", time: "12:00 AM", location: "Platform", type: "system", status: "scheduled", capacity: 0, registered: 0, link: "" },
  { id: "ev-4", title: "Cybersecurity CTF", description: "Capture the flag competition for all skill levels.", date: "Apr 10, 2026", time: "6:00 PM", location: "Online — Platform", type: "competition", status: "draft", capacity: 150, registered: 0, link: "" },
  { id: "ev-5", title: "Community Meetup", description: "Monthly community gathering to share projects and network.", date: "Apr 15, 2026", time: "7:00 PM", location: "Online — Google Meet", type: "meetup", status: "draft", capacity: 50, registered: 0, link: "" },
];

const MOCK_POINT_RULES: PointRule[] = [
  { id: "pr-1", action: "Complete a challenge", points: 500, active: true },
  { id: "pr-2", action: "Daily login", points: 10, active: true },
  { id: "pr-3", action: "Login streak (7d)", points: 50, active: true },
  { id: "pr-4", action: "Follow Discord", points: 50, active: true },
  { id: "pr-5", action: "Follow Twitter/X", points: 50, active: true },
  { id: "pr-6", action: "Follow LinkedIn", points: 30, active: false },
  { id: "pr-7", action: "Follow GitHub", points: 40, active: true },
  { id: "pr-8", action: "Follow Telegram", points: 30, active: true },
  { id: "pr-9", action: "Follow WhatsApp", points: 20, active: false },
  { id: "pr-10", action: "Refer a friend", points: 200, active: true },
];

const MOCK_POINT_LOG: PointAward[] = [
  { id: "pl-1", user: "Sarah Chen", action: "Completed challenge", points: "+500", time: "10m ago" },
  { id: "pl-2", user: "Ahmed Hassan", action: "Followed Discord", points: "+50", time: "25m ago" },
  { id: "pl-3", user: "Maria Rodriguez", action: "Daily login streak (12d)", points: "+120", time: "1h ago" },
  { id: "pl-4", user: "James Park", action: "Referral bonus", points: "+200", time: "2h ago" },
  { id: "pl-5", user: "Fatima Al-Sayed", action: "Manual award (Admin)", points: "+300", time: "3h ago" },
];

const TRACK_OPTIONS = ["Frontend", "Backend", "AI / ML", "Cybersecurity", "Data Science", "DevOps", "Mobile", "Full Stack"];
const DIFFICULTY_OPTIONS: ChallengeData["difficulty"][] = ["Easy", "Medium", "Hard", "Expert"];
const EVENT_TYPE_OPTIONS: EventData["type"][] = ["hackathon", "workshop", "competition", "meetup", "webinar", "system"];
const USER_STATUS_OPTIONS: UserData["status"][] = ["active", "inactive", "banned"];
const USER_ROLE_OPTIONS: UserData["role"][] = ["member", "moderator", "admin"];

const MOCK_STATS = [
  { label: "Total Users", value: "2,847", change: "+12%", icon: Users },
  { label: "Active Challenges", value: "14", change: "+3", icon: Trophy },
  { label: "Points Awarded", value: "184K", change: "+8.2%", icon: Zap },
  { label: "Upcoming Events", value: "6", change: "+2", icon: Calendar },
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

const roleBadge = (r: string) => {
  const map: Record<string, string> = {
    admin: "text-red-500 border-red-500/30",
    moderator: "text-blue-500 border-blue-500/30",
    member: "text-muted-foreground border-border",
  };
  return map[r] || "text-muted-foreground border-border";
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

const DangerBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[13px] font-medium hover:bg-red-500/20 transition-colors">{children}</button>
);

// ─── User Form ───
const UserForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
}: {
  initial?: UserData;
  onSave: (data: UserData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}) => {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [points, setPoints] = useState(initial?.points || 0);
  const [status, setStatus] = useState<UserData["status"]>(initial?.status || "active");
  const [role, setRole] = useState<UserData["role"]>(initial?.role || "member");
  const [bio, setBio] = useState(initial?.bio || "");

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return;
    onSave({
      id: initial?.id || `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      joined: initial?.joined || "Just now",
      points,
      status,
      role,
      bio,
    });
  };

  return (
    <div className="border-2 border-foreground">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">{isEdit ? "Edit User" : "Add User"}</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <FieldInput value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <FieldInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. john@example.com" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Role</FieldLabel>
            <FieldSelect value={role} onChange={e => setRole(e.target.value as UserData["role"])}>
              {USER_ROLE_OPTIONS.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <FieldSelect value={status} onChange={e => setStatus(e.target.value as UserData["status"])}>
              {USER_STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Points</FieldLabel>
            <FieldInput type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={0} />
          </div>
        </div>
        <div>
          <FieldLabel>Bio</FieldLabel>
          <FieldTextarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Short user bio..." />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={handleSave} disabled={!name.trim() || !email.trim()}>
            <Check className="w-3.5 h-3.5" /> {isEdit ? "Save Changes" : "Add User"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};

// ─── Event Form ───
const EventForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
}: {
  initial?: EventData;
  onSave: (data: EventData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [date, setDate] = useState(initial?.date || "");
  const [time, setTime] = useState(initial?.time || "");
  const [location, setLocation] = useState(initial?.location || "");
  const [type, setType] = useState<EventData["type"]>(initial?.type || "workshop");
  const [status, setStatus] = useState<EventData["status"]>(initial?.status || "draft");
  const [capacity, setCapacity] = useState(initial?.capacity || 100);
  const [link, setLink] = useState(initial?.link || "");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: initial?.id || `ev-${Date.now()}`,
      title: title.trim(),
      description,
      date: date || "TBD",
      time: time || "TBD",
      location: location || "Online",
      type,
      status,
      capacity,
      registered: initial?.registered || 0,
      link,
    });
  };

  return (
    <div className="border-2 border-foreground">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">{isEdit ? "Edit Event" : "Create Event"}</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <FieldLabel>Title</FieldLabel>
          <FieldInput value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Frontend Hackathon" />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Event description..." />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Date</FieldLabel>
            <FieldInput value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. Mar 15, 2026" />
          </div>
          <div>
            <FieldLabel>Time</FieldLabel>
            <FieldInput value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 10:00 AM" />
          </div>
          <div>
            <FieldLabel>Location</FieldLabel>
            <FieldInput value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Online — Discord" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Type</FieldLabel>
            <FieldSelect value={type} onChange={e => setType(e.target.value as EventData["type"])}>
              {EVENT_TYPE_OPTIONS.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <FieldSelect value={status} onChange={e => setStatus(e.target.value as EventData["status"])}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Capacity</FieldLabel>
            <FieldInput type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} min={0} />
          </div>
        </div>
        <div>
          <FieldLabel>Event Link (optional)</FieldLabel>
          <FieldInput value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={handleSave} disabled={!title.trim()}>
            <Check className="w-3.5 h-3.5" /> {isEdit ? "Save Changes" : "Create Event"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};

// ─── Point Rule Form ───
const PointRuleForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
}: {
  initial?: PointRule;
  onSave: (data: PointRule) => void;
  onCancel: () => void;
  isEdit?: boolean;
}) => {
  const [action, setAction] = useState(initial?.action || "");
  const [points, setPoints] = useState(initial?.points || 100);
  const [active, setActive] = useState(initial?.active ?? true);

  return (
    <div className="border-2 border-foreground">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">{isEdit ? "Edit Rule" : "Add Rule"}</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Action</FieldLabel>
            <FieldInput value={action} onChange={e => setAction(e.target.value)} placeholder="e.g. Complete a quiz" />
          </div>
          <div>
            <FieldLabel>Points</FieldLabel>
            <FieldInput type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min={0} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActive(!active)}
            className={`w-10 h-5 rounded-full relative transition-colors ${active ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${active ? "left-5" : "left-0.5"}`} />
          </button>
          <span className="text-[13px] text-foreground">{active ? "Active" : "Inactive"}</span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={() => { if (action.trim()) onSave({ id: initial?.id || `pr-${Date.now()}`, action: action.trim(), points, active }); }} disabled={!action.trim()}>
            <Check className="w-3.5 h-3.5" /> {isEdit ? "Save" : "Add Rule"}
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};

// ─── Award Points Form ───
const AwardPointsForm = ({
  users,
  onAward,
  onCancel,
}: {
  users: UserData[];
  onAward: (userId: string, userName: string, points: number, reason: string) => void;
  onCancel: () => void;
}) => {
  const [selectedUser, setSelectedUser] = useState(users[0]?.id || "");
  const [points, setPoints] = useState(100);
  const [reason, setReason] = useState("");

  return (
    <div className="border-2 border-foreground">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">Award Points</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>User</FieldLabel>
            <FieldSelect value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Points</FieldLabel>
            <FieldInput type="number" value={points} onChange={e => setPoints(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <FieldLabel>Reason</FieldLabel>
          <FieldInput value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Manual award for outstanding contribution" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={() => {
            const user = users.find(u => u.id === selectedUser);
            if (user && reason.trim()) onAward(user.id, user.name, points, reason.trim());
          }} disabled={!reason.trim() || !points}>
            <Zap className="w-3.5 h-3.5" /> Award Points
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};

// ─── Badge Form ───
const BadgeForm = ({
  onSave,
  onCancel,
}: {
  onSave: (badge: { id: string; nameKey: string; minPoints: number; icon: React.ElementType; iconName: string; colorClass: string; borderClass: string; bgClass: string }) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState("");
  const [minPoints, setMinPoints] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const COLOR_PRESETS = [
    { label: "Zinc", colorClass: "text-zinc-400", borderClass: "border-zinc-400/30", bgClass: "bg-zinc-400/10" },
    { label: "Emerald", colorClass: "text-emerald-500", borderClass: "border-emerald-500/30", bgClass: "bg-emerald-500/10" },
    { label: "Blue", colorClass: "text-blue-500", borderClass: "border-blue-500/30", bgClass: "bg-blue-500/10" },
    { label: "Purple", colorClass: "text-purple-500", borderClass: "border-purple-500/30", bgClass: "bg-purple-500/10" },
    { label: "Amber", colorClass: "text-amber-500", borderClass: "border-amber-500/30", bgClass: "bg-amber-500/10" },
    { label: "Red", colorClass: "text-red-500", borderClass: "border-red-500/30", bgClass: "bg-red-500/10" },
    { label: "Pink", colorClass: "text-pink-500", borderClass: "border-pink-500/30", bgClass: "bg-pink-500/10" },
    { label: "Cyan", colorClass: "text-cyan-500", borderClass: "border-cyan-500/30", bgClass: "bg-cyan-500/10" },
  ];
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);

  return (
    <div className="border-2 border-foreground">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">Create Badge</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Badge Name</FieldLabel>
            <FieldInput value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Champion" />
          </div>
          <div>
            <FieldLabel>Min Points</FieldLabel>
            <FieldInput type="number" value={minPoints} onChange={e => setMinPoints(Number(e.target.value))} min={0} />
          </div>
        </div>
        <div>
          <FieldLabel>Color</FieldLabel>
          <div className="flex items-center gap-2 flex-wrap">
            {COLOR_PRESETS.map(c => (
              <button
                key={c.label}
                onClick={() => setSelectedColor(c)}
                className={`px-3 py-1.5 border text-[12px] font-mono transition-colors ${
                  selectedColor.label === c.label ? `${c.borderClass} ${c.bgClass} ${c.colorClass}` : "border-border text-muted-foreground hover:border-foreground/40"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Icon</FieldLabel>
          <div className="grid grid-cols-10 gap-1">
            {AVAILABLE_ICONS.map(iconOption => {
              const OptionIcon = iconOption.icon;
              const isSelected = selectedIcon.name === iconOption.name;
              return (
                <button
                  key={iconOption.name}
                  onClick={() => setSelectedIcon(iconOption)}
                  className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                    isSelected ? "border-foreground bg-accent text-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  <OptionIcon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
        {/* Preview */}
        <div className="flex items-center gap-3 p-3 border border-border bg-accent/20">
          <div className={`w-10 h-10 flex items-center justify-center border ${selectedColor.borderClass} ${selectedColor.bgClass}`}>
            <selectedIcon.icon className={`w-5 h-5 ${selectedColor.colorClass}`} />
          </div>
          <div>
            <p className={`text-[12px] font-mono font-medium ${selectedColor.colorClass} uppercase tracking-wider`}>{name || "Badge Name"}</p>
            <p className="text-[10px] text-muted-foreground font-mono">{minPoints.toLocaleString()}+ pts</p>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={() => {
            if (name.trim()) onSave({
              id: `badge-${Date.now()}`,
              nameKey: name.trim(),
              minPoints,
              icon: selectedIcon.icon,
              iconName: selectedIcon.name,
              ...selectedColor,
            });
          }} disabled={!name.trim()}>
            <Check className="w-3.5 h-3.5" /> Create Badge
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
      </div>
    </div>
  );
};

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

// ─── Track Form ───
const TrackForm = ({
  initial,
  onSave,
  onCancel,
  isEdit = false,
}: {
  initial?: TrackData;
  onSave: (data: TrackData) => void;
  onCancel: () => void;
  isEdit?: boolean;
}) => {
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [selectedIcon, setSelectedIcon] = useState(
    AVAILABLE_ICONS.find(i => i.name === initial?.iconName) || AVAILABLE_ICONS[0]
  );

  const autoSlug = (val: string) => val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) setSlug(autoSlug(val));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id || `tr-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim() || autoSlug(name),
      description,
      iconName: selectedIcon.name,
    });
  };

  return (
    <div className="border-2 border-foreground">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground">{isEdit ? "Edit Track" : "Add Track"}</h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Name</FieldLabel>
            <FieldInput value={name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Frontend" />
          </div>
          <div>
            <FieldLabel>Slug</FieldLabel>
            <FieldInput value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. frontend" />
          </div>
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <FieldTextarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description of the track..." />
        </div>
        <div>
          <FieldLabel>Icon</FieldLabel>
          <div className="grid grid-cols-10 gap-1">
            {AVAILABLE_ICONS.map(iconOption => {
              const OptionIcon = iconOption.icon;
              const isSelected = selectedIcon.name === iconOption.name;
              return (
                <button
                  key={iconOption.name}
                  onClick={() => setSelectedIcon(iconOption)}
                  className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                    isSelected ? "border-foreground bg-accent text-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  <OptionIcon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn onClick={handleSave} disabled={!name.trim()}>
            <Check className="w-3.5 h-3.5" /> {isEdit ? "Save Changes" : "Add Track"}
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

  // Users state
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);
  const [userFormMode, setUserFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingUser, setEditingUser] = useState<UserData | undefined>();
  const [viewingUser, setViewingUser] = useState<UserData | null>(null);

  // Events state
  const [events, setEvents] = useState<EventData[]>(MOCK_EVENTS);
  const [eventFormMode, setEventFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingEvent, setEditingEvent] = useState<EventData | undefined>();

  // Points state
  const [pointRules, setPointRules] = useState<PointRule[]>(MOCK_POINT_RULES);
  const [pointLog, setPointLog] = useState<PointAward[]>(MOCK_POINT_LOG);
  const [ruleFormMode, setRuleFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingRule, setEditingRule] = useState<PointRule | undefined>();
  const [showAwardForm, setShowAwardForm] = useState(false);

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
  const [showBadgeForm, setShowBadgeForm] = useState(false);

  // Competitions state
  const [competitions, setCompetitions] = useState<CompetitionData[]>(MOCK_COMPETITIONS);
  const [compFormMode, setCompFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingComp, setEditingComp] = useState<CompetitionData | undefined>();

  // Challenges state
  const [challenges, setChallenges] = useState<ChallengeData[]>(MOCK_CHALLENGES);
  const [chalFormMode, setChalFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingChal, setEditingChal] = useState<ChallengeData | undefined>();

  // ─── Handlers ───
  const saveUser = (user: UserData) => {
    if (userFormMode === "edit") {
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
    } else {
      setUsers(prev => [user, ...prev]);
    }
    setUserFormMode("none");
    setEditingUser(undefined);
  };

  const deleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  const saveEvent = (event: EventData) => {
    if (eventFormMode === "edit") {
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    } else {
      setEvents(prev => [event, ...prev]);
    }
    setEventFormMode("none");
    setEditingEvent(undefined);
  };

  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));

  const savePointRule = (rule: PointRule) => {
    if (ruleFormMode === "edit") {
      setPointRules(prev => prev.map(r => r.id === rule.id ? rule : r));
    } else {
      setPointRules(prev => [...prev, rule]);
    }
    setRuleFormMode("none");
    setEditingRule(undefined);
  };

  const deletePointRule = (id: string) => setPointRules(prev => prev.filter(r => r.id !== id));
  const togglePointRule = (id: string) => setPointRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));

  const awardPoints = (userId: string, userName: string, points: number, reason: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, points: u.points + points } : u));
    setPointLog(prev => [{ id: `pl-${Date.now()}`, user: userName, action: reason, points: `+${points}`, time: "Just now" }, ...prev]);
    setShowAwardForm(false);
  };

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
                      {pointLog.slice(0, 5).map((log) => (
                        <div key={log.id} className="px-5 py-3 flex items-center justify-between">
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
                      {events.slice(0, 5).map((event) => (
                        <div key={event.id} className="px-5 py-3 flex items-center justify-between">
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
                  <p className="text-[13px] text-muted-foreground">Managing <span className="text-foreground font-medium">{users.length}</span> users</p>
                  <PrimaryBtn onClick={() => { setUserFormMode("create"); setEditingUser(undefined); setViewingUser(null); }}>
                    <Plus className="w-3.5 h-3.5" /> Add User
                  </PrimaryBtn>
                </div>

                {userFormMode !== "none" && (
                  <UserForm
                    initial={editingUser}
                    isEdit={userFormMode === "edit"}
                    onSave={saveUser}
                    onCancel={() => { setUserFormMode("none"); setEditingUser(undefined); }}
                  />
                )}

                {/* User detail view */}
                {viewingUser && (
                  <div className="border-2 border-foreground">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-[14px] font-bold text-foreground">User Details</h3>
                      <button onClick={() => setViewingUser(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start gap-5">
                        <div className="w-16 h-16 bg-accent border border-border flex items-center justify-center text-[20px] font-bold font-mono text-foreground shrink-0">
                          {viewingUser.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="text-[18px] font-bold text-foreground">{viewingUser.name}</h4>
                            <p className="text-[13px] text-muted-foreground flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5" /> {viewingUser.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider ${statusBadge(viewingUser.status)}`}>{viewingUser.status}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider ${roleBadge(viewingUser.role)}`}>{viewingUser.role}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 pt-2">
                            <div className="border border-border p-3">
                              <p className="text-[11px] text-muted-foreground font-mono uppercase">Points</p>
                              <p className="text-[20px] font-bold font-mono text-foreground">{viewingUser.points.toLocaleString()}</p>
                            </div>
                            <div className="border border-border p-3">
                              <p className="text-[11px] text-muted-foreground font-mono uppercase">Joined</p>
                              <p className="text-[14px] font-medium text-foreground">{viewingUser.joined}</p>
                            </div>
                            <div className="border border-border p-3">
                              <p className="text-[11px] text-muted-foreground font-mono uppercase">Role</p>
                              <p className="text-[14px] font-medium text-foreground capitalize">{viewingUser.role}</p>
                            </div>
                          </div>
                          {viewingUser.bio && (
                            <div className="pt-2">
                              <p className="text-[11px] text-muted-foreground font-mono uppercase mb-1">Bio</p>
                              <p className="text-[13px] text-foreground">{viewingUser.bio}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border border-border">
                  <div className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                    <span>User</span><span>Email</span><span>Points</span><span>Role</span><span>Status</span><span>Actions</span>
                  </div>
                  {users.map((user) => (
                    <div key={user.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-5 py-4 border-b border-border last:border-b-0 items-center hover:bg-accent/30 transition-colors">
                      <div>
                        <p className="text-[14px] font-medium text-foreground">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">Joined {user.joined}</p>
                      </div>
                      <p className="text-[13px] text-muted-foreground">{user.email}</p>
                      <p className="font-mono font-bold text-foreground text-[14px] w-20 text-right">{user.points.toLocaleString()}</p>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider w-24 text-center ${roleBadge(user.role)}`}>{user.role}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider w-20 text-center ${statusBadge(user.status)}`}>{user.status}</span>
                      <div className="flex items-center gap-1 w-24 justify-end">
                        <button onClick={() => { setViewingUser(user); setUserFormMode("none"); }} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { setUserFormMode("edit"); setEditingUser(user); setViewingUser(null); }} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteUser(user.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
                  <p className="text-[13px] text-muted-foreground">Managing <span className="text-foreground font-medium">{events.length}</span> events</p>
                  <PrimaryBtn onClick={() => { setEventFormMode("create"); setEditingEvent(undefined); }}>
                    <Plus className="w-3.5 h-3.5" /> New Event
                  </PrimaryBtn>
                </div>

                {eventFormMode !== "none" && (
                  <EventForm
                    initial={editingEvent}
                    isEdit={eventFormMode === "edit"}
                    onSave={saveEvent}
                    onCancel={() => { setEventFormMode("none"); setEditingEvent(undefined); }}
                  />
                )}

                <div className="border border-border">
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-foreground">Event Timeline</h3>
                  </div>
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
                    {events.map((event) => (
                      <div key={event.id} className="flex items-start gap-6 px-5 py-5 hover:bg-accent/30 transition-colors relative">
                        <div className="w-6 h-6 border border-border bg-background flex items-center justify-center z-10 shrink-0 mt-0.5">
                          {event.status === "upcoming" ? (
                            <Clock className="w-3 h-3 text-amber-500" />
                          ) : event.status === "live" ? (
                            <Play className="w-3 h-3 text-emerald-500" />
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
                            <span className="text-[10px] font-mono px-2 py-0.5 border border-border text-muted-foreground uppercase tracking-wider">
                              {event.type}
                            </span>
                          </div>
                          <p className="text-[12px] text-muted-foreground mb-1">{event.description}</p>
                          <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-mono flex-wrap">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                            {event.capacity > 0 && (
                              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.registered}/{event.capacity}</span>
                            )}
                            {event.link && (
                              <span className="flex items-center gap-1"><Link className="w-3 h-3" /> Link</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEventFormMode("edit"); setEditingEvent(event); }} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteEvent(event.id)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                  <div className="flex items-center gap-2">
                    <SecondaryBtn onClick={() => { setRuleFormMode("create"); setEditingRule(undefined); }}>
                      <Plus className="w-3.5 h-3.5" /> Add Rule
                    </SecondaryBtn>
                    <PrimaryBtn onClick={() => setShowAwardForm(true)}>
                      <Zap className="w-3.5 h-3.5" /> Award Points
                    </PrimaryBtn>
                  </div>
                </div>

                {showAwardForm && (
                  <AwardPointsForm
                    users={users}
                    onAward={awardPoints}
                    onCancel={() => setShowAwardForm(false)}
                  />
                )}

                {ruleFormMode !== "none" && (
                  <PointRuleForm
                    initial={editingRule}
                    isEdit={ruleFormMode === "edit"}
                    onSave={savePointRule}
                    onCancel={() => { setRuleFormMode("none"); setEditingRule(undefined); }}
                  />
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="border border-border">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-[14px] font-bold text-foreground">Auto Point Rules</h3>
                      <span className="text-[11px] font-mono text-muted-foreground">{pointRules.length} rules</span>
                    </div>
                    <div className="divide-y divide-border">
                      {pointRules.map((rule) => (
                        <div key={rule.id} className="px-5 py-3 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => togglePointRule(rule.id)}
                              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${rule.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                              title={rule.active ? "Active — click to disable" : "Inactive — click to enable"}
                            />
                            <span className={`text-[13px] ${rule.active ? "text-foreground" : "text-muted-foreground line-through"}`}>{rule.action}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-mono font-bold text-emerald-500">+{rule.points}</span>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setRuleFormMode("edit"); setEditingRule(rule); }} className="p-1 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3 h-3" /></button>
                              <button onClick={() => deletePointRule(rule.id)} className="p-1 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-border">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                      <h3 className="text-[14px] font-bold text-foreground">Recent Awards</h3>
                      <span className="text-[11px] font-mono text-muted-foreground">{pointLog.length} entries</span>
                    </div>
                    <div className="divide-y divide-border">
                      {pointLog.map((log) => (
                        <div key={log.id} className="px-5 py-3 flex items-center justify-between">
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
                  <PrimaryBtn onClick={() => setShowBadgeForm(true)}>
                    <Plus className="w-3.5 h-3.5" /> New Badge
                  </PrimaryBtn>
                </div>

                {showBadgeForm && (
                  <BadgeForm
                    onSave={(badge) => {
                      setBadges(prev => [...prev, badge]);
                      setShowBadgeForm(false);
                    }}
                    onCancel={() => setShowBadgeForm(false)}
                  />
                )}

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
                            <div className="flex items-center gap-1">
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
                              <button
                                onClick={() => setBadges(prev => prev.filter(b => b.id !== badge.id))}
                                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
