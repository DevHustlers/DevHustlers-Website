import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Users, Target, Trophy, BookOpen, Code, Server, BarChart3, Brain, Shield, Smartphone, Cpu, Palette, Wifi } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const TRACK_DATA: Record<string, {
  name: string;
  icon: any;
  color: string;
  borderColor: string;
  bgAccent: string;
  description: string;
  longDescription: string;
  members: number;
  challenges: number;
  skills: string[];
  roadmap: { phase: string; title: string; description: string }[];
  topChallenges: { id: string; title: string; difficulty: string; points: number }[];
}> = {
  frontend: {
    name: "Frontend",
    icon: Code,
    color: "text-blue-500",
    borderColor: "border-blue-500/20",
    bgAccent: "bg-blue-500/5",
    description: "Master the art of building beautiful, responsive user interfaces with modern frameworks and tools.",
    longDescription: "Frontend development is where design meets code. Build stunning, interactive web applications using HTML, CSS, JavaScript, and modern frameworks like React, Vue, and Angular. Learn responsive design, accessibility, performance optimization, and state management.",
    members: 342,
    challenges: 28,
    skills: ["HTML5 & CSS3", "JavaScript/TypeScript", "React & Vue", "Responsive Design", "Web Animation", "Performance Optimization"],
    roadmap: [
      { phase: "Foundation", title: "Web Fundamentals", description: "Master HTML, CSS, and vanilla JavaScript. Build semantic, accessible layouts." },
      { phase: "Frameworks", title: "Modern Tools", description: "Learn React, state management, routing, and component architecture." },
      { phase: "Advanced", title: "Expert Level", description: "Performance optimization, SSR/SSG, micro-frontends, and design systems." },
    ],
    topChallenges: [
      { id: "fe-1", title: "Build a Responsive Dashboard", difficulty: "Medium", points: 300 },
      { id: "fe-2", title: "Create an Animated Landing Page", difficulty: "Easy", points: 150 },
      { id: "fe-3", title: "Build a Real-Time Kanban Board", difficulty: "Hard", points: 500 },
    ],
  },
  backend: {
    name: "Backend",
    icon: Server,
    color: "text-green-500",
    borderColor: "border-green-500/20",
    bgAccent: "bg-green-500/5",
    description: "Build robust server-side systems, APIs, and microservices that power modern applications.",
    longDescription: "Backend engineering powers everything users don't see. Design scalable APIs, manage databases, implement authentication, handle data processing, and build microservices. Master Node.js, Python, Go, databases, caching, and cloud infrastructure.",
    members: 278,
    challenges: 24,
    skills: ["REST & GraphQL APIs", "Database Design", "Authentication & Security", "Microservices", "Caching & Performance", "DevOps & CI/CD"],
    roadmap: [
      { phase: "Foundation", title: "Server Basics", description: "HTTP, REST APIs, databases, and authentication fundamentals." },
      { phase: "Architecture", title: "System Design", description: "Microservices, message queues, caching strategies, and scalability." },
      { phase: "Advanced", title: "Production Systems", description: "Monitoring, logging, testing, deployment pipelines, and infrastructure." },
    ],
    topChallenges: [
      { id: "be-1", title: "Build a RESTful API with Auth", difficulty: "Medium", points: 350 },
      { id: "be-2", title: "Design a URL Shortener", difficulty: "Easy", points: 200 },
      { id: "be-3", title: "Create a Chat Server with WebSockets", difficulty: "Hard", points: 600 },
    ],
  },
  "data-science": {
    name: "Data Science",
    icon: BarChart3,
    color: "text-purple-500",
    borderColor: "border-purple-500/20",
    bgAccent: "bg-purple-500/5",
    description: "Extract insights from data through statistical analysis, visualization, and predictive modeling.",
    longDescription: "Transform raw data into actionable insights. Learn data cleaning, exploratory analysis, statistical modeling, and visualization. Master Python, pandas, NumPy, scikit-learn, and data storytelling techniques.",
    members: 195,
    challenges: 18,
    skills: ["Python & Pandas", "Statistical Analysis", "Data Visualization", "SQL & Databases", "Feature Engineering", "A/B Testing"],
    roadmap: [
      { phase: "Foundation", title: "Data Basics", description: "Python, pandas, NumPy, data cleaning, and exploratory analysis." },
      { phase: "Analysis", title: "Statistics & Modeling", description: "Statistical inference, hypothesis testing, and regression models." },
      { phase: "Advanced", title: "Production ML", description: "Model deployment, monitoring, pipelines, and real-world projects." },
    ],
    topChallenges: [
      { id: "ds-1", title: "Analyze Customer Churn Data", difficulty: "Medium", points: 400 },
      { id: "ds-2", title: "Build a Sales Dashboard", difficulty: "Easy", points: 250 },
      { id: "ds-3", title: "Predict Stock Prices", difficulty: "Hard", points: 700 },
    ],
  },
  "ai-ml": {
    name: "AI / ML",
    icon: Brain,
    color: "text-pink-500",
    borderColor: "border-pink-500/20",
    bgAccent: "bg-pink-500/5",
    description: "Explore machine learning, deep learning, and artificial intelligence applications.",
    longDescription: "Build intelligent systems that learn from data. Master supervised and unsupervised learning, neural networks, computer vision, NLP, and deep learning frameworks like TensorFlow and PyTorch.",
    members: 231,
    challenges: 22,
    skills: ["Machine Learning", "Deep Learning", "Neural Networks", "Computer Vision", "NLP", "TensorFlow & PyTorch"],
    roadmap: [
      { phase: "Foundation", title: "ML Fundamentals", description: "Supervised learning, regression, classification, and model evaluation." },
      { phase: "Deep Learning", title: "Neural Networks", description: "CNNs, RNNs, transformers, and modern architectures." },
      { phase: "Advanced", title: "Production AI", description: "MLOps, model serving, fine-tuning LLMs, and ethical AI." },
    ],
    topChallenges: [
      { id: "ai-1", title: "Build an Image Classifier", difficulty: "Medium", points: 450 },
      { id: "ai-2", title: "Create a Sentiment Analyzer", difficulty: "Easy", points: 300 },
      { id: "ai-3", title: "Fine-Tune a Language Model", difficulty: "Hard", points: 800 },
    ],
  },
  cybersecurity: {
    name: "Cybersecurity",
    icon: Shield,
    color: "text-red-500",
    borderColor: "border-red-500/20",
    bgAccent: "bg-red-500/5",
    description: "Defend systems, discover vulnerabilities, and master the art of ethical hacking.",
    longDescription: "Protect digital infrastructure from threats. Learn penetration testing, vulnerability assessment, cryptography, network security, and incident response. Master ethical hacking and security best practices.",
    members: 167,
    challenges: 20,
    skills: ["Penetration Testing", "Network Security", "Cryptography", "Web Security", "Reverse Engineering", "Incident Response"],
    roadmap: [
      { phase: "Foundation", title: "Security Basics", description: "Networking, Linux, cryptography, and security fundamentals." },
      { phase: "Offensive", title: "Ethical Hacking", description: "Penetration testing, exploit development, and vulnerability research." },
      { phase: "Advanced", title: "Defense & Response", description: "SOC operations, threat hunting, forensics, and compliance." },
    ],
    topChallenges: [
      { id: "cs-1", title: "Capture the Flag: Web Exploits", difficulty: "Hard", points: 600 },
      { id: "cs-2", title: "Secure a Vulnerable App", difficulty: "Medium", points: 400 },
      { id: "cs-3", title: "Network Traffic Analysis", difficulty: "Easy", points: 250 },
    ],
  },
  "mobile-dev": {
    name: "Mobile Dev",
    icon: Smartphone,
    color: "text-cyan-500",
    borderColor: "border-cyan-500/20",
    bgAccent: "bg-cyan-500/5",
    description: "Create native and cross-platform mobile applications for iOS and Android.",
    longDescription: "Build mobile apps that reach billions. Master native iOS/Android development, cross-platform frameworks like React Native and Flutter, mobile UI/UX, and app store deployment.",
    members: 204,
    challenges: 16,
    skills: ["React Native", "Flutter", "iOS Development", "Android Development", "Mobile UI/UX", "App Store Deployment"],
    roadmap: [
      { phase: "Foundation", title: "Mobile Basics", description: "Platform fundamentals, UI components, navigation, and state management." },
      { phase: "Features", title: "Native Features", description: "Camera, location, notifications, storage, and device APIs." },
      { phase: "Advanced", title: "Production Apps", description: "Performance, testing, CI/CD, analytics, and monetization." },
    ],
    topChallenges: [
      { id: "md-1", title: "Build a Weather App", difficulty: "Easy", points: 200 },
      { id: "md-2", title: "Create a Social Feed", difficulty: "Medium", points: 400 },
      { id: "md-3", title: "Build a Chat App with Offline Support", difficulty: "Hard", points: 650 },
    ],
  },
  "operating-systems": {
    name: "Operating Systems",
    icon: Cpu,
    color: "text-orange-500",
    borderColor: "border-orange-500/20",
    bgAccent: "bg-orange-500/5",
    description: "Dive deep into system programming, kernel development, and OS architecture.",
    longDescription: "Understand how computers work at the lowest level. Learn process management, memory management, file systems, scheduling algorithms, and kernel development. Master C, assembly, and system internals.",
    members: 89,
    challenges: 12,
    skills: ["C & Assembly", "Process Management", "Memory Management", "File Systems", "Concurrency", "Kernel Development"],
    roadmap: [
      { phase: "Foundation", title: "System Basics", description: "C programming, processes, threads, and system calls." },
      { phase: "Internals", title: "OS Architecture", description: "Memory management, scheduling, I/O, and file systems." },
      { phase: "Advanced", title: "Kernel Development", description: "Device drivers, kernel modules, and low-level optimization." },
    ],
    topChallenges: [
      { id: "os-1", title: "Implement a Simple Shell", difficulty: "Medium", points: 500 },
      { id: "os-2", title: "Build a Memory Allocator", difficulty: "Hard", points: 700 },
      { id: "os-3", title: "Create a File System", difficulty: "Hard", points: 800 },
    ],
  },
  "ui-ux": {
    name: "UI/UX",
    icon: Palette,
    color: "text-violet-500",
    borderColor: "border-violet-500/20",
    bgAccent: "bg-violet-500/5",
    description: "Design intuitive interfaces and user experiences that delight and engage.",
    longDescription: "Create beautiful, user-centered designs. Master visual design principles, prototyping, user research, information architecture, and design systems. Learn Figma, user testing, and accessibility.",
    members: 256,
    challenges: 14,
    skills: ["Visual Design", "Prototyping", "User Research", "Figma & Design Tools", "Design Systems", "Accessibility"],
    roadmap: [
      { phase: "Foundation", title: "Design Basics", description: "Typography, color theory, layout, and design principles." },
      { phase: "UX Methods", title: "User Research", description: "User interviews, personas, journey mapping, and usability testing." },
      { phase: "Advanced", title: "Systems & Strategy", description: "Design systems, product thinking, and cross-functional collaboration." },
    ],
    topChallenges: [
      { id: "ux-1", title: "Design a Mobile Onboarding Flow", difficulty: "Easy", points: 250 },
      { id: "ux-2", title: "Create a Design System", difficulty: "Medium", points: 450 },
      { id: "ux-3", title: "Redesign a Complex Dashboard", difficulty: "Hard", points: 600 },
    ],
  },
  network: {
    name: "Network",
    icon: Wifi,
    color: "text-teal-500",
    borderColor: "border-teal-500/20",
    bgAccent: "bg-teal-500/5",
    description: "Master networking protocols, infrastructure, and distributed systems.",
    longDescription: "Build and secure network infrastructure. Learn TCP/IP, routing, switching, network security, load balancing, and distributed systems. Master protocols, troubleshooting, and network automation.",
    members: 112,
    challenges: 15,
    skills: ["TCP/IP & Protocols", "Routing & Switching", "Network Security", "Load Balancing", "DNS & CDN", "Network Automation"],
    roadmap: [
      { phase: "Foundation", title: "Network Basics", description: "OSI model, TCP/IP, subnetting, and basic protocols." },
      { phase: "Infrastructure", title: "Enterprise Networking", description: "VLANs, routing protocols, firewalls, and VPNs." },
      { phase: "Advanced", title: "Cloud & Automation", description: "SDN, network automation, cloud networking, and monitoring." },
    ],
    topChallenges: [
      { id: "net-1", title: "Configure a VPN Server", difficulty: "Medium", points: 400 },
      { id: "net-2", title: "Build a Load Balancer", difficulty: "Hard", points: 650 },
      { id: "net-3", title: "Network Traffic Analyzer", difficulty: "Easy", points: 300 },
    ],
  },
};

const TrackDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  
  if (!slug || !TRACK_DATA[slug]) {
    return <Navigate to="/planets" replace />;
  }

  const track = TRACK_DATA[slug];
  const Icon = track.icon;

  return (
    <PageLayout>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-40 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
          <Link 
            to="/planets" 
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" /> Back to Planets
          </Link>

          <div className="flex items-start gap-6 mb-8">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-2 ${track.borderColor} ${track.bgAccent} shrink-0`}>
              <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${track.color}`} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
                {track.name} Track
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                {track.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border">
            <div className="bg-background p-4 sm:p-6 text-center">
              <Users className={`w-5 h-5 ${track.color} mx-auto mb-2`} />
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">{track.members}</p>
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">Members</p>
            </div>
            <div className="bg-background p-4 sm:p-6 text-center">
              <Target className={`w-5 h-5 ${track.color} mx-auto mb-2`} />
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">{track.challenges}</p>
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">Challenges</p>
            </div>
            <div className="bg-background p-4 sm:p-6 text-center">
              <Trophy className={`w-5 h-5 ${track.color} mx-auto mb-2`} />
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">12</p>
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">Completed</p>
            </div>
            <div className="bg-background p-4 sm:p-6 text-center">
              <BookOpen className={`w-5 h-5 ${track.color} mx-auto mb-2`} />
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground">6</p>
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wider">Resources</p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* About */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">About This Track</h2>
                <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
                  {track.longDescription}
                </p>
                <Link 
                  to="/challenges" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium text-[14px]"
                >
                  Browse Challenges
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Key Skills You'll Learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {track.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 text-[14px] text-muted-foreground">
                      <div className={`w-1.5 h-1.5 ${track.bgAccent} border ${track.borderColor}`} />
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />

      {/* Roadmap */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">Learning Roadmap</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
              {track.roadmap.map((phase, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="bg-background p-6 sm:p-8">
                    <div className={`inline-block px-3 py-1 border ${track.borderColor} ${track.bgAccent} text-[11px] font-mono font-bold uppercase tracking-wider mb-4 ${track.color}`}>
                      {phase.phase}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{phase.title}</h3>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">{phase.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />

      {/* Top Challenges */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Popular Challenges</h2>
              <Link 
                to="/challenges" 
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-mono"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-px bg-border border border-border">
              {track.topChallenges.map((challenge, i) => (
                <ScrollReveal key={challenge.id} delay={i * 80}>
                  <div className="bg-background p-6 hover:bg-accent/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                          {challenge.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[12px] font-mono">
                          <span className={`px-2 py-0.5 border ${
                            challenge.difficulty === "Easy" ? "border-green-500/30 text-green-500 bg-green-500/10" :
                            challenge.difficulty === "Medium" ? "border-amber-500/30 text-amber-500 bg-amber-500/10" :
                            "border-red-500/30 text-red-500 bg-red-500/10"
                          }`}>
                            {challenge.difficulty}
                          </span>
                          <span className="text-muted-foreground">{challenge.points} points</span>
                        </div>
                      </div>
                      <Link 
                        to={`/challenges#${challenge.id}`}
                        className="px-4 py-2 border border-border hover:border-foreground hover:text-foreground text-muted-foreground transition-colors text-[13px] font-medium shrink-0"
                      >
                        Start
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default TrackDetail;
