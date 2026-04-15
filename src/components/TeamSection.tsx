import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import hamsaImg from "@/assets/team-hamsa.png";
import omarImg from "@/assets/omar.jpg";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaXTwitter,
} from "react-icons/fa6";

const team = [
  {
    name: "Hamsa Mansour",
    role: "Founder & CEO",
    bio: "Frontend Developer. Visionary builder leading DevHustlers from idea to impact.",
    image: hamsaImg,
    socials: {
      github: "#",
      linkedin:
        "https://www.linkedin.com/in/hamsa-mansour?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      x: "https://x.com/hamsamansour11?s=21&t=R1hLlWjZUJM8jzdAS0hTnA",
      instagram: "#",
      facebook: "https://www.facebook.com/share/1CSABrXx7A/?mibextid=wwXIfr",
    },
  },

  {
    name: "Omar Ahmed Abdelwareth",
    role: "Co-Founder",
    bio: "Full-Stack & Security | Building the DevHustlers ecosystem",
    image: omarImg,
    socials: {
      github: "https://github.com/omara688",
      linkedin: "https://www.linkedin.com/in/omar-ahmed-abdelwareth-ab2777257/",
      x: "https://x.com/Omar_Ahmed2711",
      instagram: "https://www.instagram.com/omar_ahmed_abdelwareth27",
      facebook: "https://www.facebook.com/share/1HChszEjDw/",
    },
  },
];

const TeamSection = () => {
  const { t } = useLanguage();

  return (
    <section>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
          <div className="bg-background p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <ScrollReveal>
              <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
                {t("team.label")}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-5">
                {t("team.title.1")}{" "}
                <span className="font-serif text-muted-foreground font-normal">
                  {t("team.title.2")}
                </span>
              </h2>
              <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed mb-6">
                {t("team.desc")}
              </p>
              <div className="flex items-center gap-6 text-muted-foreground/40">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {t("team.stat.1.value")}
                  </p>
                  <p className="text-[11px] uppercase tracking-widest font-mono">
                    {t("team.stat.1.label")}
                  </p>
                </div>
                <div
                  className="h-8 bg-border"
                  style={{ width: "var(--grid-line, 2px)" }}
                />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {t("team.stat.2.value")}
                  </p>
                  <p className="text-[11px] uppercase tracking-widest font-mono">
                    {t("team.stat.2.label")}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="grid grid-rows-2 gap-px bg-border">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={100 + i * 100}>
                <div className="group p-6 sm:p-8 bg-background hover:bg-accent/30 transition-colors duration-300 h-full flex flex-col justify-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-1/2 h-px bg-border my-4" />
                  <h3 className="font-semibold text-foreground text-[15px]">
                    {member.name}
                  </h3>
                  <p className="text-[12px] text-muted-foreground mb-1 font-medium italic">
                    {member.role}
                  </p>
                  <p className="text-[12px] text-muted-foreground/80 leading-relaxed mb-4 line-clamp-2">
                    {member.bio}
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-110"
                      title="GitHub"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#0077b5] transition-all duration-300 transform hover:scale-110"
                      title="LinkedIn"
                    >
                      <FaLinkedin className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.socials.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-all duration-300 transform hover:scale-110"
                      title="X (Formerly Twitter)"
                    >
                      <FaXTwitter className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#e4405f] transition-all duration-300 transform hover:scale-110"
                      title="Instagram"
                    >
                      <FaInstagram className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={member.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#1877f2] transition-all duration-300 transform hover:scale-110"
                      title="Facebook"
                    >
                      <FaFacebook className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
