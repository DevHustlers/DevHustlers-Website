import { Code2, Users, Zap, Globe, MessageSquare, Rocket } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const FeaturesGrid = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Code2, title: t("features.1.title"), desc: t("features.1.desc") },
    { icon: Users, title: t("features.2.title"), desc: t("features.2.desc") },
    { icon: Zap, title: t("features.3.title"), desc: t("features.3.desc") },
    { icon: Globe, title: t("features.4.title"), desc: t("features.4.desc") },
    { icon: MessageSquare, title: t("features.5.title"), desc: t("features.5.desc") },
    { icon: Rocket, title: t("features.6.title"), desc: t("features.6.desc") },
  ];

  return (
    <section id="features">
      <div className="max-w-5xl mx-auto">
        <div className="px-6 sm:px-10 pt-20 sm:pt-24 pb-14">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            {t("features.label")}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {t("features.title.1")}{" "}
            <span className="font-serif text-muted-foreground font-normal">{t("features.title.2")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border-t border-border">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-background p-6 sm:p-7 hover:bg-accent/40 transition-colors duration-300"
            >
              <feature.icon className="w-5 h-5 text-foreground mb-4" strokeWidth={1.5} />
              <h3 className="font-semibold text-foreground text-[15px] mb-1.5">{feature.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
