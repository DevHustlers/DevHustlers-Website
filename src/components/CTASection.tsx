import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-border bg-accent/30 px-8 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight">
            Ready to build{" "}
            <span className="font-serif italic text-muted-foreground font-normal">something great</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-[15px]">
            Join a community of developers who care about craft, collaboration, and shipping real products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-[15px]">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-border text-foreground font-medium hover:bg-accent transition-colors text-[15px]">
              View Projects
            </button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            No credit card required · Free forever for individuals
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
