import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import Logo from "@/components/Logo";
import PageLayout from "@/components/PageLayout";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const TRACKS = [
  "Frontend", "Backend", "Data Science", "AI / ML",
  "Cybersecurity", "Mobile Dev", "Operating Systems", "UI/UX", "Network"
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const { t } = useLanguage();

  const toggleTrack = (track: string) => {
    setSelectedTracks(prev =>
      prev.includes(track) ? prev.filter(t => t !== track) : [...prev, track]
    );
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-2 h-14 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center pt-14">
          <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-center gap-2 mb-10">
              <div className={`h-1 flex-1 ${step >= 1 ? "bg-foreground" : "bg-border"} transition-colors`} />
              <div className={`h-1 flex-1 ${step >= 2 ? "bg-foreground" : "bg-border"} transition-colors`} />
            </div>

            {step === 1 && (
              <>
                <div className="mb-10">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                    {t("signup.step1")}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t("signup.title")}
                  </h1>
                  <p className="text-muted-foreground text-[15px]">
                    {t("signup.desc")}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                        {t("signup.first_name")}
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        className="w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                        {t("signup.last_name")}
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        className="w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("signup.username")}
                    </label>
                    <input
                      type="text"
                      placeholder="johndoe"
                      className="w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("signup.email")}
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("signup.password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("signup.password_hint")}
                        className="w-full h-12 px-4 pe-12 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors mt-2"
                  >
                    {t("signup.continue")}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-10">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                    {t("signup.step2")}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t("signup.choose_tracks")}
                  </h1>
                  <p className="text-muted-foreground text-[15px]">
                    {t("signup.choose_desc")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-8">
                  {TRACKS.map((track) => {
                    const selected = selectedTracks.includes(track);
                    return (
                      <button
                        key={track}
                        onClick={() => toggleTrack(track)}
                        className={`relative h-14 px-4 flex items-center gap-3 border text-[14px] font-medium transition-all ${
                          selected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        {selected && <Check className="w-4 h-4 shrink-0" />}
                        <span className={selected ? "" : "ms-7"}>{track}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="h-12 px-6 flex items-center justify-center border border-border text-foreground font-medium text-[15px] hover:bg-accent transition-colors"
                  >
                    {t("signup.back")}
                  </button>
                  <button className="flex-1 h-12 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors">
                    {t("signup.create")}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest">{t("signup.or")}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="h-12 flex items-center justify-center gap-2 border border-border text-foreground text-[13px] font-medium hover:bg-accent transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </button>
                  <button className="h-12 flex items-center justify-center gap-2 border border-border text-foreground text-[13px] font-medium hover:bg-accent transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                    Google
                  </button>
                </div>

                <p className="text-center text-[14px] text-muted-foreground mt-10">
                  {t("signup.has_account")}{" "}
                  <Link to="/login" className="text-foreground font-medium hover:underline">
                    {t("signup.signin_link")}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-2 h-10 flex items-center">
            <p className="text-[11px] text-muted-foreground/50 font-mono">© 2026 DevHustlers</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Signup;
