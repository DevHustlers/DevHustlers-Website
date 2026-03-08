import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const links = [
    { label: t("nav.features"), href: "/#features" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.events"), href: "/events" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  return (
    <footer className="py-10 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div>
            <div className="mb-3"><Logo size="md" /></div>
            <p className="text-[15px] text-muted-foreground max-w-xs leading-relaxed">{t("footer.desc")}</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
            {links.map((link) => (
              <Link key={link.href} to={link.href} className="text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-muted-foreground">{t("footer.copyright")}</p>
          <div className="flex gap-6 text-[13px] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
