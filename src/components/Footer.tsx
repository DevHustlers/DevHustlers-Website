import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const links = [
  { label: "Features", href: "/#features" },
  { label: "Community", href: "/#community" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div>
            <div className="mb-3">
              <Logo size="md" />
            </div>
            <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
              A modern community for developers who want to collaborate, learn, and ship.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-muted-foreground">© 2026 DevHustlers. All rights reserved.</p>
          <div className="flex gap-6 text-[12px] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
