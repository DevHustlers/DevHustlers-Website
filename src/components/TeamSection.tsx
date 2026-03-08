import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const team = [
  { name: "Hamsa", role: "Founder & CEO", bio: "Software Engineer. Visionary builder leading DevHustlers from idea to impact." },
  { name: "Alaa Elsamouly", role: "Co-Founder", bio: "Software Engineer. Architecting the platform and driving technical excellence." },
  { name: "Omar", role: "CTO", bio: "Engineering leader. Shaping the infrastructure and scaling the community's backbone." },
];

const TeamSection = () => {
  const { t } = useLanguage();

  return (
    <section>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border-t border-border">
          <div className="bg-background p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <ScrollReveal>
              <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">{t("team.label")}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-5">
                {t("team.title.1")}{" "}
                <span className="font-serif text-muted-foreground font-normal">{t("team.title.2")}</span>
              </h2>
              <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed mb-6">{t("team.desc")}</p>
              <div className="flex items-center gap-6 text-muted-foreground/40">
                <div>
                  <p className="text-2xl font-bold text-foreground">{t("team.stat.1.value")}</p>
                  <p className="text-[11px] uppercase tracking-widest font-mono">{t("team.stat.1.label")}</p>
                </div>
                <div className="h-8 bg-border" style={{ width: 'var(--grid-line, 1.5px)' }} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{t("team.stat.2.value")}</p>
                  <p className="text-[11px] uppercase tracking-widest font-mono">{t("team.stat.2.label")}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="grid grid-rows-[1fr_1fr] gap-px bg-border">
            <ScrollReveal delay={100}>
              <div className="group p-6 sm:p-8 bg-background hover:bg-accent/30 transition-colors duration-300 h-full flex flex-col justify-center">
                <div className="w-11 h-11 bg-accent flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors duration-300">
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-background transition-colors">H</span>
                </div>
                <h3 className="font-semibold text-foreground text-[15px]">{team[0].name}</h3>
                <p className="text-[12px] text-muted-foreground mb-2 font-medium">{team[0].role}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{team[0].bio}</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-px bg-border">
              {team.slice(1).map((member, i) => (
                <ScrollReveal key={i} delay={200 + i * 100}>
                  <div className="group p-5 sm:p-6 bg-background hover:bg-accent/30 transition-colors duration-300 h-full flex flex-col justify-center">
                    <div className="w-11 h-11 bg-accent flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors duration-300">
                      <span className="text-sm font-bold text-muted-foreground group-hover:text-background transition-colors">{member.name.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                    <h3 className="font-semibold text-foreground text-[15px]">{member.name}</h3>
                    <p className="text-[12px] text-muted-foreground mb-2 font-medium">{member.role}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed hidden sm:block">{member.bio}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
