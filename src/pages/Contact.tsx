import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">Contact</p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
            Get in{" "}
            <span className="font-serif italic text-muted-foreground font-normal">touch</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Have a question, partnership idea, or just want to say hi? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-3">
            {submitted ? (
              <div className="p-8 rounded-2xl border border-border text-center">
                <p className="text-foreground font-semibold mb-2">Message sent!</p>
                <p className="text-[14px] text-muted-foreground">We'll get back to you within 24 hours.</p>
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
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50 resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-7 py-2.5 rounded-full bg-foreground text-background font-medium text-[14px] hover:bg-foreground/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-foreground font-medium text-[14px] mb-1">
                <Mail className="w-4 h-4" /> Email
              </div>
              <p className="text-[13px] text-muted-foreground">hello@devhive.community</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-foreground font-medium text-[14px] mb-1">
                <MapPin className="w-4 h-4" /> Location
              </div>
              <p className="text-[13px] text-muted-foreground">Remote-first, worldwide</p>
            </div>
            <div className="pt-4">
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                Follow us on{" "}
                <a href="#" className="text-foreground underline underline-offset-2">Twitter</a>,{" "}
                <a href="#" className="text-foreground underline underline-offset-2">GitHub</a>, and{" "}
                <a href="#" className="text-foreground underline underline-offset-2">Discord</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
