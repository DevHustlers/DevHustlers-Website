import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingTOC from "@/components/FloatingTOC";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";

// Rich content block types
type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "callout"; text: string; variant?: "info" | "warning" | "tip" }
  | { type: "code"; code: string; lang?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "divider" }
  | { type: "image"; caption?: string };

interface BlogPostData {
  title: string;
  date: string;
  tag: string;
  readTime: string;
  author: { name: string; role: string };
  content: ContentBlock[];
}

// Post order for next/prev navigation
const postSlugs = [
  "scaling-to-50k",
  "open-source-projects",
  "async-mentorship",
  "building-in-public",
  "hackathon-winners-feb",
  "developer-community",
];

const postTitles: Record<string, string> = {
  "scaling-to-50k": "How We Scaled to 50K Developers",
  "open-source-projects": "5 Open Source Projects That Started Here",
  "async-mentorship": "The Case for Async Mentorship",
  "building-in-public": "Building in Public: A Guide",
  "hackathon-winners-feb": "Hackathon Winners: February 2026",
  "developer-community": "Why Every Developer Needs a Community",
};

const blogContent: Record<string, BlogPostData> = {
  "scaling-to-50k": {
    title: "How We Scaled to 50K Developers",
    date: "Mar 5, 2026",
    tag: "Community",
    readTime: "8 min read",
    author: { name: "Alex Rivera", role: "Founder & CEO" },
    content: [
      { type: "p", text: "It started with a simple idea: what if there was a place where developers could genuinely collaborate without the noise of social media? That question led to the creation of DevHustlers in early 2022." },
      { type: "h2", text: "The Early Days", id: "early-days" },
      { type: "p", text: "Our first home was a Discord server with 50 members — mostly friends and colleagues who shared a passion for building things. The energy was electric from day one. People were sharing projects, giving feedback, and forming teams for side projects." },
      { type: "quote", text: "The best communities aren't built — they're cultivated. You plant seeds, create the right conditions, and let people grow together.", author: "Alex Rivera" },
      { type: "h2", text: "The Hackathon Effect", id: "hackathon-effect" },
      { type: "p", text: "The first major growth inflection came when we launched weekly hackathons. The format was simple: a theme on Monday, submissions by Sunday. No prizes at first — just the satisfaction of building something in a week and getting real feedback from peers." },
      { type: "callout", text: "Our weekly hackathons drove 60% of our organic growth in the first year. Developers who participated once had a 78% retention rate.", variant: "tip" },
      { type: "h2", text: "Crossing 10K Members", id: "crossing-10k" },
      { type: "p", text: "By the end of 2023, we had crossed 10,000 members. The key wasn't aggressive marketing — it was word of mouth. Developers who had great experiences told their friends. Projects built during our hackathons started getting traction on ProductHunt and Hacker News." },
      { type: "list", items: [
        "Word-of-mouth referrals accounted for 72% of new members",
        "Hackathon projects featured on Hacker News brought 3,000+ signups",
        "ProductHunt launches from community projects drove consistent growth",
        "Developer conference talks by members expanded our reach globally",
      ] },
      { type: "h2", text: "Investing in Community Health", id: "community-health" },
      { type: "p", text: "We invested heavily in community health. Every member goes through a brief onboarding flow. We have community guidelines that emphasize constructive feedback and inclusivity. We built custom tools to surface interesting projects and match mentors with mentees." },
      { type: "code", code: `// Our community health scoring algorithm
function calculateHealthScore(community) {
  const engagement = getWeeklyActiveRatio(community);
  const retention = get90DayRetention(community);
  const sentiment = analyzeSentiment(community.messages);
  
  return (engagement * 0.4) + (retention * 0.35) + (sentiment * 0.25);
}`, lang: "typescript" },
      { type: "h2", text: "Where We Are Today", id: "today" },
      { type: "p", text: "Today, with 50,000+ developers from 120 countries, the challenge is maintaining that intimate community feel while continuing to grow. We do this through smaller sub-communities organized by interest, timezone, and experience level." },
      { type: "callout", text: "Sub-communities are the secret to scaling without losing intimacy. Each group has its own culture while sharing the broader DevHustlers values.", variant: "info" },
      { type: "h2", text: "What's Next", id: "whats-next" },
      { type: "p", text: "The next chapter is even more exciting. We're building tools that make it easier to go from idea to shipped product within the community — project management, deployment pipelines, and integrated feedback loops." },
      { type: "list", items: [
        "Integrated project management tools",
        "One-click deployment pipelines",
        "Community-powered code review system",
        "AI-assisted mentorship matching",
      ], ordered: true },
    ],
  },
  "open-source-projects": {
    title: "5 Open Source Projects That Started Here",
    date: "Feb 28, 2026",
    tag: "Projects",
    readTime: "6 min read",
    author: { name: "Priya Sharma", role: "Head of Community" },
    content: [
      { type: "p", text: "One of the most rewarding aspects of DevHustlers is watching ideas become real, impactful open source projects. Here are five standout projects that were born from our community hackathons and collaboration boards." },
      { type: "h2", text: "1. FastSchema", id: "fastschema" },
      { type: "p", text: "A lightweight database migration tool that now has over 8,000 GitHub stars. It started as a weekend hackathon project by three developers who were frustrated with existing migration tools." },
      { type: "code", code: `# FastSchema in action
npx fastschema init
npx fastschema migrate:create add_users_table
npx fastschema migrate:run`, lang: "bash" },
      { type: "callout", text: "FastSchema reduced migration setup time from hours to minutes. It now processes over 2M migrations per month across its user base.", variant: "tip" },
      { type: "h2", text: "2. PixelForge", id: "pixelforge" },
      { type: "p", text: "An open source design-to-code tool that converts Figma designs into clean React components. Built by a team of four during our April 2025 hackathon, it's now used by several design agencies." },
      { type: "h2", text: "3. CloudPilot", id: "cloudpilot" },
      { type: "p", text: "A multi-cloud management CLI that simplifies deployments across AWS, GCP, and Azure. The creator, a DevHustlers mentor, built the first version in a week and open-sourced it to the community." },
      { type: "h2", text: "4. TestBench", id: "testbench" },
      { type: "p", text: "An automated testing framework for API endpoints that generates tests from OpenAPI specs. It was born from a common frustration discussed in our #backend channel." },
      { type: "code", code: `// TestBench auto-generates tests from your OpenAPI spec
import { generateTests } from 'testbench';

const tests = await generateTests('./openapi.yaml', {
  coverage: 'comprehensive',
  includeEdgeCases: true,
});

await tests.run();`, lang: "typescript" },
      { type: "h2", text: "5. DevFlow", id: "devflow" },
      { type: "p", text: "A VS Code extension for collaborative coding sessions. It lets you share your editor state with teammates in real-time, and it started as a hack to solve the remote pair programming challenge." },
      { type: "divider" },
      { type: "quote", text: "These projects highlight what's possible when talented developers have a supportive community behind them. The best ideas come from shared frustrations.", author: "Priya Sharma" },
      { type: "p", text: "If you have an idea, our project board is the perfect place to find collaborators and get started." },
    ],
  },
  "async-mentorship": {
    title: "The Case for Async Mentorship",
    date: "Feb 20, 2026",
    tag: "Mentorship",
    readTime: "5 min read",
    author: { name: "James Wu", role: "CTO" },
    content: [
      { type: "p", text: "Traditional mentorship assumes both parties are in the same timezone, or at least have overlapping schedules. For a global community like DevHustlers, that assumption doesn't hold." },
      { type: "h2", text: "Why Async Works Better", id: "why-async" },
      { type: "p", text: "We've found that async mentorship — where mentors and mentees communicate primarily through written messages, code reviews, and recorded video — actually produces better outcomes than synchronous sessions in many cases." },
      { type: "quote", text: "Written communication forces both parties to think more carefully. Mentees formulate better questions. Mentors provide more thorough, considered responses." },
      { type: "h2", text: "Code Reviews as Learning", id: "code-reviews" },
      { type: "p", text: "Code reviews are the backbone of our async mentorship program. Mentors review mentees' project code on a weekly basis, leaving detailed comments and suggestions. This mirrors real-world engineering workflows and builds practical skills." },
      { type: "code", code: `// Example mentor review comment
// ❌ Before
function getData(url) {
  return fetch(url).then(r => r.json());
}

// ✅ After (with error handling)
async function getData(url: string): Promise<Data> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }
  return response.json();
}`, lang: "typescript" },
      { type: "h2", text: "The Hybrid Approach", id: "hybrid" },
      { type: "p", text: "We supplement async communication with optional monthly video calls for deeper discussions. But the core learning happens asynchronously, making our mentorship program accessible to developers in any timezone." },
      { type: "h2", text: "Results", id: "results" },
      { type: "callout", text: "94% of mentees report significant skill improvement after three months, and 78% say async mentorship fits their lifestyle better than traditional formats.", variant: "tip" },
      { type: "list", items: [
        "94% report significant skill improvement after 3 months",
        "78% prefer async over synchronous mentorship",
        "Average response time: 4 hours",
        "65% of mentees go on to become mentors themselves",
      ] },
    ],
  },
  "building-in-public": {
    title: "Building in Public: A Guide",
    date: "Feb 14, 2026",
    tag: "Guide",
    readTime: "7 min read",
    author: { name: "Elena Petrova", role: "Head of Events" },
    content: [
      { type: "p", text: "Building in public means sharing your product development journey openly — the wins, the failures, the metrics, the decisions. It's become a powerful strategy for indie developers and startups alike." },
      { type: "callout", text: "At DevHustlers, we've seen hundreds of members successfully build in public. Here's what we've learned about what works and what doesn't.", variant: "info" },
      { type: "h2", text: "Start With the Problem", id: "start-with-problem" },
      { type: "p", text: "Before you write a line of code, share the problem you're trying to solve. Get feedback on whether it resonates. This saves you from building something nobody wants." },
      { type: "h2", text: "Share Progress Consistently", id: "share-progress" },
      { type: "p", text: "Weekly updates work best — they're frequent enough to build an audience but spaced enough to have meaningful progress to share. Use our #building-in-public channel for accountability." },
      { type: "list", items: [
        "Post weekly updates every Friday",
        "Include screenshots or demos when possible",
        "Share metrics honestly — both good and bad",
        "Tag relevant community members for feedback",
      ] },
      { type: "h2", text: "Be Honest About Failures", id: "be-honest" },
      { type: "p", text: "The most engaging build-in-public stories include setbacks and pivots. Developers connect with authenticity, not just success stories. Share what didn't work and why you changed direction." },
      { type: "quote", text: "Your failures teach the community more than your successes ever will. Be brave enough to share both.", author: "Elena Petrova" },
      { type: "h2", text: "Engage With Your Audience", id: "engage" },
      { type: "p", text: "Building in public is a conversation, not a broadcast. When people give feedback, respond thoughtfully. Some of the best feature ideas come from community members who are following your journey." },
      { type: "h2", text: "Know What to Keep Private", id: "keep-private" },
      { type: "p", text: "Building in public doesn't mean sharing everything. Revenue details, user data, and sensitive business information should stay private unless you're comfortable with full transparency." },
      { type: "callout", text: "A good rule of thumb: share the 'how' and 'why' generously, but be thoughtful about the 'how much' (revenue, specific user data).", variant: "warning" },
    ],
  },
  "hackathon-winners-feb": {
    title: "Hackathon Winners: February 2026",
    date: "Feb 7, 2026",
    tag: "Hackathon",
    readTime: "4 min read",
    author: { name: "Elena Petrova", role: "Head of Events" },
    content: [
      { type: "p", text: "February's hackathon theme was 'Developer Productivity' — build a tool that helps developers work faster, smarter, or more enjoyably. We received 48 submissions from teams across 22 countries." },
      { type: "h2", text: "🥇 First Place: TimeBlock", id: "first-place" },
      { type: "p", text: "A smart calendar app that automatically blocks focus time based on your GitHub activity patterns. When you're in a coding flow, it silences notifications and blocks meetings." },
      { type: "code", code: `// TimeBlock's flow detection algorithm
interface FlowState {
  commitFrequency: number;  // commits per hour
  focusScore: number;       // 0-100
  shouldBlock: boolean;
}

function detectFlow(activity: GitHubActivity[]): FlowState {
  const recentCommits = activity.filter(a => 
    a.timestamp > Date.now() - 3600000
  );
  const frequency = recentCommits.length;
  const focusScore = Math.min(frequency * 20, 100);
  
  return {
    commitFrequency: frequency,
    focusScore,
    shouldBlock: focusScore > 60,
  };
}`, lang: "typescript" },
      { type: "h2", text: "🥈 Second Place: CodeContext", id: "second-place" },
      { type: "p", text: "A browser extension that provides instant context about any code snippet you encounter online. Hover over code on Stack Overflow, blog posts, or documentation and get explanations, related examples, and compatibility notes." },
      { type: "h2", text: "🥉 Third Place: PRPal", id: "third-place" },
      { type: "p", text: "An AI-powered pull request reviewer that provides actionable feedback before your human reviewers see the code. It catches common issues, suggests improvements, and learns your team's coding standards over time." },
      { type: "h2", text: "Honorable Mentions", id: "honorable-mentions" },
      { type: "list", items: [
        "TerminalDash — a beautiful terminal dashboard for monitoring multiple services",
        "GitJournal — automatic dev journals generated from your git commits",
        "FocusFi — a lo-fi music generator that adapts to your coding rhythm",
      ] },
      { type: "divider" },
      { type: "callout", text: "Congratulations to all participants! The creativity and quality of submissions continues to amaze us every month. Next month's theme drops on March 10.", variant: "info" },
    ],
  },
  "developer-community": {
    title: "Why Every Developer Needs a Community",
    date: "Jan 30, 2026",
    tag: "Insights",
    readTime: "6 min read",
    author: { name: "Alex Rivera", role: "Founder & CEO" },
    content: [
      { type: "p", text: "Software development can be isolating. Whether you're a solo freelancer, a remote employee, or an indie hacker, it's easy to spend days without meaningful interaction with other developers." },
      { type: "h2", text: "The Research Is Clear", id: "research" },
      { type: "p", text: "Research from GitHub's State of the Octoverse and Stack Overflow's Developer Survey consistently shows that developers who participate in communities report higher job satisfaction, faster skill growth, and better career outcomes." },
      { type: "quote", text: "Developers who actively participate in communities are 2.3x more likely to report high job satisfaction and 1.8x more likely to receive promotions." },
      { type: "h2", text: "Context Over Documentation", id: "context" },
      { type: "p", text: "Communities provide something that documentation and tutorials can't: context. When you're stuck on a problem, a community member who's faced the same challenge can give you not just the solution, but the reasoning behind it." },
      { type: "h2", text: "Accountability Matters", id: "accountability" },
      { type: "p", text: "The accountability factor is equally important. When you share your goals with a community — whether it's shipping a side project, learning a new language, or contributing to open source — you're far more likely to follow through." },
      { type: "callout", text: "Members who publicly commit to goals in our #accountability channel are 3x more likely to complete them within the stated timeframe.", variant: "tip" },
      { type: "h2", text: "Real Opportunities", id: "opportunities" },
      { type: "p", text: "Networking through communities leads to real opportunities. At DevHustlers alone, we've seen members find jobs, co-founders, collaborators, and clients through organic community interactions. These connections are more genuine than typical LinkedIn networking." },
      { type: "list", items: [
        "340+ members found jobs through community connections",
        "28 startups co-founded by members who met on DevHustlers",
        "1,200+ successful project collaborations",
        "500+ freelance contracts sourced through the community",
      ] },
      { type: "h2", text: "Staying Current", id: "staying-current" },
      { type: "p", text: "Finally, communities keep you current. Technology evolves rapidly, and being part of an active community means you hear about new tools, frameworks, and best practices as they emerge — through the lens of developers who are actually using them." },
    ],
  },
};

// Extract TOC headings
const getTocItems = (content: ContentBlock[]) => {
  return content
    .filter((b): b is { type: "h2"; text: string; id: string } | { type: "h3"; text: string; id: string } =>
      b.type === "h2" || b.type === "h3"
    )
    .map((b) => ({ text: b.text, id: b.id, level: b.type }));
};

// Code block with Prism highlighting
const CodeBlock = ({ code, lang }: { code: string; lang?: string }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const grammar = lang && Prism.languages[lang] ? lang : "javascript";

  return (
    <div className="my-6 border border-border overflow-hidden">
      {lang && (
        <div className="px-4 py-2 bg-code-bg border-b border-border flex items-center justify-between">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">{lang}</span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto bg-code-bg">
        <code ref={codeRef} className={`language-${grammar} text-[13px] font-mono leading-relaxed`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

// Render a single content block
const RenderBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case "p":
      return <p className="text-[15px] text-muted-foreground leading-[1.85] mb-5">{block.text}</p>;
    case "h2":
      return (
        <h2 id={block.id} className="text-xl font-bold text-foreground mt-10 mb-4 scroll-mt-24">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 id={block.id} className="text-lg font-semibold text-foreground mt-8 mb-3 scroll-mt-24">
          {block.text}
        </h3>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-foreground/20 pl-5 py-1 my-6">
          <p className="text-[15px] text-foreground/80 italic leading-[1.8]">"{block.text}"</p>
          {block.author && (
            <cite className="block text-[13px] text-muted-foreground mt-2 not-italic">— {block.author}</cite>
          )}
        </blockquote>
      );
    case "callout": {
      const variants = {
        info: "bg-accent/60 border-foreground/10",
        warning: "bg-destructive/5 border-destructive/20",
        tip: "bg-accent/80 border-foreground/15",
      };
      const icons = { info: "💡", warning: "⚠️", tip: "✨" };
      const v = block.variant || "info";
      return (
        <div className={cn("border px-5 py-4 my-6", variants[v])}>
          <p className="text-[14px] text-foreground leading-relaxed">
            <span className="mr-2">{icons[v]}</span>
            {block.text}
          </p>
        </div>
      );
    }
    case "code":
      return <CodeBlock code={block.code} lang={block.lang} />;
    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag className={cn("my-5 space-y-2 pl-5", block.ordered ? "list-decimal" : "list-disc")}>
          {block.items.map((item, i) => (
            <li key={i} className="text-[14px] text-muted-foreground leading-relaxed pl-1">
              {item}
            </li>
          ))}
        </ListTag>
      );
    }
    case "divider":
      return <hr className="my-8 border-border" />;
    default:
      return null;
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? blogContent[slug] : null;
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!post) return;
    const headings = post.content
      .filter((b) => b.type === "h2" || b.type === "h3")
      .map((b) => (b as { id: string }).id);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [post]);

  if (!post) {
    return (
      <PageLayout>
        <Navbar />
        <div className="pt-36 pb-24 px-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
        </div>
        <Footer />
      </PageLayout>
    );
  }

  const tocItems = getTocItems(post.content);
  const currentIndex = slug ? postSlugs.indexOf(slug) : -1;
  const prevSlug = currentIndex > 0 ? postSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < postSlugs.length - 1 ? postSlugs[currentIndex + 1] : null;

  return (
    <PageLayout>
      <Navbar />
      
      {/* Floating TOC for mobile/tablet */}
      <FloatingTOC items={tocItems} activeId={activeId} />

      <article className="pt-28 sm:pt-36 pb-0">
        <div className="max-w-5xl mx-auto">
          {/* Back to blog with square dividers */}
          <SectionDivider />
          <div className="px-4 sm:px-10 py-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
            </Link>
          </div>
          <SectionDivider />

          {/* Post header */}
          <div className="px-4 sm:px-10 py-8 sm:py-10">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-mono">
                <Clock className="w-3 h-3" /> {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 border border-border">
                <Tag className="w-3 h-3" /> {post.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px]">
                <BookOpen className="w-3 h-3" /> {post.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent flex items-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground">
                  {post.author.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground">{post.author.name}</p>
                <p className="text-[11px] text-muted-foreground">{post.author.role}</p>
              </div>
            </div>
          </div>
          <SectionDivider />

          {/* Content + TOC layout */}
          <div className="relative">
            {/* Main content */}
            <div className="px-4 sm:px-10 py-10">
              {post.content.map((block, i) => (
                <RenderBlock key={i} block={block} />
              ))}
            </div>

            {/* TOC sidebar - positioned outside the right vertical line */}
            {tocItems.length > 0 && (
              <aside className="hidden lg:block absolute top-0 -right-4 w-52 translate-x-full">
                <div className="sticky top-24 pl-8">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4 font-mono">
                    On this page
                  </p>
                  <nav className="space-y-0.5">
                    {tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cn(
                          "block text-[13px] leading-snug py-1.5 transition-colors duration-150 border-l-2",
                          item.level === "h3" ? "pl-5" : "pl-3",
                          activeId === item.id
                            ? "border-foreground text-foreground font-medium"
                            : "border-transparent text-muted-foreground/70 hover:text-foreground hover:border-border"
                        )}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      {/* Next/Prev navigation */}
      <div>
        <SectionDivider />
        <div className="max-w-5xl mx-auto">
          <div className={cn(
            "grid gap-px bg-border",
            prevSlug && nextSlug ? "grid-cols-2" : "grid-cols-1"
          )}>
            {prevSlug && (
              <Link
                to={`/blog/${prevSlug}`}
                className="group p-6 sm:p-8 bg-background hover:bg-accent/30 transition-colors"
              >
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block">
                  ← Previous
                </span>
                <span className="text-[15px] font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                  {postTitles[prevSlug]}
                </span>
              </Link>
            )}
            {nextSlug && (
              <Link
                to={`/blog/${nextSlug}`}
                className={cn(
                  "group p-6 sm:p-8 bg-background hover:bg-accent/30 transition-colors",
                  prevSlug ? "text-right" : ""
                )}
              >
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-mono mb-2 block">
                  Next →
                </span>
                <span className="text-[15px] font-semibold text-foreground group-hover:text-muted-foreground transition-colors">
                  {postTitles[nextSlug]}
                </span>
              </Link>
            )}
          </div>
        </div>
        <SectionDivider />
      </div>

      <Footer />
    </PageLayout>
  );
};

export default BlogPost;
