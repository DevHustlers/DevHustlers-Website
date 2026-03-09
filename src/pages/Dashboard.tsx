import { useState } from "react";
import {
  Users, Trophy, Zap, Calendar, Settings, BarChart3,
  Plus, Search, MoreHorizontal, ArrowRight, Clock,
  TrendingUp, Activity, Eye, ChevronRight, Star,
  Shield, Globe, Pencil, Trash2, CheckCircle2, Award,
  Flame, Rocket, Gem, Crown, Sparkles, Heart, Target,
  Swords, CircleDot, Diamond, Hexagon, Pentagon, Compass,
  Anchor, Lightbulb, Bolt, Medal, BadgeCheck, X, Check
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
  { label: "Events", icon: Calendar, id: "events" },
  { label: "Points", icon: Zap, id: "points" },
  { label: "Badges", icon: Award, id: "badges" },
  { label: "Settings", icon: Settings, id: "settings" },
];

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

const MOCK_CHALLENGES_LIST = [
  { title: "Build a Real-Time Chat UI", track: "Frontend", status: "live", participants: 128, points: 500 },
  { title: "REST API Rate Limiter", track: "Backend", status: "live", participants: 89, points: 750 },
  { title: "Neural Network from Scratch", track: "AI / ML", status: "live", participants: 45, points: 1000 },
  { title: "XSS Detection Scanner", track: "Cybersecurity", status: "ended", participants: 67, points: 800 },
  { title: "Predictive Analytics Dashboard", track: "Data Science", status: "upcoming", participants: 0, points: 600 },
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

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
                {/* Stats */}
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
                  {/* Recent activity */}
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

                  {/* Timeline */}
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
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add User
                  </button>
                </div>

                <div className="border border-border">
                  <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                    <span>User</span>
                    <span>Email</span>
                    <span>Points</span>
                    <span>Status</span>
                    <span>Actions</span>
                  </div>
                  {MOCK_RECENT_USERS.map((user, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-4 border-b border-border last:border-b-0 items-center hover:bg-accent/30 transition-colors">
                      <div>
                        <p className="text-[14px] font-medium text-foreground">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">Joined {user.joined}</p>
                      </div>
                      <p className="text-[13px] text-muted-foreground">{user.email}</p>
                      <p className="font-mono font-bold text-foreground text-[14px] w-20 text-right">{user.points.toLocaleString()}</p>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider w-20 text-center ${statusBadge(user.status)}`}>
                        {user.status}
                      </span>
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
                  <p className="text-[13px] text-muted-foreground">Managing <span className="text-foreground font-medium">14</span> active challenges</p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> New Challenge
                  </button>
                </div>

                <div className="border border-border divide-y divide-border">
                  {MOCK_CHALLENGES_LIST.map((c, i) => (
                    <div key={i} className="p-5 flex items-center justify-between hover:bg-accent/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-[14px] font-bold text-foreground">{c.title}</h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider ${statusBadge(c.status)}`}>
                            {c.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[12px] text-muted-foreground font-mono">
                          <span>{c.track}</span>
                          <span>{c.participants} participants</span>
                          <span>{c.points} pts</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> New Event
                  </button>
                </div>

                {/* Timeline view */}
                <div className="border border-border">
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-foreground">Event Timeline</h3>
                  </div>
                  <div className="relative">
                    {/* Vertical line */}
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
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Award Points
                  </button>
                </div>

                {/* Point rules */}
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

                {/* Channel follow stats */}
                <div className="border border-border">
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-foreground">Channel Follow Stats</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-border">
                    {[
                      { name: "Discord", followers: 1842, icon: Globe },
                      { name: "Twitter/X", followers: 2156, icon: Globe },
                      { name: "LinkedIn", followers: 1567, icon: Globe },
                      { name: "GitHub", followers: 1923, icon: Globe },
                      { name: "Telegram", followers: 987, icon: Globe },
                      { name: "WhatsApp", followers: 654, icon: Globe },
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

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6 max-w-2xl">
                <div className="border border-border">
                  <div className="px-5 py-4 border-b border-border">
                    <h3 className="text-[14px] font-bold text-foreground">General Settings</h3>
                  </div>
                  <div className="p-5 space-y-5">
                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                        Community Name
                      </label>
                      <input
                        defaultValue="DevHustlers"
                        className="w-full h-10 px-4 bg-background border border-border text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                        Max Points per Day
                      </label>
                      <input
                        defaultValue="1000"
                        type="number"
                        className="w-full h-10 px-4 bg-background border border-border text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                        Challenge Duration (days)
                      </label>
                      <input
                        defaultValue="7"
                        type="number"
                        className="w-full h-10 px-4 bg-background border border-border text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors">
                      Save Settings
                    </button>
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

// Circle component used in events tab
const Circle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
);

export default Dashboard;
