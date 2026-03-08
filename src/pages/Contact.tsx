import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  return (
    <PageLayout>
      <Navbar />
      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">{t("contact.label")}</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
            {t("contact.title.1")}{" "}
            <span className="font-serif italic text-muted-foreground font-normal">{t("contact.title.2")}</span>
          </h1>
          <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg">
            {t("contact.desc")}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            {submitted ? (
              <div className="p-8 border border-border text-center">
                <p className="text-foreground font-semibold mb-2">{t("contact.sent")}</p>
                <p className="text-[14px] text-muted-foreground">{t("contact.sent.desc")}</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">{t("contact.name")}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
                    placeholder={t("contact.name.placeholder")}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">{t("contact.email")}</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
                    placeholder={t("contact.email.placeholder")}
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">{t("contact.message")}</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50 resize-none"
                    placeholder={t("contact.message.placeholder")}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-7 py-2.5 bg-foreground text-background font-medium text-[14px] hover:bg-foreground/90 transition-colors"
                >
                  {t("contact.send")}
                </button>
              </form>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-foreground font-medium text-[14px] mb-1">
                <Mail className="w-4 h-4" /> {t("contact.email")}
              </div>
              <p className="text-[13px] text-muted-foreground">hello@devhustlers.community</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-foreground font-medium text-[14px] mb-1">
                <MapPin className="w-4 h-4" /> {t("contact.location")}
              </div>
              <p className="text-[13px] text-muted-foreground">{t("contact.location.value")}</p>
            </div>
            <div className="pt-4">
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {t("contact.social")}{" "}
                <a href="#" className="text-foreground underline underline-offset-2">Twitter</a>,{" "}
                <a href="#" className="text-foreground underline underline-offset-2">GitHub</a>, {" "}
                <a href="#" className="text-foreground underline underline-offset-2">Discord</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Contact;
