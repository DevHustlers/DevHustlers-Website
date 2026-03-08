import { useLanguage } from "@/i18n/LanguageContext";

const StatsSection = () => {
  const { t } = useLanguage();

  const stats = [
    { value: t("stats.1.value"), label: t("stats.1.label") },
    { value: t("stats.2.value"), label: t("stats.2.label") },
    { value: t("stats.3.value"), label: t("stats.3.label") },
    { value: t("stats.4.value"), label: t("stats.4.label") },
  ];

  return (
    <section id="community" className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-[15px] text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
