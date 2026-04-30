"use client";

import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import {
  FlaskConical,
  Building2,
  Lightbulb,
  Users2,
  Cpu,
  DollarSign,
  Settings2,
  PencilLine,
  GraduationCap,
  Code2,
  Award,
  Zap,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Globe,
  Lock,
  Quote,
  Mail,
  Server,
  Wand2,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

/* ----------------------------- small utilities ---------------------------- */

type CardItem = {
  title: string;
  desc: string;
  icon?: string;
  tags?: string[];
};

type ApproachItem = {
  k: string;
  title: string;
  desc: string;
  icon?: string;
};

type Testimonial = {
  quote: string;
  name: string;
  meta: string;
};

type PillItem = { label: string; tone?: "cyan" | "green" | "violet" | "orange"; icon?: boolean };
type SimpleBadge = { label: string; icon?: string };
type StatItem = { title: string; sub: string; icon?: string };

type SectionHeaderContent = {
  prefix?: string;
  title: string;
  subtitle?: string;
  icon?: string;
};

export type LabsContent = {
  nav?: { items: Array<{ label: string; href: string }> };
  hero?: {
    pills?: PillItem[];
    icon?: string;
    title?: string;
    subtitle?: string;
    lead?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    trustBadges?: SimpleBadge[];
    quickStats?: StatItem[];
  };
  core?: { header?: SectionHeaderContent; items?: CardItem[] };
  focus?: { header?: SectionHeaderContent; items?: CardItem[] };
  approach?: { header?: SectionHeaderContent; items?: ApproachItem[] };
  programs?: { header?: SectionHeaderContent; items?: CardItem[] };
  testimonials?: { header?: SectionHeaderContent; items?: Testimonial[] };
  contact?: {
    imageUrl?: string;
    imageAlt?: string;
    badgeTitle?: string;
    badgeSubtitle?: string;
    kicker?: string;
    title?: string;
    subtitle?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    infoCards?: Array<{ title: string; desc: string }>;
  };
};

type LabsPageClientProps = {
  content?: LabsContent | null;
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  flask: FlaskConical,
  building: Building2,
  lightbulb: Lightbulb,
  users2: Users2,
  cpu: Cpu,
  dollar: DollarSign,
  settings: Settings2,
  pencil: PencilLine,
  graduation: GraduationCap,
  code: Code2,
  award: Award,
  zap: Zap,
  arrow: ArrowRight,
  chevron: ChevronRight,
  shield: ShieldCheck,
  globe: Globe,
  lock: Lock,
  quote: Quote,
  mail: Mail,
  server: Server,
  wand: Wand2,
  badge: BadgeCheck,
  sparkles: Sparkles,
};

function iconNode(name: string | undefined, className: string) {
  const Icon = (name && ICONS[name]) || FlaskConical;
  return <Icon className={className} />;
}

export const DEFAULT_CONTENT: LabsContent = {
  nav: {
    items: [
      { label: "Overview", href: "#overview" },
      { label: "Core", href: "#core" },
      { label: "Programs", href: "#programs" },
      { label: "Contact", href: "#contact" },
    ],
  },
  hero: {
    pills: [
      { label: "Innovation engine", tone: "cyan", icon: true },
      { label: "Research - Prototyping", tone: "green" },
      { label: "Programs - Community", tone: "violet" },
    ],
    icon: "flask",
    title: "HOPn Labs",
    subtitle: "Where ideas become prototypes - and prototypes become impact.",
    lead:
      "A dynamic ecosystem for research, development, collaboration, and learning - turning visionary ideas into practical, measurable outcomes.",
    primaryCta: { label: "Explore Programs", href: "#programs" },
    secondaryCta: { label: "Collaborate With Us", href: "/contact" },
    trustBadges: [
      { label: "Safe experimentation", icon: "lock" },
      { label: "Delivery discipline", icon: "shield" },
      { label: "Partnerships & community", icon: "globe" },
    ],
    quickStats: [
      { title: "Governance", sub: "Evidence, controls, audit trails", icon: "shield" },
      { title: "Velocity", sub: "Fast cycles, measurable learning", icon: "zap" },
      { title: "Network", sub: "Labs, partners, programs", icon: "globe" },
    ],
  },
  core: {
    header: {
      prefix: "HOPn Labs",
      title: "Core Functions",
      subtitle: "Four pillars that power experimentation, partnerships, and delivery.",
      icon: "flask",
    },
    items: [
      {
        title: "Research & Development Hub",
        desc: "A focused environment for experimentation and delivery - turning ideas into secure, usable prototypes and products.",
        icon: "flask",
        tags: ["Rapid prototyping", "Applied research", "Delivery-ready"],
      },
      {
        title: "University Partnerships",
        desc: "We collaborate with universities to connect theoretical research to real deployments and measurable outcomes.",
        icon: "building",
        tags: ["Joint research", "Curriculum", "Talent pipeline"],
      },
      {
        title: "Idea Incubation & Prototyping",
        desc: "From concept to clickable demo fast - validate assumptions, iterate, and learn with real feedback.",
        icon: "lightbulb",
        tags: ["Experiments", "MVPs", "Validation"],
      },
      {
        title: "Support for Emerging Projects",
        desc: "Resources, mentorship, and a collaborative ecosystem to accelerate partner projects and internal initiatives.",
        icon: "users2",
        tags: ["Mentorship", "Partnerships", "Acceleration"],
      },
    ],
  },
  focus: {
    header: {
      prefix: "HOPn Labs",
      title: "Key Focus Areas",
      subtitle: "Applied research and product thinking across AI and FinTech.",
      icon: "cpu",
    },
    items: [
      {
        title: "AI Ahead: Learn - Lead - Innovate",
        desc: "Applied AI research and productization for practical solutions and real-world value.",
        icon: "cpu",
        tags: ["LLMs", "Vision", "MLOps"],
      },
      {
        title: "Empowering FinTech with AI",
        desc: "AI-driven FinTech solutions that reduce friction, increase trust, and improve decision-making.",
        icon: "dollar",
        tags: ["Fraud", "Credit", "Personalization"],
      },
      {
        title: "AI-Powered Automation",
        desc: "Transform workflows with intelligent automation that improves speed, quality, and cost efficiency.",
        icon: "settings",
        tags: ["Workflows", "RPA+", "Observability"],
      },
    ],
  },
  approach: {
    header: {
      prefix: "HOPn Labs",
      title: "How We Work",
      subtitle: "A repeatable way to learn fast, reduce risk, and ship outcomes.",
      icon: "shield",
    },
    items: [
      { k: "01", title: "Discover", desc: "Define goals, constraints, and success metrics with stakeholders.", icon: "users2" },
      { k: "02", title: "Design", desc: "Architecture, data flows, and risk controls built around outcomes.", icon: "wand" },
      { k: "03", title: "Deliver", desc: "Iterative prototypes and pilots with feedback loops and measurable results.", icon: "server" },
      { k: "04", title: "Scale", desc: "Production hardening, governance, and a roadmap to grow adoption.", icon: "badge" },
    ],
  },
  programs: {
    header: {
      prefix: "HOPn Labs",
      title: "Programs & Initiatives",
      subtitle: "Learn, build, and collaborate through hands-on programs and community projects.",
      icon: "zap",
    },
    items: [
      {
        title: "Bootcamps & Workshops",
        desc: "Hands-on learning with real projects - practical skills designed to create real impact.",
        icon: "pencil",
        tags: ["Hands-on", "Mentored", "Project-based"],
      },
      {
        title: "Opportunities for Students",
        desc: "Internships, mentoring, and participation in innovation - learn by shipping real work.",
        icon: "graduation",
        tags: ["Internships", "Mentoring", "Experience"],
      },
      {
        title: "Hackathons & Open Source",
        desc: "Collaborate, build fast, and contribute to initiatives that matter in AI and FinTech.",
        icon: "code",
        tags: ["Hackathons", "Open source", "Community"],
      },
    ],
  },
  testimonials: {
    header: {
      prefix: "HOPn Labs",
      title: "What People Say",
      subtitle: "A few examples of what partners and participants value.",
      icon: "quote",
    },
    items: [
      {
        quote: "The lab structure made experimentation safe and fast - we went from idea to pilot with confidence.",
        name: "Product Lead",
        meta: "Innovation Program",
      },
      {
        quote: "University collaboration helped us turn research into something teams could actually ship and measure.",
        name: "Engineering Manager",
        meta: "Applied AI",
      },
      {
        quote: "The workshops produced real projects, not just certificates - the outcomes were immediately useful.",
        name: "Program Partner",
        meta: "Talent & Training",
      },
    ],
  },
  contact: {
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Collaboration",
    badgeTitle: "Build with the Lab",
    badgeSubtitle: "Research - Pilots - Programs",
    kicker: "Start a conversation",
    title: "Ready to build your next prototype or program?",
    subtitle:
      "Tell us what you want to explore - we'll reply with a suggested collaboration model, timeline, and next steps.",
    primaryCta: { label: "Collaborate With Us", href: "/contact" },
    secondaryCta: { label: "Explore Events", href: "/events" },
    infoCards: [
      { title: "Safe to try", desc: "Governance, guardrails, and evidence." },
      { title: "Built to ship", desc: "Pilots that scale into production." },
    ],
  },
};

function mergeContent(override?: LabsContent | null): LabsContent {
  const o = override || {};
  return {
    ...DEFAULT_CONTENT,
    ...o,
    nav: {
      ...DEFAULT_CONTENT.nav,
      ...o.nav,
      items: o.nav?.items ?? DEFAULT_CONTENT.nav?.items ?? [],
    },
    hero: {
      ...DEFAULT_CONTENT.hero,
      ...o.hero,
      pills: o.hero?.pills ?? DEFAULT_CONTENT.hero?.pills,
      trustBadges: o.hero?.trustBadges ?? DEFAULT_CONTENT.hero?.trustBadges,
      quickStats: o.hero?.quickStats ?? DEFAULT_CONTENT.hero?.quickStats,
    },
    core: {
      ...DEFAULT_CONTENT.core,
      ...o.core,
      items: o.core?.items ?? DEFAULT_CONTENT.core?.items,
    },
    focus: {
      ...DEFAULT_CONTENT.focus,
      ...o.focus,
      items: o.focus?.items ?? DEFAULT_CONTENT.focus?.items,
    },
    approach: {
      ...DEFAULT_CONTENT.approach,
      ...o.approach,
      items: o.approach?.items ?? DEFAULT_CONTENT.approach?.items,
    },
    programs: {
      ...DEFAULT_CONTENT.programs,
      ...o.programs,
      items: o.programs?.items ?? DEFAULT_CONTENT.programs?.items,
    },
    testimonials: {
      ...DEFAULT_CONTENT.testimonials,
      ...o.testimonials,
      items: o.testimonials?.items ?? DEFAULT_CONTENT.testimonials?.items,
    },
    contact: {
      ...DEFAULT_CONTENT.contact,
      ...o.contact,
      infoCards: o.contact?.infoCards ?? DEFAULT_CONTENT.contact?.infoCards,
    },
  };
}

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

function useInViewOnce<T extends HTMLElement>(offsetPx = 140) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { root: null, rootMargin: `0px 0px -${offsetPx}px 0px`, threshold: 0.08 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [offsetPx]);

  return { ref, inView };
}

function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(160);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={["reveal", inView ? "reveal--in" : "reveal--out", className].join(" ")}
    >
      {children}
    </div>
  );
}

/**
 * Theme-safe Pill (works in light/dark)
 */
function Pill({
  children,
  tone = "cyan",
  icon = false,
}: {
  children: React.ReactNode;
  tone?: "cyan" | "green" | "violet" | "orange";
  icon?: boolean;
}) {
  const toneVar =
    tone === "green"
      ? "var(--tone-green)"
      : tone === "violet"
      ? "var(--tone-violet)"
      : tone === "orange"
      ? "var(--tone-orange)"
      : "var(--tone-cyan)";

  const toneInkVar =
    tone === "green"
      ? "var(--tone-green-ink)"
      : tone === "violet"
      ? "var(--tone-violet-ink)"
      : tone === "orange"
      ? "var(--tone-orange-ink)"
      : "var(--tone-cyan-ink)";

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide ring-1"
      style={{
        background: `color-mix(in oklab, ${toneVar} 12%, transparent)`,
        color: `hsl(${toneInkVar})`,
        borderColor: `color-mix(in oklab, ${toneVar} 22%, transparent)`,
      }}
    >
      {icon ? <Sparkles className="h-3.5 w-3.5 opacity-80" /> : null}
      {children}
    </span>
  );
}

function GradientCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["gcard group relative", className].join(" ")}>
      <div className="gcard__border" />
      <div className="gcard__inner">{children}</div>
    </div>
  );
}

function Magnetic({
  children,
  strength = 0.09,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 700, damping: 35 });
  const sy = useSpring(y, { stiffness: 700, damping: 35 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={className}
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
        x.set(dx);
        y.set(dy);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({
  icon,
  prefix = "HOPn Labs",
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  prefix?: string;
  title: string;
  subtitle?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={reduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 260, damping: 26 }}
      className="text-center"
    >
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))] shadow-[0_30px_100px_rgba(34,211,238,0.12)]">
        {icon}
      </div>

      <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[hsl(var(--fg))]">
        <span className="grad-text">{prefix}</span> {title}
      </h2>

      {subtitle ? (
        <p className="mt-4 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}

function GlowCard({ item, index }: { item: CardItem; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -90px 0px" }}
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 340, damping: 30, delay: index * 0.05 }
      }
      className="h-full"
    >
      <GradientCard className="p-0 h-full">
        <div className="relative overflow-hidden rounded-[22px] p-7 h-full">
          {/* hover glow */}
          <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition duration-300">
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.18),transparent_58%)] blur-2xl" />
          </div>

          {/* top icon pill */}
          <div className="relative mb-6 flex h-14 items-center gap-3 rounded-full bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))] px-5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))]">
              {iconNode(item.icon || "flask", "h-5 w-5 text-[hsl(var(--accent))]")}
            </div>
            <div className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]/80" />
            <div className="h-2 w-2 rounded-full bg-[hsl(var(--card-2))]" />
            <div className="h-2 w-2 rounded-full bg-[hsl(var(--card-2))]" />
          </div>

          <h3 className="relative text-xl sm:text-2xl font-extrabold text-[hsl(var(--fg))] leading-tight">
            {item.title}
          </h3>

          <p className="relative mt-4 text-[hsl(var(--muted))] leading-relaxed">{item.desc}</p>

          {item.tags?.length ? (
            <div className="relative mt-5 flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((t, i) => (
                <Pill key={t} tone={i === 0 ? "cyan" : i === 1 ? "green" : "violet"}>
                  {t}
                </Pill>
              ))}
            </div>
          ) : null}

          <div className="relative mt-6 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
            <span>Built for impact</span>
            <span className="inline-flex items-center gap-1 text-[hsl(var(--accent))]">
              Explore <ChevronRight className="h-4 w-4" />
            </span>
          </div>

          {/* bottom sheen */}
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-44 w-72 -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/14 blur-[70px] opacity-60" />
        </div>
      </GradientCard>
    </motion.article>
  );
}

function MiniOpsPanel() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[hsl(var(--accent))]/16 blur-[28px]" />
        <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-[hsl(var(--accent-2))]/14 blur-[28px]" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">Innovation Signals</div>
          <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">Velocity - Quality - Outcomes</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted))]">Prototyping pipelines with measurable impact.</div>
        </div>

        <div className="shrink-0 rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 p-2">
          <ShieldCheck className="h-5 w-5 text-[hsl(var(--accent))]" />
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-12 items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-[hsl(var(--card-2))] ring-1 ring-[hsl(var(--border))] overflow-hidden"
          >
            <div
              className="h-full w-full origin-bottom animate-rise bg-gradient-to-t from-[hsl(var(--accent-1))]/35 via-[hsl(var(--accent-1))]/15 to-transparent"
              style={{
                animationDelay: `${i * 90}ms`,
                transform: `scaleY(${0.22 + (i % 5) * 0.14 + (i % 3) * 0.07})`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
        <span>Cycle time: 2-6 weeks</span>
        <span className="inline-flex items-center gap-1 text-[hsl(var(--accent))]">
          View insights <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function MiniCollabPanel() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-10 -left-12 h-32 w-32 rounded-full bg-[hsl(var(--accent))]/14 blur-[28px]" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[hsl(var(--accent-2))]/14 blur-[28px]" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">Partnerships</div>
          <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">Academia - Industry - Community</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted))]">Shared research, open-source, and real-world pilots.</div>
        </div>

        <div className="shrink-0 rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 p-2">
          <Globe className="h-5 w-5 text-[hsl(var(--accent))]" />
        </div>
      </div>

      <div className="relative mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3">
        <svg viewBox="0 0 260 64" className="h-16 w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M0 46 C 24 36, 44 56, 66 40 C 88 24, 104 38, 126 30 C 148 22, 170 34, 194 18 C 218 2, 236 16, 260 10"
            className="dash-path"
            stroke="rgba(34,211,238,0.95)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M0 46 C 24 36, 44 56, 66 40 C 88 24, 104 38, 126 30 C 148 22, 170 34, 194 18 C 218 2, 236 16, 260 10"
            stroke="rgba(34,211,238,0.18)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>

        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { k: "Partners", v: "18+" },
            { k: "Labs", v: "6" },
            { k: "Pilots", v: "12" },
          ].map((m) => (
            <div key={m.k} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] px-3 py-2">
              <div className="text-[11px] text-[hsl(var(--muted))]">{m.k}</div>
              <div className="text-sm font-extrabold text-[hsl(var(--fg))]">{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
        <span>Engagement: active</span>
        <span className="inline-flex items-center gap-1 text-[hsl(var(--accent))]/85">
          Programs <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------- page --------------------------------- */

export default function HopnLabsPage({ content }: LabsPageClientProps) {
  const reduceMotion = useReducedMotion();
  const data = mergeContent(content);
  const navItems = data.nav?.items || [];
  const hero = data.hero || {};
  const core = data.core || {};
  const focus = data.focus || {};
  const approach = data.approach || {};
  const programs = data.programs || {};
  const testimonials = data.testimonials || {};
  const contact = data.contact || {};

  const coreFunctions = core.items || [];
  const focusAreas = focus.items || [];
  const programItems = programs.items || [];
  const approachItems = approach.items || [];
  const testimonialItems = testimonials.items || [];

  // hero sheen follow
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(40);
  const gSX = useSpring(glowX, { stiffness: 180, damping: 30 });
  const gSY = useSpring(glowY, { stiffness: 180, damping: 30 });

  const floatAnim = reduceMotion
    ? {}
    : { animate: { y: [0, -6, 0] }, transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } };

  return (
    <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      {/* Theme variables (light + dark), plus shared FX like the FinTech page */}
      <style>{`
        :root {
          /* LIGHT */
          --bg: 210 40% 98%;
          --fg: 222 47% 11%;
          --muted: 215 16% 42%;
          --card: 0 0% 100%;
          --card-2: 210 40% 96%;
          --surface: 210 40% 94%;
          --border: 214 22% 86%;
          --ring: 199 89% 48%;

          --accent: 199 89% 48%;
          --accent-1: 199 89% 48%;
          --accent-2: 245 83% 62%;
          --accent-ink: 0 0% 100%;

          --tone-cyan: hsl(199 89% 48%);
          --tone-cyan-ink: 199 89% 18%;
          --tone-green: hsl(160 84% 39%);
          --tone-green-ink: 160 84% 18%;
          --tone-orange: hsl(25 95% 53%);
          --tone-orange-ink: 25 95% 18%;
          --tone-violet: hsl(245 83% 62%);
          --tone-violet-ink: 245 83% 20%;
        }

        .dark,
        [data-theme="dark"] {
          /* DARK */
          --bg: 228 58% 6%;
          --fg: 210 40% 98%;
          --muted: 215 20% 70%;
          --card: 224 46% 10%;
          --card-2: 224 42% 12%;
          --surface: 225 52% 8%;
          --border: 225 24% 22%;
          --ring: 191 92% 44%;

          --accent: 191 92% 44%;
          --accent-1: 191 92% 44%;
          --accent-2: 245 83% 67%;
          --accent-ink: 222 47% 11%;

          --tone-cyan: hsl(191 92% 44%);
          --tone-cyan-ink: 191 92% 86%;
          --tone-green: hsl(160 84% 39%);
          --tone-green-ink: 160 84% 86%;
          --tone-orange: hsl(25 95% 53%);
          --tone-orange-ink: 25 95% 88%;
          --tone-violet: hsl(245 83% 67%);
          --tone-violet-ink: 245 83% 90%;
        }

        :root {
          --labs-grid: rgba(2, 6, 23, 0.08);
          --labs-grid-opacity: 0.1;
          --labs-vignette: 0.06;
        }
        .dark,
        [data-theme="dark"] {
          --labs-grid: rgba(255, 255, 255, 0.06);
          --labs-grid-opacity: 0.14;
          --labs-vignette: 0.78;
        }

        .reveal {
          transition: opacity 780ms cubic-bezier(0.2, 0.85, 0.2, 1),
            transform 780ms cubic-bezier(0.2, 0.85, 0.2, 1),
            filter 780ms cubic-bezier(0.2, 0.85, 0.2, 1);
          will-change: opacity, transform, filter;
        }
        .reveal--out {
          opacity: 0;
          transform: translateY(22px) scale(0.985);
          filter: blur(12px);
        }
        .reveal--in {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }

        .grad-text {
          background: linear-gradient(90deg, hsl(var(--accent-1)), hsl(var(--accent-2)), hsl(var(--accent-1)));
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradmove 6.5s ease-in-out infinite;
        }
        @keyframes gradmove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .shimmer {
          background: radial-gradient(900px 420px at 20% 0%, rgba(34, 211, 238, 0.16), transparent 60%);
          animation: shimmerMove 9s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        @keyframes shimmerMove {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.14;
          }
          50% {
            transform: translate3d(30px, 18px, 0);
            opacity: 0.22;
          }
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.14;
          }
        }

        .gcard {
          border-radius: 24px;
        }
        .gcard__border {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.35), rgba(99, 102, 241, 0.18), rgba(34, 211, 238, 0.12));
          opacity: 0.75;
          transition: opacity 220ms ease, filter 220ms ease;
          filter: saturate(1.1);
        }
        .gcard__inner {
          position: relative;
          border-radius: 23px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          backdrop-filter: blur(18px);
          box-shadow: 0 24px 90px rgba(0, 0, 0, 0.12);
          transition: transform 220ms ease, background 220ms ease;
        }
        .dark .gcard__inner {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 30px 110px rgba(0, 0, 0, 0.45);
        }
        .gcard:hover .gcard__border {
          opacity: 1;
          filter: saturate(1.35);
        }
        .gcard:hover .gcard__inner {
          transform: translateY(-2px);
        }

        .animate-rise {
          animation: rise 1.4s ease-in-out infinite alternate;
        }
        @keyframes rise {
          from {
            filter: brightness(0.9);
          }
          to {
            filter: brightness(1.05);
          }
        }

        .dash-path {
          stroke-dasharray: 520;
          stroke-dashoffset: 520;
          animation: dash 2.2s ease forwards;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>

      {/* Ultra background like the FinTech page */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/12 blur-[95px]" />
        <div className="absolute -left-44 top-28 h-[430px] w-[430px] rounded-full bg-[hsl(var(--accent-2))]/10 blur-[95px]" />
        <div className="absolute -right-56 top-52 h-[650px] w-[650px] rounded-full bg-[hsl(var(--accent))]/10 blur-[115px]" />
        <div className="absolute inset-0 opacity-[0.18] shimmer" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, transparent, rgba(0,0,0, var(--labs-vignette)))",
          }}
        />
        <div
          className="absolute inset-0 [background-image:linear-gradient(to_right,var(--labs-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--labs-grid)_1px,transparent_1px)] bg-[size:56px_56px]"
          style={{ opacity: "var(--labs-grid-opacity)" as any }}
        />
      </div>

      {/* NAV (added, like FinTech page) */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 px-3 py-1.5 text-sm font-extrabold text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))] transition"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/18">
              {iconNode(hero.icon || "flask", "h-4.5 w-4.5 text-[hsl(var(--accent))]")}
            </span>
            {hero.title || "HOPn Labs"}
          </Link>

          <nav className="hidden items-center gap-2 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO (upgraded to match the FinTech "sheen + trust row + panels" vibe) */}
      <section
        id="overview"
        className="relative z-10 overflow-hidden pt-10 sm:pt-12 pb-14 border-b border-[hsl(var(--border))]"
        onMouseMove={(e) => {
          if (reduceMotion) return;
          const w = window.innerWidth || 1;
          const h = 520;
          glowX.set((e.clientX / w) * 100);
          glowY.set((e.clientY / h) * 100);
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: "radial-gradient(650px 300px at var(--x) var(--y), rgba(255,255,255,0.12), transparent 72%)",
            // @ts-ignore
            "--x": gSX,
            // @ts-ignore
            "--y": gSY,
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* left */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex flex-wrap items-center gap-2">
                  {(hero.pills || []).map((p) => (
                    <Pill key={p.label} tone={p.tone || "cyan"} icon={!!p.icon}>
                      {p.label}
                    </Pill>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <motion.div
                    className="grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))] shadow-[0_30px_100px_rgba(34,211,238,0.12)]"
                    {...floatAnim}
                  >
                    {iconNode(hero.icon || "flask", "h-9 w-9 text-[hsl(var(--accent))]")}
                  </motion.div>

                  <div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                      <span className="grad-text">{hero.title || "HOPn Labs"}</span>
                    </h1>
                    <p className="mt-2 text-[hsl(var(--muted))] text-sm sm:text-base">
                      {hero.subtitle || "Where ideas become prototypes - and prototypes become impact."}
                    </p>
                  </div>
                </div>

                <p className="mt-6 max-w-2xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                  {hero.lead ||
                    "A dynamic ecosystem for research, development, collaboration, and learning - turning visionary ideas into practical, measurable outcomes."}
                </p>

                {hero.primaryCta || hero.secondaryCta ? (
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {hero.primaryCta ? (
                      <Link
                        href={hero.primaryCta.href}
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-bold text-[hsl(var(--accent-ink))] shadow-[0_20px_65px_rgba(34,211,238,0.22)] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      >
                        {hero.primaryCta.label}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </Link>
                    ) : null}

                    {hero.secondaryCta ? (
                      <Link
                        href={hero.secondaryCta.href}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 px-6 py-3 text-sm font-semibold text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))] transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      >
                        {hero.secondaryCta.label}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                ) : null}

                {/* trust row */}
                <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--muted))]">
                  {(hero.trustBadges || []).map((b, idx) => (
                    <span
                      key={`${b.label}-${idx}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 px-3 py-2"
                    >
                      {iconNode(b.icon || "shield", "h-4 w-4 text-[hsl(var(--accent))]/80")}
                      {b.label}
                    </span>
                  ))}
                </div>
              </Reveal>

              {/* quick stats row (inspired by FinTech cards) */}
              <Reveal delay={120} className="mt-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  {(hero.quickStats || []).map((m) => (
                    <GradientCard key={m.title} className="p-0">
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-xl bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/18 grid place-items-center">
                            {iconNode(m.icon || "shield", "h-5 w-5 text-[hsl(var(--accent))]")}
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-[hsl(var(--fg))]">{m.title}</div>
                            <div className="text-sm text-[hsl(var(--muted))]">{m.sub}</div>
                          </div>
                        </div>

                        <div className="mt-4 h-px w-full bg-[hsl(var(--border))]" />
                        <div className="mt-3 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
                          <span>Designed for outcomes</span>
                          <span className="inline-flex items-center gap-1 text-[hsl(var(--accent))]/85">
                            Learn more <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </GradientCard>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* right */}
            <div className="lg:col-span-5">
              <Reveal delay={140}>
                <div className="relative">
                  <div className="absolute -inset-6 -z-10 rounded-[36px] bg-[hsl(var(--accent))]/10 blur-[55px]" />
                  <div className="grid gap-4">
                    <MiniCollabPanel />
                    <MiniOpsPanel />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FUNCTIONS */}
      <section id="core" className="relative z-10 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={iconNode(core.header?.icon || "flask", "h-9 w-9 text-[hsl(var(--accent))]")}
            prefix={core.header?.prefix || "HOPn Labs"}
            title={core.header?.title || "Core Functions"}
            subtitle={core.header?.subtitle}
          />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {coreFunctions.map((it, i) => (
              <GlowCard key={it.title} item={it} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* KEY FOCUS AREAS */}
      <section className="relative z-10 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={iconNode(focus.header?.icon || "cpu", "h-9 w-9 text-[hsl(var(--accent))]")}
            prefix={focus.header?.prefix || "HOPn Labs"}
            title={focus.header?.title || "Key Focus Areas"}
            subtitle={focus.header?.subtitle}
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-7">
            {focusAreas.map((it, i) => (
              <GlowCard key={it.title} item={it} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="relative z-10 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={iconNode(approach.header?.icon || "shield", "h-9 w-9 text-[hsl(var(--accent))]")}
            prefix={approach.header?.prefix || "HOPn Labs"}
            title={approach.header?.title || "How We Work"}
            subtitle={approach.header?.subtitle}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {approachItems.map((st, i) => (
              <motion.div
                key={st.k}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -90px 0px" }}
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : { type: "spring", stiffness: 340, damping: 30, delay: i * 0.06 }
                }
              >
                <GradientCard className="p-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black tracking-[0.2em] text-[hsl(var(--muted))]">{st.k}</div>
                      <div className="h-10 w-10 rounded-xl bg-[hsl(var(--card-2))] ring-1 ring-[hsl(var(--border))] grid place-items-center">
                        {iconNode(st.icon || "shield", "h-5 w-5 text-[hsl(var(--accent))]")}
                      </div>
                    </div>

                    <div className="mt-4 text-lg font-extrabold text-[hsl(var(--fg))]">{st.title}</div>
                    <div className="mt-2 text-sm text-[hsl(var(--muted))] leading-relaxed">{st.desc}</div>

                    <div className="mt-5 h-px w-full bg-[hsl(var(--border))]" />
                    <div className="mt-4 text-xs text-[hsl(var(--muted))]">Iterative - measurable - safe.</div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="relative z-10 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={iconNode(programs.header?.icon || "zap", "h-9 w-9 text-[hsl(var(--accent))]")}
            prefix={programs.header?.prefix || "HOPn Labs"}
            title={programs.header?.title || "Programs & Initiatives"}
            subtitle={programs.header?.subtitle}
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-7">
            {programItems.map((it, i) => (
              <GlowCard key={it.title} item={it} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative z-10 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            icon={iconNode(testimonials.header?.icon || "quote", "h-9 w-9 text-[hsl(var(--accent))]")}
            prefix={testimonials.header?.prefix || "HOPn Labs"}
            title={testimonials.header?.title || "What People Say"}
            subtitle={testimonials.header?.subtitle}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonialItems.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -90px 0px" }}
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : { type: "spring", stiffness: 340, damping: 30, delay: i * 0.06 }
                }
              >
                <GradientCard className="p-0">
                  <div className="p-6 sm:p-7">
                    <Quote className="h-6 w-6 text-[hsl(var(--accent))]/80" />
                    <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed">"{t.quote}"</p>
                    <div className="mt-6 h-px w-full bg-[hsl(var(--border))]" />
                    <div className="mt-4">
                      <div className="font-extrabold text-[hsl(var(--fg))]">{t.name}</div>
                      <div className="text-sm text-[hsl(var(--muted))]">{t.meta}</div>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA (upgraded: split image + contact block inspired by FinTech page) */}
      <section id="contact" className="relative z-10 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 backdrop-blur-2xl shadow-[0_35px_140px_rgba(0,0,0,0.25)] dark:shadow-[0_35px_140px_rgba(0,0,0,0.55)]">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-[220px] sm:min-h-[320px] lg:min-h-[560px]">
                  <img
                    src={contact.imageUrl || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"}
                    alt={contact.imageAlt || "Collaboration"}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/45 to-black/70 dark:from-[#060913]/20 dark:via-[#060913]/65 dark:to-[#060913]/95 lg:dark:to-[#060913]/75" />

                  <div className="absolute left-6 top-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 backdrop-blur-xl p-4 shadow-[0_25px_90px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_90px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/18 grid place-items-center">
                        <Award className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div>
                        <div className="font-extrabold text-[hsl(var(--fg))]">{contact.badgeTitle || "Build with the Lab"}</div>
                        <div className="text-sm text-[hsl(var(--muted))]">{contact.badgeSubtitle || "Research - Pilots - Programs"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative p-8 sm:p-10 lg:p-12">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))] ring-1 ring-[hsl(var(--accent))]/18 px-3 py-1.5 text-xs font-semibold">
                    <Sparkles className="h-4 w-4" />
                    {contact.kicker || "Start a conversation"}
                  </div>

                  <h3 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-[hsl(var(--fg))]">
                    {contact.title || "Ready to build your next prototype or program?"}
                  </h3>

                  <p className="mt-4 text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                    {contact.subtitle ||
                      "Tell us what you want to explore - we'll reply with a suggested collaboration model, timeline, and next steps."}
                  </p>

                  <div className="mt-8 grid gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))] grid place-items-center">
                        <Mail className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-[hsl(var(--fg))]">Share your idea</div>
                        <div className="text-xs text-[hsl(var(--muted))]">We'll respond with options.</div>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3">
                      <Magnetic className="flex-1">
                        <Link
                          href={contact.primaryCta?.href || "/contact"}
                          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-bold text-[hsl(var(--accent-ink))] shadow-[0_20px_65px_rgba(34,211,238,0.18)] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                        >
                          {contact.primaryCta?.label || "Collaborate With Us"}
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </Link>
                      </Magnetic>

                      <Magnetic>
                        <Link
                          href={contact.secondaryCta?.href || "/events"}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-3 text-sm font-semibold text-[hsl(var(--fg))] hover:bg-[hsl(var(--card-2))] transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                        >
                          {contact.secondaryCta?.label || "Explore Events"}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Magnetic>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {(contact.infoCards || []).map((card) => (
                      <div key={card.title} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] p-4">
                        <div className="text-[hsl(var(--accent))] font-extrabold text-lg">{card.title}</div>
                        <div className="mt-1 text-[hsl(var(--muted))] text-sm">{card.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-[hsl(var(--border))] lg:block" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
