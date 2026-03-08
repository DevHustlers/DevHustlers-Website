import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is DevHustle free to join?",
    a: "Yes! DevHustle is completely free for individual developers. We also offer team plans for companies that want to sponsor their employees' participation.",
  },
  {
    q: "How do the weekly hackathons work?",
    a: "Every Monday we announce a theme. You have until Sunday to build and submit a project. Winners get featured on our homepage and receive mentorship sessions with industry experts.",
  },
  {
    q: "Can I find collaborators for my project?",
    a: "Absolutely. Our project board lets you post ideas and find teammates. Many successful open source projects and startups have started from DevHustle collaborations.",
  },
  {
    q: "What programming languages are supported?",
    a: "DevHive is language-agnostic. Our community includes developers working with JavaScript, Python, Rust, Go, and many more. Everyone is welcome regardless of their tech stack.",
  },
  {
    q: "How do I become a mentor?",
    a: "Senior developers with 5+ years of experience can apply to our mentorship program. We'll match you with mentees based on your expertise and availability.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">
            FAQ
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Frequently asked{" "}
            <span className="font-serif italic text-muted-foreground font-normal">questions</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-[15px] font-medium text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
