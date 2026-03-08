import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const SquareDivider = () => (
  <div className="col-span-1 md:col-span-2 overflow-hidden border-t border-b border-border">
    <div className="flex w-full h-6">
      {Array.from({ length: 80 }).map((_, i) => (
        <div key={i} className="shrink-0 w-6 h-6 border-r border-border" />
      ))}
    </div>
  </div>
);

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  return (
    <PageLayout>
      <Navbar />

      <section className="pt-28 sm:pt-36 pb-16 px-3 sm:px-6 lg:px-0">
        <div className="lg:max-w-5xl lg:mx-auto px-3 sm:px-4 lg:px-0">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="text-[12px] font-medium text-muted-foreground mb-4 uppercase tracking-[0.2em] font-mono">
                {t("contact.label")}
              </p>
              <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-bold text-foreground leading-[1.1] tracking-tight mb-4">
                {t("contact.title.1")}{" "}
                <span className="font-serif text-muted-foreground font-normal">{t("contact.title.2")}</span>
              </h1>
              <p className="text-muted-foreground text-[14px] sm:text-[15px] leading-relaxed max-w-lg">
                {t("contact.desc")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="px-3 sm:px-6 lg:px-0">
        <div className="lg:max-w-5xl lg:mx-auto border-t border-border">
          {submitted ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 bg-accent flex items-center justify-center mx-auto mb-4">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-foreground font-semibold mb-2">{t("contact.sent")}</p>
              <p className="text-[13px] text-muted-foreground max-w-xs mx-auto">{t("contact.sent.desc")}</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-border">
                  <label className="block text-[12px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">{t("contact.name")}</label>
                  <input type="text" required className="w-full px-4 py-3 border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/40 transition-colors" placeholder={t("contact.name.placeholder")} />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-foreground font-medium text-[13px] mb-2 uppercase tracking-wider">
                    <Mail className="w-4 h-4" /> {t("contact.email")}
                  </div>
                  <p className="text-[14px] text-muted-foreground">hello@devhustlers.community</p>
                </div>

                <SquareDivider />

                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-border">
                  <label className="block text-[12px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">{t("contact.email")}</label>
                  <input type="email" required className="w-full px-4 py-3 border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/40 transition-colors" placeholder={t("contact.email.placeholder")} />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-foreground font-medium text-[13px] mb-2 uppercase tracking-wider">
                    <MapPin className="w-4 h-4" /> {t("contact.location")}
                  </div>
                  <p className="text-[14px] text-muted-foreground">{t("contact.location.value")}</p>
                </div>

                <SquareDivider />

                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-border">
                  <label className="block text-[12px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">{t("contact.message")}</label>
                  <textarea required rows={5} className="w-full px-4 py-3 border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/40 resize-none transition-colors" placeholder={t("contact.message.placeholder")} />
                  <div className="mt-5">
                    <button type="submit" className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-foreground text-background font-medium text-[14px] hover:bg-foreground/90 transition-colors">
                      {t("contact.send")}
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-foreground font-medium text-[13px] mb-2 uppercase tracking-wider">
                      <Phone className="w-4 h-4" /> Phone
                    </div>
                    <p className="text-[14px] text-muted-foreground">+1 (555) 000-0000</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-foreground font-medium text-[13px] mb-2 uppercase tracking-wider">
                      <span className="text-[14px] font-bold">𝕏</span> Twitter / X
                    </div>
                    <a href="#" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border">@devhustlers</a>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-[13px] text-muted-foreground mb-3">{t("contact.social")}</p>
                    <div className="flex items-center gap-4">
                      {["Twitter", "GitHub", "Discord"].map((name) => (
                        <a key={name} href="#" className="text-[13px] font-medium text-foreground hover:text-muted-foreground transition-colors underline underline-offset-4 decoration-border hover:decoration-foreground">{name}</a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Contact;
