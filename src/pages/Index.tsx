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

const rotatingWords = ["build & ship", "learn & grow", "code & create", "hack & deploy"];

const Index = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageLayout>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-40 px-4 sm:px-6 relative">
        <div className="max-w-3xl mx-auto pb-20 sm:pb-32">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-border text-[13px] text-muted-foreground mb-8 font-mono">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              50,000+ developers and growing
            </div>
          </div>

          <h1
            className="text-[clamp(2.5rem,7vw,5.5rem)] font-bold text-foreground leading-[1.05] tracking-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.08s", opacity: 0 }}
          >
            Where developers{" "}
            <span className="font-serif italic text-muted-foreground font-normal">come together</span>
            <br className="hidden sm:block" />
            {" "}to{" "}
            <span className="relative inline-block">
              {/* Fixed curved underline */}
              <svg
                className="absolute -bottom-1 left-0 w-full"
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
              {/* Sliding text */}
              <span className="inline-block h-[1.15em] overflow-hidden align-bottom">
                <span
                  key={wordIndex}
                  className="block animate-slide-up"
                >
                  {rotatingWords[wordIndex]}
                </span>
              </span>
            </span>
          </h1>

          <p
            className="text-[15px] sm:text-base md:text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.16s", opacity: 0 }}
          >
            A community for programmers who want to collaborate, learn, and ship products that matter. No gatekeeping, just building.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 animate-fade-up"
            style={{ animationDelay: "0.24s", opacity: 0 }}
          >
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-[15px]">
              Join the Community
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-border text-foreground font-medium hover:bg-accent transition-colors text-[15px]">
              Explore Projects
            </button>
          </div>
        </div>

        {/* Mini feature row — full width, touching dividers */}
        <div className="max-w-5xl mx-auto">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border-t border-border animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            {[
              { icon: Terminal, label: "Ship faster", sub: "Weekly hackathons" },
              { icon: GitBranch, label: "Open source", sub: "2.4K+ projects" },
              { icon: Sparkles, label: "Level up", sub: "Expert mentorship" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-5 sm:p-6 bg-background">
                <item.icon className="w-5 h-5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[14px] font-semibold text-foreground">{item.label}</p>
                  <p className="text-[12px] text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Social proof */}
      <ScrollReveal>
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-[12px] sm:text-[13px] text-muted-foreground/60 uppercase tracking-widest mb-6 sm:mb-8 font-medium">
              Developers from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3 text-muted-foreground/25">
              {["Google", "Meta", "Stripe", "Vercel", "GitHub", "Shopify"].map((name) => (
                <span key={name} className="text-base sm:text-lg font-semibold tracking-tight select-none">
                  {name}
                </span>
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
