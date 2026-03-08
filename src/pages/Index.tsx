import Navbar from "@/components/Navbar";
import FeaturesGrid from "@/components/FeaturesGrid";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import TeamSection from "@/components/TeamSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border text-[13px] text-muted-foreground mb-8">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              50,000+ developers and growing
            </div>
          </div>

          <h1
            className="text-[clamp(2rem,5.5vw,4.25rem)] font-bold text-foreground leading-[1.08] tracking-tight mb-5 animate-fade-up"
            style={{ animationDelay: "0.08s", opacity: 0 }}
          >
            Where developers{" "}
            <span className="font-serif italic text-muted-foreground font-normal">come together</span>
            {" "}to build
          </h1>

          <p
            className="text-[15px] sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.16s", opacity: 0 }}
          >
            A community for programmers who want to collaborate, learn, and ship products that matter.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up"
            style={{ animationDelay: "0.24s", opacity: 0 }}
          >
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-[15px]">
              Join the Community
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-colors text-[15px]">
              Explore Projects
            </button>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <ScrollReveal>
        <section className="pb-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-[12px] sm:text-[13px] text-muted-foreground/60 uppercase tracking-widest mb-6 sm:mb-8 font-medium">
              Developers from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3 text-muted-foreground/30">
              {["Google", "Meta", "Stripe", "Vercel", "GitHub", "Shopify"].map((name) => (
                <span key={name} className="text-base sm:text-lg font-semibold tracking-tight select-none">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <FeaturesGrid />
      </ScrollReveal>
      <ScrollReveal>
        <StatsSection />
      </ScrollReveal>
      <ScrollReveal>
        <TestimonialsSection />
      </ScrollReveal>
      <ScrollReveal>
        <TeamSection />
      </ScrollReveal>
      <ScrollReveal>
        <FAQSection />
      </ScrollReveal>
      <ScrollReveal>
        <CTASection />
      </ScrollReveal>
      <Footer />
    </div>
  );
};

export default Index;
