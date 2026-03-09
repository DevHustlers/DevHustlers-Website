import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowRight } from "lucide-react";
import {
  SiWhatsapp,
  SiDiscord,
  SiX,
  SiFacebook,
} from "@icons-pack/react-simple-icons";

const COMMUNITIES = [
  { name: "WhatsApp", icon: SiWhatsapp, href: "#", members: "1.2K", color: "hover:text-[#25D366]", bg: "hover:bg-[#25D366]/10 hover:border-[#25D366]/30" },
  { name: "Discord", icon: SiDiscord, href: "#", members: "2.4K", color: "hover:text-[#5865F2]", bg: "hover:bg-[#5865F2]/10 hover:border-[#5865F2]/30" },
  { name: "X (Twitter)", icon: SiX, href: "#", members: "3.1K", color: "hover:text-foreground", bg: "hover:bg-foreground/5 hover:border-foreground/20" },
  { name: "Facebook", icon: SiFacebook, href: "#", members: "1.8K", color: "hover:text-[#1877F2]", bg: "hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30" },
];

const About = () => {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="text-[13px] font-mono text-muted-foreground mb-4 uppercase tracking-widest">{t("about.label")}</p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-6">
                {t("about.title.1")}{" "}
                <span className="font-serif text-muted-foreground font-normal">{t("about.title.2")}</span>{" "}
                {t("about.title.3")}
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg leading-relaxed mb-6">{t("about.p1")}</p>
              <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg leading-relaxed">{t("about.p2")}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
            {[
              { value: t("about.stat.1.value"), label: t("about.stat.1.label") },
              { value: t("about.stat.2.value"), label: t("about.stat.2.label") },
              { value: t("about.stat.3.value"), label: t("about.stat.3.label") },
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="p-6 bg-background text-center">
                  <div className="text-2xl font-bold text-foreground mb-1 font-mono">{s.value}</div>
                  <div className="text-[13px] text-muted-foreground">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Communities */}
      <ScrollReveal>
        <section className="py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
            <div className="max-w-2xl mb-10">
              <p className="text-[13px] font-mono text-muted-foreground mb-4 uppercase tracking-widest">Our Communities</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight mb-3">
                Join the{" "}
                <span className="font-serif text-muted-foreground font-normal">conversation</span>
              </h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Connect with fellow developers, get help, share your projects, and stay updated across all our community channels.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
              {COMMUNITIES.map((community, i) => (
                <ScrollReveal key={community.name} delay={i * 60}>
                  <a
                    href={community.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col items-center gap-4 p-8 bg-background text-center border border-transparent transition-all duration-300 ${community.bg}`}
                  >
                    <community.icon
                      size={36}
                      className={`text-muted-foreground/50 transition-colors duration-300 ${community.color}`}
                    />
                    <div>
                      <p className="text-[15px] font-bold text-foreground mb-0.5">{community.name}</p>
                      <p className="text-[12px] font-mono text-muted-foreground">{community.members} members</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      Join <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                    </span>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />
      <TeamSection />
      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default About;
