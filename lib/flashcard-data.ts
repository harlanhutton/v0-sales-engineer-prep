export interface Flashcard {
  id: string
  category: string
  question: string
  answer: string
}

export const FLASHCARD_CATEGORIES: Record<string, string> = {
  all: "All",
  platform: "Platform",
  nextjs: "Next.js",
  infrastructure: "Infrastructure",
  dx: "Developer Experience",
  ai: "AI",
  enterprise: "Enterprise",
}

export const FLASHCARDS: Flashcard[] = [
  // Platform
  {
    id: "p1",
    category: "platform",
    question: "What is Vercel's core value proposition?",
    answer:
      "Vercel is a frontend cloud platform that enables developers to build, deploy, and scale web applications with zero configuration. It provides the best developer experience with instant deployments, automatic previews, and global edge infrastructure.",
  },
  {
    id: "p2",
    category: "platform",
    question: "How does Vercel's preview deployment system work?",
    answer:
      "Every git push to a branch automatically generates a unique preview URL. This enables teams to review changes before merging. Preview deployments are isolated environments with their own URLs, environment variables, and can be shared with stakeholders for feedback.",
  },
  {
    id: "p3",
    category: "platform",
    question: "What is the Vercel Toolbar?",
    answer:
      "A browser extension and embedded widget that provides contextual tools for reviewing deployments, leaving comments on previews, toggling feature flags, and accessing draft content -- all without leaving the page.",
  },
  {
    id: "p4",
    category: "platform",
    question: "How does Vercel handle domains and DNS?",
    answer:
      "Vercel provides automatic SSL/TLS certificates, global DNS with anycast routing, and simple domain management. Custom domains can be added via the dashboard or CLI, with automatic HTTPS and DNS propagation typically completing in under a minute.",
  },

  // Next.js
  {
    id: "n1",
    category: "nextjs",
    question: "What is the difference between the App Router and Pages Router?",
    answer:
      "The App Router (introduced in Next.js 13) uses React Server Components by default, supports nested layouts, streaming, and has a file-based routing system using folders. The Pages Router uses client-side React components by default with getServerSideProps/getStaticProps for data fetching.",
  },
  {
    id: "n2",
    category: "nextjs",
    question: "What are Server Components in Next.js?",
    answer:
      "React Server Components (RSC) render on the server, reducing client JavaScript bundle size. They can directly access databases, APIs, and the filesystem. They don't include client-side interactivity -- for that, you use 'use client' directive to mark Client Components.",
  },
  {
    id: "n3",
    category: "nextjs",
    question: "What is ISR (Incremental Static Regeneration)?",
    answer:
      "ISR allows you to update static pages after they've been built without rebuilding the entire site. Pages are regenerated in the background when a request comes in after the revalidation period. This combines the performance of static with the freshness of dynamic.",
  },
  {
    id: "n4",
    category: "nextjs",
    question: "What are Server Actions in Next.js?",
    answer:
      "Server Actions are async functions that run on the server, defined with 'use server' directive. They can be called directly from Client Components for mutations (form submissions, data updates) without creating separate API routes. They support progressive enhancement.",
  },
  {
    id: "n5",
    category: "nextjs",
    question: "What is the 'use cache' directive in Next.js 16?",
    answer:
      "The 'use cache' directive enables Cache Components -- a new explicit caching model. It can be applied at the file, component, or function level. The compiler automatically generates cache keys, making caching more granular and flexible than previous page-level caching.",
  },

  // Infrastructure
  {
    id: "i1",
    category: "infrastructure",
    question: "What is Vercel's Edge Network?",
    answer:
      "Vercel's Edge Network is a globally distributed CDN that serves content from data centers closest to users. It supports Edge Functions (lightweight compute at the edge), Edge Middleware, and static asset caching with automatic invalidation on new deployments.",
  },
  {
    id: "i2",
    category: "infrastructure",
    question: "How do Serverless Functions work on Vercel?",
    answer:
      "Serverless Functions on Vercel are auto-scaling compute units that run on-demand. They support Node.js, Python, Go, and Ruby. Each API route or Server Component becomes a serverless function. They scale to zero when idle and scale up automatically under load.",
  },
  {
    id: "i3",
    category: "infrastructure",
    question: "What is Edge Middleware?",
    answer:
      "Edge Middleware runs before a request reaches your application, at the edge closest to the user. It can rewrite URLs, redirect, add headers, implement A/B testing, handle authentication, and personalize content -- all with sub-millisecond cold starts.",
  },
  {
    id: "i4",
    category: "infrastructure",
    question: "What is Vercel Firewall?",
    answer:
      "Vercel Firewall provides DDoS protection, rate limiting, IP blocking, and custom security rules at the edge. It integrates natively with Vercel deployments and can be configured via the dashboard or Infrastructure as Code.",
  },

  // Developer Experience
  {
    id: "d1",
    category: "dx",
    question: "What is v0 by Vercel?",
    answer:
      "v0 is an AI-powered development tool that generates production-ready code from natural language prompts. It creates React components using shadcn/ui and Tailwind CSS, supports full-stack apps with database integrations, and can deploy directly to Vercel.",
  },
  {
    id: "d2",
    category: "dx",
    question: "What is Vercel's CI/CD pipeline?",
    answer:
      "Vercel provides a built-in CI/CD pipeline triggered by Git pushes. Every commit to a connected repo triggers a build, generates preview deployments for branches/PRs, runs checks, and auto-deploys production on merge to main. No separate CI service needed.",
  },
  {
    id: "d3",
    category: "dx",
    question: "What are Vercel Feature Flags?",
    answer:
      "Native Feature Flags (built into Vercel) allow you to control feature rollout without redeploying. They support boolean, string, and number types, with targeting rules per environment (production, preview, development). They integrate with the Vercel Toolbar for easy toggling.",
  },
  {
    id: "d4",
    category: "dx",
    question: "How does Vercel Speed Insights work?",
    answer:
      "Speed Insights collects real user performance metrics (Core Web Vitals: LCP, FID, CLS, TTFB) from actual visitors. It provides per-page breakdowns, tracks performance over time, and helps identify regressions -- all without any third-party scripts.",
  },

  // AI
  {
    id: "a1",
    category: "ai",
    question: "What is the Vercel AI SDK?",
    answer:
      "The AI SDK is an open-source TypeScript library for building AI-powered applications. It provides unified APIs for streaming text, structured output, tool calling, and building agents. It works with any model provider (OpenAI, Anthropic, etc.) through a single interface.",
  },
  {
    id: "a2",
    category: "ai",
    question: "What is the Vercel AI Gateway?",
    answer:
      "The AI Gateway is a proxy that routes AI API calls through Vercel's infrastructure. It provides zero-config access to multiple model providers, handles API keys, adds caching, rate limiting, and usage tracking -- all without installing provider-specific packages.",
  },
  {
    id: "a3",
    category: "ai",
    question: "What is tool calling in the AI SDK?",
    answer:
      "Tool calling lets AI models execute functions during a conversation. You define tools with descriptions and Zod schemas, and the model decides when to call them. The SDK handles the execute/response loop, enabling agents that can query databases, call APIs, or perform actions.",
  },
  {
    id: "a4",
    category: "ai",
    question: "What is a ToolLoopAgent in AI SDK 6?",
    answer:
      "ToolLoopAgent is a class that orchestrates multi-step AI interactions. It allows the model to call tools repeatedly in a loop until a stop condition is met (e.g., stepCountIs(10)). It's the foundation for building autonomous agents that can solve complex, multi-step problems.",
  },

  // Enterprise
  {
    id: "e1",
    category: "enterprise",
    question: "What compliance certifications does Vercel hold?",
    answer:
      "Vercel is SOC 2 Type II compliant, GDPR compliant, and HIPAA eligible (on Enterprise plans). It also supports SAML SSO, audit logs, and custom security policies for enterprise customers.",
  },
  {
    id: "e2",
    category: "enterprise",
    question: "What is Vercel's Enterprise offering?",
    answer:
      "Vercel Enterprise includes dedicated support, SLAs (99.99% uptime), advanced security features (SSO, audit logs, IP allowlisting), custom billing, higher limits, multi-region failover, and dedicated account management.",
  },
  {
    id: "e3",
    category: "enterprise",
    question: "How does Vercel handle observability?",
    answer:
      "Vercel provides built-in observability through Logs (real-time serverless function logs), Speed Insights (Core Web Vitals), Web Analytics (privacy-friendly visitor tracking), and integrations with third-party tools like Datadog, Sentry, and LogRocket.",
  },
  {
    id: "e4",
    category: "enterprise",
    question: "What is Vercel Secure Compute?",
    answer:
      "Secure Compute provides dedicated, isolated compute environments for Serverless Functions. It enables private networking, VPC peering, and dedicated IP addresses -- letting enterprise customers connect Vercel to private databases and internal services securely.",
  },
]
