import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const blogContent: Record<string, { title: string; date: string; tag: string; readTime: string; content: string[] }> = {
  "scaling-to-50k": {
    title: "How We Scaled to 50K Developers",
    date: "Mar 5, 2026",
    tag: "Community",
    readTime: "8 min read",
    content: [
      "It started with a simple idea: what if there was a place where developers could genuinely collaborate without the noise of social media? That question led to the creation of DevHustle in early 2022.",
      "Our first home was a Discord server with 50 members — mostly friends and colleagues who shared a passion for building things. The energy was electric from day one. People were sharing projects, giving feedback, and forming teams for side projects.",
      "The first major growth inflection came when we launched weekly hackathons. The format was simple: a theme on Monday, submissions by Sunday. No prizes at first — just the satisfaction of building something in a week and getting real feedback from peers.",
      "By the end of 2023, we had crossed 10,000 members. The key wasn't aggressive marketing — it was word of mouth. Developers who had great experiences told their friends. Projects built during our hackathons started getting traction on ProductHunt and Hacker News.",
      "We invested heavily in community health. Every member goes through a brief onboarding flow. We have community guidelines that emphasize constructive feedback and inclusivity. We built custom tools to surface interesting projects and match mentors with mentees.",
      "Today, with 50,000+ developers from 120 countries, the challenge is maintaining that intimate community feel while continuing to grow. We do this through smaller sub-communities organized by interest, timezone, and experience level.",
      "The next chapter is even more exciting. We're building tools that make it easier to go from idea to shipped product within the community — project management, deployment pipelines, and integrated feedback loops.",
    ],
  },
  "open-source-projects": {
    title: "5 Open Source Projects That Started Here",
    date: "Feb 28, 2026",
    tag: "Projects",
    readTime: "6 min read",
    content: [
      "One of the most rewarding aspects of DevHustle is watching ideas become real, impactful open source projects. Here are five standout projects that were born from our community hackathons and collaboration boards.",
      "1. FastSchema — A lightweight database migration tool that now has over 8,000 GitHub stars. It started as a weekend hackathon project by three developers who were frustrated with existing migration tools. The simplicity and developer experience made it a hit.",
      "2. PixelForge — An open source design-to-code tool that converts Figma designs into clean React components. Built by a team of four during our April 2025 hackathon, it's now used by several design agencies.",
      "3. CloudPilot — A multi-cloud management CLI that simplifies deployments across AWS, GCP, and Azure. The creator, a DevHustle mentor, built the first version in a week and open-sourced it to the community.",
      "4. TestBench — An automated testing framework for API endpoints that generates tests from OpenAPI specs. It was born from a common frustration discussed in our #backend channel.",
      "5. DevFlow — A VS Code extension for collaborative coding sessions. It lets you share your editor state with teammates in real-time, and it started as a hack to solve the remote pair programming challenge.",
      "These projects highlight what's possible when talented developers have a supportive community behind them. If you have an idea, our project board is the perfect place to find collaborators and get started.",
    ],
  },
  "async-mentorship": {
    title: "The Case for Async Mentorship",
    date: "Feb 20, 2026",
    tag: "Mentorship",
    readTime: "5 min read",
    content: [
      "Traditional mentorship assumes both parties are in the same timezone, or at least have overlapping schedules. For a global community like DevHustle, that assumption doesn't hold.",
      "We've found that async mentorship — where mentors and mentees communicate primarily through written messages, code reviews, and recorded video — actually produces better outcomes than synchronous sessions in many cases.",
      "Written communication forces both parties to think more carefully. Mentees formulate better questions. Mentors provide more thorough, considered responses. The entire exchange becomes a reference document that the mentee can revisit.",
      "Code reviews are the backbone of our async mentorship program. Mentors review mentees' project code on a weekly basis, leaving detailed comments and suggestions. This mirrors real-world engineering workflows and builds practical skills.",
      "We supplement async communication with optional monthly video calls for deeper discussions. But the core learning happens asynchronously, making our mentorship program accessible to developers in any timezone.",
      "The results speak for themselves: 94% of mentees report significant skill improvement after three months, and 78% say async mentorship fits their lifestyle better than traditional formats.",
    ],
  },
  "building-in-public": {
    title: "Building in Public: A Guide",
    date: "Feb 14, 2026",
    tag: "Guide",
    readTime: "7 min read",
    content: [
      "Building in public means sharing your product development journey openly — the wins, the failures, the metrics, the decisions. It's become a powerful strategy for indie developers and startups alike.",
      "At DevHustle, we've seen hundreds of members successfully build in public. Here's what we've learned about what works and what doesn't.",
      "Start with the problem, not the solution. Before you write a line of code, share the problem you're trying to solve. Get feedback on whether it resonates. This saves you from building something nobody wants.",
      "Share your progress consistently. Weekly updates work best — they're frequent enough to build an audience but spaced enough to have meaningful progress to share. Use our #building-in-public channel for accountability.",
      "Be honest about failures. The most engaging build-in-public stories include setbacks and pivots. Developers connect with authenticity, not just success stories. Share what didn't work and why you changed direction.",
      "Engage with your audience. Building in public is a conversation, not a broadcast. When people give feedback, respond thoughtfully. Some of the best feature ideas come from community members who are following your journey.",
      "Know what to keep private. Building in public doesn't mean sharing everything. Revenue details, user data, and sensitive business information should stay private unless you're comfortable with full transparency.",
    ],
  },
  "hackathon-winners-feb": {
    title: "Hackathon Winners: February 2026",
    date: "Feb 7, 2026",
    tag: "Hackathon",
    readTime: "4 min read",
    content: [
      "February's hackathon theme was 'Developer Productivity' — build a tool that helps developers work faster, smarter, or more enjoyably. We received 48 submissions from teams across 22 countries.",
      "First Place: TimeBlock — A smart calendar app that automatically blocks focus time based on your GitHub activity patterns. When you're in a coding flow, it silences notifications and blocks meetings. Built with React and a custom ML model.",
      "Second Place: CodeContext — A browser extension that provides instant context about any code snippet you encounter online. Hover over code on Stack Overflow, blog posts, or documentation and get explanations, related examples, and compatibility notes.",
      "Third Place: PRPal — An AI-powered pull request reviewer that provides actionable feedback before your human reviewers see the code. It catches common issues, suggests improvements, and learns your team's coding standards over time.",
      "Honorable Mentions go to TerminalDash (a beautiful terminal dashboard for monitoring multiple services), GitJournal (automatic dev journals from your git commits), and FocusFi (a lo-fi music generator that adapts to your coding rhythm).",
      "Congratulations to all participants! The creativity and quality of submissions continues to amaze us every month.",
    ],
  },
  "developer-community": {
    title: "Why Every Developer Needs a Community",
    date: "Jan 30, 2026",
    tag: "Insights",
    readTime: "6 min read",
    content: [
      "Software development can be isolating. Whether you're a solo freelancer, a remote employee, or an indie hacker, it's easy to spend days without meaningful interaction with other developers.",
      "Research from GitHub's State of the Octoverse and Stack Overflow's Developer Survey consistently shows that developers who participate in communities report higher job satisfaction, faster skill growth, and better career outcomes.",
      "Communities provide something that documentation and tutorials can't: context. When you're stuck on a problem, a community member who's faced the same challenge can give you not just the solution, but the reasoning behind it.",
      "The accountability factor is equally important. When you share your goals with a community — whether it's shipping a side project, learning a new language, or contributing to open source — you're far more likely to follow through.",
      "Networking through communities leads to real opportunities. At DevHustle alone, we've seen members find jobs, co-founders, collaborators, and clients through organic community interactions. These connections are more genuine than typical LinkedIn networking.",
      "Finally, communities keep you current. Technology evolves rapidly, and being part of an active community means you hear about new tools, frameworks, and best practices as they emerge — through the lens of developers who are actually using them.",
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? blogContent[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-36 pb-24 px-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="pt-36 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[12px] text-muted-foreground">{post.date}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
              {post.tag}
            </span>
            <span className="text-[11px] text-muted-foreground/60">{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight mb-8">
            {post.title}
          </h1>

          <div className="space-y-5">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-[15px] text-muted-foreground leading-[1.8]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[14px] text-foreground font-medium hover:text-muted-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All posts
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;
