import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/i18n/LanguageContext";

const FAQSection = () => {
  const { t } = useLanguage();

  const faqs = [
    { q: t("faq.1.q"), a: t("faq.1.a") },
    { q: t("faq.2.q"), a: t("faq.2.a") },
    { q: t("faq.3.q"), a: t("faq.3.a") },
    { q: t("faq.4.q"), a: t("faq.4.a") },
    { q: t("faq.5.q"), a: t("faq.5.a") },
  ];

  return (
    <section>
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
        <div className="px-3 sm:px-4 lg:px-6 pt-20 sm:pt-24 pb-14">
          <p className="text-[15px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">{t("faq.label")}</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {t("faq.title.1")}{" "}
            <span className="font-serif text-muted-foreground font-normal">{t("faq.title.2")}</span>
          </h2>
        </div>

        <div className="border-t border-border">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border px-3 sm:px-4 lg:px-6">
                <AccordionTrigger className="text-[17px] font-medium text-foreground hover:no-underline py-5 text-start">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-[15px] text-muted-foreground leading-relaxed pb-5">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
