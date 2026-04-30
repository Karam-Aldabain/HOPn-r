"use client";

import Link from "next/link";
import { useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  LazyMotion,
  domAnimation,
  MotionConfig,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Briefcase,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight,
  DollarSign,
  Search,
  Truck,
  BarChart3,
  Users,
} from "lucide-react";

/**
 * ✅ PROJECT / PORTFOLIO PAGE (HOPn)
 * - Same dark navy + cyan palette like your screenshots
 * - "Alive" motion: shimmer, floating orbs, card hover glow, staggered entrance
 * - ✅ Fixes the Next/Image 400 issue by NOT using next/image at all (uses <img/> safely)
 *   -> Put images in /public/portfolio/*.jpg and use the same paths below.
 */

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085 } },
};

type ChipItem = { label: string; tone?: "cyan" | "slate" | "indigo" };

type ProjectItem = {
  name: string;
  desc: string;
  tags: string[];
  category: string;
  image: string; // from /public or absolute
  href?: string;
  icon?: string;
  featured?: boolean;
};

export type ProjectsPageContent = {
  hero?: {
    title?: string;
    subtitle?: string;
    icon?: string;
  };
  chips?: ChipItem[];
  projects?: {
    useCms?: boolean;
    items?: ProjectItem[];
  };
  projectCardCtaLabel?: string;
  projectCardCtaHref?: string;
  cta?: {
    title?: string;
    subtitle?: string;
    icon?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
};

type ProjectsPageClientProps = {
  content?: ProjectsPageContent | null;
  cmsProjects?: ProjectItem[];
};

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  dollar: DollarSign,
  search: Search,
  truck: Truck,
  chart: BarChart3,
  users: Users,
  sparkles: Sparkles,
  zap: Zap,
};

function iconNode(name: string | undefined, className: string) {
  const Icon = (name && ICONS[name]) || Briefcase;
  return <Icon className={className} />;
}

export const DEFAULT_CONTENT: ProjectsPageContent = {
  hero: {
    title: "Our Portfolio: Check Our Latest Work",
    subtitle:
      "Discover some of the innovative projects and impactful solutions we've delivered for our clients across various industries.",
    icon: "briefcase",
  },
  chips: [
    { label: "Innovation-led" },
    { label: "Production-grade", tone: "indigo" },
    { label: "Secure-by-design" },
    { label: "Measurable impact", tone: "slate" },
  ],
  projects: {
    useCms: true,
    items: [
      {
        name: "Goldenia",
        category: "FinTech",
        desc:
          "Invest in gold and ensure your money keeps up with the world's changes. A secure platform for gold investment and portfolio management.",
        tags: ["FinTech", "Investment", "Security", "AI Insights"],
        image: "/portfolio/fintech.jpg",
        href: "#",
        icon: "dollar",
      },
      {
        name: "Find your Drug",
        category: "HealthTech",
        desc:
          "Search for missing drugs with our pharmacies network. Connecting patients with essential medications through a vast network of pharmacies.",
        tags: ["HealthTech", "Network", "Logistics", "AI Search"],
        image: "/portfolio/healthtech.png",
        href: "#",
        icon: "search",
      },
      {
        name: "KAHRAMAA Fleet",
        category: "Logistics",
        desc:
          "Advanced fleet management and tracking solution. Optimizing logistics, enhancing efficiency, and ensuring real-time monitoring for large-scale fleets.",
        tags: ["Logistics", "IoT", "Real-time Tracking", "AI Analytics"],
        image: "/portfolio/logistics.png",
        href: "#",
        icon: "truck",
      },
      {
        name: "AI-Powered Market Analysis Platform",
        category: "AI + FinTech",
        desc:
          "A sophisticated platform providing deep market insights and predictive analytics using advanced AI models for financial institutions.",
        tags: ["AI", "FinTech", "Big Data", "Predictive Analytics"],
        image: "/portfolio/market-analysis.avif",
        href: "#",
        icon: "chart",
        featured: true,
      },
    ],
  },
  projectCardCtaLabel: "View Project Details",
  projectCardCtaHref: "#",
  cta: {
    title: "Have a Project in Mind?",
    subtitle:
      "If you're looking to develop an innovative solution or transform your business with technology, we'd love to hear from you. Let's discuss how HOPn can bring your vision to life.",
    icon: "users",
    primaryCta: { label: "Let's Build Together", href: "/contact" },
    secondaryCta: { label: "Talk to an Expert", href: "/contact" },
  },
};

function mergeContent(override?: ProjectsPageContent | null): ProjectsPageContent {
  const o = override || {};
  return {
    ...DEFAULT_CONTENT,
    ...o,
    hero: { ...DEFAULT_CONTENT.hero, ...o.hero },
    projects: { ...DEFAULT_CONTENT.projects, ...o.projects },
    cta: { ...DEFAULT_CONTENT.cta, ...o.cta },
    chips: Array.isArray(o.chips) ? o.chips : DEFAULT_CONTENT.chips,
  };
}

type Project = {
  name: string;
  desc: string;
  tags: string[];
  category: string;
  image: string; // from /public
  href?: string;
  icon?: string;
  featured?: boolean;
};

function Chip({
  children,
  tone = "cyan",
}: {
  children: ReactNode;
  tone?: "cyan" | "slate" | "indigo";
}) {
  const toneCls =
    tone === "slate"
      ? "bg-[hsl(var(--chip))] text-[hsl(var(--muted))] ring-1 ring-[hsl(var(--border))]"
      : tone === "indigo"
        ? "bg-[hsl(var(--chip-indigo))] text-[hsl(var(--chip-indigo-fg))] ring-1 ring-[hsl(var(--chip-indigo-ring))]"
        : "bg-[hsl(var(--chip-cyan))] text-[hsl(var(--accent))] ring-1 ring-[hsl(var(--chip-cyan-ring))]";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide",
        "backdrop-blur-md",
        toneCls
      )}
    >
      <Sparkles className="h-3.5 w-3.5 opacity-80" />
      {children}
    </span>
  );
}

function TagPill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-[hsl(var(--tag))] text-[hsl(var(--tag-fg))] ring-1 ring-[hsl(var(--tag-ring))] px-3 py-1.5 text-xs font-bold">
      {children}
    </span>
  );
}

/** A premium, unified HOPn card shell (same palette as your screenshots) */
function NeoCard({
  children,
  className = "",
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cx(
        "group relative overflow-hidden rounded-[26px] border border-[hsl(var(--border))]",
        "shadow-[0_30px_130px_rgba(0,0,0,var(--shadow))]",
        "bg-[linear-gradient(180deg,hsl(var(--neo-from))/0.92,hsl(var(--neo-to))/0.92)]",
        // inner sheen
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-[var(--sheen)]",
        "before:bg-[radial-gradient(650px_260px_at_20%_0%,hsl(var(--neo-sheen)/0.10),transparent_60%)]",
        // subtle grid
        "after:pointer-events-none after:absolute after:inset-0 after:opacity-[0.07]",
        "after:[background-image:linear-gradient(to_right,hsl(var(--neo-grid)/0.14)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--neo-grid)/0.10)_1px,transparent_1px)]",
        "after:[background-size:110px_110px]",
        interactive &&
          "transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.01]",
        className
      )}
    >
      {/* hover glow */}
      <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(520px_240px_at_20%_0%,hsl(var(--accent)/0.18),transparent_62%)] blur-2xl" />
      </div>

      {children}
    </div>
  );
}

function SafeImg({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        className={cx(
          "relative grid place-items-center",
          "bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.18),transparent_55%),radial-gradient(circle_at_80%_30%,hsl(var(--accent-2)/0.16),transparent_55%),linear-gradient(180deg,hsl(var(--neo-from))/0.9,hsl(var(--neo-to))/0.9)]",
          className
        )}
      >
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,hsl(var(--fg)/0.35)_1px,transparent_0)] [background-size:10px_10px]" />
        <div className="relative text-[hsl(var(--muted))] text-xs font-semibold tracking-wide">
          Image not found
        </div>
      </div>
    );
  }

  // ✅ Using <img/> avoids Next.js image optimizer 400 errors entirely.
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
      className={className}
    />
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--ring))]/20 shadow-[0_20px_90px_rgba(34,211,238,0.08)]">
        {icon}
      </div>

      <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-1))] via-[hsl(var(--accent-2))] to-[hsl(var(--accent-1))]">
          {title}
        </span>
      </h1>

      {subtitle ? (
        <p className="mt-4 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function ProjectCard({
  p,
  ctaLabel,
  ctaHrefFallback,
  spanClass,
}: {
  p: Project;
  ctaLabel: string;
  ctaHrefFallback: string;
  spanClass?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <m.article
      variants={fadeUp}
      transition={
        reduce
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 320, damping: 26 }
      }
      className={cx(spanClass || "lg:col-span-2")}
    >
      <NeoCard className="h-full">
        {/* Top media */}
        <div className="relative h-44 overflow-hidden rounded-t-[26px] sm:h-56">
          <SafeImg
            src={p.image}
            alt={p.name}
            className={cx(
              "h-full w-full object-cover",
              "scale-[1.03] group-hover:scale-[1.08] transition duration-700 ease-out",
              "brightness-[0.86] contrast-[1.05]"
            )}
          />
          {/* top dark overlay like screenshot */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.05),rgba(0,0,0,0.28))]" />
          {/* subtle moving shimmer */}
          <div className="pointer-events-none absolute -inset-16 opacity-0 group-hover:opacity-100 transition duration-500">
            <div className="absolute inset-0 shimmer-sweep" />
          </div>

          {/* icon bubble on the right */}
          <div className="absolute top-4 right-4">
            <div className="relative grid h-14 w-14 place-items-center rounded-full bg-[hsl(var(--accent))]/18 ring-1 ring-[hsl(var(--ring))]/25 backdrop-blur-xl">
              {iconNode(p.icon || "briefcase", "h-7 w-7 text-[hsl(var(--accent))]")}
              <div className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_80px_rgba(34,211,238,0.12)]" />
              <div className="pointer-events-none absolute -inset-3 opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="absolute inset-0 rounded-full bg-[hsl(var(--accent))]/10 blur-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative p-6 sm:p-7">
          <div className="text-[11px] font-extrabold tracking-[0.22em] text-[hsl(var(--accent))]/80">
            {p.category.toUpperCase()}
          </div>

          <h3 className="mt-3 text-2xl sm:text-3xl font-black text-[hsl(var(--fg))] leading-tight">
            {p.name}
          </h3>

          <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed">{p.desc}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <TagPill key={t}>{t}</TagPill>
            ))}
          </div>

          <div className="mt-7">
            <Link
              href={p.href || ctaHrefFallback || "#"}
              className={cx(
                "group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl",
                "border border-[hsl(var(--ring))]/25 bg-[hsl(var(--btn))] hover:bg-[hsl(var(--accent))]/10",
                "px-5 py-3 text-sm font-extrabold text-[hsl(var(--accent))]",
                "transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/20"
              )}
            >
              {ctaLabel}
              <Zap className="h-4 w-4 opacity-90 transition group-hover/btn:translate-x-0.5" />
            </Link>
          </div>

          {/* bottom divider */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />
        </div>
      </NeoCard>
    </m.article>
  );
}

function CTA({ content }: { content: ProjectsPageContent["cta"] | undefined }) {
  const reduce = useReducedMotion();
  const cta = content || {};
  const primary = cta.primaryCta;
  const secondary = cta.secondaryCta;
  return (
    <m.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-140px" }}
      transition={
        reduce
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 260, damping: 26 }
      }
      className="relative z-10 py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NeoCard className="p-10 sm:p-12 text-center" interactive={!reduce}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-[hsl(var(--accent))]/12 blur-[80px]" />
            <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-[hsl(var(--accent-2))]/10 blur-[90px]" />
          </div>

          <div className="relative">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--ring))]/20">
              {iconNode(cta.icon || "users", "h-8 w-8 text-[hsl(var(--accent))]")}
            </div>

            <h3 className="text-3xl sm:text-5xl font-black text-[hsl(var(--fg))]">
              {cta.title || "Have a Project in Mind?"}
            </h3>

            <p className="mt-5 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
              {cta.subtitle ||
                "If you're looking to develop an innovative solution or transform your business with technology, we'd love to hear from you. Let's discuss how HOPn can bring your vision to life."}
            </p>

            {primary || secondary ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {primary ? (
                  <Link
                    href={primary.href}
                    className={cx(
                      "group inline-flex items-center justify-center gap-2 rounded-xl",
                      "bg-[hsl(var(--accent))] px-7 py-4 text-sm sm:text-base font-extrabold text-[hsl(var(--accent-ink))]",
                      "shadow-[0_18px_80px_rgba(34,211,238,0.18)] hover:brightness-110 transition"
                    )}
                  >
                    {primary.label}
                    <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                  </Link>
                ) : null}

                {secondary ? (
                  <Link
                    href={secondary.href}
                    className={cx(
                      "inline-flex items-center justify-center gap-2 rounded-xl",
                      "border border-[hsl(var(--border))] bg-[hsl(var(--btn))] px-7 py-4 text-sm sm:text-base font-bold text-[hsl(var(--fg))]",
                      "hover:bg-[hsl(var(--card))]/85 transition"
                    )}
                  >
                    {secondary.label}
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </NeoCard>
      </div>
    </m.section>
  );
}

export default function PortfolioPage({ content, cmsProjects = [] }: ProjectsPageClientProps) {
  const reduce = useReducedMotion();
  const data = mergeContent(content);
  const hero = data.hero || {};
  const chips = data.chips || [];
  const projectsBlock = data.projects || {};
  const projects =
    projectsBlock.useCms === false
      ? projectsBlock.items || []
      : cmsProjects.length
      ? cmsProjects
      : projectsBlock.items || [];
  const cardCtaLabel = data.projectCardCtaLabel || "View Project Details";
  const cardCtaHref = data.projectCardCtaHref || "#";

  // slow parallax background
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 1200], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 1200], [0, -90]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={reduce ? "always" : "never"}>
        <main className="relative min-h-screen text-[hsl(var(--fg))] bg-[hsl(var(--bg))]">
          {/* BACKGROUND SYSTEM (alive) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 [background-image:linear-gradient(to_right,hsl(var(--fg)/0.12)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--fg)/0.08)_1px,transparent_1px)] [background-size:110px_110px]"
              style={{ opacity: "var(--grid)" as never }}
            />

            <m.div
              aria-hidden="true"
              style={{ y: orbY }}
              className="absolute -top-60 left-1/4 h-[720px] w-[720px] rounded-full bg-[hsl(var(--accent))]/10 blur-[190px]"
              animate={reduce ? undefined : { x: [0, 16, 0], scale: [1, 1.03, 1] }}
              transition={reduce ? { duration: 0.01 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <m.div
              aria-hidden="true"
              style={{ y: orbY2 }}
              className="absolute -top-20 -right-72 h-[860px] w-[860px] rounded-full bg-[hsl(var(--accent-2))]/10 blur-[210px]"
              animate={reduce ? undefined : { x: [0, -18, 0], scale: [1, 1.02, 1] }}
              transition={reduce ? { duration: 0.01 } : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(closest-side, transparent, rgba(0,0,0, var(--vignette)))`,
              }}
            />
          </div>

          {/* HERO */}
          <section className="relative z-10 pt-16 sm:pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div variants={stagger} initial="hidden" animate="show">
                <m.div variants={fadeUp}>
                  <SectionTitle
                    icon={iconNode(hero.icon || "briefcase", "h-8 w-8 text-[hsl(var(--accent))]")}
                    title={hero.title || "Our Portfolio: Check Our Latest Work"}
                    subtitle={
                      hero.subtitle ||
                      "Discover some of the innovative projects and impactful solutions we've delivered for our clients across various industries."
                    }
                  />
                </m.div>

                <m.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-2">
                  {chips.map((chip, idx) => (
                    <Chip key={`${chip.label}-${idx}`} tone={chip.tone}>
                      {chip.label}
                    </Chip>
                  ))}
                </m.div>
              </m.div>
            </div>
          </section>

          {/* PROJECTS GRID */}
          <section className="relative z-10 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-120px" }}
                className="grid gap-7 lg:grid-cols-6 [grid-auto-flow:dense]"
              >
                {projects.map((p, i) => {
                  const total = projects.length;
                  const remainder = total % 3;
                  let spanClass = p.featured ? "lg:col-span-4" : "lg:col-span-2";

                  if (remainder === 1 && i === total - 1) {
                    spanClass = "lg:col-span-6";
                  } else if (remainder === 2 && (i === total - 1 || i === total - 2)) {
                    spanClass = "lg:col-span-3";
                  }

                  return (
                    <ProjectCard
                      key={p.name}
                      p={p}
                      ctaLabel={cardCtaLabel}
                      ctaHrefFallback={cardCtaHref}
                      spanClass={spanClass}
                    />
                  );
                })}
              </m.div>
            </div>
          </section>

          {/* CTA */}
          <CTA content={data.cta} />

          {/* FOOT SPACER */}
          <div className="relative z-10 h-10" />

          {/* GLOBAL STYLES */}
          <style>{`
            :root {
              --bg: 210 40% 98%;
              --fg: 222 47% 11%;
              --muted: 215 16% 38%;
              --card: 0 0% 100%;
              --border: 215 20% 88%;

              --accent: 191 92% 45%;
              --accent-1: 191 92% 45%;
              --accent-2: 245 83% 60%;
              --accent-ink: 210 40% 98%;
              --ring: 191 92% 45%;

              --neo-from: 0 0% 100%;
              --neo-to: 210 40% 96%;
              --neo-sheen: 191 92% 45%;
              --neo-grid: 215 20% 50%;
              --shadow: 0.14;
              --sheen: 0.55;

              --chip: 0 0% 100%;
              --chip-cyan: 199 89% 95%;
              --chip-cyan-ring: 199 89% 70%;
              --chip-indigo: 245 83% 95%;
              --chip-indigo-fg: 245 65% 38%;
              --chip-indigo-ring: 245 83% 72%;

              --tag: 199 89% 95%;
              --tag-fg: 199 89% 26%;
              --tag-ring: 199 89% 72%;

              --btn: 0 0% 100%;

              --vignette: 0.08;
              --grid: 0.05;
            }

            .dark {
              --bg: 224 46% 6%;
              --fg: 210 40% 98%;
              --muted: 215 20% 70%;
              --card: 224 46% 10%;
              --border: 224 42% 16%;

              --accent: 191 92% 55%;
              --accent-1: 191 92% 55%;
              --accent-2: 245 83% 68%;
              --accent-ink: 224 46% 6%;
              --ring: 191 92% 55%;

              --neo-from: 224 46% 10%;
              --neo-to: 224 46% 7%;
              --neo-sheen: 191 92% 55%;
              --neo-grid: 210 40% 98%;
              --shadow: 0.55;
              --sheen: 0.7;

              --chip: 224 46% 10%;
              --chip-cyan: 191 92% 10%;
              --chip-cyan-ring: 191 92% 25%;
              --chip-indigo: 245 83% 12%;
              --chip-indigo-fg: 245 83% 88%;
              --chip-indigo-ring: 245 83% 26%;

              --tag: 191 92% 12%;
              --tag-fg: 191 92% 78%;
              --tag-ring: 191 92% 24%;

              --btn: 224 46% 10%;

              --vignette: 0.78;
              --grid: 0.05;
            }

            .shimmer-sweep {
              background: linear-gradient(
                110deg,
                transparent 20%,
                hsl(var(--accent) / 0.14) 40%,
                hsl(var(--fg) / 0.10) 50%,
                hsl(var(--accent) / 0.12) 60%,
                transparent 80%
              );
              transform: translateX(-40%);
              animation: sweep 2.4s ease-in-out infinite;
              filter: blur(1px);
              opacity: 0.9;
            }
            @keyframes sweep {
              0% {
                transform: translateX(-55%);
              }
              50% {
                transform: translateX(12%);
              }
              100% {
                transform: translateX(-55%);
              }
            }
          `}</style>
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
