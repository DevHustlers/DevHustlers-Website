import Navbar from "@/components/Navbar";
import FeaturesGrid from "@/components/FeaturesGrid";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import TeamSection from "@/components/TeamSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Terminal, GitBranch, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-28 px-6 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-accent/50 text-[13px] text-muted-foreground mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              50,000+ developers and growing
            </div>
          </div>

          <h1
            className="text-[clamp(2.5rem,6vw,5rem)] font-bold text-foreground leading-[1.05] tracking-tight mb-6 animate-fade-up"
            style={{ animationDelay: "0.08s", opacity: 0 }}
          >
            Where developers{" "}
            <span className="font-serif italic text-muted-foreground font-normal">come together</span>
            <br className="hidden sm:block" />
            {" "}to build & ship
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.16s", opacity: 0 }}
          >
            A community for programmers who want to collaborate, learn, and ship products that matter. No gatekeeping, just building.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up"
            style={{ animationDelay: "0.24s", opacity: 0 }}
          >
            <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all text-[15px] hover:scale-[1.02] active:scale-[0.98]">
              Join the Community
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-all text-[15px] hover:scale-[1.02] active:scale-[0.98]">
              Explore Projects
            </button>
          </div>

          {/* Hero visual cards */}
          <div
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            {[
              { icon: Terminal, label: "Ship faster", sub: "Weekly hackathons" },
              { icon: GitBranch, label: "Open source", sub: "2.4K+ projects" },
              { icon: Sparkles, label: "Level up", sub: "Expert mentorship" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-accent/30 backdrop-blur-sm text-left">
                <div className="w-9 h-9 rounded-lg bg-foreground/5 dark:bg-foreground/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <ScrollReveal>
        <section className="pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-[13px] text-muted-foreground/60 uppercase tracking-widest mb-8 font-medium">
              Developers from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-muted-foreground/30">
              {["Google", "Meta", "Stripe", "Vercel", "GitHub", "Shopify"].map((name) => (
                <span key={name} className="text-lg font-semibold tracking-tight select-none">
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
