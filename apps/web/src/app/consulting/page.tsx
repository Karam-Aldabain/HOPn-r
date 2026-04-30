"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  LazyMotion,
  domAnimation,
  MotionConfig,
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import {
  MessageSquareText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  GitMerge,
  Lightbulb,
  Shield,
  Wand2,
  ChevronRight,
  Layers,
  Radar,
  Gauge,
  Workflow,
  Lock,
  Target,
  Cpu,
  LineChart,
  Zap,
  Activity,
  ShieldCheck,
  Cpu as CpuIcon,
  RefreshCw,
  SlidersHorizontal,
  Menu,
  X,
} from "lucide-react";
import { useCmsPageData } from "@/lib/use-cms-page-data";

/* -------------------------------- utilities ------------------------------- */
function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

type Expertise = {
  title: string;
  desc: string;
  Icon: ComponentType<{ className?: string }>;
  bullets: string[];
};

type Step = {
  title: string;
  desc: string;
  Icon: ComponentType<{ className?: string }>;
};

type Pillar = {
  title: string;
  desc: string;
  footLeft: string;
  footRight: string;
  Icon: ComponentType<{ className?: string }>;
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085 } },
};

/* ------------------------------ UI PRIMITIVES ----------------------------- */
function Chip({
  children,
  tone = "blue",
  icon = true,
}: {
  children: ReactNode;
  tone?: "blue" | "indigo" | "slate" | "teal";
  icon?: boolean;
}) {
  const toneVar =
    tone === "teal"
      ? "var(--tone-green)"
      : tone === "indigo"
        ? "var(--tone-violet)"
        : tone === "slate"
          ? "var(--tone-slate)"
          : "var(--tone-cyan)";

  const toneInk =
    tone === "teal"
      ? "var(--tone-green-ink)"
      : tone === "indigo"
        ? "var(--tone-violet-ink)"
        : tone === "slate"
          ? "var(--tone-slate-ink)"
          : "var(--tone-cyan-ink)";

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide ring-1"
      style={{
        background: `color-mix(in oklab, ${toneVar} 12%, transparent)`,
        color: `hsl(${toneInk})`,
        borderColor: `color-mix(in oklab, ${toneVar} 22%, transparent)`,
      }}
    >
      {icon ? <Sparkles className="h-3.5 w-3.5 opacity-80" /> : null}
      {children}
    </span>
  );
}

/**
 * Upgraded card:
 * - gradient border
 * - inner gloss + faint grid
 * - focus ring + keyboard friendly
 */
function GradientCard({
  children,
  className = "",
  interactive = true,
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: any;
}) {
  return (
    <As
      className={cx(
        "gcard group relative",
        interactive &&
          "transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.01]",
        className
      )}
    >
      <div className="gcard__border" />
      <div className="gcard__inner">{children}</div>
    </As>
  );
}

function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 backdrop-blur-[12px]",
        className
      )}
    >
      {children}
    </div>
  );
}

function IconPill({
  Icon,
  label,
}: {
  Icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Surface className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
          <Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
        </div>
        <div className="text-sm font-semibold text-[hsl(var(--fg))]">
          {label}
        </div>
      </div>
    </Surface>
  );
}

function SectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      {kicker ? (
        <div className="text-xs font-semibold tracking-[0.18em] text-[hsl(var(--muted))]">
          {kicker}
        </div>
      ) : null}

      <div className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
        <span className="grad-text">{title}</span>
      </div>

      {subtitle ? (
        <div className="mt-4 text-[hsl(var(--muted))] max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------ MINI CHARTS ------------------------------ */
function SparkLine() {
  return (
    <div className="relative h-16 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] [background-size:12px_12px]" />
      <svg
        viewBox="0 0 260 64"
        className="relative h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M10 46 C 36 34, 58 52, 82 36 C 106 20, 122 34, 146 26 C 170 18, 188 30, 208 18 C 228 6, 242 14, 252 10"
          className="dash-path"
          stroke="rgba(34,211,238,0.95)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M10 46 C 36 34, 58 52, 82 36 C 106 20, 122 34, 146 26 C 170 18, 188 30, 208 18 C 228 6, 242 14, 252 10"
          stroke="rgba(34,211,238,0.14)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function MiniBars({ cols = 12 }: { cols?: number }) {
  return (
    <div className="grid grid-cols-12 gap-2">
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className="h-14 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 overflow-hidden"
        >
          <div
            className="h-full w-full origin-bottom animate-rise bg-gradient-to-t from-[hsl(var(--accent-1))]/30 via-[hsl(var(--accent-1))]/12 to-transparent"
            style={{
              animationDelay: `${i * 80}ms`,
              transform: `scaleY(${0.22 + (i % 5) * 0.14 + (i % 3) * 0.08})`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* --------------------------- DASHBOARD-LIKE CARDS -------------------------- */
function StatPill({ k, v }: { k: string; v: string }) {
  return (
    <Surface className="px-4 py-3">
      <div className="text-[11px] text-[hsl(var(--muted))]">{k}</div>
      <div className="text-base font-extrabold text-[hsl(var(--fg))]">{v}</div>
    </Surface>
  );
}

function DashboardCardA() {
  return (
    <GradientCard className="p-0" interactive>
      <div className="relative overflow-hidden rounded-[22px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
              Payments Health
            </div>
            <div className="mt-2 text-xl font-extrabold text-[hsl(var(--fg))]">
              Success rate &amp; throughput
            </div>
            <div className="mt-2 text-sm text-[hsl(var(--muted))]">
              Autoscaling, retries, and smart routing.
            </div>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--tone-green))]/12 ring-1 ring-[hsl(var(--tone-green))]/20">
            <Zap className="h-5 w-5 text-[hsl(var(--tone-green-ink))]" />
          </div>
        </div>

        <div className="mt-5">
          <SparkLine />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatPill k="TPS" v="4.8k" />
          <StatPill k="Success" v="99.94%" />
          <StatPill k="p95" v="210ms" />
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
          <span>Uptime: 99.99%</span>
          <span className="inline-flex items-center gap-2 text-[hsl(var(--accent))]/90">
            Live ops <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </GradientCard>
  );
}

function DashboardCardB() {
  return (
    <GradientCard className="p-0" interactive>
      <div className="relative overflow-hidden rounded-[22px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
              Risk &amp; Fraud Signals
            </div>
            <div className="mt-2 text-xl font-extrabold text-[hsl(var(--fg))]">
              Real-time anomaly score
            </div>
            <div className="mt-2 text-sm text-[hsl(var(--muted))]">
              Streaming detection with explainable flags.
            </div>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15">
            <ShieldCheck className="h-5 w-5 text-[hsl(var(--accent))]" />
          </div>
        </div>

        <div className="mt-5">
          <MiniBars cols={12} />
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
          <span>Latency: ~120ms</span>
          <span className="inline-flex items-center gap-2 text-[hsl(var(--accent))]/90">
            View details <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </GradientCard>
  );
}

function TwinSyncCard() {
  return (
    <GradientCard className="p-0" interactive>
      <div className="relative overflow-hidden rounded-[22px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
              Twin Sync
            </div>
            <div className="mt-2 text-xl font-extrabold text-[hsl(var(--fg))]">
              Physical ↔ Digital alignment
            </div>
            <div className="mt-2 text-sm text-[hsl(var(--muted))]">
              Stream data, update state, and keep models calibrated.
            </div>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15">
            <Activity className="h-5 w-5 text-[hsl(var(--accent))]" />
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <Surface className="p-4">
            <div className="flex items-center gap-2 font-extrabold text-[hsl(var(--fg))]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
                <Layers className="h-4 w-4 text-[hsl(var(--accent))]" />
              </span>
              Physical
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { k: "Sensors", v: "Live" },
                { k: "Vibration", v: "0.72g" },
                { k: "Temp", v: "58°C" },
                { k: "Load", v: "81%" },
              ].map((x) => (
                <Surface key={x.k} className="p-3 bg-[hsl(var(--card))]/75">
                  <div className="text-[11px] text-[hsl(var(--muted))]">{x.k}</div>
                  <div className="text-base font-extrabold text-[hsl(var(--fg))]">{x.v}</div>
                </Surface>
              ))}
            </div>
          </Surface>

          <Surface className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-[hsl(var(--fg))]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
                  <CpuIcon className="h-4 w-4 text-[hsl(var(--tone-green-ink))]" />
                </span>
                Digital
              </div>
              <span className="text-xs font-semibold text-[hsl(var(--accent))]/90">
                Updated
              </span>
            </div>

            <div className="mt-3">
              <div className="text-xs text-[hsl(var(--muted))]">Model state</div>
              <div className="mt-2">
                <SparkLine />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <StatPill k="Drift" v="Low" />
              <StatPill k="p95" v="190ms" />
              <StatPill k="Sync" v="99.9%" />
            </div>
          </Surface>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
          <span>Latency: ~120ms</span>
          <span className="inline-flex items-center gap-2 text-[hsl(var(--accent))]/90">
            View twin graph <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </GradientCard>
  );
}

function ScenarioLabCard() {
  return (
    <GradientCard className="p-0" interactive>
      <div className="relative overflow-hidden rounded-[22px] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
              Scenario Lab
            </div>
            <div className="mt-2 text-xl font-extrabold text-[hsl(var(--fg))]">
              Simulate • Predict • Optimize
            </div>
            <div className="mt-2 text-sm text-[hsl(var(--muted))]">
              Test operational changes safely before touching production.
            </div>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--tone-green))]/12 ring-1 ring-[hsl(var(--tone-green))]/20">
            <SlidersHorizontal className="h-5 w-5 text-[hsl(var(--tone-green-ink))]" />
          </div>
        </div>

        <div className="mt-5">
          <MiniBars cols={12} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatPill k="Bottlenecks" v="2 found" />
          <StatPill k="Throughput" v="+14%" />
          <StatPill k="Downtime" v="-21%" />
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
          <span>Run: safe mode</span>
          <span className="inline-flex items-center gap-2 text-[hsl(var(--accent))]/90">
            View scenarios <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </GradientCard>
  );
}

/* ------------------------------ PILLAR CARD ------------------------------ */
function PillarCard({ p }: { p: Pillar }) {
  return (
    <GradientCard className="p-0" interactive>
      <div className="relative overflow-hidden rounded-[22px] p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
            <p.Icon className="h-7 w-7 text-[hsl(var(--accent))]" />
          </div>

          <div className="min-w-0">
            <div className="text-xl font-extrabold text-[hsl(var(--fg))]">{p.title}</div>
            <div className="mt-1.5 text-[hsl(var(--muted))] leading-relaxed">
              {p.desc}
            </div>
          </div>
        </div>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent" />

        <div className="mt-4 flex items-center justify-between gap-6">
          <div className="text-sm text-[hsl(var(--muted))]">{p.footLeft}</div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(var(--accent))]/90">
            {p.footRight} <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </GradientCard>
  );
}

/* ------------------------------ NAV + UI ------------------------------ */
function NavBar({
  reduce,
  onOpenMobile,
}: {
  reduce: boolean;
  onOpenMobile: () => void;
}) {
  return (
    <div className="sticky top-0 z-30">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent dark:from-black/35" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <GradientCard className="p-0" interactive={!reduce}>
          <div className="rounded-[22px] px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <Link href="#" className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] rounded-xl px-2 py-1">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15">
                <MessageSquareText className="h-5 w-5 text-[hsl(var(--accent))]" />
              </span>
              <span className="font-extrabold tracking-tight text-[hsl(var(--fg))]">
                HOPn <span className="text-[hsl(var(--muted))] font-semibold">Consulting</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {[
                ["Expertise", "#expertise"],
                ["Playbook", "#playbook"],
                ["Outcomes", "#outcomes"],
                ["Contact", "#cta"],
              ].map(([t, href]) => (
                <Link
                  key={t}
                  href={href}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                >
                  {t}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="#cta"
                className="hidden sm:inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-4 py-2 text-sm font-extrabold text-[hsl(var(--accent-ink))] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              >
                Request <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={onOpenMobile}
                className="md:hidden inline-flex items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-2 hover:bg-[hsl(var(--card))]/85 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GradientCard className="p-0" interactive>
          <div className="rounded-[22px] p-4">
            <div className="flex items-center justify-between">
              <div className="font-extrabold text-[hsl(var(--fg))]">Menu</div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-2 hover:bg-[hsl(var(--card))]/85 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 grid gap-2">
              {[
                ["Expertise", "#expertise"],
                ["Playbook", "#playbook"],
                ["Outcomes", "#outcomes"],
                ["Contact", "#cta"],
              ].map(([t, href]) => (
                <Link
                  key={t}
                  href={href}
                  onClick={onClose}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-[hsl(var(--fg))] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 hover:bg-[hsl(var(--card))]/85"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </GradientCard>
      </div>
    </div>
  );
}

/* ------------------------------- MAIN PAGE ------------------------------- */
export default function TechnologyConsultingPage() {
  const content = useCmsPageData("consulting", {
    hero: {
      title: "Technology Consulting by HOPn",
      subtitle:
        "Expert guidance to navigate complex technology decisions — turning ambiguity into a clear plan, secure execution, and measurable business impact.",
      primaryCta: "Explore Expertise",
      secondaryCta: "Request Consultation",
    },
    expertiseTitle: "Our Core Consulting Expertise Areas",
  });

  const reduce = useReducedMotion();

  // scroll progress (top bar)
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32 });

  // background parallax
  const orbY = useTransform(scrollY, [0, 900], [0, 90]);
  const orbY2 = useTransform(scrollY, [0, 900], [0, -70]);

  // subtle “mouse sheen” on hero
  const heroRef = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const smx = useSpring(mx, { stiffness: 180, damping: 30 });
  const smy = useSpring(my, { stiffness: 180, damping: 30 });

  // small “scroll hint” pill
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setShowTop(v > 900));
    return () => unsub();
  }, [scrollY]);

  // mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  const pillars = useMemo<Pillar[]>(
    () => [
      {
        title: "Governance",
        desc: "Evidence, controls, audit trails",
        footLeft: "Designed for production",
        footRight: "Learn more",
        Icon: Shield,
      },
      {
        title: "Performance",
        desc: "Low latency, high uptime",
        footLeft: "Designed for production",
        footRight: "Learn more",
        Icon: Gauge,
      },
      {
        title: "Visibility",
        desc: "Metrics, logs, traces",
        footLeft: "Designed for production",
        footRight: "Learn more",
        Icon: LineChart,
      },
    ],
    []
  );

  const expertise = useMemo<Expertise[]>(
    () => [
      {
        title: "Digital Transformation Strategy",
        desc: "Roadmaps that convert ambition into sequenced execution — with governance, milestones, and measurable outcomes.",
        Icon: GitMerge,
        bullets: [
          "Operating model & KPI design",
          "Platform + data strategy",
          "Change enablement plan",
        ],
      },
      {
        title: "Technology Advisory",
        desc: "Objective guidance on architecture, cloud, build-vs-buy, and modernization to maximize ROI and reduce risk.",
        Icon: Wand2,
        bullets: [
          "Architecture reviews",
          "Cloud & cost optimization",
          "Delivery acceleration",
        ],
      },
      {
        title: "Cybersecurity & Risk Management",
        desc: "Security-first decisions across identity, data, and infrastructure — aligned with regulatory and audit needs.",
        Icon: Shield,
        bullets: [
          "Risk posture assessment",
          "Controls & hardening",
          "Compliance readiness",
        ],
      },
      {
        title: "Innovation Management",
        desc: "A repeatable pipeline to validate ideas, prototype quickly, and scale what works — without chaos.",
        Icon: Lightbulb,
        bullets: [
          "Discovery workshops",
          "Experiment design",
          "Pilot → production playbook",
        ],
      },
    ],
    []
  );

  const steps = useMemo<Step[]>(
    () => [
      {
        title: "Discover",
        desc: "Clarify goals, constraints, stakeholders, and baseline metrics.",
        Icon: Radar,
      },
      {
        title: "Design",
        desc: "Define target architecture, roadmap, governance, and delivery plan.",
        Icon: Layers,
      },
      {
        title: "Deliver",
        desc: "Support execution: teams, tooling, cadence, and measurable milestones.",
        Icon: Workflow,
      },
      {
        title: "Harden",
        desc: "Security, compliance, reliability, and operational readiness.",
        Icon: Lock,
      },
      {
        title: "Optimize",
        desc: "Cost/performance tuning + continuous improvement loop.",
        Icon: Gauge,
      },
    ],
    []
  );

  const outcomes = useMemo(
    () => [
      { k: "Strategic Clarity & Direction", Icon: Target },
      { k: "Optimized Technology Investments", Icon: Cpu },
      { k: "Enhanced Cybersecurity Posture", Icon: Shield },
      { k: "Accelerated Innovation Cycles", Icon: Sparkles },
      { k: "Sustainable Business Growth", Icon: ArrowRight },
    ],
    []
  );

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={reduce ? "always" : "never"}>
        <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
          {/* Skip link for accessibility */}
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 rounded-xl bg-[hsl(var(--accent))] px-4 py-2 text-sm font-extrabold text-[hsl(var(--accent-ink))]"
          >
            Skip to content
          </a>

          {/* Top scroll progress bar */}
          <m.div
            aria-hidden="true"
            className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-[hsl(var(--accent))]/80"
            style={{ scaleX: progress }}
          />

          {/* THEME + GLOBAL STYLES */}
          <style>{`
            :root {
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
              --accent-3: 160 84% 39%;
              --accent-ink: 0 0% 100%;

              --tone-cyan: hsl(199 89% 48%);
              --tone-cyan-ink: 199 89% 18%;
              --tone-green: hsl(160 84% 39%);
              --tone-green-ink: 160 84% 18%;
              --tone-violet: hsl(245 83% 62%);
              --tone-violet-ink: 245 83% 20%;
              --tone-slate: hsl(215 16% 42%);
              --tone-slate-ink: 222 47% 11%;

              --consult-grid: rgba(2, 6, 23, 0.08);
              --consult-grid-opacity: 0.08;
              --consult-vignette: 0.06;
            }

            .dark,
            [data-theme="dark"] {
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
              --accent-3: 160 84% 45%;
              --accent-ink: 222 47% 11%;

              --tone-cyan: hsl(191 92% 44%);
              --tone-cyan-ink: 191 92% 86%;
              --tone-green: hsl(160 84% 39%);
              --tone-green-ink: 160 84% 86%;
              --tone-violet: hsl(245 83% 67%);
              --tone-violet-ink: 245 83% 90%;
              --tone-slate: hsl(215 20% 70%);
              --tone-slate-ink: 210 40% 98%;

              --consult-grid: rgba(255, 255, 255, 0.1);
              --consult-grid-opacity: 0.08;
              --consult-vignette: 0.78;
            }

            .grad-text {
              background: linear-gradient(
                90deg,
                hsl(var(--accent-1)),
                hsl(var(--accent-2)),
                hsl(var(--accent-3)),
                hsl(var(--accent-1))
              );
              background-size: 220% 100%;
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

            .animate-rise {
              animation: rise 1.35s ease-in-out infinite alternate;
            }
            @keyframes rise {
              from {
                filter: brightness(0.9);
              }
              to {
                filter: brightness(1.08);
              }
            }

            .dash-path {
              stroke-dasharray: 520;
              stroke-dashoffset: 520;
              animation: dash 2.1s ease forwards;
            }
            @keyframes dash {
              to {
                stroke-dashoffset: 0;
              }
            }

            .gcard {
              border-radius: 26px;
            }
            .gcard__border {
              position: absolute;
              inset: 0;
              border-radius: 26px;
              padding: 1px;
              background: linear-gradient(
                135deg,
                rgba(34, 211, 238, 0.35),
                rgba(99, 102, 241, 0.2),
                rgba(16, 185, 129, 0.14),
                rgba(34, 211, 238, 0.14)
              );
              opacity: 0.85;
              transition: opacity 220ms ease, filter 220ms ease;
              filter: saturate(1.12);
            }
            .gcard__inner {
              position: relative;
              border-radius: 25px;
              border: 1px solid hsl(var(--border));
              background: color-mix(in oklab, hsl(var(--card)) 86%, transparent);
              backdrop-filter: blur(18px);
              box-shadow: 0 24px 90px rgba(0, 0, 0, 0.12);
              overflow: hidden;
            }
            .gcard__inner:before {
              content: "";
              position: absolute;
              inset: 0;
              pointer-events: none;
              opacity: 0.75;
              background: radial-gradient(
                80% 60% at 30% 10%,
                rgba(255, 255, 255, 0.12),
                transparent 62%
              );
            }
            .gcard__inner:after {
              content: "";
              position: absolute;
              inset: 0;
              pointer-events: none;
              opacity: 0.07;
              background-image: linear-gradient(
                  to right,
                  rgba(255, 255, 255, 0.12) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  to bottom,
                  rgba(255, 255, 255, 0.1) 1px,
                  transparent 1px
                );
              background-size: 96px 96px;
            }
            .dark .gcard__inner,
            [data-theme="dark"] .gcard__inner {
              background: rgba(255, 255, 255, 0.03);
              border-color: rgba(255, 255, 255, 0.08);
              box-shadow: 0 30px 110px rgba(0, 0, 0, 0.45);
            }
            .gcard:hover .gcard__border {
              opacity: 1;
              filter: saturate(1.35);
            }

            .shimmer {
              background: radial-gradient(
                900px 420px at 20% 0%,
                rgba(34, 211, 238, 0.16),
                transparent 60%
              );
              animation: shimmerMove 9s ease-in-out infinite;
              mix-blend-mode: screen;
            }
            @keyframes shimmerMove {
              0% {
                transform: translate3d(0, 0, 0);
                opacity: 0.12;
              }
              50% {
                transform: translate3d(30px, 18px, 0);
                opacity: 0.22;
              }
              100% {
                transform: translate3d(0, 0, 0);
                opacity: 0.12;
              }
            }

            /* reduced motion */
            @media (prefers-reduced-motion: reduce) {
              .grad-text {
                animation: none !important;
              }
              .animate-rise {
                animation: none !important;
              }
              .dash-path {
                animation: none !important;
                stroke-dashoffset: 0 !important;
              }
            }
          `}</style>

          <NavBar reduce={!!reduce} onOpenMobile={() => setMenuOpen(true)} />
          <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

          {/* BACKGROUND SYSTEM */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <m.div
              aria-hidden="true"
              style={{ y: orbY }}
              className="absolute -top-56 left-1/3 h-[640px] w-[940px] -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/12 blur-[140px]"
              animate={reduce ? undefined : { x: [0, 16, 0], scale: [1, 1.03, 1] }}
              transition={reduce ? { duration: 0.01 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <m.div
              aria-hidden="true"
              style={{ y: orbY2 }}
              className="absolute -top-10 -right-72 h-[820px] w-[820px] rounded-full bg-[hsl(var(--accent-2))]/10 blur-[170px]"
              animate={reduce ? undefined : { x: [0, -18, 0], scale: [1, 1.02, 1] }}
              transition={reduce ? { duration: 0.01 } : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="absolute inset-0 opacity-[0.16] shimmer" />

            <div
              className="absolute inset-0 [background-image:linear-gradient(to_right,var(--consult-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--consult-grid)_1px,transparent_1px)] [background-size:120px_120px]"
              style={{ opacity: "var(--consult-grid-opacity)" as any }}
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(closest-side, transparent, rgba(0,0,0,var(--consult-vignette)))",
              }}
            />
          </div>

          {/* CONTENT */}
          <div id="content" />

          {/* HERO */}
          <section
            ref={heroRef}
            className="relative z-10 pt-10 sm:pt-12 pb-12"
            onMouseMove={(e) => {
              if (reduce) return;
              const el = heroRef.current;
              if (!el) return;
              const r = el.getBoundingClientRect();
              const px = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
              const py = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
              mx.set(px);
              my.set(py);
            }}
          >
            <m.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(680px 340px at var(--x) var(--y), rgba(255,255,255,0.10), transparent 70%)",
                // @ts-ignore
                "--x": smx,
                // @ts-ignore
                "--y": smy,
              }}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid gap-10 lg:grid-cols-12 items-start"
              >
                <div className="lg:col-span-7">
                  <m.div variants={fadeUp} className="flex flex-wrap items-center gap-2">
                    <Chip tone="blue">Secure-by-design</Chip>
                    <Chip tone="teal">Compliance-ready</Chip>
                    <Chip tone="indigo">Cloud-native scale</Chip>
                  </m.div>

                  <m.div variants={fadeUp} className="mt-6">
                    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[hsl(var(--card))]/80 ring-1 ring-[hsl(var(--border))]">
                      <MessageSquareText className="h-8 w-8 text-[hsl(var(--accent))]" />
                    </div>

                    <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                      <span className="grad-text">{content.hero.title.split(" ")[0]}</span>{" "}
                      <span className="text-[hsl(var(--fg))]">
                        {content.hero.title.split(" ").slice(1).join(" ")}
                      </span>
                    </h1>

                    <p className="mt-5 max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                      {content.hero.subtitle}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        href="#expertise"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-7 py-4 text-sm sm:text-base font-extrabold text-[hsl(var(--accent-ink))] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      >
                        {content.hero.primaryCta}
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                      </Link>

                      <Link
                        href="#cta"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-7 py-4 text-sm sm:text-base font-bold text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--border))]"
                      >
                        {content.hero.secondaryCta}
                        <ChevronRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                      </Link>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--muted))]">
                      {[
                        { t: "Security controls first", Icon: Lock },
                        { t: "Global-ready architecture", Icon: RefreshCw },
                        { t: "Built for regulated industries", Icon: ShieldCheck },
                      ].map((x) => (
                        <span
                          key={x.t}
                          className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-2"
                        >
                          <x.Icon className="h-4 w-4 text-[hsl(var(--accent))]/90" />
                          {x.t}
                        </span>
                      ))}
                    </div>
                  </m.div>

                  <m.div variants={fadeUp} className="mt-10 grid gap-6 md:grid-cols-3">
                    {pillars.map((p) => (
                      <PillarCard key={p.title} p={p} />
                    ))}
                  </m.div>
                </div>

                <div className="lg:col-span-5">
                  <m.div variants={stagger} className="grid gap-6">
                    <m.div variants={fadeUp}>
                      <DashboardCardA />
                    </m.div>
                    <m.div variants={fadeUp}>
                      <DashboardCardB />
                    </m.div>
                  </m.div>
                </div>
              </m.div>
            </div>
          </section>

          {/* “TWIN / SCENARIO” SECTION */}
          <section className="relative z-10 pb-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-140px" }}
                className="grid gap-6 lg:grid-cols-2"
              >
                <m.div variants={fadeUp} transition={{ type: "spring", stiffness: 340, damping: 28 }}>
                  <TwinSyncCard />
                </m.div>
                <m.div variants={fadeUp} transition={{ type: "spring", stiffness: 340, damping: 28 }}>
                  <ScenarioLabCard />
                </m.div>
              </m.div>
            </div>
          </section>

          {/* EXPERTISE */}
          <section id="expertise" className="relative z-10 py-12 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }}>
                <SectionTitle
                  kicker="CONSULTING • STRATEGY • EXECUTION"
                  title={content.expertiseTitle}
                  subtitle="Practical strategy + delivery guidance — tuned to your team, constraints, and business goals."
                />
              </m.div>

              <m.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-140px" }}
                className="mt-10 grid gap-6 lg:gap-8 lg:grid-cols-2"
              >
                {expertise.map((x, idx) => (
                  <m.div
                    key={x.title}
                    variants={fadeUp}
                    transition={
                      reduce
                        ? { duration: 0.01 }
                        : { type: "spring", stiffness: 360, damping: 30, delay: idx * 0.05 }
                    }
                  >
                    <GradientCard className="p-0" interactive={!reduce}>
                      <div className="relative overflow-hidden rounded-[22px] p-6 sm:p-7">
                        <div className="flex items-start gap-4">
                          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
                            <x.Icon className="h-7 w-7 text-[hsl(var(--accent))]" />
                          </div>

                          <div className="min-w-0">
                            <div className="text-xl sm:text-2xl font-extrabold text-[hsl(var(--fg))]">
                              {x.title}
                            </div>
                            <div className="mt-3 text-[hsl(var(--muted))] leading-relaxed">
                              {x.desc}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-2 sm:grid-cols-3">
                          {x.bullets.map((b) => (
                            <Surface key={b} className="px-4 py-3 text-sm text-[hsl(var(--fg))]">
                              {b}
                            </Surface>
                          ))}
                        </div>

                        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent" />

                        <div className="mt-5 flex items-center justify-between">
                          <span className="text-xs text-[hsl(var(--muted))] font-semibold tracking-wide">
                            Outcome-focused
                          </span>
                          <span className="text-sm font-semibold text-[hsl(var(--accent))]/90 inline-flex items-center gap-2">
                            Learn more <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </GradientCard>
                  </m.div>
                ))}
              </m.div>
            </div>
          </section>

          {/* DELIVERY PLAYBOOK */}
          <section id="playbook" className="relative z-10 py-12 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }}>
                <SectionTitle
                  kicker="HOW WE WORK"
                  title="A delivery playbook that reduces risk"
                  subtitle="Structured, repeatable, and tailored — from discovery to measurable outcomes."
                />
              </m.div>

              <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
                <m.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-140px" }}
                  transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 340, damping: 28 }}
                  className="lg:col-span-5"
                >
                  <GradientCard className="p-0" interactive={!reduce}>
                    <div className="relative overflow-hidden rounded-[22px] p-6 sm:p-7">
                      <div className="text-xs font-semibold tracking-[0.18em] text-[hsl(var(--muted))]">
                        DELIVERY SIGNALS
                      </div>
                      <div className="mt-3 text-2xl font-black text-[hsl(var(--fg))]">
                        Clarity, control, and momentum.
                      </div>

                      <div className="mt-6 space-y-3">
                        {[
                          { t: "Measurable milestones", d: "Define success metrics up front.", Icon: Target },
                          { t: "Risk-managed execution", d: "Controls, guardrails, and governance.", Icon: Shield },
                          { t: "High-leverage decisions", d: "Architecture, cloud, and operating model.", Icon: Layers },
                        ].map((x) => (
                          <Surface key={x.t} className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
                                <x.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                              </div>
                              <div>
                                <div className="font-extrabold text-[hsl(var(--fg))]">{x.t}</div>
                                <div className="text-sm text-[hsl(var(--muted))]">{x.d}</div>
                              </div>
                            </div>
                          </Surface>
                        ))}
                      </div>
                    </div>
                  </GradientCard>
                </m.div>

                <m.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-140px" }}
                  className="lg:col-span-7"
                >
                  <div className="relative">
                    <div className="absolute left-[18px] top-2 bottom-2 w-px bg-[hsl(var(--border))]" />
                    <div className="space-y-3">
                      {steps.map((s, i) => (
                        <m.div
                          key={s.title}
                          variants={fadeUp}
                          transition={
                            reduce
                              ? { duration: 0.01 }
                              : { type: "spring", stiffness: 360, damping: 30, delay: i * 0.05 }
                          }
                        >
                          <GradientCard className="p-0" interactive={!reduce}>
                            <div className="relative overflow-hidden rounded-[22px] p-5 sm:p-6">
                              <div className="flex items-start gap-4">
                                <div className="mt-1 grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
                                  <s.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-black tracking-[0.2em] text-[hsl(var(--muted))]">
                                      {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div className="text-lg font-extrabold text-[hsl(var(--fg))]">{s.title}</div>
                                  </div>
                                  <div className="mt-2 text-[hsl(var(--muted))] leading-relaxed">{s.desc}</div>
                                </div>
                              </div>
                            </div>
                          </GradientCard>
                        </m.div>
                      ))}
                    </div>
                  </div>
                </m.div>
              </div>
            </div>
          </section>

          {/* OUTCOMES */}
          <section id="outcomes" className="relative z-10 py-12 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }}>
                <GradientCard className="p-0" interactive={false}>
                  <div className="relative overflow-hidden rounded-[22px] p-7 sm:p-10">
                    <div className="text-center">
                      <div className="text-xs font-semibold tracking-[0.18em] text-[hsl(var(--muted))]">
                        WHY CHOOSE HOPn
                      </div>
                      <div className="mt-3 text-3xl sm:text-4xl font-black text-[hsl(var(--fg))]">
                        Outcomes you can defend in the boardroom
                      </div>
                    </div>

                    <m.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-140px" }} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {outcomes.map((o, idx) => (
                        <m.div
                          key={o.k}
                          variants={fadeUp}
                          transition={
                            reduce
                              ? { duration: 0.01 }
                              : { type: "spring", stiffness: 340, damping: 28, delay: idx * 0.05 }
                          }
                        >
                          <Surface className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
                                <o.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                              </div>
                              <div className="font-extrabold text-[hsl(var(--fg))]">{o.k}</div>
                            </div>
                            <div className="mt-2 text-sm text-[hsl(var(--muted))]">
                              Designed for measurable impact — not just slides.
                            </div>
                          </Surface>
                        </m.div>
                      ))}
                    </m.div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                      {[
                        "Discovery workshop",
                        "Architecture review",
                        "Security posture assessment",
                        "Transformation roadmap",
                        "Delivery acceleration",
                      ].map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-2 text-xs font-semibold text-[hsl(var(--fg))]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </GradientCard>
              </m.div>
            </div>
          </section>

          {/* CTA (upgraded with mini form, still frontend-only) */}
          <section id="cta" className="relative z-10 py-14 sm:py-16 pb-20 border-t border-[hsl(var(--border))]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-12 items-center">
                <m.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-140px" }}
                  transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 320, damping: 28 }}
                  className="lg:col-span-6"
                >
                  <GradientCard className="p-0" interactive={!reduce}>
                    <div className="relative overflow-hidden rounded-[22px] p-6">
                      <Surface className="p-6 sm:p-7">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs text-[hsl(var(--muted))]">
                              Engagement snapshot
                            </div>
                            <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">
                              What you get in week 1–2
                            </div>
                          </div>
                          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
                            <Sparkles className="h-5 w-5 text-[hsl(var(--accent))]" />
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3">
                          {[
                            { t: "Current-state map", d: "Systems, risks, dependencies", Icon: Layers },
                            { t: "Decision brief", d: "Options + tradeoffs + recommendation", Icon: Radar },
                            { t: "Roadmap draft", d: "Sequenced milestones + owners", Icon: GitMerge },
                          ].map((x) => (
                            <Surface key={x.t} className="p-4 bg-[hsl(var(--card))]/75">
                              <div className="flex items-center gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--card))]/85 ring-1 ring-[hsl(var(--border))]">
                                  <x.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                                </div>
                                <div>
                                  <div className="font-extrabold text-[hsl(var(--fg))]">{x.t}</div>
                                  <div className="text-sm text-[hsl(var(--muted))]">{x.d}</div>
                                </div>
                              </div>
                            </Surface>
                          ))}
                        </div>

                        <Surface className="mt-6 p-4 bg-[hsl(var(--card))]/75">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--tone-green-ink))]" />
                            <div className="text-sm text-[hsl(var(--fg))]">
                              Executive-ready guidance, practical outputs, and delivery momentum.
                            </div>
                          </div>
                        </Surface>
                      </Surface>
                    </div>
                  </GradientCard>
                </m.div>

                <m.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-140px" }}
                  className="lg:col-span-6"
                >
                  <m.div
                    variants={fadeUp}
                    className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-1.5 text-xs text-[hsl(var(--muted))]"
                  >
                    <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
                    Consulting • Strategy • Execution
                  </m.div>

                  <m.h3 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-[hsl(var(--fg))]">
                    Need strategic tech advice to{" "}
                    <span className="text-[hsl(var(--accent))]">elevate</span>{" "}
                    your business?
                  </m.h3>

                  <m.p variants={fadeUp} className="mt-4 text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                    Share a quick brief and we’ll suggest the best starting point (workshop, review, or roadmap).
                  </m.p>

                  <m.div variants={fadeUp} className="mt-7">
                    <GradientCard className="p-0" interactive={!reduce}>
                      <form
                        className="relative overflow-hidden rounded-[22px] p-5 sm:p-6"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="grid gap-1.5">
                            <span className="text-xs font-semibold text-[hsl(var(--muted))]">
                              Name
                            </span>
                            <input
                              className="h-11 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                              placeholder="Your name"
                              autoComplete="name"
                            />
                          </label>

                          <label className="grid gap-1.5">
                            <span className="text-xs font-semibold text-[hsl(var(--muted))]">
                              Email
                            </span>
                            <input
                              className="h-11 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                              placeholder="you@company.com"
                              autoComplete="email"
                              inputMode="email"
                            />
                          </label>
                        </div>

                        <label className="mt-3 grid gap-1.5">
                          <span className="text-xs font-semibold text-[hsl(var(--muted))]">
                            What are you trying to achieve?
                          </span>
                          <textarea
                            className="min-h-[110px] rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                            placeholder="Modernization, security posture, cloud migration, cost optimization…"
                          />
                        </label>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-extrabold text-[hsl(var(--accent-ink))] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                          >
                            Send request <ArrowRight className="h-4 w-4" />
                          </button>

                          <div className="text-xs text-[hsl(var(--muted))]">
                            Typical response: 1 business day.
                          </div>
                        </div>
                      </form>
                    </GradientCard>
                  </m.div>

                  <m.div variants={fadeUp} className="mt-8 grid gap-3 sm:grid-cols-3">
                    <IconPill Icon={GitMerge} label="Practical roadmaps" />
                    <IconPill Icon={Shield} label="Security & resilience" />
                    <IconPill Icon={Lightbulb} label="Innovation operating model" />
                  </m.div>
                </m.div>
              </div>
            </div>
          </section>

          {/* Floating “back to top” */}
          <div className="fixed bottom-5 right-5 z-30">
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: showTop ? 1 : 0, y: showTop ? 0 : 12 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto"
            >
              <Link
                href="#"
                className={cx(
                  "inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-2 text-xs font-semibold",
                  "hover:bg-[hsl(var(--card))]/95 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                )}
              >
                Back to top <ChevronRight className="h-4 w-4 rotate-[-90deg]" />
              </Link>
            </m.div>
          </div>

          <div className="relative z-10 h-10" />
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
