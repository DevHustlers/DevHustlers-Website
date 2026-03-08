import ScrollReveal from "@/components/ScrollReveal";

const team = [
  { name: "Alex Rivera", role: "Founder & CEO", bio: "Ex-Google engineer. Building communities since 2018." },
  { name: "Priya Sharma", role: "Head of Community", bio: "Previously led developer relations at Stripe." },
  { name: "James Wu", role: "CTO", bio: "Open source contributor. Rust and TypeScript enthusiast." },
  { name: "Elena Petrova", role: "Head of Events", bio: "Organized 200+ hackathons across 30 countries." },
];

const TeamSection = () => {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14 px-4 sm:px-6">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            Our team
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            The people{" "}
            <span className="font-serif italic text-muted-foreground font-normal">behind DevHustlers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
          {team.map((member, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="group p-6 bg-background hover:bg-accent/30 transition-all duration-300">
                <div className="w-11 h-11 bg-accent flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
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
    </section>
  );
};

export default TeamSection;
