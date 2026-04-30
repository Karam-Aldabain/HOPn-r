"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  ScanEye,
  Cpu,
  ShieldCheck,
  Boxes,
  Network,
  Wrench,
  Gauge,
  Factory,
  Truck,
  Layers,
  Orbit,
  Workflow,
  Quote,
  Mail,
  Lock,
  Globe,
  Building2,
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
      className={["reveal", inView ? "reveal--in" : "reveal--out", className].join(
        " "
      )}
    >
      {children}
    </div>
  );
}

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

function GradientCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["gcard group relative", className].join(" ")}>
      <div className="gcard__border" />
      <div className="gcard__inner">{children}</div>
    </div>
  );
}

/* ------------------------------ hero visuals ------------------------------ */

function TwinSyncPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-5">
      <div className="absolute inset-0 opacity-45">
        <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-[hsl(var(--accent))]/15 blur-[30px]" />
        <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-indigo-500/15 blur-[34px]" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
            Twin Sync
          </div>
          <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">
            Physical ↔ Digital alignment
          </div>
          <div className="mt-2 text-sm text-[hsl(var(--muted))]">
            Stream data, update state, and keep models calibrated.
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 p-2">
          <Orbit className="h-5 w-5 text-[hsl(var(--accent))]" />
        </div>
      </div>

      {/* split “physical vs digital” */}
      <div className="relative mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-black/20 p-4">
          <div className="flex items-center gap-2">
            <Factory className="h-4.5 w-4.5 text-[hsl(var(--accent))]/80" />
            <div className="text-sm font-extrabold text-[hsl(var(--fg))]">Physical</div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { k: "Sensors", v: "Live" },
              { k: "Vibration", v: "0.72g" },
              { k: "Temp", v: "58°C" },
              { k: "Load", v: "81%" },
            ].map((m) => (
              <div
                key={m.k}
                className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-2"
              >
                <div className="text-[11px] text-[hsl(var(--muted))]">{m.k}</div>
                <div className="text-sm font-extrabold text-[hsl(var(--fg))]">{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[hsl(var(--border))] bg-black/20 p-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4.5 w-4.5 text-emerald-200/80" />
            <div className="text-sm font-extrabold text-[hsl(var(--fg))]">Digital</div>
          </div>

          <div className="mt-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-3">
            <div className="flex items-center justify-between text-xs text-[hsl(var(--muted))]">
              <span>Model state</span>
              <span className="text-[hsl(var(--accent))]/80">Updated</span>
            </div>

            <div className="mt-3">
              <svg
                viewBox="0 0 260 64"
                className="h-16 w-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
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
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { k: "Drift", v: "Low" },
                { k: "p95", v: "190ms" },
                { k: "Sync", v: "99.9%" },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-2 py-1.5 min-w-0"
                >
                  <div className="text-[9px] text-[hsl(var(--muted))] leading-none truncate">{m.k}</div>
                  <div className="text-[10px] font-extrabold text-[hsl(var(--fg))] leading-none truncate">
                    {m.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
        <span>Latency: ~120ms</span>
        <span className="inline-flex items-center gap-1 text-[hsl(var(--accent))]/80">
          View twin graph <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

function ScenarioLabPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-5">
      <div className="absolute inset-0 opacity-45">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/12 blur-[30px]" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[hsl(var(--accent))]/12 blur-[34px]" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
            Scenario Lab
          </div>
          <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">
            Simulate • Predict • Optimize
          </div>
          <div className="mt-2 text-sm text-[hsl(var(--muted))]">
            Test operational changes safely before touching production.
          </div>
        </div>

        <div className="shrink-0 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/15 p-2">
          <Workflow className="h-5 w-5 text-emerald-200" />
        </div>
      </div>

      {/* animated “bento” bars */}
      <div className="relative mt-5 grid grid-cols-12 items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-[hsl(var(--card))]/75 ring-1 ring-[hsl(var(--border))] overflow-hidden"
          >
            <div
              className="h-full w-full origin-bottom animate-rise bg-gradient-to-t from-[hsl(var(--accent-1))]/35 via-[hsl(var(--accent-1))]/15 to-transparent"
              style={{
                animationDelay: `${i * 85}ms`,
                transform: `scaleY(${0.22 + ((i % 6) * 0.13 + (i % 3) * 0.06)})`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative mt-4 grid gap-2 sm:grid-cols-3">
        {[
          { k: "Bottlenecks", v: "2 found" },
          { k: "Throughput", v: "+14%" },
          { k: "Downtime", v: "-21%" },
        ].map((m) => (
          <div
            key={m.k}
            className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-2"
          >
            <div className="text-[11px] text-[hsl(var(--muted))]">{m.k}</div>
            <div className="text-sm font-extrabold text-[hsl(var(--fg))]">{m.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- page --------------------------------- */

export default function DigitalTwinsPage() {
  const content = useCmsPageData("digital-twins", {
    hero: {
      title: "Digital Twins by HOPn",
      subtitle:
        "Creating dynamic virtual representations of physical assets, processes, and systems to unlock new levels of insight, control, and predictive capability.",
      cta: "Start Your Digital Twin Journey",
    },
    lifecycle: {
      title: "The Digital Twin Lifecycle",
      subtitle:
        "A practical path from instrumentation to optimization—built to run in production.",
    },
    socialProof: {
      title: "Real outcomes, clear value",
      subtitle:
        "What teams tend to highlight after shipping Digital Twins with us.",
    },
    cta: {
      kicker: "Start your journey",
      title: "Start your Digital Twin journey",
      body:
        "Let’s explore how Digital Twin technology can revolutionize your operations—offering predictive insights and a distinct competitive advantage.",
      button: "Start Your Digital Twin Journey",
    },
  });

  const applications = useMemo(
    () => [
      {
        title: "Predictive Maintenance",
        desc: "Anticipate equipment failures and optimize maintenance schedules using real-time asset signals.",
        Icon: Wrench,
        meta: "Minimize downtime",
        pills: ["Real-time signals", "Anomaly detection", "Health scoring"],
      },
      {
        title: "Performance Optimization",
        desc: "Simulate operational scenarios to identify bottlenecks, improve efficiency, and enhance throughput.",
        Icon: Gauge,
        meta: "Increase throughput",
        pills: ["What-if simulation", "Constraints", "Optimization loops"],
      },
      {
        title: "Process Simulation & Design",
        desc: "Test, validate, and refine new processes in a risk-free virtual environment before rollout.",
        Icon: Layers,
        meta: "Reduce risk",
        pills: ["Virtual commissioning", "Validation", "Faster iteration"],
      },
      {
        title: "Supply Chain Visibility",
        desc: "Create end-to-end digital replicas for tracking, risk management, and resilience planning.",
        Icon: Truck,
        meta: "Improve resilience",
        pills: ["Traceability", "Risk insights", "End-to-end view"],
      },
    ],
    []
  );

  const advantages = useMemo(
    () => [
      "Reduced operational costs",
      "Enhanced product quality",
      "Data-driven decision making",
      "Improved asset performance",
      "Faster time-to-market",
    ],
    []
  );

  const lifecycle = useMemo(
    () => [
      {
        k: "01",
        title: "Instrument",
        desc: "Connect sensors, systems, and events to build a reliable data foundation.",
        Icon: Network,
      },
      {
        k: "02",
        title: "Model",
        desc: "Create dynamic representations of assets, processes, and constraints.",
        Icon: Boxes,
      },
      {
        k: "03",
        title: "Simulate",
        desc: "Run scenarios, stress tests, and virtual trials to predict outcomes.",
        Icon: ScanEye,
      },
      {
        k: "04",
        title: "Optimize",
        desc: "Turn insights into actions—policies, schedules, and controls that improve performance.",
        Icon: ShieldCheck,
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        quote:
          "We finally got a living view of operations—simulation made decisions obvious and measurable.",
        name: "Operations Excellence Lead",
        meta: "Manufacturing",
      },
      {
        quote:
          "Predictive maintenance shifted us from reactive fixes to planned reliability. Downtime dropped fast.",
        name: "Maintenance Manager",
        meta: "Industrial Systems",
      },
      {
        quote:
          "Supply chain replicas gave us visibility and resilience planning we didn’t have before.",
        name: "Program Director",
        meta: "Logistics & Distribution",
      },
    ],
    []
  );

  return (
    <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      {/* Ultra background (same palette) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/10 blur-[95px]" />
        <div className="absolute -left-44 top-28 h-[430px] w-[430px] rounded-full bg-indigo-500/10 blur-[95px]" />
        <div className="absolute -right-56 top-52 h-[650px] w-[650px] rounded-full bg-[hsl(var(--accent))]/10 blur-[115px]" />

        <div className="absolute inset-0 opacity-[0.22] shimmer" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, transparent, rgba(0,0,0, var(--twins-vignette)))",
          }}
        />
        <div
          className="absolute inset-0 [background-image:linear-gradient(to_right,var(--twins-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--twins-grid)_1px,transparent_1px)] [background-size:56px_56px]"
          style={{ opacity: "var(--twins-grid-opacity)" as any }}
        />
      </div>

      {/* NAV */}
      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="#"
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-1.5 text-sm font-extrabold text-[hsl(var(--fg))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15">
              <Orbit className="h-4.5 w-4.5 text-[hsl(var(--accent))]" />
            </span>
            HOPn Digital Twins
          </Link>

          <nav className="hidden items-center gap-2 sm:flex">
            <Link
              href="#applications"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/80 transition"
            >
              Applications
            </Link>
            <Link
              href="#lifecycle"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/80 transition"
            >
              Lifecycle
            </Link>
            <Link
              href="#contact"
              className="rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/80 transition"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO (new layout: centered headline + bento right) */}
      <section className="relative z-10 pt-8 sm:pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* left: more “editorial” */}
            <div className="lg:col-span-6">
              <Reveal>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="cyan">Dynamic simulations</Pill>
                  <Pill tone="green">Real-time insight</Pill>
                  <Pill tone="violet">Predictive control</Pill>
                </div>

                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="grad-text">{content.hero.title.split(" ")[0]}</span>{" "}
                  <span className="text-[hsl(var(--fg))]">
                    {content.hero.title.split(" ").slice(1).join(" ")}
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base sm:text-lg text-[hsl(var(--muted))] leading-relaxed">
                  {content.hero.subtitle}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-bold text-[hsl(var(--accent-ink))] shadow-[0_20px_65px_rgba(34,211,238,0.28)] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  >
                    {content.hero.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* trust row (kept palette) */}
                <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--muted))]">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-2">
                    <Lock className="h-4 w-4 text-[hsl(var(--accent))]/80" />
                    Secure integrations
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-2">
                    <Globe className="h-4 w-4 text-emerald-200/80" />
                    Scales across industries
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-2">
                    <Building2 className="h-4 w-4 text-violet-200/80" />
                    Production-grade delivery
                  </span>
                </div>
              </Reveal>

              {/* “Bridge” block (new placement + style) */}
              <Reveal delay={140} className="mt-8">
                <GradientCard className="p-0">
                  <div className="relative overflow-hidden rounded-[22px] p-6 sm:p-7">
                    <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[hsl(var(--accent))]/0 blur-[85px] transition group-hover:bg-[hsl(var(--accent))]/12" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.16),transparent_58%)]" />
                    </div>

                    <div className="relative">
                      <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
                        Bridge the Physical and Digital Worlds
                      </div>
                      <div className="mt-2 text-lg sm:text-xl font-extrabold text-[hsl(var(--fg))]">
                        Living digital simulations for real operations
                      </div>
                      <p className="mt-3 text-[hsl(var(--muted))] leading-relaxed">
                        We help you harness Digital Twins to gain visibility into operations,
                        predict performance with accuracy, and optimize complex systems in real-time.
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {[
                          { k: "Visibility", v: "Live state + history" },
                          { k: "Prediction", v: "Future performance" },
                          { k: "Control", v: "Closed-loop actions" },
                        ].map((m) => (
                          <div
                            key={m.k}
                            className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-4"
                          >
                            <div className="text-[11px] text-[hsl(var(--muted))]">{m.k}</div>
                            <div className="mt-1 text-sm font-extrabold text-[hsl(var(--fg))]">
                              {m.v}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GradientCard>
              </Reveal>
            </div>

            {/* right: bento visual stack (new) */}
            <div className="lg:col-span-6">
              <Reveal delay={110}>
                <div className="relative">
                  <div className="absolute -inset-6 -z-10 rounded-[36px] bg-[hsl(var(--accent))]/10 blur-[55px]" />

                  <div className="grid gap-4 lg:grid-cols-5">
                    <div className="lg:col-span-3">
                      <TwinSyncPanel />
                    </div>
                    <div className="lg:col-span-2">
                      <ScenarioLabPanel />
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[hsl(var(--border))]" />
      </section>

      {/* APPLICATIONS (new bento grid) */}
      <section id="applications" className="relative z-10 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black">
                <span className="grad-text">Core Applications</span>{" "}
                <span className="text-[hsl(var(--fg))]">of Digital Twins</span>
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-base sm:text-lg text-[hsl(var(--muted))]">
                From maintenance and optimization to design validation and supply chain replicas —
                built to deliver measurable improvements.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            {applications.map((a, i) => (
              <Reveal
                key={a.title}
                delay={i * 80}
                className={[
                  i === 0 ? "lg:col-span-7" : "",
                  i === 1 ? "lg:col-span-5" : "",
                  i === 2 ? "lg:col-span-5" : "",
                  i === 3 ? "lg:col-span-7" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <GradientCard className="p-0 h-full">
                  <div className="relative overflow-hidden rounded-[22px] p-6 sm:p-7 h-full">
                    <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[hsl(var(--accent))]/0 blur-[85px] transition group-hover:bg-[hsl(var(--accent))]/12" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(34,211,238,0.16),transparent_58%)]" />
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="relative h-12 w-12 shrink-0 rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20 grid place-items-center">
                        <a.Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="text-lg sm:text-xl font-extrabold text-[hsl(var(--fg))]">
                            {a.title}
                          </h3>
                          <span className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
                            {a.meta}
                          </span>
                        </div>

                        <p className="mt-2 text-[hsl(var(--muted))] leading-relaxed">
                          {a.desc}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {a.pills.map((t, idx) => (
                            <Pill
                              key={t}
                              tone={idx === 0 ? "cyan" : idx === 1 ? "green" : "violet"}
                              icon={false}
                            >
                              {t}
                            </Pill>
                          ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <span className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
                            Built for real-time operations
                          </span>
                          <span className="inline-flex items-center gap-2 font-semibold text-[hsl(var(--accent))] transition group-hover:translate-x-0.5">
                            Explore <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GradientCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES (new: checklist + side feature) */}
      <section className="relative z-10 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
              <div className="lg:col-span-5">
                <h3 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
                  Advantages of implementing{" "}
                  <span className="grad-text">Digital Twins</span>
                </h3>
                <p className="mt-3 text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                  Build a single source of operational truth, improve reliability,
                  and move from reactive decisions to predictive control.
                </p>

                <div className="mt-6 space-y-3">
                  {advantages.map((b, i) => (
                    <div
                      key={b}
                      className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-4 hover:bg-[hsl(var(--card))]/75 transition"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                      <div className="min-w-0">
                        <div className="font-extrabold text-[hsl(var(--fg))]">{b}</div>
                        <div className="text-sm text-[hsl(var(--muted))]">
                          Measurable impact through continuous monitoring and simulation.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7">
                <GradientCard className="p-0 h-full">
                  <div className="relative overflow-hidden rounded-[22px] p-6 sm:p-7 h-full">
                    <div className="pointer-events-none absolute -left-52 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[110px]" />
                    <div className="pointer-events-none absolute -right-52 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[hsl(var(--accent))]/10 blur-[110px]" />

                    <div className="relative">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill tone="cyan">Real-time</Pill>
                        <Pill tone="green">Predictive</Pill>
                        <Pill tone="violet">Optimized</Pill>
                      </div>

                      <div className="mt-4 text-lg sm:text-xl font-extrabold text-[hsl(var(--fg))]">
                        From data → model → decisions, continuously
                      </div>

                      <p className="mt-2 text-[hsl(var(--muted))] leading-relaxed">
                        Our expertise spans the full lifecycle—strategic data acquisition,
                        sophisticated model creation, advanced simulation, in-depth analysis,
                        and seamless integration with existing infrastructure.
                      </p>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {[
                          {
                            Icon: Network,
                            title: "Connected data foundation",
                            desc: "Sensors, systems, and events unified into a consistent twin view.",
                          },
                          {
                            Icon: ScanEye,
                            title: "Deep operational visibility",
                            desc: "Understand what’s happening now and what’s likely to happen next.",
                          },
                          {
                            Icon: ShieldCheck,
                            title: "Reliable decisions",
                            desc: "Explainable signals, auditable runs, and measurable improvements.",
                          },
                          {
                            Icon: Cpu,
                            title: "Real-time optimization",
                            desc: "Turn scenarios into actions—policies, schedules, and controls.",
                          },
                        ].map((x) => (
                          <div
                            key={x.title}
                            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-5"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-11 w-11 rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 grid place-items-center">
                                <x.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-extrabold text-[hsl(var(--fg))]">
                                  {x.title}
                                </div>
                                <div className="mt-1 text-sm text-[hsl(var(--muted))] leading-relaxed">
                                  {x.desc}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
                        <span>Designed for manufacturing, energy, smart cities, healthcare</span>
                        <span className="inline-flex items-center gap-1 text-[hsl(var(--accent))]/80">
                          See outcomes <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </GradientCard>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* LIFECYCLE (new: vertical stepper) */}
      <section id="lifecycle" className="relative z-10 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
                {content.lifecycle.title.replace("Lifecycle", "")}{" "}
                <span className="grad-text">Lifecycle</span>
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[hsl(var(--muted))]">
                {content.lifecycle.subtitle}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="space-y-4">
                {lifecycle.map((st, i) => (
                  <Reveal key={st.k} delay={i * 80}>
                    <GradientCard className="p-0">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="shrink-0">
                            <div className="text-xs font-black tracking-[0.2em] text-[hsl(var(--muted))]">
                              {st.k}
                            </div>
                            <div className="mt-3 h-11 w-11 rounded-xl bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))] grid place-items-center">
                              <st.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-lg font-extrabold text-[hsl(var(--fg))]">
                              {st.title}
                            </div>
                            <div className="mt-2 text-sm text-[hsl(var(--muted))] leading-relaxed">
                              {st.desc}
                            </div>

                            <div className="mt-5 h-px w-full bg-[hsl(var(--card))]/90" />
                            <div className="mt-4 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
                              <span>Iterative, measurable, and secure.</span>
                              <span className="inline-flex items-center gap-1 text-[hsl(var(--accent))]/80">
                                Details <ChevronRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GradientCard>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={120}>
                <div className="relative overflow-hidden rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-2xl shadow-[0_35px_140px_rgba(0,0,0,0.55)]">
                  <div className="pointer-events-none absolute -top-36 -right-36 h-72 w-72 rounded-full bg-[hsl(var(--accent))]/10 blur-[90px]" />
                  <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-[90px]" />

                  <div className="relative p-7 sm:p-8">
                    <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
                      What you get
                    </div>
                    <div className="mt-2 text-xl font-extrabold text-[hsl(var(--fg))]">
                      A twin that teams can trust
                    </div>
                    <p className="mt-3 text-[hsl(var(--muted))] leading-relaxed">
                      Clear model assumptions, reliable integrations, and dashboards that connect
                      simulation results to real operational decisions.
                    </p>

                    <div className="mt-6 grid gap-3">
                      {[
                        { Icon: Lock, t: "Security-first integration" },
                        { Icon: ShieldCheck, t: "Operational reliability" },
                        { Icon: ScanEye, t: "Explainable insights" },
                        { Icon: Cpu, t: "Real-time optimization loops" },
                      ].map((x) => (
                        <div
                          key={x.t}
                          className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-4"
                        >
                          <div className="h-10 w-10 rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 grid place-items-center">
                            <x.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                          </div>
                          <div className="font-extrabold text-[hsl(var(--fg))]">{x.t}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 text-xs text-[hsl(var(--muted))]">
                      Built to integrate with your existing infrastructure.
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative z-10 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
                {content.socialProof.title.replace("clear value", "")}{" "}
                <span className="grad-text">clear value</span>
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[hsl(var(--muted))]">
                {content.socialProof.subtitle}
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
                    <div className="mt-6 h-px w-full bg-[hsl(var(--card))]/90" />
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

      {/* STRONG CTA + IMAGE (same palette, new copy) */}
      <section id="contact" className="relative z-10 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-2xl shadow-[0_35px_140px_rgba(0,0,0,0.55)]">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-[220px] sm:min-h-[320px] lg:min-h-[560px]">
                  {/* replace with your factory/twin image when ready */}
                  <img
                    src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1600&q=80"
                    alt="Factory operations"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#060913]/20 via-[#060913]/65 to-[#060913]/95 lg:to-[#060913]/75" />

                  <div className="absolute left-6 top-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 backdrop-blur-xl p-4 shadow-[0_25px_90px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 grid place-items-center">
                        <Orbit className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div>
                        <div className="font-extrabold text-[hsl(var(--fg))]">
                          Ready to build your Digital Twin?
                        </div>
                        <div className="text-sm text-[hsl(var(--muted))]">
                          Predictive • Real-time • Production-grade
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative p-8 sm:p-10 lg:p-12">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] ring-1 ring-[hsl(var(--accent))]/15 px-3 py-1.5 text-xs font-semibold">
                    <Sparkles className="h-4 w-4" />
                    {content.cta.kicker}
                  </div>

                  <h3 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-[hsl(var(--fg))]">
                    {content.cta.title.replace("Digital Twin", "")}{" "}
                    <span className="grad-text">Digital Twin</span> journey
                  </h3>

                  <p className="mt-4 text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                    {content.cta.body}
                  </p>

                  <div className="mt-8 grid gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))] grid place-items-center">
                        <Mail className="h-5 w-5 text-[hsl(var(--accent))]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-[hsl(var(--fg))]">
                          Share your requirements
                        </div>
                        <div className="text-xs text-[hsl(var(--muted))]">
                          We’ll reply with suggested next steps.
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3">
                      <Link
                      href="/contact"
                      className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-bold text-[hsl(var(--accent-ink))] shadow-[0_20px_65px_rgba(34,211,238,0.24)] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    >
                      {content.cta.button}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-4">
                      <div className="text-[hsl(var(--accent))] font-extrabold text-lg">
                        Reduced downtime
                      </div>
                      <div className="mt-1 text-[hsl(var(--muted))] text-sm">
                        Predict failures and schedule maintenance efficiently.
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-4">
                      <div className="text-[hsl(var(--accent))] font-extrabold text-lg">
                        Faster decisions
                      </div>
                      <div className="mt-1 text-[hsl(var(--muted))] text-sm">
                        Simulation-backed actions you can defend and measure.
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-[hsl(var(--card))]/90 lg:block" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Global animation CSS (kept) */}
      <style>{`
        :root {
          --tone-cyan: hsl(199 89% 48%);
          --tone-cyan-ink: 199 89% 18%;
          --tone-green: hsl(160 84% 39%);
          --tone-green-ink: 160 84% 18%;
          --tone-orange: hsl(25 95% 53%);
          --tone-orange-ink: 25 95% 18%;
          --tone-violet: hsl(245 83% 62%);
          --tone-violet-ink: 245 83% 20%;

          --twins-grid: rgba(2, 6, 23, 0.08);
          --twins-grid-opacity: 0.14;
          --twins-vignette: 0.06;
        }
        .dark,
        [data-theme="dark"] {
          --tone-cyan: hsl(191 92% 44%);
          --tone-cyan-ink: 191 92% 86%;
          --tone-green: hsl(160 84% 39%);
          --tone-green-ink: 160 84% 86%;
          --tone-orange: hsl(25 95% 53%);
          --tone-orange-ink: 25 95% 88%;
          --tone-violet: hsl(245 83% 67%);
          --tone-violet-ink: 245 83% 90%;

          --twins-grid: rgba(255, 255, 255, 0.10);
          --twins-grid-opacity: 0.14;
          --twins-vignette: 0.74;
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
          background: linear-gradient(
            90deg,
            rgba(34, 211, 238, 1),
            rgba(99, 102, 241, 1),
            rgba(34, 211, 238, 1)
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
            opacity: 0.18;
          }
          50% {
            transform: translate3d(30px, 18px, 0);
            opacity: 0.26;
          }
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.18;
          }
        }

        /* Gradient border card */
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
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(18px);
          box-shadow: 0 30px 110px rgba(0, 0, 0, 0.45);
          transition: transform 220ms ease, background 220ms ease;
        }
        .gcard:hover .gcard__border {
          opacity: 1;
          filter: saturate(1.35);
        }
        .gcard:hover .gcard__inner {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.04);
        }

        /* chart animation */
        .animate-rise {
          animation: rise 1.4s ease-in-out infinite alternate;
        }
        @keyframes rise {
          from {
            filter: brightness(0.85);
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










