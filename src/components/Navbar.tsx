import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const links = [
    { label: t("nav.features"), href: "/#features" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.events"), href: "/events" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
            <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors ms-1">
              {t("nav.join")}
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
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
                <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background text-[15px] font-medium">
                  {t("nav.join")}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
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
