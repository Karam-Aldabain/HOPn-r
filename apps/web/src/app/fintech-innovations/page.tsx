"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DollarSign,
  Landmark,
  CreditCard,
  Layers,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ScanEye,
  Lock,
  Cpu,
  ChevronRight,
  Building2,
  BadgeCheck,
  Globe,
  Server,
  Wand2,
  Zap,
  Shield,
  Users,
  Quote,
  Mail,
} from "lucide-react";
import { useCmsPageData } from "@/lib/use-cms-page-data";

/* ----------------------------- small utilities ---------------------------- */

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
 * Pill uses tone variables so it looks GOOD in both light/dark
 */
function Pill({
  children,
  tone = "cyan",
  icon = true,
}: {
  children: React.ReactNode;
  tone?: "cyan" | "green" | "orange" | "violet";
  icon?: boolean;
}) {
  const toneVar =
    tone === "green"
      ? "var(--tone-green)"
      : tone === "orange"
      ? "var(--tone-orange)"
      : tone === "violet"
      ? "var(--tone-violet)"
      : "var(--tone-cyan)";

  const toneInkVar =
    tone === "green"
      ? "var(--tone-green-ink)"
      : tone === "orange"
      ? "var(--tone-orange-ink)"
      : tone === "violet"
      ? "var(--tone-violet-ink)"
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

function MiniChart() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[hsl(var(--accent))]/20 blur-[28px]" />
        <div className="absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-[hsl(var(--accent-2))]/14 blur-[28px]" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">Risk & Fraud Signals</div>
          <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">Real-time anomaly score</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted))]">Streaming detection with explainable flags.</div>
        </div>

        <div className="shrink-0 rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 p-2">
          <ShieldCheck className="h-5 w-5 text-[hsl(var(--accent))]" />
        </div>
      </div>

      {/* Animated bars */}
      <div className="relative mt-5 grid grid-cols-12 items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-16 overflow-hidden rounded-lg bg-[hsl(var(--card-2))] ring-1 ring-[hsl(var(--border))]"
          >
            <div
              className="h-full w-full origin-bottom animate-rise bg-gradient-to-t from-[hsl(var(--accent-1))]/35 via-[hsl(var(--accent-1))]/15 to-transparent"
              style={{
                animationDelay: `${i * 90}ms`,
                transform: `scaleY(${0.25 + (i % 5) * 0.14 + (i % 3) * 0.07})`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
        <span>Latency: ~120ms</span>
        <span className="inline-flex items-center gap-1 text-[hsl(var(--accent))]/85">
          View details <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function MiniDashboard() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -top-10 -left-12 h-32 w-32 rounded-full bg-[hsl(var(--tone-green))]/15 blur-[28px]" />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[hsl(var(--accent))]/15 blur-[28px]" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">Payments Health</div>
          <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">Success rate & throughput</div>
          <div className="mt-2 text-sm text-[hsl(var(--muted))]">Autoscaling, retries, and smart routing.</div>
        </div>

        <div className="shrink-0 rounded-xl bg-[hsl(var(--tone-green))]/12 ring-1 ring-[hsl(var(--tone-green))]/20 p-2">
          <Zap className="h-5 w-5 text-[hsl(var(--tone-green-ink))]" />
        </div>
      </div>

      {/* Animated line */}
      <div className="relative mt-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3">
        <svg viewBox="0 0 260 64" className="h-16 w-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M0 46 C 24 36, 44 56, 66 40 C 88 24, 104 38, 126 30 C 148 22, 170 34, 194 18 C 218 2, 236 16, 260 10"
            className="dash-path"
            stroke="rgba(34,211,238,0.9)"
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
            { k: "TPS", v: "4.8k" },
            { k: "Success", v: "99.94%" },
            { k: "p95", v: "210ms" },
          ].map((m) => (
            <div key={m.k} className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] px-3 py-2">
              <div className="text-[11px] text-[hsl(var(--muted))]">{m.k}</div>
              <div className="text-sm font-extrabold text-[hsl(var(--fg))]">{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
        <span>Uptime: 99.99%</span>
        <span className="inline-flex items-center gap-1 text-[hsl(var(--tone-green-ink))]/90">
          Live ops <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------- page --------------------------------- */

export default function FintechInnovationsPage() {
  const content = useCmsPageData("fintech-innovations", {
    hero: {
      title: "FinTech Innovations by HOPn",
      subtitle:
        "Build secure, scalable, and modern financial products — from digital banking and payments to RegTech and tokenization — with engineering rigor and exceptional UX.",
      cta: "Explore FinTech Solutions",
    },
    servicesTitle: "FinTech Service Areas",
    servicesSubtitle:
      "Built to help you launch, modernize, and scale financial services with strong security, governance, and performance.",
    approachTitle:
      "A delivery approach that reduces risk and speeds up outcomes",
    approachSubtitle:
      "We combine product thinking, security engineering, and platform reliability to ship compliant systems that teams can run confidently.",
    benefitsTitle: "Benefits you can feel in production",
    socialTitle: "Trusted delivery, clear outcomes",
    socialSubtitle: "A few examples of what teams value when working with us.",
    ctaTitle:
      "Ready to modernize your financial services?",
    ctaBody:
      "Tell us what you’re building — we’ll respond with a suggested approach, timeline, and the fastest path to a secure launch.",
    ctaButton: "Explore FinTech Solutions",
  });

  const services = useMemo(
    () => [
      {
        title: "Digital Banking Platforms",
        desc: "Mobile-first experiences, onboarding flows, and core integrations designed to reduce friction and boost engagement.",
        Icon: Landmark,
        tags: ["KYC-ready", "Omnichannel", "Core integrations"],
      },
      {
        title: "Modern Payments & Orchestration",
        desc: "Gateways, routing, retries, reconciliation, and observability to keep transactions fast, resilient, and measurable.",
        Icon: CreditCard,
        tags: ["Real-time", "High uptime", "Smart routing"],
      },
      {
        title: "Blockchain, Tokenization & DLT",
        desc: "Asset tokenization, smart contracts, and settlement flows engineered for transparency, auditability, and safety.",
        Icon: Layers,
        tags: ["Settlement", "Tokenization", "Audit trails"],
      },
      {
        title: "RegTech, Risk & Compliance",
        desc: "Policy automation, monitoring, reporting, and controls that keep you aligned with evolving regulations.",
        Icon: LineChart,
        tags: ["Controls", "Reporting", "Governance"],
      },
    ],
    []
  );

  const benefits = useMemo(
    () => [
      {
        title: "Security & privacy baked in",
        desc: "Threat modeling, encryption, access controls, and secure SDLC — from day one.",
        Icon: Shield,
      },
      {
        title: "Compliance without the drag",
        desc: "Automate audits and evidence, reduce manual processes, and stay ready for change.",
        Icon: BadgeCheck,
      },
      {
        title: "Operational efficiency at scale",
        desc: "Cloud-native patterns that reduce cost, improve reliability, and simplify operations.",
        Icon: Server,
      },
      {
        title: "Delightful customer experiences",
        desc: "Faster flows, fewer drop-offs, and richer journeys across web and mobile.",
        Icon: Users,
      },
    ],
    []
  );

  const steps = useMemo(
    () => [
      {
        k: "01",
        title: "Discover",
        desc: "Clarify goals, risks, constraints, and success metrics with stakeholders.",
        Icon: ScanEye,
      },
      {
        k: "02",
        title: "Design",
        desc: "Architecture, threat models, data flows, and UX built around outcomes.",
        Icon: Wand2,
      },
      {
        k: "03",
        title: "Deliver",
        desc: "Iterative builds with observability, testing, and compliance evidence.",
        Icon: Cpu,
      },
      {
        k: "04",
        title: "Run",
        desc: "SRE-ready operations, monitoring, incident playbooks, and improvements.",
        Icon: ShieldCheck,
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        quote:
          "The architecture and delivery discipline were outstanding — we shipped faster while improving controls and audit readiness.",
        name: "Head of Digital Transformation",
        meta: "Tier-1 Financial Institution",
      },
      {
        quote:
          "Payment reliability improved immediately. The observability layer made incidents measurable and rare.",
        name: "Payments Platform Lead",
        meta: "Global Commerce Provider",
      },
      {
        quote:
          "Clear threat modeling and secure-by-design practices helped align engineering and compliance from the start.",
        name: "Risk & Compliance Director",
        meta: "Regulated FinTech",
      },
    ],
    []
  );

  return (
    <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      {/* Theme variables:
          - Dark mode stays like your screenshot
          - Light mode gets a clean, advisor-friendly palette
          NOTE: this assumes you toggle dark mode with the `dark` class on <html> or <body>.
      */}
      <style>{`
        :root {
          /* LIGHT (clean, readable) */
          --bg: 210 40% 98%;
          --fg: 222 47% 11%;
          --muted: 215 16% 42%;
          --card: 0 0% 100%;
          --card-2: 210 40% 96%;
          --surface: 210 40% 94%;
          --border: 214 22% 86%;
          --ring: 199 89% 48%;

          /* Accents (light mode can be different) */
          --accent: 199 89% 48%;
          --accent-1: 199 89% 48%;
          --accent-2: 245 83% 62%;
          --accent-ink: 0 0% 100%;

          /* Pill tones */
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
          /* DARK (match your screenshot vibe) */
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
          --fintech-grid: rgba(2, 6, 23, 0.08);
          --fintech-grid-opacity: 0.1;
          --fintech-vignette: 0.06;
        }
        .dark,
        [data-theme="dark"] {
          --fintech-grid: rgba(255, 255, 255, 0.06);
          --fintech-grid-opacity: 0.14;
          --fintech-vignette: 0.78;
        }
      `}</style>

      {/* Ultra background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/12 blur-[95px]" />
        <div className="absolute -left-44 top-28 h-[430px] w-[430px] rounded-full bg-[hsl(var(--accent-2))]/10 blur-[95px]" />
        <div className="absolute -right-56 top-52 h-[650px] w-[650px] rounded-full bg-[hsl(var(--accent))]/10 blur-[115px]" />

        {/* Moving shimmer */}
        <div className="absolute inset-0 opacity-[0.18] shimmer" />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, transparent, rgba(0,0,0, var(--fintech-vignette)))",
          }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 [background-image:linear-gradient(to_right,var(--fintech-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--fintech-grid)_1px,transparent_1px)] bg-[size:56px_56px]"
          style={{ opacity: "var(--fintech-grid-opacity)" as any }}
        />
      </div>

      {/* NAV */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 px-3 py-1.5 text-sm font-extrabold text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))] transition"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/18">
              <DollarSign className="h-4.5 w-4.5 text-[hsl(var(--accent))]" />
            </span>
            HOPn FinTech
          </Link>

          <nav className="hidden items-center gap-2 sm:flex">
            <Link
              href="#service-areas"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition"
            >
              Services
            </Link>
            <Link
              href="#approach"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition"
            >
              Approach
            </Link>
            <Link
              href="#contact"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 pt-10 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* left */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="cyan">Secure-by-design</Pill>
                  <Pill tone="green">Compliance-ready</Pill>
                  <Pill tone="violet">Cloud-native scale</Pill>
                </div>

                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="grad-text">{content.hero.title.split(" ")[0]}</span>{" "}
                  <span className="text-[hsl(var(--fg))]">
                    {content.hero.title.split(" ").slice(1).join(" ")}
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-[hsl(var(--muted))] leading-relaxed">
                  {content.hero.subtitle}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-bold text-[hsl(var(--accent-ink))] shadow-[0_20px_65px_rgba(34,211,238,0.24)] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  >
                    {content.hero.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* trust row */}
                <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--muted))]">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 px-3 py-2">
                    <Lock className="h-4 w-4 text-[hsl(var(--accent))]/80" />
                    Security controls first
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 px-3 py-2">
                    <Globe className="h-4 w-4 text-[hsl(var(--tone-green-ink))]/85" />
                    Global-ready architecture
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 px-3 py-2">
                    <Building2 className="h-4 w-4 text-[hsl(var(--tone-violet-ink))]/85" />
                    Built for regulated industries
                  </span>
                </div>
              </Reveal>

              {/* stats */}
              <Reveal delay={140} className="mt-8">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { Icon: ShieldCheck, title: "Governance", sub: "Evidence, controls, audit trails" },
                    { Icon: Cpu, title: "Performance", sub: "Low latency, high uptime" },
                    { Icon: ScanEye, title: "Visibility", sub: "Metrics, logs, traces" },
                  ].map((m) => (
                    <GradientCard key={m.title} className="p-0">
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-xl bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/18 grid place-items-center">
                            <m.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-extrabold text-[hsl(var(--fg))]">{m.title}</div>
                            <div className="text-sm text-[hsl(var(--muted))]">{m.sub}</div>
                          </div>
                        </div>

                        <div className="mt-4 h-px w-full bg-[hsl(var(--border))]" />

                        <div className="mt-3 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
                          <span>Designed for production</span>
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
              <Reveal delay={120}>
                <div className="relative">
                  <div className="absolute -inset-6 -z-10 rounded-[36px] bg-[hsl(var(--accent))]/10 blur-[55px]" />
                  <div className="grid gap-4">
                    <MiniDashboard />
                    <MiniChart />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[hsl(var(--border))]" />
      </section>

      {/* SERVICES */}
      <section id="service-areas" className="relative z-10 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black">
                <span className="grad-text">FinTech</span>{" "}
                <span className="text-[hsl(var(--fg))]">{content.servicesTitle.replace("FinTech ", "")}</span>
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-base sm:text-lg text-[hsl(var(--muted))]">
                {content.servicesSubtitle}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <GradientCard className="p-0">
                  <div className="relative overflow-hidden rounded-[22px] p-6 sm:p-7">
                    <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[hsl(var(--accent))]/0 blur-[85px] transition group-hover:bg-[hsl(var(--accent))]/12" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.16),transparent_58%)]" />
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="relative h-12 w-12 shrink-0 rounded-2xl bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/18 grid place-items-center">
                        <s.Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-extrabold text-[hsl(var(--fg))]">{s.title}</h3>
                        <p className="mt-2 text-[hsl(var(--muted))] leading-relaxed">{s.desc}</p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {s.tags.map((t, idx) => (
                            <Pill key={t} tone={idx === 0 ? "cyan" : idx === 1 ? "green" : "violet"} icon={false}>
                              {t}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-6 flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">Built for production</span>
                      <span className="inline-flex items-center gap-2 font-semibold text-[hsl(var(--accent))] transition group-hover:translate-x-0.5">
                        Explore <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </GradientCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH / STEPS */}
      <section id="approach" className="relative z-10 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
                {content.approachTitle.replace("reduces risk", "")} <span className="grad-text">reduces risk</span> and speeds up outcomes
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[hsl(var(--muted))]">
                {content.approachSubtitle}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {steps.map((st, i) => (
              <Reveal key={st.k} delay={i * 80}>
                <GradientCard className="p-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-black tracking-[0.2em] text-[hsl(var(--muted))]">{st.k}</div>
                      <div className="h-10 w-10 rounded-xl bg-[hsl(var(--card-2))] ring-1 ring-[hsl(var(--border))] grid place-items-center">
                        <st.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                    </div>

                    <div className="mt-4 text-lg font-extrabold text-[hsl(var(--fg))]">{st.title}</div>
                    <div className="mt-2 text-sm text-[hsl(var(--muted))] leading-relaxed">{st.desc}</div>

                    <div className="mt-5 h-px w-full bg-[hsl(var(--border))]" />
                    <div className="mt-4 text-xs text-[hsl(var(--muted))]">Iterative, measurable, and secure.</div>
                  </div>
                </GradientCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative z-10 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 backdrop-blur-2xl shadow-[0_35px_140px_rgba(0,0,0,0.25)] dark:shadow-[0_35px_140px_rgba(0,0,0,0.55)]">
              <div className="pointer-events-none absolute -left-52 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[hsl(var(--tone-green))]/10 blur-[110px]" />
              <div className="pointer-events-none absolute -right-52 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[hsl(var(--accent))]/10 blur-[110px]" />

              <div className="px-6 py-10 sm:px-10 sm:py-12">
                <h3 className="text-center text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
                  {content.benefitsTitle.replace("in production", "")} <span className="grad-text">in production</span>
                </h3>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  {benefits.map((b) => (
                    <div
                      key={b.title}
                      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] p-5 sm:p-6 hover:bg-[hsl(var(--card))] transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-11 w-11 rounded-xl bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/18 grid place-items-center">
                          <b.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-base sm:text-lg font-extrabold text-[hsl(var(--fg))]">{b.title}</div>
                          <div className="mt-1 text-sm sm:text-base text-[hsl(var(--muted))] leading-relaxed">
                            {b.desc}
                          </div>

                          <div className="mt-4 flex items-center gap-3 text-sm text-[hsl(var(--muted))]">
                            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--tone-green))]" />
                            <span>Designed to pass audits and scale.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex items-center justify-center gap-3 text-[hsl(var(--muted))] text-sm">
                  <ShieldCheck className="h-4 w-4 text-[hsl(var(--accent))]/70" />
                  Built with security, governance, and performance in mind.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative z-10 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
                {content.socialTitle.replace("clear outcomes", "")} <span className="grad-text">clear outcomes</span>
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[hsl(var(--muted))]">
                {content.socialSubtitle}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <GradientCard className="p-0">
                  <div className="p-6 sm:p-7">
                    <Quote className="h-6 w-6 text-[hsl(var(--accent))]/80" />
                    <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed">“{t.quote}”</p>
                    <div className="mt-6 h-px w-full bg-[hsl(var(--border))]" />
                    <div className="mt-4">
                      <div className="font-extrabold text-[hsl(var(--fg))]">{t.name}</div>
                      <div className="text-sm text-[hsl(var(--muted))]">{t.meta}</div>
                    </div>
                  </div>
                </GradientCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STRONG CTA + IMAGE */}
      <section id="contact" className="relative z-10 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 backdrop-blur-2xl shadow-[0_35px_140px_rgba(0,0,0,0.25)] dark:shadow-[0_35px_140px_rgba(0,0,0,0.55)]">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-[220px] sm:min-h-[320px] lg:min-h-[560px]">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
                    alt="FinTech dashboard"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/45 to-black/70 dark:from-[#060913]/20 dark:via-[#060913]/65 dark:to-[#060913]/95 lg:dark:to-[#060913]/75" />

                  {/* floating badge */}
                  <div className="absolute left-6 top-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 backdrop-blur-xl p-4 shadow-[0_25px_90px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_90px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--accent))]/18 grid place-items-center">
                        <DollarSign className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div>
                        <div className="font-extrabold text-[hsl(var(--fg))]">Next-gen FinTech</div>
                        <div className="text-sm text-[hsl(var(--muted))]">Secure • Compliant • Scalable</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative p-8 sm:p-10 lg:p-12">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))]/12 text-[hsl(var(--accent))] ring-1 ring-[hsl(var(--accent))]/18 px-3 py-1.5 text-xs font-semibold">
                    <Sparkles className="h-4 w-4" />
                    Start a conversation
                  </div>

                  <h3 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-[hsl(var(--fg))]">
                    {content.ctaTitle.replace("financial services", "")} <span className="grad-text">financial services</span>?
                  </h3>

                  <p className="mt-4 text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                    {content.ctaBody}
                  </p>

                  {/* simple contact UI */}
                  <div className="mt-8 grid gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[hsl(var(--card))] ring-1 ring-[hsl(var(--border))] grid place-items-center">
                        <Mail className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-[hsl(var(--fg))]">Share your requirements</div>
                        <div className="text-xs text-[hsl(var(--muted))]">We’ll reply with next steps.</div>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3">
                      <Link
                        href="/contact"
                        className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-bold text-[hsl(var(--accent-ink))] shadow-[0_20px_65px_rgba(34,211,238,0.18)] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      >
                        {content.ctaButton}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] p-4">
                      <div className="text-[hsl(var(--accent))] font-extrabold text-lg">Security-first</div>
                      <div className="mt-1 text-[hsl(var(--muted))] text-sm">Strong controls, privacy, and compliance baked in.</div>
                    </div>
                    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card-2))] p-4">
                      <div className="text-[hsl(var(--accent))] font-extrabold text-lg">Built to scale</div>
                      <div className="mt-1 text-[hsl(var(--muted))] text-sm">Cloud-native architectures designed for growth.</div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-[hsl(var(--border))] lg:block" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Global animation CSS */}
      <style>{`
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
          background: linear-gradient(
            90deg,
            hsl(var(--accent-1)),
            hsl(var(--accent-2)),
            hsl(var(--accent-1))
          );
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

        /* Gradient border card (now theme-safe) */
        .gcard {
          border-radius: 24px;
        }
        .gcard__border {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(34, 211, 238, 0.35),
            rgba(99, 102, 241, 0.18),
            rgba(34, 211, 238, 0.12)
          );
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

        /* chart animation */
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
    </main>
  );
}
