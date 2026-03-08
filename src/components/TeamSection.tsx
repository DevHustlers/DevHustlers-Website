import ScrollReveal from "@/components/ScrollReveal";

const team = [
  { name: "Alex Rivera", role: "Founder & CEO", bio: "Ex-Google engineer. Building communities since 2018.", gradient: "from-violet-500/20 to-blue-500/20" },
  { name: "Priya Sharma", role: "Head of Community", bio: "Previously led developer relations at Stripe.", gradient: "from-amber-500/20 to-rose-500/20" },
  { name: "James Wu", role: "CTO", bio: "Open source contributor. Rust and TypeScript enthusiast.", gradient: "from-emerald-500/20 to-cyan-500/20" },
  { name: "Elena Petrova", role: "Head of Events", bio: "Organized 200+ hackathons across 30 countries.", gradient: "from-pink-500/20 to-purple-500/20" },
];

const TeamSection = () => {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            Our team
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            The people{" "}
            <span className="font-serif italic text-muted-foreground font-normal">behind DevHustle</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((member, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="group p-6 rounded-2xl border border-border hover:border-foreground/10 hover:bg-accent/30 transition-all duration-300 relative overflow-hidden">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-sm font-bold text-foreground">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-[15px]">{member.name}</h3>
                  <p className="text-[12px] text-muted-foreground mb-2 font-medium">{member.role}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
