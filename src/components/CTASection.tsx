import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
        <div className="border border-border bg-accent/30 px-6 sm:px-8 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            {t("cta.title.1")}{" "}
            <span className="font-serif text-muted-foreground font-normal">{t("cta.title.2")}</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-[17px]">{t("cta.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-[15px]">
              {t("cta.btn.1")}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-border text-foreground font-medium hover:bg-accent transition-colors text-[15px]">
              {t("cta.btn.2")}
            </button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{t("cta.note")}</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
