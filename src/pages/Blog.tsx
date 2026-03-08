import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";

const posts = [
  {
    title: "How We Scaled to 50K Developers",
    excerpt: "The story behind DevHustlers' growth from a Discord server to a global community.",
    date: "Mar 5, 2026",
    tag: "Community",
    slug: "/blog/scaling-to-50k",
    readTime: "8 min read",
  },
  {
    title: "5 Open Source Projects That Started Here",
    excerpt: "A look at the most impactful projects that were born from DevHustlers hackathons.",
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

const allTags = Array.from(new Set(posts.map((p) => p.tag)));

const Blog = () => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !activeTag || post.tag === activeTag;
      return matchesSearch && matchesTag;
    });
  }, [search, activeTag]);

  return (
    <PageLayout>
      <Navbar />
      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[12px] sm:text-[13px] font-medium text-muted-foreground mb-3 uppercase tracking-widest">Blog</p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
            Stories &{" "}
            <span className="font-serif italic text-muted-foreground font-normal">insights</span>
          </h1>
          <p className="text-muted-foreground text-[15px] sm:text-base md:text-lg mb-8">
            Updates, guides, and stories from the DevHustlers community.
          </p>

          {/* Search + Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2.5 border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50 font-mono"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={cn(
                  "px-3 py-1 text-[12px] font-medium border transition-colors",
                  !activeTag
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:text-foreground"
                )}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={cn(
                    "px-3 py-1 text-[12px] font-medium border transition-colors",
                    activeTag === tag
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-[14px]">No posts found matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((post, i) => (
                <ScrollReveal key={post.slug} delay={i * 50}>
                  <Link to={post.slug} className="block py-6 sm:py-7 group">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-[11px] sm:text-[12px] text-muted-foreground font-mono">{post.date}</span>
                      <span className="text-[10px] sm:text-[11px] px-2 py-0.5 border border-border text-muted-foreground">
                        {post.tag}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground/60">{post.readTime}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-muted-foreground transition-colors mb-1.5 flex items-center gap-2">
                      {post.title}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0 hidden sm:block" />
                    </h2>
                    <p className="text-[13px] sm:text-[14px] text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Blog;
