import { ArrowRight, Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const links = [
  { label: "Features", href: "#features" },
  { label: "Community", href: "#community" },
  { label: "Events", href: "#events" },
  { label: "Blog", href: "#blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background font-bold text-[11px] leading-none">D</span>
          </div>
          <span className="font-semibold text-foreground tracking-tight">DevHive</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-[13px]">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
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
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-foreground hover:bg-accent transition-colors text-[15px]"
                  >
                    {link.label}
                  </a>
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
