import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "Features", href: "/#features" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return location.pathname === "/" && location.hash === href.slice(1);
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_3px_0_hsl(var(--foreground)/0.04)]"
            : "bg-background/60 backdrop-blur-xl border-b border-transparent"
        )}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-[13px] transition-colors duration-200",
                  isActive(link.href)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors ml-1">
              Join Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute top-14 left-0 right-0 bg-background border-b border-border shadow-lg animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-[15px] transition-colors",
                    isActive(link.href)
                      ? "text-foreground font-medium bg-accent/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 px-3 sm:hidden">
                <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium">
                  Join Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
