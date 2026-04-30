"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
  MotionConfig,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  BrainCircuit,
  Cpu,
  BarChart3,
  Bot,
  Workflow,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Layers3,
  Radar,
  Wand2,
  Gauge,
  ScanEye,
  Lock,
  Activity,
  GitBranch,
} from "lucide-react";
import { fetchCms, normalizeSingle } from "@/lib/cms-client";

/**
 * ✅ AI SOLUTIONS PAGE — Updated to match PortfolioPage theme system
 * - Same light/dark CSS variables (advisor-friendly light + premium dark)
 * - Same background grid + orbs + theme-aware vignette
 * - Same NeoCard styling language (borders, gradients, glow, sheen, grid)
 */

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

type Capability = {
  id: string;
  title: string;
  desc: string;
  Icon: ComponentType<{ className?: string }>;
  outcomes: string[];
  examples: string[];
};

type AiSolutionsSettings = {
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
  };
  chips?: string[];
  stats?: { k: string; v: string }[];
  roadmap?: { k: string; d: string }[];
  capabilities?: {
    id: string;
    title?: string;
    desc?: string;
    outcomes?: string[];
    examples?: string[];
  }[];
  benefits?: string[];
  cta?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    primaryCta?: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    tags?: string[];
  };
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085 } },
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
        "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold tracking-wide",
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
        "shadow-[0_30px_120px_rgba(0,0,0,var(--shadow))]",
        "bg-[linear-gradient(180deg,hsl(var(--neo-from))/0.92,hsl(var(--neo-to))/0.92)]",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-[var(--sheen)]",
        "before:bg-[radial-gradient(650px_260px_at_20%_0%,hsl(var(--neo-sheen)/0.10),transparent_60%)]",
        "after:pointer-events-none after:absolute after:inset-0 after:opacity-[0.07]",
        "after:[background-image:linear-gradient(to_right,hsl(var(--neo-grid)/0.14)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--neo-grid)/0.10)_1px,transparent_1px)]",
        "after:[background-size:130px_130px]",
        interactive &&
          "transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.01]",
        className
      )}
    >
      {/* hover glow */}
      <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(520px_240px_at_20%_0%,rgba(34,211,238,0.20),transparent_62%)] blur-2xl" />
      </div>

      {children}
    </div>
  );
}

function Stat({
  k,
  v,
  Icon,
}: {
  k: string;
  v: string;
  Icon: ComponentType<{ className?: string }>;
}) {
  return (
    <NeoCard interactive className="p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
          <Icon className="h-5 w-5 text-[hsl(var(--fg))]" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-[hsl(var(--muted))]">{k}</div>
          <div className="font-extrabold text-[hsl(var(--fg))] truncate">{v}</div>
        </div>
      </div>
    </NeoCard>
  );
}

function SectionTitle({
  icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: ReactNode;
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-1.5 text-xs text-[hsl(var(--muted))] backdrop-blur">
        {icon}
        {eyebrow ?? "AI Solutions • HOPn"}
      </div>

      <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[hsl(var(--fg))]">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-1))] via-[hsl(var(--accent-2))] to-[hsl(var(--accent-1))]">
          {title}
        </span>
      </h1>

      {subtitle ? (
        <p className="mt-5 max-w-2xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function CapabilityButton({
  cap,
  index,
  active,
  onClick,
}: {
  cap: Capability;
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <m.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className={cx(
        "relative w-full text-left rounded-2xl transition overflow-hidden",
        "border border-[hsl(var(--border))]",
        active
          ? "bg-[linear-gradient(180deg,hsl(var(--neo-from))/0.92,hsl(var(--neo-to))/0.92)]"
          : "bg-[hsl(var(--card))]/60 hover:bg-[hsl(var(--card))]/75"
      )}
    >
      {/* shared active glow */}
      {active && (
        <m.div
          layoutId="cap-active-glow"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(34,211,238,0.16),transparent_60%),radial-gradient(circle_at_90%_20%,rgba(99,102,241,0.14),transparent_60%)]"
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
        />
      )}

      {/* left active indicator track */}
      <div className="absolute left-3 top-6 bottom-6 w-[3px] rounded-full bg-[hsl(var(--border))] overflow-hidden">
        {active && (
          <m.div
            layoutId="cap-active-bar"
            className="h-full w-full bg-gradient-to-b from-cyan-300 via-cyan-500 to-indigo-400"
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          />
        )}
      </div>

      <div className="p-5 pl-7 flex items-start gap-4 relative">
        <div
          className={cx(
            "mt-1 grid h-9 w-9 place-items-center rounded-xl ring-1",
            active
              ? "bg-[hsl(var(--accent))]/10 ring-[hsl(var(--accent))]/20"
              : "bg-[hsl(var(--card))]/80 ring-[hsl(var(--border))]"
          )}
        >
          <cap.Icon
            className={cx(
              "h-5 w-5",
              active ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--muted))]"
            )}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-[0.2em] text-[hsl(var(--muted))]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--border))]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--border))]" />
          </div>

          <div className="mt-2 font-extrabold text-[hsl(var(--fg))]">{cap.title}</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted))] leading-relaxed">{cap.desc}</div>
        </div>
      </div>
    </m.button>
  );
}

function CapabilityDetail({ cap }: { cap: Capability }) {
  const reduce = useReducedMotion();

  return (
    <m.div
      key={cap.id}
      initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
      transition={
        reduce ? { duration: 0.01 } : { type: "spring", stiffness: 260, damping: 28 }
      }
      className="group"
    >
      <NeoCard className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
              Capability
            </div>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
              {cap.title}
            </div>
          </div>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
            <cap.Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
          </div>
        </div>

        <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed">{cap.desc}</p>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5">
            <div className="text-sm font-extrabold text-[hsl(var(--fg))]">Outcomes</div>
            <div className="mt-4 space-y-3">
              {cap.outcomes.map((o) => (
                <div key={o} className="flex items-center gap-3 text-[hsl(var(--muted))]">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--accent))]" />
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-5">
            <div className="text-sm font-extrabold text-[hsl(var(--fg))]">Example Use-Cases</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {cap.examples.map((e) => (
                <TagPill key={e}>{e}</TagPill>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[
            { Icon: Lock, t: "Governed", d: "Controls, privacy, auditability" },
            { Icon: Activity, t: "Observable", d: "Monitoring + drift signals" },
            { Icon: GitBranch, t: "Deployable", d: "Integration-ready delivery" },
          ].map((p) => (
            <div
              key={p.t}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
                  <p.Icon className="h-5 w-5 text-[hsl(var(--muted))]" />
                </div>
                <div>
                  <div className="font-extrabold text-[hsl(var(--fg))]">{p.t}</div>
                  <div className="text-xs text-[hsl(var(--muted))]">{p.d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-extrabold text-[hsl(var(--accent-ink))] shadow-[0_18px_80px_rgba(34,211,238,0.18)] hover:brightness-110 transition"
          >
            Discuss This Use-Case
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </NeoCard>
    </m.div>
  );
}

function CTAOrb() {
  const reduce = useReducedMotion();

  return (
    <div className="relative aspect-square w-full max-w-[420px] mx-auto overflow-hidden rounded-[32px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 shadow-[0_55px_190px_rgba(0,0,0,var(--shadow))]">
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/12 blur-[90px]" />
      <div className="absolute -bottom-28 right-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] [background-size:12px_12px]" />

      <m.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.70), rgba(59,130,246,0.35) 45%, rgba(99,102,241,0.20) 62%, rgba(0,0,0,0) 72%)",
        }}
        animate={reduce ? undefined : { rotate: [0, 10, -8, 0], scale: [1, 1.02, 0.99, 1] }}
        transition={reduce ? { duration: 0.01 } : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[hsl(var(--border))]"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? { duration: 0.01 } : { duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/65 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
            <ShieldCheck className="h-5 w-5 text-[hsl(var(--fg))]" />
          </div>
          <div>
            <div className="font-extrabold text-[hsl(var(--fg))]">Production-first</div>
            <div className="text-sm text-[hsl(var(--muted))]">Built with governance and monitoring.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AiSolutionsPage() {
  const reduce = useReducedMotion();

  // background orbs motion like the portfolio
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 1200], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 1200], [0, -90]);

  const defaultCapabilities = useMemo<Capability[]>(
    () => [
      {
        id: "ml",
        title: "Machine Learning Models",
        desc: "Custom ML for prediction, detection, forecasting, and decision intelligence — tuned to your real data and constraints.",
        Icon: Cpu,
        outcomes: ["Higher accuracy forecasts", "Fraud / anomaly detection", "Smarter segmentation"],
        examples: ["Risk scoring", "Churn prediction", "Demand forecasting"],
      },
      {
        id: "analytics",
        title: "Data Analytics & Insights",
        desc: "Turn raw data into decision systems: KPI frameworks, dashboards, experimentation, and insight pipelines that teams actually use.",
        Icon: BarChart3,
        outcomes: ["Clear KPI ownership", "Faster decisions", "Reliable reporting"],
        examples: ["Executive dashboards", "Cohort analysis", "Attribution"],
      },
      {
        id: "nlp",
        title: "Natural Language Processing (NLP)",
        desc: "Build AI that understands text: semantic search, chat assistants, document intelligence, classification, and summarization.",
        Icon: Bot,
        outcomes: ["Faster knowledge access", "Better support", "Reduced manual review"],
        examples: ["Doc Q&A", "Ticket triage", "Contract extraction"],
      },
      {
        id: "automation",
        title: "AI-Powered Automation",
        desc: "Automate repetitive work with AI: intelligent routing, extraction, approvals, and workflow copilots that scale operations.",
        Icon: Workflow,
        outcomes: ["Lower cycle time", "Fewer errors", "Operational scale"],
        examples: ["Ops automation", "Invoice parsing", "Process copilots"],
      },
    ],
    []
  );

  const defaultHero = {
    eyebrow: "AI Solutions • HOPn",
    title: "Build AI that ships, scales, and pays back.",
    subtitle:
      "Bespoke AI services designed for real-world delivery — from proof-of-value to production systems with governance, monitoring, and measurable ROI.",
    primaryCta: { label: "Explore Capabilities", href: "#capabilities" },
    secondaryCta: { label: "Discuss Your AI Project", href: "/contact" },
  };

  const defaultChips = ["ML • NLP • Analytics", "Automation", "Secure-by-design", "MVP → Production"];
  const defaultStats = [
    { k: "Approach", v: "Outcome-first delivery" },
    { k: "Deployment", v: "Governance + monitoring" },
    { k: "Speed", v: "Prototype in weeks" },
  ];
  const defaultRoadmap = [
    { k: "Discover", d: "Goals, data readiness, ROI metrics" },
    { k: "Prototype", d: "Proof-of-value with measurable lift" },
    { k: "Deploy", d: "Integrate, monitor, govern" },
    { k: "Optimize", d: "Continuous improvement & adoption" },
  ];
  const defaultBenefits = [
    "Enhanced Decision-Making",
    "Personalized Customer Experiences",
    "Competitive Advantage",
    "Improved Operational Efficiency",
    "New Revenue Streams",
    "Operational Trust & Governance",
  ];
  const defaultCta = {
    eyebrow: "Let’s build something real",
    title: "Ready to implement AI and drive growth?",
    subtitle:
      "Discover how tailored AI solutions can optimize operations, enhance customer experiences, and give you a significant competitive edge.",
    primaryCta: { label: "Discuss Your AI Project", href: "/contact" },
    secondaryCta: { label: "Revisit Capabilities", href: "#capabilities" },
    tags: ["MVP in weeks", "Secure deployment", "Measurable ROI"],
  };

  const [settings, setSettings] = useState<AiSolutionsSettings | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchCms<{ key: string; valueJson?: AiSolutionsSettings }>("/settings/public?key=page_ai_solutions")
      .then((res) => {
        const data = normalizeSingle<{ valueJson?: AiSolutionsSettings }>(res as any);
        if (!mounted) return;
        setSettings(data?.valueJson || null);
      })
      .catch(() => {
        if (!mounted) return;
        setSettings(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const hero = settings?.hero ? { ...defaultHero, ...settings.hero } : defaultHero;
  const chips = settings?.chips?.length ? settings.chips : defaultChips;
  const stats = settings?.stats?.length ? settings.stats : defaultStats;
  const roadmap = settings?.roadmap?.length ? settings.roadmap : defaultRoadmap;
  const benefits = settings?.benefits?.length ? settings.benefits : defaultBenefits;
  const cta = settings?.cta ? { ...defaultCta, ...settings.cta } : defaultCta;

  const capabilities = useMemo<Capability[]>(() => {
    if (!settings?.capabilities?.length) return defaultCapabilities;
    const map = new Map(defaultCapabilities.map((c) => [c.id, c]));
    return settings.capabilities.map((c) => {
      const base = map.get(c.id) || defaultCapabilities[0];
      return {
        ...base,
        title: c.title ?? base.title,
        desc: c.desc ?? base.desc,
        outcomes: c.outcomes?.length ? c.outcomes : base.outcomes,
        examples: c.examples?.length ? c.examples : base.examples,
      };
    });
  }, [defaultCapabilities, settings?.capabilities]);

  const [active, setActive] = useState<string>(capabilities[0]?.id ?? "ml");
  const current = capabilities.find((c) => c.id === active) ?? capabilities[0];

  useEffect(() => {
    if (!capabilities.length) return;
    setActive((prev) => capabilities.find((c) => c.id === prev)?.id ?? capabilities[0].id);
  }, [capabilities]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={reduce ? "always" : "never"}>
        <main className="relative min-h-screen text-[hsl(var(--fg))] bg-[hsl(var(--bg))]">
          <style>{`
            :root {
              /* base */
              --bg: 210 40% 99%;
              --fg: 222 47% 11%;
              --card: 0 0% 100%;
              --muted: 215 16% 40%;
              --border: 214 20% 88%;
              --ring: 199 89% 55%;

              /* accents (same vibe as portfolio) */
              --accent: 191 92% 55%;
              --accent-1: 191 92% 55%;
              --accent-2: 245 83% 65%;
              --accent-ink: 222 47% 10%;

              /* card language */
              --neo-from: 0 0% 100%;
              --neo-to: 210 40% 98%;
              --neo-sheen: 191 92% 55%;
              --neo-grid: 215 20% 22%;

              /* chips / tags / btn */
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

              /* background */
              --shadow: 0.14;
              --sheen: 0.55;
              --vignette: 0.08;
              --grid: 0.05;
            }

            .dark,
            [data-theme="dark"] {
              --bg: 224 46% 6%;
              --fg: 210 40% 98%;
              --card: 224 46% 10%;
              --muted: 215 20% 70%;
              --border: 220 22% 18%;
              --ring: 191 92% 55%;

              --accent: 191 92% 55%;
              --accent-1: 191 92% 55%;
              --accent-2: 245 83% 65%;
              --accent-ink: 224 46% 8%;

              --neo-from: 224 46% 10%;
              --neo-to: 224 46% 7%;
              --neo-sheen: 191 92% 55%;
              --neo-grid: 210 40% 98%;

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

              --shadow: 0.55;
              --sheen: 0.70;
              --vignette: 0.78;
              --grid: 0.05;
            }

            .shimmer-sweep {
              background: linear-gradient(
                110deg,
                transparent 20%,
                rgba(34, 211, 238, 0.14) 40%,
                rgba(255, 255, 255, 0.10) 50%,
                rgba(34, 211, 238, 0.12) 60%,
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

          {/* BACKGROUND SYSTEM (same as portfolio) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:110px_110px]"
              style={{ opacity: "var(--grid)" as any }}
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
              className="absolute -top-20 -right-72 h-[860px] w-[860px] rounded-full bg-indigo-500/10 blur-[210px]"
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
          <section className="relative z-10 pt-16 sm:pt-20 pb-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-12 items-start">
                <div className="lg:col-span-7">
                  <m.div variants={stagger} initial="hidden" animate="show">
                    <m.div variants={fadeUp}>
                      <SectionTitle
                        icon={<BrainCircuit className="h-4 w-4 text-[hsl(var(--accent))]" />}
                        eyebrow={hero.eyebrow}
                        title={hero.title}
                        subtitle={hero.subtitle}
                      />
                    </m.div>

                    <m.div variants={fadeUp} className="mt-7 flex flex-wrap gap-2">
                      {chips.map((chip, idx) => (
                        <Chip
                          key={`${chip}-${idx}`}
                          tone={idx % 3 === 1 ? "indigo" : idx % 3 === 2 ? "slate" : "cyan"}
                        >
                          {chip}
                        </Chip>
                      ))}
                    </m.div>

                    <m.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
                      <Link
                        href={hero.primaryCta.href}
                        className={cx(
                          "group inline-flex items-center justify-center gap-2 rounded-xl",
                          "bg-[hsl(var(--accent))] px-6 py-3 text-sm font-extrabold text-[hsl(var(--accent-ink))]",
                          "shadow-[0_18px_80px_rgba(34,211,238,0.18)] hover:brightness-110 transition",
                          "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                        )}
                      >
                        {hero.primaryCta.label}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </Link>

                      <Link
                        href={hero.secondaryCta.href}
                        className={cx(
                          "group inline-flex items-center justify-center gap-2 rounded-xl",
                          "border border-[hsl(var(--border))] bg-[hsl(var(--btn))] px-6 py-3 text-sm font-bold text-[hsl(var(--fg))]",
                          "hover:bg-[hsl(var(--card))]/85 transition",
                          "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                        )}
                      >
                        {hero.secondaryCta.label}
                        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </Link>
                    </m.div>

                    <m.div variants={fadeUp} className="mt-10 grid gap-3 sm:grid-cols-3">
                      {[Radar, ShieldCheck, Wand2].map((Icon, idx) => (
                        <Stat
                          key={stats[idx]?.k || idx}
                          k={stats[idx]?.k || ""}
                          v={stats[idx]?.v || ""}
                          Icon={Icon}
                        />
                      ))}
                    </m.div>
                  </m.div>
                </div>

                {/* RIGHT PANEL */}
                <m.div variants={fadeUp} initial="hidden" animate="show" className="lg:col-span-5">
                  <NeoCard className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
                          Your AI roadmap
                        </div>
                        <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">
                          From idea to production
                        </div>
                      </div>
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
                        <Layers3 className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[
                        { Icon: ScanEye },
                        { Icon: Wand2 },
                        { Icon: ShieldCheck },
                        { Icon: Gauge },
                      ].map((icon, i) => {
                        const step = roadmap[i];
                        if (!step) return null;
                        return (
                        <m.div
                          key={step.k}
                          whileHover={reduce ? undefined : { y: -2 }}
                          transition={{ type: "spring", stiffness: 320, damping: 24 }}
                          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
                              <icon.Icon className="h-5 w-5 text-[hsl(var(--muted))]" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-extrabold text-[hsl(var(--fg))]">
                                {i + 1}. {step.k}
                              </div>
                              <div className="text-sm text-[hsl(var(--muted))]">{step.d}</div>
                            </div>
                          </div>
                        </m.div>
                      )})}
                    </div>

                    <div className="mt-5 text-xs text-[hsl(var(--muted))]">
                      Built for reliability, traceability, and business impact.
                    </div>
                  </NeoCard>
                </m.div>
              </div>
            </div>
          </section>

          {/* CAPABILITIES */}
          <section
            id="capabilities"
            className="relative z-10 py-14 border-t border-[hsl(var(--border))]"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
                      Key AI Capabilities
                    </div>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-black text-[hsl(var(--fg))]">
                      Pick a capability — see outcomes & examples
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Chip tone="slate">Strategy</Chip>
                    <Chip tone="slate">Engineering</Chip>
                    <Chip tone="slate">Delivery</Chip>
                  </div>
                </div>
              </m.div>

              <div className="mt-10 grid gap-8 lg:grid-cols-12">
                {/* Left list */}
                <div className="lg:col-span-5">
                  <div className="space-y-3">
                    {capabilities.map((c, idx) => (
                      <CapabilityButton
                        key={c.id}
                        cap={c}
                        index={idx}
                        active={active === c.id}
                        onClick={() => setActive(c.id)}
                      />
                    ))}
                  </div>
                </div>

                {/* Right detail */}
                <div className="lg:col-span-7">
                  <AnimatePresence mode="wait">
                    <CapabilityDetail cap={current} />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          {/* BENEFITS */}
          <section className="relative z-10 py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }}>
                <div className="grid gap-6 lg:grid-cols-12 items-start">
                  <div className="lg:col-span-5">
                    <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
                      Benefits
                    </div>
                    <h3 className="mt-2 text-3xl sm:text-4xl font-black text-[hsl(var(--fg))]">
                      Why partner with HOPn for AI?
                    </h3>
                    <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed">
                      We focus on delivery, governance, and measurable impact — so your AI initiatives become
                      real systems your teams trust.
                    </p>
                  </div>

                  <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
                    {benefits.map((b) => (
                      <NeoCard key={b} className="p-5" interactive>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-[hsl(var(--accent))]" />
                          <div className="font-extrabold text-[hsl(var(--fg))]">{b}</div>
                        </div>
                        <div className="mt-2 text-sm text-[hsl(var(--muted))]">
                          Built to deliver measurable value, not just prototypes.
                        </div>
                      </NeoCard>
                    ))}
                  </div>
                </div>
              </m.div>
            </div>
          </section>

          {/* CTA */}
          <section
            id="cta"
            className="relative z-10 py-16 pb-20 border-t border-[hsl(var(--border))]"
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }}>
                <NeoCard className="p-8 sm:p-12" interactive>
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-[hsl(var(--accent))]/12 blur-[80px]" />
                    <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[90px]" />
                  </div>

                  <div className="relative grid gap-10 lg:grid-cols-12 items-center">
                    <div className="lg:col-span-7">
                      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted))]">
                        <BrainCircuit className="h-4 w-4 text-[hsl(var(--accent))]" />
                        {cta.eyebrow}
                      </div>
                      <h4 className="mt-3 text-3xl sm:text-5xl font-black text-[hsl(var(--fg))]">
                        {cta.title}
                      </h4>
                      <p className="mt-4 text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                        {cta.subtitle}
                      </p>

                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                          href={cta.primaryCta.href}
                          className={cx(
                            "group inline-flex items-center justify-center gap-2 rounded-xl",
                            "bg-[hsl(var(--accent))] px-7 py-4 text-sm sm:text-base font-extrabold text-[hsl(var(--accent-ink))]",
                            "shadow-[0_18px_80px_rgba(34,211,238,0.18)] hover:brightness-110 transition"
                          )}
                        >
                          {cta.primaryCta.label}
                          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                        </Link>

                        <Link
                          href={cta.secondaryCta.href}
                          className={cx(
                            "inline-flex items-center justify-center gap-2 rounded-xl",
                            "border border-[hsl(var(--border))] bg-[hsl(var(--btn))] px-7 py-4 text-sm sm:text-base font-bold text-[hsl(var(--fg))]",
                            "hover:bg-[hsl(var(--card))]/85 transition"
                          )}
                        >
                          {cta.secondaryCta.label}
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </div>

                      <div className="mt-7 flex flex-wrap gap-2">
                        {cta.tags.map((t) => (
                          <TagPill key={t}>{t}</TagPill>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <CTAOrb />
                    </div>
                  </div>
                </NeoCard>
              </m.div>
            </div>
          </section>

          <div className="relative z-10 h-10" />
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
