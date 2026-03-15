import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Calendar, Mail, Zap, Trophy, Link as LinkIcon } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (!user) return (
    <PageLayout>
      <Navbar />
      <div className="min-h-screen flex flex-col pt-28 pb-16 px-4 items-center justify-center">
        <p className="text-muted-foreground font-mono">Loading profile...</p>
      </div>
      <Footer />
    </PageLayout>
  );

  const initial = user.user_metadata?.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <PageLayout>
      <Navbar />
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-20 min-h-screen flex flex-col">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-6 flex-1 w-full">
          <div className="border border-border bg-background p-8 md:p-12 mb-8 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-foreground"></div>
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-foreground text-background flex items-center justify-center text-4xl md:text-5xl font-bold rounded-none shrink-0 border-2 border-foreground">
                {initial}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {user.user_metadata?.full_name || user.user_metadata?.username || "Developer"}
                  </h1>
                  <p className="text-muted-foreground text-[15px] font-mono mt-1">
                    @{user.user_metadata?.username || user.email?.split('@')[0]}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-1.5 border border-border px-3 py-1.5 bg-accent/20">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border border-border px-3 py-1.5 bg-accent/20">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[13px] font-mono text-foreground mb-4 uppercase tracking-widest flex items-center gap-2 border-b border-border pb-3">
                    <Trophy className="w-4 h-4" /> Selected Tracks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.user_metadata?.tracks?.map((track: string) => (
                      <span key={track} className="px-3 py-1 border border-foreground bg-foreground text-background text-[13px] font-medium transition-colors">
                        {track}
                      </span>
                    )) || <span className="text-[13px] text-muted-foreground italic font-mono bg-accent/30 px-3 py-1 border border-border">No tracks selected yet.</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[13px] font-mono text-foreground mb-4 uppercase tracking-widest flex items-center gap-2 border-b border-border pb-3">
                    <Zap className="w-4 h-4" /> Activity & Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-border p-5 bg-accent/10 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold font-mono text-foreground mb-1 mt-2">0</div>
                      <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Points</div>
                    </div>
                    <div className="border border-border p-5 bg-accent/10 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold font-mono text-foreground mb-1 mt-2">0</div>
                      <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Challenges</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Profile;
