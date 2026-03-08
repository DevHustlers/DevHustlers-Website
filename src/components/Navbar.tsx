import { ArrowRight, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { label: "Features", href: "/#features" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-8 text-[13px]">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-background text-[13px] font-medium hover:bg-foreground/90 transition-colors">
            Join Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex flex-col gap-1 mt-8">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors text-[15px]"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 px-3">
                  <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-foreground text-background text-sm font-medium">
                    Join Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
