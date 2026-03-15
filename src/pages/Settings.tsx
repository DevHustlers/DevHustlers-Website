import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { Save, LogOut } from "lucide-react";

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setFullName(currentUser.user_metadata?.full_name || "");
        setUsername(currentUser.user_metadata?.username || "");
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          username: username,
        }
      });
      if (error) throw error;
      alert("Profile updated successfully");
    } catch (err: any) {
      alert("Error updating profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return (
    <PageLayout>
      <Navbar />
      <div className="min-h-screen flex flex-col pt-28 pb-16 px-4 items-center justify-center">
        <p className="text-muted-foreground font-mono">Please log in...</p>
      </div>
      <Footer />
    </PageLayout>
  );

  return (
    <PageLayout>
      <Navbar />
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-20 min-h-screen flex flex-col">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 lg:px-6 w-full flex-1">
          <div className="mb-10 block border-l-4 border-foreground pl-4 py-1">
             <p className="text-[13px] font-mono text-muted-foreground mb-2 uppercase tracking-widest">Preferences</p>
             <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">Account Settings</h1>
          </div>

          <div className="space-y-8">
            <div className="border border-border p-6 sm:p-8 bg-background relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-border hover:bg-foreground transition-colors"></div>
              <h2 className="text-lg font-bold mb-6 font-mono border-b border-border pb-4 uppercase tracking-wider">Personal Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                    Email address (cannot be changed here)
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full h-12 px-4 bg-muted/20 border border-border text-muted-foreground text-[15px] focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="h-12 px-6 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-red-500/30 p-6 sm:p-8 bg-black/5 dark:bg-red-500/5 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
              <h2 className="text-lg font-bold mb-4 font-mono text-red-500 uppercase tracking-wider">Danger Zone</h2>
              <p className="text-[14px] text-muted-foreground mb-6">
                Logging out or deleting your account will restrict access to all your current progress and activity.
              </p>
              <button
                onClick={handleLogout}
                className="h-12 px-6 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 font-medium text-[15px] hover:bg-red-500/20 transition-colors uppercase tracking-wider font-mono text-[12px]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

        </div>
      </section>
      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Settings;
