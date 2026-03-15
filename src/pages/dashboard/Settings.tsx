import { useState, useEffect } from "react";
import {
  Check,
  Settings2,
  Shield,
  Bell,
  Globe,
  Zap,
  Trophy,
  Loader2,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { getPlatformSettings, updatePlatformSettings } from "@/services/settings.service";
import { toast } from "sonner";
import { PlatformSettingsInput } from "@/lib/validation/settings.schema";

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
    {children}
  </label>
);

const FieldInput = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full h-9 px-3 bg-background border border-border text-foreground text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/40 hover:border-primary/30 transition-all ${className}`}
  />
);

const FieldSelect = ({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={`w-full h-9 px-3 bg-background border border-border text-foreground text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-primary/30 transition-all ${className}`}
  >
    {children}
  </select>
);

const PrimaryBtn = ({
  children,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) => (
  <button
    {...props}
    disabled={props.disabled || loading}
    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-lg hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
  >
    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
    {children}
  </button>
);

const ToggleSwitch = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full transition-all duration-300 relative disabled:opacity-50 ${checked ? "bg-emerald-500" : "bg-border hover:bg-muted-foreground/30"}`}
  >
    <span
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${checked ? "left-6" : "left-1"}`}
    />
  </button>
);

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettingsInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await getPlatformSettings();
    if (!error && data) {
      setSettings(data);
    } else if (error) {
      toast.error("Failed to load settings: " + error);
    }
    setLoading(false);
  };

  const handleSave = async (section: string, data: Partial<PlatformSettingsInput>) => {
    if (isSubmitting) return;
    setIsSubmitting(section);
    
    const { data: updated, error } = await updatePlatformSettings(data);
    if (!error && updated) {
      setSettings(updated);
      toast.success(`${section} saved successfully`);
    } else if (error) {
      toast.error(`Failed to save ${section}: ` + error);
    }
    setIsSubmitting(null);
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                General Settings
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <FieldLabel>Community Name</FieldLabel>
                <FieldInput 
                  value={settings.community_name} 
                  onChange={e => setSettings({...settings, community_name: e.target.value})}
                  className="h-10" 
                />
              </div>
              <div>
                <FieldLabel>Default Language</FieldLabel>
                <FieldSelect 
                  value={settings.default_language} 
                  onChange={e => setSettings({...settings, default_language: e.target.value})}
                  className="h-10"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </FieldSelect>
              </div>
              <div>
                <FieldLabel>Timezone</FieldLabel>
                <FieldSelect 
                  value={settings.timezone} 
                  onChange={e => setSettings({...settings, timezone: e.target.value})}
                  className="h-10"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Dubai">Dubai</option>
                </FieldSelect>
              </div>
              <PrimaryBtn 
                loading={isSubmitting === "General"} 
                onClick={() => handleSave("General", {
                  community_name: settings.community_name,
                  default_language: settings.default_language,
                  timezone: settings.timezone
                })}
              >
                {!isSubmitting && <Check className="w-3.5 h-3.5" />} Save Settings
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Points Configuration
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <FieldLabel>Max Points per Day</FieldLabel>
                <FieldInput
                  value={settings.max_points_per_day}
                  onChange={e => setSettings({...settings, max_points_per_day: parseInt(e.target.value) || 0})}
                  type="number"
                  className="h-10"
                />
              </div>
              <div>
                <FieldLabel>Challenge Duration (days)</FieldLabel>
                <FieldInput 
                  value={settings.challenge_duration}
                  onChange={e => setSettings({...settings, challenge_duration: parseInt(e.target.value) || 1})}
                  type="number" 
                  className="h-10" 
                />
              </div>
              <div>
                <FieldLabel>Points Expiry (days)</FieldLabel>
                <FieldInput 
                  value={settings.points_expiry}
                  onChange={e => setSettings({...settings, points_expiry: parseInt(e.target.value) || 30})}
                  type="number" 
                  className="h-10" 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Streak Bonuses
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Reward consistent daily activity
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_streak_bonuses} 
                  onChange={val => setSettings({...settings, enable_streak_bonuses: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <PrimaryBtn
                loading={isSubmitting === "Points"}
                onClick={() => handleSave("Points", {
                  max_points_per_day: settings.max_points_per_day,
                  challenge_duration: settings.challenge_duration,
                  points_expiry: settings.points_expiry,
                  enable_streak_bonuses: settings.enable_streak_bonuses
                })}
              >
                {!isSubmitting && <Check className="w-3.5 h-3.5" />} Save Points
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Security
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Two-Factor Authentication
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_2fa} 
                  onChange={val => setSettings({...settings, enable_2fa: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Email Verification
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Users must verify email
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_email_verification} 
                  onChange={val => setSettings({...settings, enable_email_verification: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Account Approval
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Admin must approve new accounts
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_account_approval} 
                  onChange={val => setSettings({...settings, enable_account_approval: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <div>
                <FieldLabel>Session Timeout (minutes)</FieldLabel>
                <FieldInput 
                   value={settings.session_timeout}
                   onChange={e => setSettings({...settings, session_timeout: parseInt(e.target.value) || 30})}
                   type="number" 
                   className="h-10" 
                />
              </div>
              <PrimaryBtn
                loading={isSubmitting === "Security"}
                onClick={() => handleSave("Security", {
                  enable_2fa: settings.enable_2fa,
                  enable_email_verification: settings.enable_email_verification,
                  enable_account_approval: settings.enable_account_approval,
                  session_timeout: settings.session_timeout
                })}
              >
                {!isSubmitting && <Check className="w-3.5 h-3.5" />} Save Security
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Notifications
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Email Notifications
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Send email for important events
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_email_notifications} 
                  onChange={val => setSettings({...settings, enable_email_notifications: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Challenge Reminders
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Remind users about active challenges
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_challenge_reminders} 
                  onChange={val => setSettings({...settings, enable_challenge_reminders: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Leaderboard Updates
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Weekly leaderboard digest
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_leaderboard_updates} 
                  onChange={val => setSettings({...settings, enable_leaderboard_updates: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    New Event Alerts
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Notify when new events are scheduled
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_new_event_alerts} 
                  onChange={val => setSettings({...settings, enable_new_event_alerts: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <PrimaryBtn
                loading={isSubmitting === "Notifications"}
                onClick={() => handleSave("Notifications", {
                  enable_email_notifications: settings.enable_email_notifications,
                  enable_challenge_reminders: settings.enable_challenge_reminders,
                  enable_leaderboard_updates: settings.enable_leaderboard_updates,
                  enable_new_event_alerts: settings.enable_new_event_alerts
                })}
              >
                {!isSubmitting && <Check className="w-3.5 h-3.5" />} Save Notifications
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Social Links
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <FieldLabel>Discord Server</FieldLabel>
                <FieldInput
                  value={settings.discord_link}
                  onChange={e => setSettings({...settings, discord_link: e.target.value})}
                  className="h-10"
                />
              </div>
              <div>
                <FieldLabel>Twitter / X</FieldLabel>
                <FieldInput
                  value={settings.twitter_link}
                  onChange={e => setSettings({...settings, twitter_link: e.target.value})}
                  className="h-10"
                />
              </div>
              <div>
                <FieldLabel>GitHub</FieldLabel>
                <FieldInput
                  value={settings.github_link}
                  onChange={e => setSettings({...settings, github_link: e.target.value})}
                  className="h-10"
                />
              </div>
              <div>
                <FieldLabel>LinkedIn</FieldLabel>
                <FieldInput
                  value={settings.linkedin_link}
                  onChange={e => setSettings({...settings, linkedin_link: e.target.value})}
                  className="h-10"
                />
              </div>
              <PrimaryBtn
                loading={isSubmitting === "Links"}
                onClick={() => handleSave("Links", {
                  discord_link: settings.discord_link,
                  twitter_link: settings.twitter_link,
                  github_link: settings.github_link,
                  linkedin_link: settings.linkedin_link
                })}
              >
                {!isSubmitting && <Check className="w-3.5 h-3.5" />} Save Links
              </PrimaryBtn>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl hover:border-primary/20 hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <Trophy className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-[14px] font-bold text-foreground">
                Gamification
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Leaderboard
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Show top users on platform
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_leaderboard} 
                  onChange={val => setSettings({...settings, enable_leaderboard: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Badges
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Users can earn achievement badges
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_badges} 
                  onChange={val => setSettings({...settings, enable_badges: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Streaks
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Track daily login streaks
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_streaks} 
                  onChange={val => setSettings({...settings, enable_streaks: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    Enable Referrals
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Users can refer friends
                  </p>
                </div>
                <ToggleSwitch 
                  checked={settings.enable_referrals} 
                  onChange={val => setSettings({...settings, enable_referrals: val})}
                  disabled={!!isSubmitting}
                />
              </div>
              <PrimaryBtn
                loading={isSubmitting === "Gamification"}
                onClick={() => handleSave("Gamification", {
                  enable_leaderboard: settings.enable_leaderboard,
                  enable_badges: settings.enable_badges,
                  enable_streaks: settings.enable_streaks,
                  enable_referrals: settings.enable_referrals
                })}
              >
                {!isSubmitting && <Check className="w-3.5 h-3.5" />} Save Gamification
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
