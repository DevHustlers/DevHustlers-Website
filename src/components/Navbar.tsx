import { ArrowRight, Menu, X, LogOut, Settings, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
  };

  const links = [
    { label: t("nav.features"), href: "/#features" },
    { label: t("nav.challenges"), href: "/challenges" },
    { label: t("nav.events"), href: "/events" },
    { label: t("nav.planets"), href: "/planets" },
    { label: t("nav.leaderboard"), href: "/leaderboard" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.about"), href: "/about" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return location.pathname === "/" && location.hash === href.slice(1);
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-border",
          scrolled ? "bg-background/90 backdrop-blur-xl" : "bg-background/60 backdrop-blur-xl"
        )}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-2 h-14 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3 py-1.5 text-[13px] transition-colors duration-150",
                  isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 hover:bg-accent transition-colors ms-1 border border-border outline-none">
                  <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold">
                    {user.user_metadata?.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-[13px] font-medium max-w-[100px] truncate">
                    {user.user_metadata?.username || user.email?.split('@')[0]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-none border-border bg-background shadow-none p-2 space-y-1">
                  <DropdownMenuLabel className="font-mono uppercase tracking-wider text-[11px] text-muted-foreground">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem asChild className="cursor-pointer rounded-none focus:bg-accent text-[13px] font-medium transition-colors">
                    <Link to="/profile" className="w-full flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {(user.email === "o.ahmed3688@gmail.com" || user.user_metadata?.role === "admin") && (
                    <DropdownMenuItem asChild className="cursor-pointer rounded-none focus:bg-accent text-[13px] font-medium transition-colors">
                      <Link to="/dashboard" className="w-full flex items-center text-emerald-600 dark:text-emerald-500">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="cursor-pointer rounded-none focus:bg-accent text-[13px] font-medium transition-colors">
                    <Link to="/settings" className="w-full flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-none text-red-600 focus:text-red-600 focus:bg-red-500/10 text-[13px] font-medium transition-colors">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors ms-1">
                {t("nav.join")}
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 -me-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-14 left-0 right-0 bottom-0 bg-background border-t border-border animate-fade-in overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
              <div className="space-y-1">
                {links.map((link, i) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-4 text-[22px] font-medium transition-colors border-b border-border",
                      isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-10">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-muted/50 border border-border text-[15px] font-medium mb-2">
                      <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[11px] font-bold">
                        {user.user_metadata?.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      {user.user_metadata?.username || user.email?.split('@')[0]}
                    </div>
                    <Link to="/profile" onClick={() => setOpen(false)} className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground text-[15px] font-medium hover:bg-accent transition-colors">
                      <UserIcon className="w-4 h-4" /> Profile
                    </Link>
                    {(user.email === "o.ahmed3688@gmail.com" || user.user_metadata?.role === "admin") && (
                      <Link to="/dashboard" onClick={() => setOpen(false)} className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-emerald-500/30 text-emerald-600 dark:text-emerald-500 bg-emerald-500/5 text-[15px] font-medium hover:bg-emerald-500/10 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                    <Link to="/settings" onClick={() => setOpen(false)} className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground text-[15px] font-medium hover:bg-accent transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 text-red-600 border border-red-500/20 text-[15px] font-medium mt-4">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background text-[15px] font-medium">
                    {t("nav.join")}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-[11px] text-muted-foreground/50 uppercase tracking-widest font-mono">© 2026 DevHustlers</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
