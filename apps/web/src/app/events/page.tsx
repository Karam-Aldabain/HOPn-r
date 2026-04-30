"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Video,
  ChevronUp,
  Sparkles,
  Mic2,
  Users,
  Megaphone,
  ChevronDown,
  SlidersHorizontal,
  Filter,
  X,
  Ticket,
} from "lucide-react";
import { useCmsPageData } from "@/lib/use-cms-page-data";

/**
 * ✅ Upgrade goals (inspired by your “first/navbar” code style):
 * - Navbar-like “shared panel” popover for filters (blur, gradient border, dot grid)
 * - Magnetic buttons (kept) + cleaner glass surfaces (consistent)
 * - Card top “pill bar” (like your shared panel rows)
 * - Robust dates (sort + optional “upcoming first”)
 * - Fix: tab-pill measurement also runs on resize + initial mount
 */

type EventType = "Conference" | "Webinar" | "Workshop";
type EventStatus = "upcoming" | "past";

type EventItem = {
  id: string;
  status: EventStatus;
  type: EventType;
  dateLabel: string; // display string
  title: string;
  desc: string;
  location: string;
  cover: string; // image url
};

const defaultEvents: EventItem[] = [
  {
    id: "e1",
    status: "upcoming",
    type: "Conference",
    dateLabel: "MARCH 15, 2026",
    title: "Nexius Summit 2026: The AI Enterprise",
    desc: "Join 500+ industry leaders for a deep dive into generative AI strategies for the modern enterprise.",
    location: "Berlin, Germany",
    cover:
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "e2",
    status: "upcoming",
    type: "Webinar",
    dateLabel: "APRIL 02, 2026",
    title: "Mastering API Security in the Cloud",
    desc: "Learn how to secure your microservices architecture against the latest OWASP threats.",
    location: "Online",
    cover:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "e3",
    status: "upcoming",
    type: "Workshop",
    dateLabel: "APRIL 10, 2026",
    title: "DevOps World Tour: London",
    desc: "A hands-on workshop on Kubernetes orchestration and CI/CD pipelines.",
    location: "London, UK",
    cover:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "e4",
    status: "past",
    type: "Webinar",
    dateLabel: "JAN 01, 2026",
    title: "Identity Management for FinTech",
    desc: "Watch the recording of our deep dive into CIAM for banking applications.",
    location: "Online",
    cover:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  },
];

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function parseDateLabel(label: string) {
  // expects like "MARCH 15, 2026" / "JAN 01, 2026"
  const d = new Date(label);
  return isNaN(d.getTime()) ? null : d;
}

function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: () => void
) {
  useEffect(() => {
    function onDown(e: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el) return;
      if (el.contains(e.target as Node)) return;
      handler();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [ref, handler]);
}

/** -------------------------------------------------------
 * Subtle magnetic wrapper (kept)
 * ------------------------------------------------------ */
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

/** -------------------------------------------------------
 * Navbar-inspired primitives
 * ------------------------------------------------------ */

function GlassCard({
  children,
  className = "",
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cx(
        "group relative overflow-hidden rounded-[34px] border backdrop-blur-2xl",
        "border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 shadow-[0_50px_160px_rgba(0,0,0,0.25)]",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-80",
        "before:bg-[radial-gradient(circle_at_18%_0%,hsl(var(--card))/0.65,transparent_58%)]",
        "after:pointer-events-none after:absolute after:inset-0 after:opacity-[0.08]",
        "after:[background-image:radial-gradient(hsl(var(--fg))/0.18_1px,transparent_1px)] after:[background-size:12px_12px]",
        interactive && "transition-transform hover:-translate-y-1 hover:scale-[1.01] will-change-transform",
        className
      )}
    >
      {/* hover glow */}
      <div className="pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_30%_10%,rgba(232,87,24,0.22),transparent_60%),radial-gradient(circle_at_80%_25%,rgba(16,185,129,0.14),transparent_55%)]" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function CardTopPill({
  Icon,
}: {
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 rounded-[18px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60">
            <Icon className="h-5 w-5 text-[hsl(var(--accent-warm))]" />
          </div>
          <div className="h-2 w-28 rounded-full bg-[hsl(var(--border))]" />
        </div>
      </div>
      <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--accent-warm))]/70" />
    </div>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full bg-[hsl(var(--accent-warm))] px-3 py-1 text-[12px] font-semibold text-[hsl(var(--fg))] shadow-[0_10px_30px_rgba(232,87,24,0.25)]",
        className
      )}
    >
      {children}
    </span>
  );
}

function TypePill({ type }: { type: EventType }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[hsl(var(--card))]/70 px-3 py-1 text-[11px] font-semibold text-[hsl(var(--fg))] ring-1 ring-[hsl(var(--border))]">
      {type.toUpperCase()}
    </span>
  );
}

function SectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <div className="text-[hsl(var(--accent-warm))] text-xs font-bold tracking-[0.22em] uppercase">
        {kicker}
      </div>
      <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[hsl(var(--fg))] tracking-tight">
        {title}
      </h1>
      <p className="mt-6 mx-auto max-w-2xl text-base sm:text-lg text-[hsl(var(--muted))] leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

/** -------------------------------------------------------
 * Event Card (upgraded: top pill bar + better glass)
 * ------------------------------------------------------ */
function EventCard({ e, index }: { e: EventItem; index: number }) {
  const reduceMotion = useReducedMotion();

  const icon =
    e.type === "Conference" ? Users : e.type === "Webinar" ? Video : Ticket;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 350, damping: 30, delay: index * 0.05 }
      }
      className="h-full"
    >
      <GlassCard className="h-full" interactive={!reduceMotion}>
        {/* top pill (navbar/shared-panel vibe) */}
        <div className="p-6 pb-0">
          <CardTopPill Icon={icon} />
        </div>

        {/* cover */}
        <div className="relative mt-5 h-44 overflow-hidden sm:h-52">
          <img
            src={e.cover}
            alt={e.title}
            className="h-full w-full object-cover scale-[1.03] group-hover:scale-[1.08] transition-transform duration-700 ease-out brightness-[0.88] contrast-[1.06] saturate-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.05),rgba(0,0,0,0.28))]" />
          <div className="absolute left-4 top-4">
            <TypePill type={e.type} />
          </div>
        </div>

        {/* body */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-[hsl(var(--accent-warm))] text-sm font-bold tracking-[0.12em] uppercase">
            <Calendar className="h-4 w-4" />
            <span>{e.dateLabel}</span>
          </div>

          <h3 className="mt-3 text-2xl font-extrabold text-[hsl(var(--fg))] leading-tight">
            {e.title}
          </h3>

          <p className="mt-3 text-[hsl(var(--muted))] leading-relaxed">{e.desc}</p>

          <div className="mt-6 border-t border-[hsl(var(--border))] pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[hsl(var(--muted))]">
              {e.location.toLowerCase() === "online" ? (
                <Video className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span className="text-sm">{e.location}</span>
            </div>

            <Link
              href="#"
              className={cx(
                "inline-flex h-10 w-10 items-center justify-center rounded-full",
                "bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))] text-[hsl(var(--muted))]",
                "group-hover:bg-[hsl(var(--card))]/85 group-hover:text-[hsl(var(--fg))] transition"
              )}
              aria-label="Open event"
            >
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
}

/** -------------------------------------------------------
 * Page
 * ------------------------------------------------------ */
type SortKey = "soonest" | "latest" | "title";

export default function EventsPage() {
  const reduceMotion = useReducedMotion();

  const content = useCmsPageData("events", {
    hero: {
      kicker: "CONNECT & LEARN",
      title: "Events & Webinars",
      subtitle:
        "Join our community of developers, architects, and industry leaders to explore the future of digital platforms.",
    },
    events: defaultEvents,
    featuredIndex: 0,
    speakers: {
      title: "Call for Speakers",
      body:
        "Are you an expert in API Management, AI, or Cloud Security? We are always looking for thought leaders to speak at our webinars and conferences.",
      ctaLabel: "Apply to Speak",
      reasonsTitle: "Why Speak at Nexius?",
      reasons: [
        "Reach a global audience of 50k+ developers",
        "Network with industry CTOs and Architects",
        "Full marketing support for your session",
      ],
    },
  });

  const events: EventItem[] = useMemo(
    () => (content.events?.length ? content.events : defaultEvents),
    [content.events]
  );

  const featured =
    events[Number(content.featuredIndex ?? 0)] ?? events[0];

  const [tab, setTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [sort, setSort] = useState<SortKey>("soonest");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    const base = tab === "all" ? events : events.filter((e) => e.status === tab);

    const sorted = [...base].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const da = parseDateLabel(a.dateLabel)?.getTime() ?? 0;
      const db = parseDateLabel(b.dateLabel)?.getTime() ?? 0;
      return sort === "soonest" ? da - db : db - da;
    });

    return sorted;
  }, [events, tab, sort]);

  // tabs
  const tabs = useMemo(
    () =>
      [
        { id: "upcoming", label: "Upcoming Events" },
        { id: "past", label: "Past Events" },
        { id: "all", label: "All Events" },
      ] as const,
    []
  );

  // animated tab pill measurement
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const measurePill = () => {
    const wrap = tabsRef.current;
    const btn = tabBtnRefs.current[tab];
    if (!wrap || !btn) return;
    const wr = wrap.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPill({ left: br.left - wr.left, width: br.width });
  };

  useEffect(() => {
    measurePill();
    // also on resize
    const onResize = () => measurePill();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // scroll-to-top
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // hero mouse sheen
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(20);
  const gSX = useSpring(glowX, { stiffness: 180, damping: 30 });
  const gSY = useSpring(glowY, { stiffness: 180, damping: 30 });

  // filter panel outside-click
  const filterRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(filterRef, () => setFilterOpen(false));

  return (
    <main className="relative min-h-screen text-[hsl(var(--fg))] bg-[hsl(var(--bg))]">
      {/* BACKGROUND SYSTEM (adapts to theme) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 [background-image:linear-gradient(to_right,var(--events-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--events-grid)_1px,transparent_1px)] [background-size:110px_110px]"
          style={{ opacity: "var(--events-grid-opacity)" as any }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, transparent, rgba(0,0,0, var(--events-vignette)))",
          }}
        />
      </div>
      {/* HERO */}
      <section
        className="relative overflow-hidden pt-24 pb-16 border-b border-[hsl(var(--border))]"
        onMouseMove={(e) => {
          if (reduceMotion) return;
          const w = window.innerWidth;
          const h = 520;
          glowX.set(clamp((e.clientX / w) * 100, 0, 100));
          glowY.set(clamp((e.clientY / h) * 100, 0, 100));
        }}
      >
        {/* ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-56 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[hsl(var(--glow-2))] blur-[90px] opacity-70" />
          <div className="absolute -top-40 left-1/2 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-[hsl(var(--accent-warm))]/18 blur-[90px] opacity-70" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.20)_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* mouse-follow sheen */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            background:
              "radial-gradient(600px 260px at var(--x) var(--y), rgba(255,255,255,0.11), transparent 70%)",
            // @ts-ignore
            "--x": gSX,
            // @ts-ignore
            "--y": gSY,
          }}
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { type: "spring", stiffness: 260, damping: 26 }
            }
          >
            <SectionTitle
              kicker={content.hero.kicker}
              title={content.hero.title}
              subtitle={content.hero.subtitle}
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURED EVENT */}
      <section className="relative py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -120px 0px" }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { type: "spring", stiffness: 260, damping: 26 }
            }
          >
            <GlassCard interactive={false} className="min-h-[260px] sm:min-h-[420px]">
              {/* image */}
              <div className="absolute inset-0">
                <img
                  src={featured.cover}
                  alt={featured.title}
                  className="h-full w-full object-cover brightness-[0.88] contrast-[1.06] saturate-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.65),rgba(0,0,0,0.35),rgba(0,0,0,0.55))]" />
              </div>

              <div className="relative p-8 sm:p-10 lg:p-12">
                <Badge className="bg-black/55 text-white ring-1 ring-white/15 backdrop-blur-sm">
                  FEATURED EVENT
                </Badge>

                <h2 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)]">
                  {featured.title}
                </h2>

                <p className="mt-5 max-w-2xl text-white/85 text-lg leading-relaxed drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)]">
                  {featured.desc}
                </p>

                {/* meta */}
                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-black/45 px-4 py-2 text-white ring-1 ring-white/15 backdrop-blur-sm">
                    <Calendar className="h-4 w-4 text-[hsl(var(--accent-warm))]" />
                    <span className="font-semibold">{featured.dateLabel}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-black/45 px-4 py-2 text-white ring-1 ring-white/15 backdrop-blur-sm">
                    <Clock className="h-4 w-4 text-[hsl(var(--accent-warm))]" />
                    <span className="font-semibold">09:00 AM - 05:00 PM</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-black/45 px-4 py-2 text-white ring-1 ring-white/15 backdrop-blur-sm">
                    <MapPin className="h-4 w-4 text-[hsl(var(--accent-warm))]" />
                    <span className="font-semibold">{featured.location}</span>
                  </div>
                </div>

                {/* actions */}
                <div className="mt-10 flex flex-wrap gap-4">
                  <Magnetic>
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center rounded-full bg-[hsl(var(--fg))] text-[hsl(var(--bg))] px-10 py-4 text-sm font-extrabold shadow-[0_20px_80px_rgba(0,0,0,0.12)] hover:brightness-95 transition"
                    >
                      Register Now
                    </Link>
                  </Magnetic>

                  <Magnetic>
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center rounded-full bg-black/35 text-white px-10 py-4 text-sm font-extrabold ring-1 ring-white/20 backdrop-blur-sm hover:bg-black/45 transition"
                    >
                      View Agenda
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* TABS + FILTER + GRID */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Row: Tabs + Filter (navbar shared panel) */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* Tabs */}
            <div className="flex justify-center sm:justify-start w-full sm:w-auto">
              <div
                ref={tabsRef}
                className="relative inline-flex items-center gap-2 rounded-full bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))] p-1 shadow-[0_30px_90px_rgba(0,0,0,0.20)]"
              >
                <AnimatePresence>
                  {pill && (
                    <motion.div
                      className="absolute top-1 bottom-1 rounded-full bg-[hsl(var(--accent-warm))]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, left: pill.left, width: pill.width }}
                      exit={{ opacity: 0 }}
                      transition={
                        reduceMotion
                          ? { duration: 0.01 }
                          : { type: "spring", stiffness: 520, damping: 38 }
                      }
                    />
                  )}
                </AnimatePresence>

                {tabs.map((t) => (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabBtnRefs.current[t.id] = el;
                    }}
                    onClick={() => setTab(t.id)}
                    className={cx(
                      "relative z-10 rounded-full px-6 py-2.5 text-sm font-extrabold transition",
                      tab === t.id ? "text-[hsl(var(--fg))]" : "text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter popover */}
            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((v) => !v)}
                className={cx(
                  "inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold",
                  "bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))] text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition",
                  "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30"
                )}
              >
                <SlidersHorizontal className="h-4 w-4 text-[hsl(var(--muted))]" />
                Sort & Filter
                <motion.span
                  animate={{ rotate: filterOpen ? 180 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 34 }}
                >
                  <ChevronDown className="h-4 w-4 text-[hsl(var(--muted))]" />
                </motion.span>
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={
                      reduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 10, scale: 0.985, filter: "blur(7px)" }
                    }
                    animate={
                      reduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                    }
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 8, scale: 0.99, filter: "blur(7px)" }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0.12 }
                        : { type: "spring", stiffness: 420, damping: 30, mass: 0.6 }
                    }
                    className="absolute right-0 mt-3 w-[320px] rounded-2xl p-[1px] bg-gradient-to-b from-[hsl(var(--border))] via-[hsl(var(--border))]/60 to-transparent shadow-[0_45px_140px_rgba(0,0,0,0.40)] z-50"
                  >
                    <div className="relative rounded-2xl bg-[hsl(var(--card))]/92 backdrop-blur-2xl ring-1 ring-[hsl(var(--border))] overflow-hidden">
                      <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,hsl(var(--fg))/0.18_1px,transparent_0)] [background-size:10px_10px]" />

                      <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <div className="flex items-center gap-2 text-[hsl(var(--fg))]">
                          <Filter className="h-4 w-4 text-[hsl(var(--muted))]" />
                          <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                            Filters
                          </span>
                        </div>
                        <button
                          onClick={() => setFilterOpen(false)}
                          className="inline-flex items-center gap-1 text-xs text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="px-2 pb-3">
                        <div className="px-2 text-[11px] text-[hsl(var(--muted))] font-semibold tracking-[0.14em] uppercase">
                          Sort
                        </div>

                        <div className="mt-2 grid gap-1">
                          {([
                            { key: "soonest", label: "Soonest first" },
                            { key: "latest", label: "Latest first" },
                            { key: "title", label: "Title (A → Z)" },
                          ] as const).map((o) => (
                            <button
                              key={o.key}
                              onClick={() => {
                                setSort(o.key);
                                setFilterOpen(false);
                              }}
                              className={cx(
                                "w-full text-left rounded-xl px-3 py-3 text-sm font-semibold transition",
                                "hover:bg-[hsl(var(--card))]/85 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30",
                                sort === o.key ? "bg-[hsl(var(--card))]/90 text-[hsl(var(--fg))]" : "text-[hsl(var(--muted))]"
                              )}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>

                        <div className="mt-3 h-px bg-[hsl(var(--border))]" />

                        <div className="mt-3 px-2 text-xs text-[hsl(var(--muted))]">
                          Showing{" "}
                          <span className="text-[hsl(var(--fg))] font-semibold">
                            {filtered.length}
                          </span>{" "}
                          event{filtered.length === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((e, i) => (
              <EventCard key={e.id} e={e} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CALL FOR SPEAKERS */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -140px 0px" }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { type: "spring", stiffness: 260, damping: 26 }
            }
          >
            <GlassCard interactive={false}>
              <div className="relative p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left */}
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))] grid place-items-center">
                    <Mic2 className="h-6 w-6 text-[hsl(var(--accent-warm))]" />
                  </div>

                  <h3 className="mt-6 text-3xl sm:text-4xl font-extrabold text-[hsl(var(--fg))]">
                    {content.speakers.title}
                  </h3>

                  <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed text-lg max-w-xl">
                    {content.speakers.body}
                  </p>

                  <div className="mt-8">
                    <Magnetic>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-full bg-[hsl(var(--fg))] text-[hsl(var(--bg))] px-10 py-4 text-sm font-extrabold shadow-[0_20px_80px_rgba(0,0,0,0.12)] hover:brightness-95 transition"
                      >
                        {content.speakers.ctaLabel}
                      </Link>
                    </Magnetic>
                  </div>
                </div>

                {/* Right */}
                <div className="lg:border-l lg:border-[hsl(var(--border))] lg:pl-10">
                  <h4 className="text-2xl font-extrabold text-[hsl(var(--fg))]">
                    {content.speakers.reasonsTitle}
                  </h4>

                  <div className="mt-6 space-y-5">
                    {(content.speakers.reasons || []).map((r, i) => {
                      const Icon = i === 0 ? Users : i === 1 ? Sparkles : Megaphone;
                      return (
                        <div key={r} className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-emerald-200/95 grid place-items-center">
                            <Icon className="h-5 w-5 text-black" />
                          </div>
                          <div className="text-[hsl(var(--fg))] font-semibold text-lg">
                            {r}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.18 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full bg-[hsl(var(--fg))] text-[hsl(var(--bg))] shadow-[0_25px_90px_rgba(0,0,0,0.65)] hover:brightness-95 transition grid place-items-center"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* GLOBAL STYLES */}
      <style>{`
        :root {
          --events-grid: rgba(2, 6, 23, 0.08);
          --events-grid-opacity: 0.12;
          --events-vignette: 0.06;
        }
        .dark {
          --events-grid: rgba(255, 255, 255, 0.10);
          --events-grid-opacity: 0.12;
          --events-vignette: 0.74;
        }
      `}</style>
    </main>
  );
}
