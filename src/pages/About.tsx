import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">About us</p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-6">
            Building the{" "}
            <span className="font-serif italic text-muted-foreground font-normal">future of</span>{" "}
            developer communities
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
            DevHive started in 2022 as a small Discord server with 50 developers. Today, we're a global
            community of 50,000+ programmers collaborating across 120 countries. Our mission is simple:
            make it easier for developers to find their people, build together, and ship real products.
          </p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            We believe the best software comes from communities that value craft, openness, and genuine
            collaboration. No gatekeeping, no elitism — just developers helping developers.
          </p>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: "2022", label: "Founded" },
            { value: "50K+", label: "Members" },
            { value: "120", label: "Countries" },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl border border-border text-center">
              <div className="text-2xl font-bold text-foreground mb-1">{s.value}</div>
              <div className="text-[13px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <TeamSection />
      <Footer />
    </div>
  );
};

export default About;
