"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  AnimatePresence,
} from "framer-motion";
import {
  Info,
  HelpCircle,
  Lightbulb,
  Network,
  Share2,
  Eye,
  Rocket,
  Users2,
  Zap,
  Target,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Layers3,
} from "lucide-react";
import { fetchCms, normalizeSingle } from "@/lib/cms-client";

/**
 * ✅ WHO WE ARE / MISSION PAGE — upgraded to match your Portfolio page system
 * - Same theme variables style (chip/tag/neo-from/neo-to/vignette/grid)
 * - Same background orbs + theme-aware vignette (no permanent dark overlay)
 * - Same card visuals + hover glow
 * - Cleaner accordion (AnimatePresence, shared motion)
 */

/* -------------------------------- utils -------------------------------- */

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

type ValueCard = {
  title: string;
  desc: string;
  Icon: ComponentType<{ className?: string }>;
};

type MeaningItem = {
  title: string;
  desc: string;
  Icon: ComponentType<{ className?: string }>;
};

type VisionMissionSettings = {
  hero?: { title?: string; subtitle?: string; chips?: string[] };
  meaning?: { id: string; title?: string; desc?: string }[];
  vision?: { title?: string; body?: string; tags?: string[] };
  mission?: { title?: string; body?: string; tags?: string[] };
  values?: { id: string; title?: string; desc?: string }[];
  coreValues?: { eyebrow?: string; title?: string; subtitle?: string };
  quote?: { text?: string; primaryCta?: { label: string; href: string }; secondaryCta?: { label: string; href: string } };
};

/* ----------------------------- ui primitives ---------------------------- */

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

/**
 * ✅ NeoCard — matches your Portfolio page
 */
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

function IconBadge({
  Icon,
  className = "",
}: {
  Icon: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20 shadow-[0_18px_70px_rgba(34,211,238,0.10)]",
        className
      )}
    >
      <Icon className="h-7 w-7 text-[hsl(var(--accent))]" />
    </div>
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
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20 shadow-[0_18px_70px_rgba(34,211,238,0.10)]">
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

/* ------------------------------- accordion ------------------------------ */

function MeaningAccordion({ items }: { items: MeaningItem[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string>(items[0]?.title ?? "");

  return (
    <NeoCard className="p-7 sm:p-8" interactive={!reduce}>
      <div className="flex items-start gap-4">
        <div className="mt-1 grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
          <HelpCircle className="h-6 w-6 text-[hsl(var(--accent))]" />
        </div>
        <div className="min-w-0">
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-[hsl(var(--fg))]">
            The Meaning of HOPn
          </div>
          <div className="mt-2 text-[hsl(var(--muted))]">
            Tap an item — quick, responsive, and theme-consistent.
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-3">
        {items.map((it) => {
          const isOpen = open === it.title;
          const Icon = it.Icon;

          return (
            <div
              key={it.title}
              className={cx(
                "rounded-2xl border border-[hsl(var(--border))] overflow-hidden",
                "bg-[hsl(var(--card))]/70"
              )}
            >
              <button
                type="button"
                onClick={() => setOpen((p) => (p === it.title ? "" : it.title))}
                className={cx(
                  "w-full text-left px-5 py-4",
                  "hover:bg-[hsl(var(--card))]/85 transition"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--btn))] ring-1 ring-[hsl(var(--border))]">
                      <Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                    </div>
                    <div className="text-base sm:text-lg font-extrabold text-[hsl(var(--fg))]">
                      {it.title}
                    </div>
                  </div>

                  <m.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={
                      reduce ? { duration: 0.01 } : { type: "spring", stiffness: 320, damping: 22 }
                    }
                    className="shrink-0 text-[hsl(var(--muted))]"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </m.span>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    initial={reduce ? { opacity: 1 } : { opacity: 0, height: 0, y: -6 }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto", y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0, y: -6 }}
                    transition={reduce ? { duration: 0.01 } : { duration: 0.22, ease: "easeOut" }}
                    className="px-5 pb-4"
                  >
                    <div className="text-[hsl(var(--muted))] leading-relaxed">{it.desc}</div>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </NeoCard>
  );
}

/* ---------------------------------- page --------------------------------- */

export default function MissionPage() {
  const reduce = useReducedMotion();

  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 1200], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 1200], [0, -90]);
  const sOrbY = useSpring(orbY, { stiffness: 120, damping: 26 });
  const sOrbY2 = useSpring(orbY2, { stiffness: 120, damping: 26 });

  const meaning = useMemo<MeaningItem[]>(
    () => [
      {
        title: "Hop into Innovation",
        Icon: Lightbulb,
        desc: "We move fast, prototype smart, and turn ideas into real outcomes — with measurable impact.",
      },
      {
        title: "Hub of Projects & Networks",
        Icon: Network,
        desc: "A connected ecosystem: projects, people, and partnerships working together to ship value.",
      },
      {
        title: "Higher Order Prototyping Network",
        Icon: Share2,
        desc: "A network designed for repeatable prototyping — production-aware, governed, and scalable.",
      },
    ],
    []
  );

  const values = useMemo<ValueCard[]>(
    () => [
      {
        title: "Innovation",
        desc: "Continuously seeking and implementing novel solutions to complex challenges, fostering a culture of creativity and forward-thinking.",
        Icon: Lightbulb,
      },
      {
        title: "Collaboration",
        desc: "Working together with our clients, partners, and within our teams to achieve shared goals and deliver superior outcomes.",
        Icon: Users2,
      },
      {
        title: "Excellence",
        desc: "Striving for the highest standards in everything we do, from product development to client service, ensuring quality and reliability.",
        Icon: Zap,
      },
      {
        title: "Integrity",
        desc: "Operating with transparency, honesty, and ethical principles in all our interactions and business practices.",
        Icon: Target,
      },
    ],
    []
  );

  const [settings, setSettings] = useState<VisionMissionSettings | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchCms<{ key: string; valueJson?: VisionMissionSettings }>("/settings/public?key=page_vision_mission")
      .then((res) => {
        const data = normalizeSingle<{ valueJson?: VisionMissionSettings }>(res as any);
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

  const heroTitle = settings?.hero?.title ?? "Who We Are";
  const heroSubtitle =
    settings?.hero?.subtitle ??
    "Understanding HOPn: our purpose, aspirations, and the principles that define us.";
  const heroChips =
    settings?.hero?.chips ??
    ["Innovation-led", "Production-grade", "Secure-by-design", "Measurable impact"];

  const meaningItems = useMemo<MeaningItem[]>(() => {
    if (!settings?.meaning?.length) return meaning;
    return meaning.map((item, idx) => {
      const override = settings.meaning?.[idx];
      if (!override) return item;
      return {
        ...item,
        title: override.title ?? item.title,
        desc: override.desc ?? item.desc,
      };
    });
  }, [meaning, settings?.meaning]);

  const valuesItems = useMemo<ValueCard[]>(() => {
    if (!settings?.values?.length) return values;
    return values.map((item, idx) => {
      const override = settings.values?.[idx];
      if (!override) return item;
      return {
        ...item,
        title: override.title ?? item.title,
        desc: override.desc ?? item.desc,
      };
    });
  }, [values, settings?.values]);

  const visionTitle = settings?.vision?.title ?? "Our Vision";
  const visionBody =
    settings?.vision?.body ??
    "To become the leading platform where innovation, education, and technology converge — simplifying life through connected services in AI, FinTech, automation, and digital transformation.";
  const visionTags = settings?.vision?.tags ?? ["Platform", "Ecosystem", "Impact"];

  const missionTitle = settings?.mission?.title ?? "Our Mission";
  const missionBody =
    settings?.mission?.body ??
    "HOPn’s mission is to empower individuals, universities, and startups by uniting smart services and practical education in one seamless ecosystem. Through digital twins, AI, FinTech, automation, and hands-on training, we build bridges between research, innovation, and real-world impact — simplifying complexity and accelerating progress.";
  const missionTags = settings?.mission?.tags ?? ["Education", "Delivery", "Acceleration"];

  const coreValuesEyebrow = settings?.coreValues?.eyebrow ?? "CORE VALUES";
  const coreValuesTitle = settings?.coreValues?.title ?? "What we optimize for";
  const coreValuesSubtitle =
    settings?.coreValues?.subtitle ??
    "Principles that shape how we build, partner, and deliver — across every project.";

  const quoteText =
    settings?.quote?.text ??
    "“Together, we build the future, driven by our vision and guided by our values.”";
  const quotePrimary = settings?.quote?.primaryCta ?? { label: "Explore Insights", href: "/insights" };
  const quoteSecondary =
    settings?.quote?.secondaryCta ?? { label: "Collaborate with us", href: "/contact" };

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={reduce ? "always" : "never"}>
        <main className="relative min-h-screen text-[hsl(var(--fg))] bg-[hsl(var(--bg))]">
          {/* ✅ Theme vars (Portfolio-style) */}
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
          `}</style>

          {/* BACKGROUND SYSTEM (same as Portfolio page) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:110px_110px]"
              style={{ opacity: "var(--grid)" as any }}
            />

            <m.div
              aria-hidden="true"
              style={{ y: sOrbY }}
              className="absolute -top-60 left-1/4 h-[720px] w-[720px] rounded-full bg-[hsl(var(--accent))]/10 blur-[190px]"
              animate={reduce ? undefined : { x: [0, 16, 0], scale: [1, 1.03, 1] }}
              transition={reduce ? { duration: 0.01 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <m.div
              aria-hidden="true"
              style={{ y: sOrbY2 }}
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
          <section className="relative z-10 pt-16 sm:pt-20 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div variants={stagger} initial="hidden" animate="show">
                <m.div variants={fadeUp}>
                  <SectionTitle
                    icon={<Info className="h-8 w-8 text-[hsl(var(--accent))]" />}
                    title={heroTitle}
                    subtitle={heroSubtitle}
                  />
                </m.div>

                <m.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-2">
                  {heroChips.map((chip, idx) => (
                    <Chip
                      key={`${chip}-${idx}`}
                      tone={idx % 3 === 1 ? "indigo" : idx % 3 === 2 ? "slate" : "cyan"}
                    >
                      {chip}
                    </Chip>
                  ))}
                </m.div>

                <m.div variants={fadeUp} className="mt-10 max-w-4xl mx-auto">
                  <MeaningAccordion items={meaningItems} />
                </m.div>
              </m.div>
            </div>
          </section>

          {/* VISION / MISSION */}
          <section className="relative z-10 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-7 lg:grid-cols-2">
                <m.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-120px" }}
                  transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 320, damping: 26 }}
                >
                  <NeoCard className="p-7 sm:p-9" interactive={!reduce}>
                    <div className="flex items-start gap-4">
                      <IconBadge Icon={Eye} />
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold tracking-[0.22em] text-[hsl(var(--accent))]/80">
                          VISION
                        </div>
                        <div className="mt-2 text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
                          {visionTitle}
                        </div>
                        <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed text-base sm:text-lg">
                          {visionBody}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {visionTags.map((t) => (
                            <TagPill key={t}>{t}</TagPill>
                          ))}
                        </div>
                      </div>
                    </div>
                  </NeoCard>
                </m.div>

                <m.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-120px" }}
                  transition={
                    reduce ? { duration: 0.01 } : { type: "spring", stiffness: 320, damping: 26, delay: 0.06 }
                  }
                >
                  <NeoCard className="p-7 sm:p-9" interactive={!reduce}>
                    <div className="flex items-start gap-4">
                      <IconBadge Icon={Rocket} />
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold tracking-[0.22em] text-[hsl(var(--accent))]/80">
                          MISSION
                        </div>
                        <div className="mt-2 text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
                          {missionTitle}
                        </div>
                        <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed text-base sm:text-lg">
                          {missionBody}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {missionTags.map((t) => (
                            <TagPill key={t}>{t}</TagPill>
                          ))}
                        </div>
                      </div>
                    </div>
                  </NeoCard>
                </m.div>
              </div>
            </div>
          </section>

          {/* CORE VALUES */}
          <section className="relative z-10 py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-120px" }}
                className="text-center"
              >
                <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[hsl(var(--chip-indigo))] text-[hsl(var(--chip-indigo-fg))] ring-1 ring-[hsl(var(--chip-indigo-ring))] px-4 py-2 text-xs font-extrabold tracking-[0.22em]">
                  <Layers3 className="h-4 w-4" />
                  {coreValuesEyebrow}
                </div>
                <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-[hsl(var(--fg))]">
                  {coreValuesTitle}
                </h2>
                <p className="mt-3 text-[hsl(var(--muted))] max-w-2xl mx-auto leading-relaxed">
                  {coreValuesSubtitle}
                </p>
              </m.div>

              <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                {valuesItems.map((v, i) => {
                  const Icon = v.Icon;
                  return (
                    <m.div
                      key={v.title}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-120px" }}
                      transition={
                        reduce
                          ? { duration: 0.01 }
                          : { type: "spring", stiffness: 320, damping: 26, delay: i * 0.05 }
                      }
                    >
                      <NeoCard className="p-6 sm:p-7 h-full" interactive={!reduce}>
                        <div className="flex items-start gap-4">
                          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
                            <Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
                          </div>

                          <div className="min-w-0">
                            <div className="text-xl font-black text-[hsl(var(--fg))]">{v.title}</div>
                            <p className="mt-2 text-[hsl(var(--muted))] leading-relaxed">{v.desc}</p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                          <Chip tone="slate">Built into delivery</Chip>
                          <Chip>Customer value</Chip>
                        </div>
                      </NeoCard>
                    </m.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* IMAGE + QUOTE */}
          <section className="relative z-10 pt-2 pb-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }}>
                <NeoCard className="p-7 sm:p-8" interactive={!reduce}>
                  <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/about/teamwork.webp"
                      alt="Teamwork"
                      className="w-full h-[200px] sm:h-[360px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="mt-7 text-center">
                    <p className="text-[hsl(var(--accent))]/85 italic text-lg sm:text-xl">
                      {quoteText}
                    </p>

                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <Link
                        href={quotePrimary.href}
                        className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-extrabold text-[hsl(var(--accent-ink))] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      >
                        {quotePrimary.label} <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Link
                        href={quoteSecondary.href}
                        className="inline-flex items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--btn))] px-6 py-3 text-sm font-bold text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                      >
                        {quoteSecondary.label} <ShieldCheck className="h-4 w-4 text-[hsl(var(--accent))]" />
                      </Link>
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
