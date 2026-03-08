const team = [
  { name: "Alex Rivera", role: "Founder & CEO", bio: "Ex-Google engineer. Building communities since 2018." },
  { name: "Priya Sharma", role: "Head of Community", bio: "Previously led developer relations at Stripe." },
  { name: "James Wu", role: "CTO", bio: "Open source contributor. Rust and TypeScript enthusiast." },
  { name: "Elena Petrova", role: "Head of Events", bio: "Organized 200+ hackathons across 30 countries." },
];

const TeamSection = () => {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            Our team
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            The people{" "}
            <span className="font-serif italic text-muted-foreground font-normal">behind DevHive</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((member, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border hover:bg-accent/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-4">
                <span className="text-sm font-semibold text-muted-foreground">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-[15px]">{member.name}</h3>
              <p className="text-[12px] text-muted-foreground mb-2">{member.role}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
