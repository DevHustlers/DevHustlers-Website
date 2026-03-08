import ScrollReveal from "@/components/ScrollReveal";

const team = [
  { name: "Hamsa", role: "Founder & CEO", bio: "Software Engineer. Visionary builder leading DevHustlers from idea to impact." },
  { name: "Alaa Elsamouly", role: "Co-Founder", bio: "Software Engineer. Architecting the platform and driving technical excellence." },
  { name: "Omar", role: "CTO", bio: "Engineering leader. Shaping the infrastructure and scaling the community's backbone." },
];

const TeamSection = () => {
  return (
    <section>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border-x border-border">
          {/* Left — Text block spanning full height */}
          <div className="bg-background p-8 sm:p-10 flex flex-col justify-center">
            <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
              Our team
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-5">
              The people{" "}
              <span className="font-serif italic text-muted-foreground font-normal">behind DevHustlers</span>
            </h2>
            <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed mb-6">
              A small, focused crew of engineers and builders who believe developer communities should be built by developers. We ship fast, listen closely, and care deeply about the people in this space.
            </p>
            <div className="flex items-center gap-6 text-muted-foreground/40">
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-[11px] uppercase tracking-widest font-mono">Founders</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">2+</p>
                <p className="text-[11px] uppercase tracking-widest font-mono">Years building</p>
              </div>
            </div>
          </div>

          {/* Right — Bento grid */}
          <div className="grid grid-rows-[1fr_1fr] gap-px bg-border">
            {/* Top: Hamsa (full width of right column) */}
            <ScrollReveal delay={0}>
              <div className="group p-6 sm:p-8 bg-background hover:bg-accent/30 transition-all duration-300 h-full flex flex-col justify-center">
                <div className="w-11 h-11 bg-accent flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors duration-300">
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-background transition-colors">H</span>
                </div>
                <h3 className="font-semibold text-foreground text-[15px]">{team[0].name}</h3>
                <p className="text-[12px] text-muted-foreground mb-2 font-medium">{team[0].role}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{team[0].bio}</p>
              </div>
            </ScrollReveal>

            {/* Bottom: Alaa + Omar side by side */}
            <div className="grid grid-cols-2 gap-px bg-border">
              {team.slice(1).map((member, i) => (
                <ScrollReveal key={i} delay={(i + 1) * 80}>
                  <div className="group p-5 sm:p-6 bg-background hover:bg-accent/30 transition-all duration-300 h-full flex flex-col justify-center">
                    <div className="w-11 h-11 bg-accent flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors duration-300">
                      <span className="text-sm font-bold text-muted-foreground group-hover:text-background transition-colors">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
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
