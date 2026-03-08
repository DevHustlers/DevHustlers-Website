const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Engineer at Vercel",
    quote: "DevHustlers completely changed how I approach side projects. The community feedback loop is incredible.",
  },
  {
    name: "Marcus Johnson",
    role: "Full-Stack Developer",
    quote: "I shipped my first open source project thanks to the mentorship I got here. Can't recommend it enough.",
  },
  {
    name: "Aiko Tanaka",
    role: "Software Engineer at Stripe",
    quote: "The weekly hackathons push me to build things I'd never try alone. It's the best dev community I've been part of.",
  },
  {
    name: "David Park",
    role: "Indie Developer",
    quote: "Found my co-founder through DevHustlers. We launched our startup six months later.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14 px-4 sm:px-6">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            What people say
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Loved by{" "}
            <span className="font-serif italic text-muted-foreground font-normal">developers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 bg-background hover:bg-accent/30 transition-colors duration-300"
            >
              <p className="text-foreground text-[15px] leading-relaxed mb-5">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent flex items-center justify-center">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-foreground">{t.name}</p>
                  <p className="text-[12px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
