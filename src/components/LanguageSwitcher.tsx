import { useLanguage } from "@/i18n/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "ar" : "en")}
      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Switch language"
    >
      <span className="text-[12px] font-mono font-medium flex items-center gap-1">
        <Globe className="w-3.5 h-3.5" />
        {locale === "en" ? "AR" : "EN"}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
