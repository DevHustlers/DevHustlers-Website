import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const posts = [
  {
    title: "How We Scaled to 50K Developers",
    excerpt: "The story behind DevHustle's growth from a Discord server to a global community.",
    date: "Mar 5, 2026",
    tag: "Community",
    slug: "/blog/scaling-to-50k",
    readTime: "8 min read",
  },
  {
    title: "5 Open Source Projects That Started Here",
    excerpt: "A look at the most impactful projects that were born from DevHustle hackathons.",
    date: "Feb 28, 2026",
    tag: "Projects",
    slug: "/blog/open-source-projects",
    readTime: "6 min read",
  },
  {
    title: "The Case for Async Mentorship",
    excerpt: "Why async mentorship works better for global developer communities.",
    date: "Feb 20, 2026",
    tag: "Mentorship",
    slug: "/blog/async-mentorship",
    readTime: "5 min read",
  },
  {
    title: "Building in Public: A Guide",
    excerpt: "How to leverage community feedback while building your next product.",
    date: "Feb 14, 2026",
    tag: "Guide",
    slug: "/blog/building-in-public",
    readTime: "7 min read",
  },
  {
    title: "Hackathon Winners: February 2026",
    excerpt: "Meet the developers who built incredible projects in just one week.",
    date: "Feb 7, 2026",
    tag: "Hackathon",
    slug: "/blog/hackathon-winners-feb",
    readTime: "4 min read",
  },
  {
    title: "Why Every Developer Needs a Community",
    excerpt: "Research-backed reasons why community involvement makes you a better engineer.",
    date: "Jan 30, 2026",
    tag: "Insights",
    slug: "/blog/developer-community",
    readTime: "6 min read",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">Blog</p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
            Stories &{" "}
            <span className="font-serif italic text-muted-foreground font-normal">insights</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Updates, guides, and stories from the DevHustle community.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="divide-y divide-border">
            {posts.map((post, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <Link
                  to={post.slug}
                  className="block py-7 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[12px] text-muted-foreground">{post.date}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                      {post.tag}
                    </span>
                    <span className="text-[11px] text-muted-foreground/60">{post.readTime}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-muted-foreground transition-colors mb-1.5 flex items-center gap-2">
                    {post.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </h2>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
