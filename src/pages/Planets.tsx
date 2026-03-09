import { ArrowRight, Code, Server, BarChart3, Brain, Shield, Smartphone, Cpu, Palette, Wifi } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import OrbitsBackground from "@/components/OrbitsBackground";
import { useLanguage } from "@/i18n/LanguageContext";

const PLANETS = [
  { slug: "frontend", name: "Frontend", icon: Code, members: 342, challenges: 28, color: "text-blue-500", borderColor: "border-blue-500/20", description: "Master the art of building beautiful, responsive user interfaces with modern frameworks and tools." },
  { slug: "backend", name: "Backend", icon: Server, members: 278, challenges: 24, color: "text-green-500", borderColor: "border-green-500/20", description: "Build robust server-side systems, APIs, and microservices that power modern applications." },
  { slug: "data-science", name: "Data Science", icon: BarChart3, members: 195, challenges: 18, color: "text-purple-500", borderColor: "border-purple-500/20", description: "Extract insights from data through statistical analysis, visualization, and predictive modeling." },
  { slug: "ai-ml", name: "AI / ML", icon: Brain, members: 231, challenges: 22, color: "text-pink-500", borderColor: "border-pink-500/20", description: "Explore machine learning, deep learning, and artificial intelligence applications." },
  { slug: "cybersecurity", name: "Cybersecurity", icon: Shield, members: 167, challenges: 20, color: "text-red-500", borderColor: "border-red-500/20", description: "Defend systems, discover vulnerabilities, and master the art of ethical hacking." },
  { slug: "mobile-dev", name: "Mobile Dev", icon: Smartphone, members: 204, challenges: 16, color: "text-cyan-500", borderColor: "border-cyan-500/20", description: "Create native and cross-platform mobile applications for iOS and Android." },
  { slug: "operating-systems", name: "Operating Systems", icon: Cpu, members: 89, challenges: 12, color: "text-orange-500", borderColor: "border-orange-500/20", description: "Dive deep into system programming, kernel development, and OS architecture." },
  { slug: "ui-ux", name: "UI/UX", icon: Palette, members: 256, challenges: 14, color: "text-violet-500", borderColor: "border-violet-500/20", description: "Design intuitive interfaces and user experiences that delight and engage." },
  { slug: "network", name: "Network", icon: Wifi, members: 112, challenges: 15, color: "text-teal-500", borderColor: "border-teal-500/20", description: "Master networking protocols, infrastructure, and distributed systems." },
];

const Planets = () => {
  const { t, dir } = useLanguage();

  return (
    <PageLayout>
      <Navbar />

      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-4">
                {t("planets.label")}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
                {t("planets.title")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg">
                {t("planets.desc")}
              </p>
            </div>
            <OrbitsBackground
              className="w-40 h-40 sm:w-52 sm:h-52 shrink-0 hidden sm:block"
              count={5}
              color="#6b7280"
              speed={0.5}
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      <ScrollReveal>
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
              {PLANETS.map((planet) => (
                <Link
                  key={planet.slug}
                  to={`/planets/${planet.slug}`}
                  className="bg-background p-8 hover:bg-accent/30 transition-all group relative block"
                >
                  <div className={`w-14 h-14 flex items-center justify-center border ${planet.borderColor} mb-6`}>
                    <planet.icon className={`w-7 h-7 ${planet.color}`} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {planet.name}
                  </h3>

                  <p className="text-muted-foreground text-[14px] leading-relaxed mb-6">
                    {planet.description}
                  </p>

                  <div className="flex items-center gap-6 mb-6">
                    <div>
                      <p className="font-mono font-bold text-foreground text-[18px]">{planet.members}</p>
                      <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">{t("planets.members")}</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <p className="font-mono font-bold text-foreground text-[18px]">{planet.challenges}</p>
                      <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">{t("planets.challenges")}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {t("planets.explore")} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Planets;
