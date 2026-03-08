import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { useLanguage } from "@/i18n/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <Navbar />
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">{t("about.label")}</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-6">
            {t("about.title.1")}{" "}
            <span className="font-serif italic text-muted-foreground font-normal">{t("about.title.2")}</span>{" "}
            {t("about.title.3")}
          </h1>
          <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg leading-relaxed mb-6">
            {t("about.p1")}
          </p>
          <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg leading-relaxed">
            {t("about.p2")}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
          {[
            { value: t("about.stat.1.value"), label: t("about.stat.1.label") },
            { value: t("about.stat.2.value"), label: t("about.stat.2.label") },
            { value: t("about.stat.3.value"), label: t("about.stat.3.label") },
          ].map((s, i) => (
            <div key={i} className="p-6 bg-background text-center">
              <div className="text-2xl font-bold text-foreground mb-1">{s.value}</div>
              <div className="text-[13px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <SectionDivider />
      <TeamSection />
      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default About;
