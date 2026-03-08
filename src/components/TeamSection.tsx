import ScrollReveal from "@/components/ScrollReveal";

const team = [
  { name: "Hamsa", role: "Founder & CEO", bio: "Software Engineer. Visionary builder leading DevHustlers from idea to impact." },
  { name: "Alaa Elsamouly", role: "Co-Founder", bio: "Software Engineer. Architecting the platform and driving technical excellence." },
  { name: "Omar", role: "CTO", bio: "Engineering leader. Shaping the infrastructure and scaling the community's backbone." },
];

const TeamSection = () => {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left — Text */}
          <div className="lg:w-2/5 shrink-0">
            <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
              Our team
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
              The people{" "}
              <span className="font-serif italic text-muted-foreground font-normal">behind DevHustlers</span>
            </h2>
            <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed">
              A small, focused crew of engineers and builders who believe developer communities should be built by developers. We ship fast, listen closely, and care deeply about the people in this space.
            </p>
          </div>

          {/* Right — Cards */}
          <div className="lg:w-3/5">
            {/* Top row: Hamsa centered */}
            <div className="flex justify-center mb-px">
              <ScrollReveal delay={0}>
                <div className="group p-6 bg-background border border-border hover:bg-accent/30 transition-all duration-300 w-64">
                  <div className="w-11 h-11 bg-accent flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors duration-300">
                    <span className="text-sm font-bold text-muted-foreground group-hover:text-background transition-colors">
                      H
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-[15px]">{team[0].name}</h3>
                  <p className="text-[12px] text-muted-foreground mb-2 font-medium">{team[0].role}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{team[0].bio}</p>
                </div>
              </ScrollReveal>
            </div>

            {/* Bottom row: Alaa + Omar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
              {team.slice(1).map((member, i) => (
                <ScrollReveal key={i} delay={(i + 1) * 80}>
                  <div className="group p-6 bg-background hover:bg-accent/30 transition-all duration-300">
                    <div className="w-11 h-11 bg-accent flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors duration-300">
                      <span className="text-sm font-bold text-muted-foreground group-hover:text-background transition-colors">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-[15px]">{member.name}</h3>
                    <p className="text-[12px] text-muted-foreground mb-2 font-medium">{member.role}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{member.bio}</p>
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
