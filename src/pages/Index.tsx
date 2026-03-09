import Navbar from "@/components/Navbar";
import FeaturesGrid from "@/components/FeaturesGrid";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import TeamSection from "@/components/TeamSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Terminal, GitBranch, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { techStack } from "@/components/TechIcons";

const Index = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const { t } = useLanguage();

  const rotatingWords = [t("hero.word.1"), t("hero.word.2"), t("hero.word.3"), t("hero.word.4")];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  return (
    <PageLayout>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-40 relative">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
          <div className="max-w-3xl pb-20 sm:pb-32 px-1 sm:px-4 lg:px-6">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-border text-[15px] text-muted-foreground mb-8 font-mono">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                {t("hero.badge")}
              </div>
            </div>

            <h1
              className="text-[clamp(2.25rem,6vw,4.5rem)] font-bold text-foreground leading-[1.05] tracking-tight mb-6 animate-fade-up"
              style={{ animationDelay: "0.08s", opacity: 0 }}
            >
              {t("hero.title.1")}{" "}
              <span className="font-serif text-muted-foreground font-normal">{t("hero.title.2")}</span>
              <br className="hidden sm:block" />
              {" "}{t("hero.title.3")}{" "}
              <span className="relative inline-block align-baseline">
                <svg
                  className="absolute -bottom-1 left-0 w-full z-20 pointer-events-none"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C30 3 60 2 100 5C140 8 170 4 198 6"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="opacity-30"
                  />
                </svg>
                <span className="inline-flex h-[1em] items-end overflow-hidden align-baseline leading-[1]">
                  <span key={wordIndex} className="inline-block animate-slide-up">
                    {rotatingWords[wordIndex]}
                  </span>
                </span>
              </span>
            </h1>

            <p
              className="text-[17px] sm:text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.16s", opacity: 0 }}
            >
              {t("hero.desc")}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: "0.24s", opacity: 0 }}
            >
              <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-[16px] w-full sm:w-auto">
                {t("hero.cta.join")}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-3 border border-border text-foreground font-medium hover:bg-accent transition-colors text-[16px] w-full sm:w-auto">
                {t("hero.cta.explore")}
              </button>
            </div>
          </div>

          {/* Mini feature row */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border-t border-border animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            {[
              { icon: Terminal, label: t("hero.mini.1.label"), sub: t("hero.mini.1.sub") },
              { icon: GitBranch, label: t("hero.mini.2.label"), sub: t("hero.mini.2.sub") },
              { icon: Sparkles, label: t("hero.mini.3.label"), sub: t("hero.mini.3.sub") },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5 sm:p-6 bg-background">
                <item.icon className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[16px] font-semibold text-foreground">{item.label}</p>
                  <p className="text-[14px] text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Social proof */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
            <p className="text-center text-[13px] sm:text-[14px] text-muted-foreground uppercase tracking-[0.25em] mb-10 font-mono">
              {t("social.from")}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-8 gap-x-4">
              {techStack.map(({ name, Icon, hoverColor }) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-2.5 cursor-default transition-colors duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('svg')!.style.color = hoverColor;
                    e.currentTarget.querySelector('span')!.style.color = hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('svg')!.style.color = '';
                    e.currentTarget.querySelector('span')!.style.color = '';
                  }}
                >
                  <Icon size={48} className="text-muted-foreground/40 transition-colors duration-300" />
                  <span className="text-[15px] sm:text-[17px] font-bold text-muted-foreground/40 tracking-tight select-none transition-colors duration-300">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />
      <ScrollReveal><FeaturesGrid /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><StatsSection /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><TestimonialsSection /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><TeamSection /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><FAQSection /></ScrollReveal>
      <SectionDivider />
      <ScrollReveal><CTASection /></ScrollReveal>
      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Index;
