import { Code2, Users, Zap, Globe, MessageSquare, Rocket } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "Open Source First",
    desc: "Collaborate on projects that matter. Every contribution counts.",
  },
  {
    icon: Users,
    title: "Global Community",
    desc: "Connect with 50K+ developers from 120 countries worldwide.",
  },
  {
    icon: Zap,
    title: "Weekly Hackathons",
    desc: "Build, ship, and learn together with structured weekly challenges.",
  },
  {
    icon: Globe,
    title: "Remote Friendly",
    desc: "Async-first culture. Collaborate across timezones seamlessly.",
  },
  {
    icon: MessageSquare,
    title: "Mentorship",
    desc: "Get guidance from senior engineers at top tech companies.",
  },
  {
    icon: Rocket,
    title: "Launch Support",
    desc: "From idea to launch — get feedback, beta testers, and support.",
  },
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            Everything you need
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Built for developers,{" "}
            <span className="font-serif italic text-muted-foreground font-normal">by developers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-background p-7 hover:bg-accent/40 transition-colors duration-300"
            >
              <feature.icon className="w-5 h-5 text-foreground mb-4" strokeWidth={1.5} />
              <h3 className="font-semibold text-foreground text-[15px] mb-1.5">{feature.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
