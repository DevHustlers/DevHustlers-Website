import { useEffect, useState } from "react";
import { TrendingUp, Users, Trophy, Zap, Calendar, Star, Target, LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

export const StatGrid = () => {
  const [stats, setStats] = useState<StatItem[]>([
    {
      label: "Total Users",
      value: "...",
      change: "+0%",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Active Challenges",
      value: "...",
      change: "+0",
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Points Awarded",
      value: "...",
      change: "+0%",
      icon: Zap,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Upcoming Events",
      value: "...",
      change: "+0",
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Total Competitions",
      value: "...",
      change: "+0",
      icon: Star,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    {
      label: "Badge Tiers",
      value: "...",
      change: "+0",
      icon: Target,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
  ]);

  useEffect(() => {
    fetchStats();

    // Set up realtime channel for all relevant tables
    const channel = supabase
      .channel('dashboard-stats-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'challenges' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'competitions' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'badges' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    console.log('Fetching dashboard stats...');
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const [
      { count: userCount },
      { count: newUserCount },
      { count: challengeCount },
      { count: newChallengeCount },
      { count: eventCount },
      { count: compCount },
      { count: badgeCount },
      { data: profilesData }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek),
      supabase.from('challenges').select('*', { count: 'exact', head: true }).eq('status', 'live'),
      supabase.from('challenges').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek),
      supabase.from('events').select('*', { count: 'exact', head: true }).in('status', ['upcoming', 'scheduled']),
      supabase.from('competitions').select('*', { count: 'exact', head: true }),
      supabase.from('badges').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('points')
    ]);

    const totalPoints = profilesData?.reduce((acc, curr) => acc + (curr.points || 0), 0) || 0;

    setStats(prev => [
      { 
        ...prev[0], 
        value: (userCount || 0).toLocaleString(),
        change: newUserCount ? `+${newUserCount}` : "+0"
      },
      { 
        ...prev[1], 
        value: (challengeCount || 0).toLocaleString(),
        change: newChallengeCount ? `+${newChallengeCount}` : "+0"
      },
      { ...prev[2], value: totalPoints > 1000 ? `${(totalPoints / 1000).toFixed(1)}K` : totalPoints.toString() },
      { ...prev[3], value: (eventCount || 0).toLocaleString() },
      { ...prev[4], value: (compCount || 0).toLocaleString() },
      { ...prev[5], value: (badgeCount || 0).toLocaleString() },
    ]);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-3 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bg} ${stat.border} border rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon
                className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`}
              />
            </div>
            {stat.change !== "+0" && stat.change !== "+0%" && (
              <span className="text-[10px] sm:text-[11px] font-mono text-emerald-500 flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                {stat.change}
              </span>
            )}
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground font-mono group-hover:text-primary transition-colors">
            {stat.value}
          </p>
          <p className="text-[10px] sm:text-[12px] text-muted-foreground mt-0.5 sm:mt-1 group-hover:text-foreground/80 transition-colors">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};
