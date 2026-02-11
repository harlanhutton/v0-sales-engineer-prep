export interface ActionItem {
  id: string
  category: "vercel" | "technical" | "sales" | "narrative"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  dueContext?: string
}

export interface KnowledgeCard {
  id: string
  category: "vercel" | "technical" | "sales"
  title: string
  summary: string
  details: string[]
  talkingPoints?: string[]
}

export interface MockQuestion {
  id: string
  category: "hr" | "technical" | "behavioral" | "sales"
  question: string
  guidanceNotes: string
  sampleFramework: string
}

export const ACTION_ITEMS: ActionItem[] = [
  // Vercel Knowledge
  {
    id: "v1",
    category: "vercel",
    title: "Deploy a Next.js project on Vercel",
    description:
      "Create and deploy a real project so you can speak from firsthand experience. Even a simple app counts -- the key is being able to reference it in conversation.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "v2",
    category: "vercel",
    title: "Explore v0 and build something with it",
    description:
      "Use v0 to generate UI components or a full page. Understand how it accelerates development -- this is a major Vercel product you should know deeply.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "v3",
    category: "vercel",
    title: "Try the AI SDK (build a simple chat or tool-calling demo)",
    description:
      "Build a small AI-powered feature using @ai-sdk/react and the AI SDK. Your LLM/agent background makes this a natural differentiator.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "v4",
    category: "vercel",
    title: "Read Vercel's startup program pages and blog posts",
    description:
      "Understand how Vercel partners with VCs, accelerators (YC, a16z), and early-stage companies. Know the startup tier pricing and what makes Vercel compelling for seed-stage teams.",
    priority: "medium",
    dueContext: "Before HR screen",
  },
  {
    id: "v5",
    category: "vercel",
    title: "Understand Vercel's product suite end-to-end",
    description:
      "Be able to explain: Vercel Platform, Next.js, v0, AI SDK, Edge Network, Analytics, Speed Insights, Firewall, and how they connect. Review the Vercel docs overview.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "v6",
    category: "vercel",
    title: "Learn Vercel's competitive positioning",
    description:
      "Understand how Vercel differentiates from Netlify, AWS Amplify, Cloudflare Pages, and Railway. Know the DX, performance, and ecosystem arguments.",
    priority: "medium",
    dueContext: "Before technical rounds",
  },
  {
    id: "v7",
    category: "vercel",
    title: "Review Vercel case studies and customer stories",
    description:
      "Read 3-5 case studies on vercel.com/customers. Note patterns: what industries, what problems, what outcomes. Be ready to reference these in conversation.",
    priority: "medium",
    dueContext: "Before technical rounds",
  },

  // Technical Knowledge
  {
    id: "t1",
    category: "technical",
    title: "Build a multi-page Next.js app with App Router",
    description:
      "Create an app using the App Router with layouts, server components, client components, and dynamic routes. Understand RSC vs client component tradeoffs.",
    priority: "high",
    dueContext: "Before technical rounds",
  },
  {
    id: "t2",
    category: "technical",
    title: "Understand React Server Components deeply",
    description:
      "Know: what renders on the server vs client, when to use 'use client', streaming, suspense boundaries, and data fetching patterns. This is core Next.js knowledge.",
    priority: "high",
    dueContext: "Before technical rounds",
  },
  {
    id: "t3",
    category: "technical",
    title: "Learn Next.js caching and ISR",
    description:
      "Understand the caching layers: fetch cache, full route cache, router cache. Know how to use revalidateTag, revalidatePath, and ISR for incremental updates.",
    priority: "medium",
    dueContext: "Before technical rounds",
  },
  {
    id: "t4",
    category: "technical",
    title: "Practice explaining technical concepts simply",
    description:
      "Take 3 complex topics (RSC, Edge computing, CI/CD) and practice explaining each in 60 seconds to a non-technical audience. Record yourself and refine.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "t5",
    category: "technical",
    title: "Understand Edge vs Serverless vs Static rendering",
    description:
      "Know when and why to use each rendering strategy. Be able to advise a startup CTO on which approach fits their use case.",
    priority: "medium",
    dueContext: "Before technical rounds",
  },
  {
    id: "t6",
    category: "technical",
    title: "Review React 19 features and patterns",
    description:
      "Understand Server Actions, useFormStatus, useOptimistic, and the new hooks. Next.js 16 builds on React 19 -- this shows you're current.",
    priority: "low",
    dueContext: "Before technical rounds",
  },

  // Sales & Startup Skills
  {
    id: "s1",
    category: "sales",
    title: "Prepare your 'why SE, why Vercel, why now' narrative",
    description:
      "Craft a 60-90 second story connecting your engineering background to this role. Hit: impact multiplication, enabling developers, Vercel's AI moment.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "s2",
    category: "sales",
    title: "Research the startup sales cycle",
    description:
      "Understand: discovery calls, technical demos, POCs, procurement at early-stage companies. Know how startup buying decisions differ from enterprise.",
    priority: "medium",
    dueContext: "Before HR screen",
  },
  {
    id: "s3",
    category: "sales",
    title: "Practice the MEDDPICC framework basics",
    description:
      "Learn the MEDDPICC qualification methodology (Metrics, Economic Buyer, Decision criteria, etc). Vercel's sales org likely uses a variant of this.",
    priority: "medium",
    dueContext: "Before later rounds",
  },
  {
    id: "s4",
    category: "sales",
    title: "Prepare 3 STAR-format stories",
    description:
      "Stories for: (1) Translating tech for non-technical audiences, (2) Enabling developers with tools/processes, (3) Operating independently on ambiguous work.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "s5",
    category: "sales",
    title: "Learn to frame features as business outcomes",
    description:
      "Practice converting technical features into business value: 'faster builds' -> 'ship features 3x faster' -> 'beat competitors to market'. This is core SE skill.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "s6",
    category: "sales",
    title: "Understand startup pain points Vercel solves",
    description:
      "Small team, need to move fast, can't afford DevOps overhead, want enterprise-grade infra without enterprise complexity. Practice articulating these.",
    priority: "medium",
    dueContext: "Before HR screen",
  },

  // Personal Narrative
  {
    id: "n1",
    category: "narrative",
    title: "Frame your Google experience as an asset, not a gap",
    description:
      "You built systems used by thousands of engineers. That's SE work -- enabling developers. The CLI tool 'adopted by hundreds of engineers' is your headline story.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "n2",
    category: "narrative",
    title: "Connect your AI expertise to Vercel's strategy",
    description:
      "Vercel's AI products (v0, AI SDK, AI Gateway) are central to their growth. Your agentic systems, LLM tool-use, and NeurIPS work make you uniquely qualified for AI-native startups.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "n3",
    category: "narrative",
    title: "Prepare answers for the 'no sales experience' question",
    description:
      "Reframe: intern mentorship = coaching/enablement, CLI tool adoption = driving adoption, cross-team collab = stakeholder management. These ARE proto-SE skills.",
    priority: "high",
    dueContext: "Before HR screen",
  },
  {
    id: "n4",
    category: "narrative",
    title: "Research your interviewers on LinkedIn",
    description:
      "Look up likely HR screeners and hiring managers. Understand their backgrounds and tailor your conversation accordingly.",
    priority: "medium",
    dueContext: "Before HR screen",
  },
]

export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: "k1",
    category: "vercel",
    title: "Vercel Platform",
    summary:
      "The frontend cloud platform that enables developers to build, deploy, and scale web applications with zero configuration.",
    details: [
      "Automatic deployments from Git (GitHub, GitLab, Bitbucket)",
      "Preview deployments for every pull request",
      "Global Edge Network with 100+ points of presence",
      "Built-in CI/CD -- no separate pipeline needed",
      "Environment variables, team collaboration, and access controls",
      "Integrations marketplace for databases, CMS, analytics",
    ],
    talkingPoints: [
      "For startups: 'Deploy in minutes, not days. No DevOps hire needed.'",
      "The preview deployment workflow transforms team collaboration -- every PR gets a live URL to share with stakeholders.",
      "Scales from side project to millions of users without infrastructure changes.",
    ],
  },
  {
    id: "k2",
    category: "vercel",
    title: "Next.js",
    summary:
      "React framework for production with hybrid rendering, built-in routing, and full-stack capabilities. The most popular React framework.",
    details: [
      "App Router: file-system based routing with layouts, loading, and error states",
      "React Server Components: render on the server by default, reducing JS sent to client",
      "Server Actions: mutate data directly from components without API routes",
      "Streaming: progressive rendering with Suspense boundaries",
      "Built-in optimizations: Image, Font, Script, and Metadata APIs",
      "Middleware: run logic at the edge before a request completes",
    ],
    talkingPoints: [
      "Next.js is the default choice for new React projects -- especially at startups where speed matters.",
      "Server Components mean faster initial loads and better SEO -- critical for startups trying to grow organically.",
      "Full-stack in one framework: API routes + server actions + database access. One fewer thing to set up.",
    ],
  },
  {
    id: "k3",
    category: "vercel",
    title: "v0 by Vercel",
    summary:
      "AI-powered UI generation tool that converts natural language prompts into production-ready React components using shadcn/ui and Tailwind.",
    details: [
      "Generates full React components from text descriptions",
      "Uses shadcn/ui component library and Tailwind CSS",
      "Iterative refinement through conversation",
      "One-click deployment to Vercel or copy code directly",
      "Supports complex layouts, forms, dashboards, and interactive UIs",
      "Built on top of Vercel's AI infrastructure",
    ],
    talkingPoints: [
      "For startups: 'Go from idea to deployed prototype in minutes, not weeks.'",
      "v0 is how Vercel practices what it preaches -- using AI to accelerate development.",
      "The code is real, production-quality React -- not a no-code locked-in solution.",
    ],
  },
  {
    id: "k4",
    category: "vercel",
    title: "AI SDK",
    summary:
      "TypeScript toolkit for building AI-powered applications. Unified API for multiple LLM providers with streaming, tool calling, and structured output.",
    details: [
      "Unified API across OpenAI, Anthropic, Google, and more",
      "Streaming text and object generation",
      "Tool calling and multi-step agents",
      "Structured output with Zod schema validation",
      "React hooks for chat UIs (@ai-sdk/react)",
      "Vercel AI Gateway for zero-config provider access",
    ],
    talkingPoints: [
      "Your agentic systems background at Google maps directly to AI SDK's tool-calling and multi-step agent patterns.",
      "For AI-native startups: 'Switch LLM providers without rewriting your app. Ship AI features in hours.'",
      "AI Gateway handles API keys and routing -- one fewer integration headache for small teams.",
    ],
  },
  {
    id: "k5",
    category: "vercel",
    title: "Edge Network & Infrastructure",
    summary:
      "Vercel's global edge network powers fast content delivery, edge compute, and serverless functions across 100+ locations.",
    details: [
      "Edge Functions: run server-side code at the edge, close to users",
      "Serverless Functions: Node.js/Python/Go/Ruby backend logic",
      "Edge Middleware: rewrite, redirect, or modify requests before they hit your app",
      "Image Optimization: automatic resizing, format conversion, lazy loading",
      "DDoS protection and Web Application Firewall",
      "Analytics and Speed Insights for performance monitoring",
    ],
    talkingPoints: [
      "Edge means your users in Tokyo get the same speed as users in San Francisco.",
      "For startups scaling globally: 'Enterprise-grade infrastructure without the enterprise setup.'",
      "Observability built in -- no separate APM tool needed to understand your app's performance.",
    ],
  },
  {
    id: "k6",
    category: "technical",
    title: "React Server Components (RSC)",
    summary:
      "Components that render exclusively on the server, reducing client-side JavaScript and enabling direct database/API access.",
    details: [
      "Server Components are the default in Next.js App Router",
      "They can directly access databases, file systems, and APIs",
      "Zero JavaScript sent to the client for server components",
      "Use 'use client' directive only when you need interactivity (state, effects, browser APIs)",
      "Can be streamed to the client with Suspense boundaries",
      "Compose server and client components together in the component tree",
    ],
    talkingPoints: [
      "Think of RSC as the best of both worlds: the DX of React with the performance of server rendering.",
      "The mental model: 'Everything is a server component unless it needs to be interactive.'",
      "For startups: faster loads, better SEO, simpler data fetching -- all without sacrificing the React development experience.",
    ],
  },
  {
    id: "k7",
    category: "technical",
    title: "App Router Architecture",
    summary:
      "Next.js file-system based routing with nested layouts, loading states, error boundaries, and parallel routes.",
    details: [
      "File-based routing: folders = routes, page.tsx = UI",
      "layout.tsx persists across navigations (no re-render)",
      "loading.tsx provides instant loading states with Suspense",
      "error.tsx catches errors at the route segment level",
      "route.ts for API endpoints within the app directory",
      "Parallel routes (@folder) and intercepting routes for complex UIs",
    ],
    talkingPoints: [
      "The App Router eliminates entire categories of routing libraries and boilerplate.",
      "Nested layouts mean shared UI (navbars, sidebars) just works without prop drilling or context.",
      "For startups: convention over configuration = less time on architecture decisions, more time building features.",
    ],
  },
  {
    id: "k8",
    category: "sales",
    title: "Startup Sales Motion",
    summary:
      "How selling to startups differs from enterprise: faster cycles, founder-led decisions, value-first approach, and developer advocacy.",
    details: [
      "Decision makers are often technical founders or CTOs",
      "Sales cycles are days/weeks, not months/quarters",
      "Developers are the buyers -- if they love it, they adopt it",
      "Product-led growth: free tier adoption -> team usage -> paid plan",
      "Trust is built through technical credibility, not slides",
      "Startups care about: speed to ship, cost efficiency, scalability promise",
    ],
    talkingPoints: [
      "Your engineering background IS the qualification for startup sales -- founders want to talk to someone who understands their stack.",
      "The SE role with startups is more 'technical advisor' than 'salesperson' -- you're helping them make the right architecture choice.",
      "Land-and-expand: help them deploy one project, and the rest of their stack follows.",
    ],
  },
  {
    id: "k9",
    category: "sales",
    title: "Value Selling for Vercel",
    summary:
      "Translating Vercel's technical features into business outcomes that resonate with startup founders and CTOs.",
    details: [
      "Speed: 'Ship features in hours, not weeks' (preview deploys, instant rollbacks)",
      "Cost: 'No DevOps hire needed' ($150K+ salary saved)",
      "Scale: 'Infrastructure that grows with you from 0 to IPO'",
      "Quality: 'Built-in performance monitoring catches issues before users do'",
      "Talent: 'Developers want to work with modern tools -- Vercel helps you recruit'",
      "Focus: 'Spend engineering time on your product, not your infrastructure'",
    ],
    talkingPoints: [
      "Always lead with the business outcome, then explain the technical how.",
      "For seed-stage: emphasize speed and cost. For Series A+: emphasize scale and reliability.",
      "Frame everything as: 'What would your team do with the time you get back?'",
    ],
  },
]

export const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: "q1",
    category: "hr",
    question: "Why are you interested in the Sales Engineer role at Vercel?",
    guidanceNotes:
      "This is your 'why SE, why Vercel, why now' moment. Connect your engineering background to impact multiplication. Show genuine passion for developer tools and the Vercel mission.",
    sampleFramework:
      "Start with what excites you about Vercel's mission (developer experience, AI). Then bridge from your engineering career -- you've seen the impact of great tooling at Google scale. Explain why SE specifically: you want to help hundreds of teams ship better products, not just ship features yourself. Close with timing: Vercel's AI products + your AI background = unique fit.",
  },
  {
    id: "q2",
    category: "hr",
    question:
      "Tell me about your experience. How does it prepare you for this role?",
    guidanceNotes:
      "Lead with your Google SWE experience but immediately bridge to SE-relevant skills. Don't just list technical achievements -- frame them as enabling others.",
    sampleFramework:
      "Highlight: (1) CLI tool adopted by hundreds of engineers -- that's driving developer adoption. (2) Leading interns and cross-team projects -- that's stakeholder management and technical mentorship. (3) AI/ML platform work -- directly relevant to Vercel's AI-native startup customers. Frame your NeurIPS publication as ability to communicate complex technical concepts clearly.",
  },
  {
    id: "q3",
    category: "hr",
    question:
      "You don't have traditional sales experience. How do you see yourself succeeding in this role?",
    guidanceNotes:
      "Acknowledge directly, then reframe. Show self-awareness and a clear plan to ramp up on the sales side while emphasizing that your technical depth is the hard-to-find part.",
    sampleFramework:
      "Acknowledge that you haven't carried a quota. Then reframe: the hardest part of SE is the technical credibility -- you have that. The sales methodology can be learned. Point to proto-SE experiences: driving adoption of your CLI tool, mentoring developers, explaining complex systems to non-experts. Express eagerness to learn the sales motion and note that startup selling is closer to technical advising than traditional sales.",
  },
  {
    id: "q4",
    category: "behavioral",
    question:
      "Tell me about a time you had to explain a complex technical concept to a non-technical audience.",
    guidanceNotes:
      "Use STAR format. Pick a specific example -- could be explaining your NeurIPS work to business stakeholders, or teaching interns about your systems.",
    sampleFramework:
      "Situation: Specific context and who you were explaining to. Task: What concept needed to be communicated and why it mattered. Action: How you simplified without losing accuracy -- analogies, demos, visuals. Result: What happened as a result -- did they make a decision, change approach, approve a project?",
  },
  {
    id: "q5",
    category: "behavioral",
    question:
      "Describe a time you independently drove a project from ambiguity to completion.",
    guidanceNotes:
      "The job posting emphasizes 'operating independently' and 'thriving in ambiguity.' Pick a project where you defined the direction, not just executed on a spec.",
    sampleFramework:
      "Your CLI tool or the LLM Agent Evaluation framework are strong choices. Show: (1) How the problem was undefined/ambiguous. (2) How you scoped it yourself. (3) How you built stakeholder buy-in. (4) The measurable outcome (adoption, impact metrics).",
  },
  {
    id: "q6",
    category: "technical",
    question:
      "A startup CTO asks: 'Why should we use Vercel instead of just deploying on AWS?' How do you respond?",
    guidanceNotes:
      "Don't bash AWS. Acknowledge it's powerful, then explain the tradeoff: Vercel gives you the same reliability with 10x less configuration. Frame it in startup terms: time, team size, focus.",
    sampleFramework:
      "Acknowledge AWS is powerful and flexible. Then: 'The question is whether your 5-person team should spend engineering cycles managing infrastructure, or shipping product features. Vercel gives you enterprise-grade deployment, CDN, serverless, and observability out of the box. Your team pushes to Git and it's live globally. That's weeks of DevOps setup you skip.' Reference a specific case study if you can.",
  },
  {
    id: "q7",
    category: "sales",
    question:
      "How would you approach a startup that's currently on a competitor platform and is evaluating Vercel?",
    guidanceNotes:
      "Show consultative approach, not hard sell. Understand their current setup, identify pain points, propose a low-risk migration path.",
    sampleFramework:
      "Start with discovery: 'What's working well for you today? Where are the pain points?' Then identify the gap Vercel fills -- usually it's DX, deployment speed, or scaling concerns. Propose a low-friction proof: 'Let's deploy one project on Vercel and compare the experience side by side.' Don't push for a full migration -- let the experience sell itself.",
  },
  {
    id: "q8",
    category: "hr",
    question: "What are your compensation expectations?",
    guidanceNotes:
      "The posted OTE range for SF is $180K-$275K. Coming from Google SWE III, you're likely in range. Try to defer detailed discussion but show you've done your research.",
    sampleFramework:
      "Express flexibility and focus on total opportunity. 'I've seen the posted range and it's within my expectations. I'm most focused on finding the right role and team -- I'm confident we can work out compensation once we establish mutual fit.' If pressed, give a range based on the posting.",
  },
]

export const CATEGORIES = {
  vercel: { label: "Vercel Knowledge", color: "text-primary" },
  technical: { label: "Next.js & React", color: "text-chart-2" },
  sales: { label: "Sales & Startups", color: "text-warning" },
  narrative: { label: "Your Story", color: "text-chart-5" },
  hr: { label: "HR Screen", color: "text-primary" },
  behavioral: { label: "Behavioral", color: "text-chart-2" },
} as const
