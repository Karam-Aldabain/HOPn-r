"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import type { ReactNode, ComponentType } from "react";
import { usePathname } from "next/navigation";
import {
  LazyMotion,
  domAnimation,
  MotionConfig,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Newspaper,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Leaf,
  Layers,
  Rocket,
  CalendarDays,
  User,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Filter,
  X,
  Loader2,
} from "lucide-react";

/** -------------------------------------------------------
 * helpers
 * ------------------------------------------------------ */
function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function formatPublishDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function parseISO(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function truncate160(s: string) {
  const clean = s.trim();
  if (clean.length <= 160) return clean;
  return clean.slice(0, 157).trimEnd() + "...";
}

/** -------------------------------------------------------
 * types (spec-aligned)
 * ------------------------------------------------------ */
type InsightCategory =
  | "Artificial Intelligence"
  | "Emerging Technologies"
  | "Sustainability & Tech"
  | "Digital Transformation"
  | "Innovation & Startups";

type SortKey = "latest" | "oldest" | "mostRead" | "editorsPicks";

type InsightArticle = {
  id: string;
  category: InsightCategory;
  title: string;
  shortDescription: string; // <= 160
  featuredImage: { src: string; alt: string };
  authorName: string;
  authorRole?: string;
  publishDate: string; // ISO recommended
  slug: string;
  tags?: string[]; // keywords/tags for search
  viewCount?: number; // optional future-ready
  isEditorsPick?: boolean; // optional future-ready
};

type InsightsPageClientProps = {
  cmsInsights?: InsightArticle[];
};

const DEFAULT_INSIGHTS: InsightArticle[] = [
  {
    id: "ai-1",
    category: "Artificial Intelligence",
    title: "The Future of AI in Enterprise Systems",
    shortDescription:
      "A practical overview of how enterprise AI, automation, and large language models are transforming decision-making and operations.",
    authorName: "HOPn Leadership Team",
    publishDate: "2025-05-15",
    slug: "the-future-of-ai-in-enterprise-systems",
    featuredImage: { src: "/insights-ai.webp", alt: "Abstract AI and enterprise technology" },
    tags: ["enterprise AI", "automation", "large language models", "operations", "decision-making"],
  },
  {
    id: "em-1",
    category: "Emerging Technologies",
    title: "Turning Emerging Technologies into Real Business Value",
    shortDescription:
      "Exploring how organizations can move from experimentation to scalable adoption of emerging technologies.",
    authorName: "HOPn Technology Team",
    publishDate: "2025-04-28",
    slug: "turning-emerging-technologies-into-real-business-value",
    featuredImage: { src: "/insights-api.webp", alt: "Emerging technologies concept visual" },
    tags: ["emerging tech", "adoption", "scale", "strategy", "innovation"],
  },
  {
    id: "su-1",
    category: "Sustainability & Tech",
    title: "Technology as a Driver of Sustainable Innovation",
    shortDescription:
      "How digital solutions support sustainable business models and responsible innovation.",
    authorName: "HOPn Labs Research Team",
    publishDate: "2025-04-10",
    slug: "technology-as-a-driver-of-sustainable-innovation",
    featuredImage: { src: "/insights-cyber.jpeg", alt: "Sustainability and digital innovation" },
    tags: ["sustainability", "digital solutions", "responsible innovation", "business models"],
  },
];

/** -------------------------------------------------------
 * motion presets
 * ------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

/** -------------------------------------------------------
 * UI bits
 * ------------------------------------------------------ */
function IconChip({
  Icon,
  g1,
  g2,
}: {
  Icon: ComponentType<{ className?: string }>;
  g1: string;
  g2: string;
}) {
  return (
    <div className="relative h-11 w-11 shrink-0 rounded-2xl ring-1 ring-[hsl(var(--border))] bg-[hsl(var(--card))]/70 overflow-hidden">
      <div
        className="absolute -inset-6 opacity-45 blur-2xl"
        style={{ background: `radial-gradient(closest-side, ${g2}55, transparent 70%)` }}
      />
      <div className="absolute inset-0 opacity-85" style={{ background: `linear-gradient(135deg, ${g1}55, ${g2}55)` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-30" />
      <div className="absolute inset-0 grid place-items-center">
        <Icon className="h-[18px] w-[18px] text-[hsl(var(--fg))]" />
      </div>
    </div>
  );
}

function ChipPill({
  children,
  active = false,
  onClick,
  Icon = Sparkles,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  Icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold tracking-wide",
        "border border-[hsl(var(--border))] bg-[hsl(var(--btn))] text-[hsl(var(--muted))]",
        "hover:bg-[hsl(var(--card))]/85 hover:text-[hsl(var(--fg))] transition",
        active &&
          cx(
            "bg-[hsl(var(--accent))] text-[hsl(var(--accent-ink))]",
            "border-[hsl(var(--accent))]/40 ring-1 ring-[hsl(var(--ring))]/30",
            "shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_18px_70px_rgba(34,211,238,0.18)]"
          )
      )}
    >
      <Icon className={cx("h-4 w-4", active ? "text-[hsl(var(--accent-ink))]" : "text-[hsl(var(--muted))]")} />
      {children}
    </button>
  );
}

function GlowIconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))]">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_20%,rgba(96,165,250,0.22),transparent_55%)]" />
      {children}
    </div>
  );
}

/** -------------------------------------------------------
 * backdrop (spec: #141D26 + subtle grid/noise + pro animation)
 * ------------------------------------------------------ */
function PageBackdrop() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 900], [0, 70]);
  const y2 = useTransform(scrollY, [0, 900], [0, -55]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px_800px_at_50%_-10%,rgba(34,211,238,0.10),transparent_60%)," +
            "linear-gradient(180deg,hsl(var(--bg)) 0%, hsl(var(--bg)) 100%)",
        }}
      />

      {/* subtle grid (slight drift) */}
      <div className="absolute inset-0 insights-grid animate-gridShift" />

      {/* soft orbs */}
      <m.div
        aria-hidden="true"
        style={{ y: y1 }}
        className="absolute -top-64 left-[12%] h-[720px] w-[720px] rounded-full bg-[hsl(var(--accent))]/10 blur-[180px]"
        animate={reduce ? undefined : { x: [0, 14, 0], scale: [1, 1.04, 1] }}
        transition={reduce ? { duration: 0.01 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        aria-hidden="true"
        style={{ y: y2 }}
        className="absolute -top-40 -right-72 h-[820px] w-[820px] rounded-full bg-sky-500/10 blur-[200px]"
        animate={reduce ? undefined : { x: [0, -16, 0], scale: [1, 1.03, 1] }}
        transition={reduce ? { duration: 0.01 } : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(closest-side, transparent, rgba(0,0,0,var(--vignette)))" }}
      />

      {/* animated noise */}
      <div className="absolute inset-0 opacity-[0.06] noise" />
    </div>
  );
}

/** -------------------------------------------------------
 * click-outside for popover
 * ------------------------------------------------------ */
function useOnClickOutside<T extends HTMLElement>(ref: React.RefObject<T | null>, handler: () => void) {
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
 * card image (hover zoom)
 * ------------------------------------------------------ */
function CardHeaderImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 transition-transform duration-500 will-change-transform group-hover:scale-[1.03]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_30%_15%,rgba(96,165,250,0.20),transparent_62%),linear-gradient(180deg,rgba(4,18,27,0.20),rgba(0,0,0,0.55))]" />
      <div className="absolute inset-0 opacity-[0.30] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.18)_1px,transparent_0)] [background-size:12px_12px]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.60))]" />
    </div>
  );
}

/** -------------------------------------------------------
 * card
 * ------------------------------------------------------ */
function InsightCard({ item, index }: { item: InsightArticle; index: number }) {
  const reduce = useReducedMotion();

  const catAccent =
    item.category === "Artificial Intelligence"
      ? { g1: "#5EEAD4", g2: "#3B82F6", Icon: Sparkles }
      : item.category === "Emerging Technologies"
      ? { g1: "#60A5FA", g2: "#A78BFA", Icon: Newspaper }
      : item.category === "Sustainability & Tech"
      ? { g1: "#34D399", g2: "#22C55E", Icon: Leaf }
      : item.category === "Digital Transformation"
      ? { g1: "#38BDF8", g2: "#6366F1", Icon: Layers }
      : { g1: "#A78BFA", g2: "#22D3EE", Icon: Rocket };

  const displayDate = formatPublishDate(item.publishDate);

  return (
    <m.article
      variants={fadeUp}
      transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 340, damping: 28, delay: index * 0.06 }}
      className="group h-full"
    >
      <div
        className={cx(
          "relative overflow-hidden rounded-[22px] border border-[hsl(var(--border))]",
          "bg-[hsl(var(--card))]/70 backdrop-blur-xl",
          "shadow-[0_30px_120px_rgba(0,0,0,0.25)]",
          "transition-transform duration-300 will-change-transform",
          "hover:-translate-y-[6px]"
        )}
      >
        {/* hover glow border */}
        <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="absolute inset-0 rounded-[22px] bg-[radial-gradient(650px_260px_at_35%_0%,rgba(96,165,250,0.18),transparent_70%)] blur-2xl" />
        </div>

        <div className="relative flex h-full flex-col">
          {/* top bar */}
          <div className="relative flex items-center justify-between gap-3 px-5 pt-5 pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <IconChip Icon={catAccent.Icon} g1={catAccent.g1} g2={catAccent.g2} />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[hsl(var(--muted))]">
                  {item.category}
                </div>
                <div className="text-[12px] text-[hsl(var(--muted))] truncate">
                  {item.authorName}
                  {item.authorRole ? ` • ${item.authorRole}` : ""}
                </div>
              </div>
            </div>

            <div className="rounded-full px-3 py-1 text-[11px] font-semibold text-[hsl(var(--muted))] bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))]">
              {displayDate}
            </div>
          </div>

          {/* image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <CardHeaderImage src={item.featuredImage.src} alt={item.featuredImage.alt} />
          </div>

          {/* body (flex-1 to enforce equal height) */}
          <div className="relative flex flex-1 flex-col p-6 pt-5">
            <h3 className="text-2xl font-black leading-snug text-[hsl(var(--fg))]">{item.title}</h3>

            <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed">
              {truncate160(item.shortDescription)}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[hsl(var(--muted))]">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-[hsl(var(--muted))]" />
                {item.authorName}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[hsl(var(--muted))]" />
                {displayDate}
              </span>
              {typeof item.viewCount === "number" ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--muted))]/60" />
                  {item.viewCount.toLocaleString()} views
                </span>
              ) : null}
              {item.isEditorsPick ? (
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))]">
                  <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
                  Editor’s Pick
                </span>
              ) : null}
            </div>

            {/* CTA pinned to bottom */}
            <div className="mt-auto pt-7">
              <Link
                href={`/insights/${item.slug}`}
                aria-label={`Read more: ${item.title}`}
                className={cx(
                  "group/btn relative inline-flex w-full items-center justify-center gap-2 rounded-xl",
                  "border border-[hsl(var(--ring))]/25",
                  "bg-[hsl(var(--btn))] hover:bg-[hsl(var(--accent))]/10",
                  "px-5 py-3 text-sm font-extrabold text-[hsl(var(--accent))]",
                  "transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/20"
                )}
              >
                Read More
                <ArrowRight className="h-4 w-4 opacity-90 transition group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[hsl(var(--border))]" />
      </div>
    </m.article>
  );
}

/** -------------------------------------------------------
 * newsletter (spec section)
 * ------------------------------------------------------ */
function NewsletterSection() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const validate = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  return (
    <m.section
      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -120px 0px" }}
      transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 240, damping: 26 }}
      aria-label="Newsletter subscription"
      className="relative"
    >
      <div className="relative overflow-hidden rounded-[34px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/65 backdrop-blur-2xl shadow-[0_60px_180px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,hsl(var(--fg))/0.18_1px,transparent_0)] [background-size:12px_12px]" />
        <div className="pointer-events-none absolute -top-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-3xl bg-[rgba(167,139,250,0.14)]" />

        <div className="relative px-8 py-12 sm:px-14 sm:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-3xl sm:text-5xl font-black text-[hsl(var(--fg))] tracking-tight">
              Stay Ahead of Innovation
            </h3>
            <p className="mt-5 text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
              Subscribe to receive insights, research highlights, and updates from HOPn.
            </p>

            <form
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStatus("idle");
                setErrorMsg("");

                const v = email.trim();
                if (!validate(v)) {
                  setStatus("error");
                  setErrorMsg("Please enter a valid email address.");
                  return;
                }

                // Placeholder: hook up to your backend / ESP.
                setStatus("success");
                setErrorMsg("");
                setEmail("");
              }}
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                  setErrorMsg("");
                }}
                placeholder="Email address"
                className={cx(
                  "w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-xl",
                  "px-5 py-4 text-sm sm:text-base text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))]",
                  "outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/40 focus:border-[hsl(var(--border))]"
                )}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "newsletter-error" : status === "success" ? "newsletter-success" : undefined}
                required
              />

              <button
                type="submit"
                className={cx(
                  "inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 font-extrabold",
                  "text-[hsl(var(--fg))] hover:brightness-110 transition",
                  "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/40"
                )}
                style={{
                  background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                  boxShadow: "0 22px 80px rgba(96,165,250,0.22)",
                }}
              >
                Subscribe
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>

            {status === "success" ? (
              <p id="newsletter-success" className="mt-4 text-sm text-[hsl(var(--fg))]">
                Thank you for subscribing to HOPn Insights.
              </p>
            ) : null}

            {status === "error" ? (
              <p id="newsletter-error" className="mt-4 text-sm text-red-200">
                {errorMsg}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </m.section>
  );
}

/** -------------------------------------------------------
 * final CTA (spec section)
 * ------------------------------------------------------ */
function FinalCTA() {
  const reduce = useReducedMotion();

  return (
    <m.section
      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -120px 0px" }}
      transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 240, damping: 26 }}
      aria-label="Contact call to action"
      className="relative"
    >
      <div className="relative overflow-hidden rounded-[34px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/65 backdrop-blur-2xl shadow-[0_60px_180px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,hsl(var(--fg))/0.18_1px,transparent_0)] [background-size:12px_12px]" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full blur-3xl bg-[rgba(34,211,238,0.14)]" />

        <div className="relative px-8 py-14 sm:px-14 sm:py-16 text-center">
          <m.div
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))]"
            animate={reduce ? undefined : { y: [0, -6, 0] }}
            transition={reduce ? { duration: 0.01 } : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lightbulb className="h-8 w-8 text-[#A78BFA]" />
          </m.div>

          <h3 className="mt-7 text-3xl sm:text-5xl font-black text-[hsl(var(--fg))] tracking-tight">
            Want to Turn Insights into Action?
          </h3>

          <p className="mt-6 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
            Discover how HOPn helps organizations apply technology and innovation to real business challenges.
          </p>

          <m.div className="mt-10 flex justify-center" whileHover={reduce ? undefined : { scale: 1.02 }} whileTap={reduce ? undefined : { scale: 0.98 }}>
            <Link
              href="/contact"
              className={cx(
                "inline-flex items-center gap-3 rounded-2xl px-10 py-4 font-extrabold",
                "text-[hsl(var(--fg))] hover:brightness-110 transition",
                "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/40"
              )}
              style={{
                background: "linear-gradient(135deg, #22D3EE, #A78BFA)",
                boxShadow: "0 22px 80px rgba(167,139,250,0.22)",
              }}
            >
              Contact Us <ArrowRight className="h-5 w-5" />
            </Link>
          </m.div>
        </div>
      </div>
    </m.section>
  );
}

/** -------------------------------------------------------
 * Load more (functional)
 * ------------------------------------------------------ */
function LoadMoreButton({
  onClick,
  disabled,
  loading,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <m.div
      initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -120px 0px" }}
      transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 260, damping: 26 }}
      className="flex justify-center"
    >
      <m.button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        whileTap={reduce || disabled || loading ? undefined : { scale: 0.98 }}
        className={cx(
          "inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-extrabold",
          "bg-[hsl(var(--accent))] text-[hsl(var(--accent-ink))]",
          "shadow-[0_18px_80px_rgba(34,211,238,0.18)] hover:brightness-110 transition",
          "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30",
          (disabled || loading) && "opacity-60 cursor-not-allowed"
        )}
        aria-label="Load more insights"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading…
          </>
        ) : (
          <>
            Load More <ArrowRight className="h-5 w-5" />
          </>
        )}
      </m.button>
    </m.div>
  );
}

/** -------------------------------------------------------
 * Page
 * ------------------------------------------------------ */
export default function InsightsPageClient({ cmsInsights = [] }: InsightsPageClientProps) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  const categories = useMemo(
    () => [
      { key: "All" as const, label: "All", Icon: Sparkles },
      { key: "Artificial Intelligence" as const, label: "Artificial Intelligence", Icon: Sparkles },
      { key: "Emerging Technologies" as const, label: "Emerging Technologies", Icon: Newspaper },
      { key: "Sustainability & Tech" as const, label: "Sustainability & Tech", Icon: Leaf },
      { key: "Digital Transformation" as const, label: "Digital Transformation", Icon: Layers },
      { key: "Innovation & Startups" as const, label: "Innovation & Startups", Icon: Rocket },
    ],
    []
  );

  const [active, setActive] = useState<"All" | InsightCategory>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");
  const [sortOpen, setSortOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  // close popover when route changes
  useEffect(() => {
    setSortOpen(false);
  }, [pathname]);

  // reset visible count on filter changes
  useEffect(() => {
    setVisibleCount(6);
  }, [active, query, sort]);

  const closeSort = useCallback(() => setSortOpen(false), []);
  const sortRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(sortRef, closeSort);

  // initial articles (spec-safe)
  const insights = useMemo<InsightArticle[]>(() => {
    if (!cmsInsights.length) return DEFAULT_INSIGHTS;
    // Merge CMS with defaults so "All" always has content.
    const byKey = new Map<string, InsightArticle>();
    [...DEFAULT_INSIGHTS, ...cmsInsights].forEach((it) => {
      const key = it.slug || it.id;
      if (!byKey.has(key)) byKey.set(key, it);
    });
    return Array.from(byKey.values());
  }, [cmsInsights]);

  const filtered = useMemo(() => {
    const q = normalize(query);

    const categoryFiltered =
      active === "All" ? insights : insights.filter((x) => x.category === active);

    const base = q
      ? categoryFiltered.filter((x) => {
          const haystack = normalize(
            [
              x.title,
              x.shortDescription,
              x.authorName,
              x.authorRole ?? "",
              (x.tags ?? []).join(" "),
            ].join(" ")
          );
          return haystack.includes(q);
        })
      : categoryFiltered;

    const sorted = [...base].sort((a, b) => {
      const da = parseISO(a.publishDate)?.getTime() ?? 0;
      const db = parseISO(b.publishDate)?.getTime() ?? 0;

      if (sort === "latest") return db - da;
      if (sort === "oldest") return da - db;
      if (sort === "mostRead") return (b.viewCount ?? 0) - (a.viewCount ?? 0);

      // editorsPicks: picks first, then latest
      const ap = a.isEditorsPick ? 1 : 0;
      const bp = b.isEditorsPick ? 1 : 0;
      if (bp !== ap) return bp - ap;
      return db - da;
    });

    if (sorted.length === 0 && active === "All" && !q) return insights;
    return sorted;
  }, [insights, active, query, sort]);

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const canLoadMore = visibleCount < filtered.length;

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={reduce ? "always" : "never"}>
        <main className="insights-scope relative min-h-screen text-[hsl(var(--fg))] bg-[hsl(var(--bg))]">
          <PageBackdrop />

          {/* HERO */}
          <section className="relative z-10 pt-20 sm:pt-24 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div variants={stagger} initial="hidden" animate="show" className="text-center">
                <m.div variants={fadeUp}>
                  <GlowIconBadge>
                    <Newspaper className="h-9 w-9 text-[#60A5FA]" />
                  </GlowIconBadge>
                </m.div>

                <m.h1 variants={fadeUp} className="mt-8 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] via-[#22D3EE] to-[#A78BFA]">
                    HOPn Insights & News
                  </span>
                </m.h1>

                <m.h2 variants={fadeUp} className="sr-only">
                  Technology trends, expert analyses, research, and innovation updates
                </m.h2>

                <m.p
                  variants={fadeUp}
                  className="mt-6 mx-auto max-w-4xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed"
                >
                  Stay updated with the latest technology trends, expert analyses, research findings, and news from HOPn and the wider world of innovation.
                </m.p>

                <m.p variants={fadeUp} className="mt-3 mx-auto max-w-3xl text-[hsl(var(--muted))] text-sm sm:text-base">
                  Thought leadership, research, and perspectives from HOPn experts and innovation labs.
                </m.p>

                {/* Category Filters + Search & Sort */}
                <m.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4">
                  {/* categories */}
                  <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Category filters">
                    {categories.map((c) => (
                      <ChipPill
                        key={c.key}
                        Icon={c.Icon}
                        active={active === c.key}
                        onClick={() => setActive(c.key as any)}
                      >
                        {c.label}
                      </ChipPill>
                    ))}
                  </div>

                  {/* search + sort */}
                  <div className="mx-auto w-full max-w-2xl">
                    <div className="relative">
                      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))]">
                        <Search className="h-5 w-5" />
                      </div>

                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search insights (title, author, keywords)..."
                        aria-label="Search insights"
                        className={cx(
                          "w-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-xl",
                          "pl-12 pr-12 py-4 text-sm sm:text-base text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))]",
                          "outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/40 focus:border-[hsl(var(--border))]"
                        )}
                      />

                      {/* sort popover */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div ref={sortRef} className="relative">
                          <button
                            type="button"
                            onClick={() => setSortOpen((v) => !v)}
                            aria-expanded={sortOpen}
                            aria-label="Open sort options"
                            className={cx(
                              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold",
                              "bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))] text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition",
                              "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/40"
                            )}
                          >
                            <SlidersHorizontal className="h-4 w-4 text-[hsl(var(--muted))]" />
                            <span className="hidden sm:inline">Sort</span>
                            <m.span
                              animate={{ rotate: sortOpen ? 180 : 0 }}
                              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 34 }}
                            >
                              <ChevronDown className="h-4 w-4 text-[hsl(var(--muted))]" />
                            </m.span>
                          </button>

                          <AnimatePresence>
                            {sortOpen && (
                              <m.div
                                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.985, filter: "blur(7px)" }}
                                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99, filter: "blur(7px)" }}
                                transition={reduce ? { duration: 0.12 } : { type: "spring", stiffness: 420, damping: 30, mass: 0.6 }}
                                className="absolute right-0 mt-3 w-[320px] rounded-2xl p-[1px] bg-gradient-to-b from-[hsl(var(--border))] via-[hsl(var(--border))]/60 to-transparent shadow-[0_45px_140px_rgba(0,0,0,0.40)] z-50"
                              >
                                <div className="relative rounded-2xl bg-[hsl(var(--card))]/92 backdrop-blur-2xl ring-1 ring-[hsl(var(--border))] overflow-hidden">
                                  <div className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,hsl(var(--fg))/0.18_1px,transparent_0)] [background-size:10px_10px]" />
                                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                                    <div className="flex items-center gap-2 text-[hsl(var(--fg))]">
                                      <Filter className="h-4 w-4 text-[hsl(var(--muted))]" />
                                      <span className="text-xs font-semibold tracking-[0.14em] uppercase">Sort</span>
                                    </div>
                                    <button
                                      onClick={() => setSortOpen(false)}
                                      className="inline-flex items-center gap-1 text-xs text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] transition"
                                      aria-label="Close sort options"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>

                                  <div className="px-2 pb-3">
                                    <div className="px-2 text-[11px] text-[hsl(var(--muted))] font-semibold tracking-[0.14em] uppercase">
                                      Sort by
                                    </div>

                                    <div className="mt-2 grid gap-1">
                                      {([
                                        { key: "latest", label: "Latest First" },
                                        { key: "oldest", label: "Oldest First" },
                                        { key: "mostRead", label: "Most Read" },
                                        { key: "editorsPicks", label: "Editor’s Picks" },
                                      ] as const).map((o) => (
                                        <button
                                          key={o.key}
                                          onClick={() => {
                                            setSort(o.key);
                                            setSortOpen(false);
                                          }}
                                          className={cx(
                                            "w-full text-left rounded-xl px-3 py-3 text-sm font-semibold transition",
                                            "hover:bg-[hsl(var(--card))]/85 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30",
                                            sort === o.key
                                              ? "bg-[hsl(var(--card))]/90 text-[hsl(var(--fg))]"
                                              : "text-[hsl(var(--muted))]"
                                          )}
                                        >
                                          {o.label}
                                        </button>
                                      ))}
                                    </div>

                                    <div className="mt-3 h-px bg-[hsl(var(--border))]" />
                                    <div className="mt-3 px-2 text-xs text-[hsl(var(--muted))]">
                                      Showing{" "}
                                      <span className="text-[hsl(var(--fg))] font-semibold">{filtered.length}</span>{" "}
                                      result{filtered.length === 1 ? "" : "s"}
                                    </div>
                                  </div>
                                </div>
                              </m.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </m.div>
              </m.div>
            </div>
          </section>

          {/* GRID */}
          <section className="relative z-10 pb-10" aria-label="Insights grid">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {visible.length === 0 ? (
                <div className="mx-auto max-w-2xl rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/60 backdrop-blur-xl p-8 text-center text-[hsl(var(--muted))]">
                  No insights match your filters. Try a different category or search term.
                </div>
              ) : (
                <m.div
                  key={`${active}-${query}-${sort}`}
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-120px" }}
                  className="grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch"
                >
                  {visible.map((it, i) => (
                    <InsightCard key={`${it.id}-${it.slug}-${i}`} item={it} index={i} />
                  ))}
                </m.div>
              )}

              {/* Load more */}
              {canLoadMore ? (
                <div className="mt-14">
                  <LoadMoreButton
                    loading={loadingMore}
                    onClick={() => {
                      if (loadingMore) return;
                      setLoadingMore(true);
                      // Replace with real fetch if you move to server pagination.
                      window.setTimeout(() => {
                        setVisibleCount((n) => n + 6);
                        setLoadingMore(false);
                      }, 450);
                    }}
                  />
                </div>
              ) : null}

              {/* Newsletter */}
              <div className="mt-16">
                <NewsletterSection />
              </div>

              {/* Final CTA */}
              <div className="mt-16">
                <FinalCTA />
              </div>
            </div>
          </section>

          <div className="relative z-10 h-16" />

          {/* GLOBAL STYLES */}
          <style>{`
            .insights-scope{
              --bg: 210 40% 98%;
              --fg: 222 47% 11%;
              --muted: 215 16% 38%;
              --card: 0 0% 100%;
              --border: 215 20% 88%;

              --accent: 191 92% 45%;
              --ring: 191 92% 45%;

              --btn: 0 0% 100%;

              --vignette: 0.08;
              --grid: 0.05;
            }

            .dark .insights-scope{
              --bg: 224 46% 6%;
              --fg: 210 40% 98%;
              --muted: 215 20% 70%;
              --card: 224 46% 10%;
              --border: 224 42% 16%;

              --accent: 191 92% 55%;
              --ring: 191 92% 55%;

              --btn: 224 46% 12%;

              --vignette: 0.78;
              --grid: 0.05;
            }

            .insights-grid {
              background-image:
                linear-gradient(to right, hsl(var(--fg) / 0.12) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--fg) / 0.08) 1px, transparent 1px);
              background-size: 110px 110px;
              opacity: var(--grid);
            }
            @keyframes gridShift {
              0% { background-position: 0px 0px; }
              100% { background-position: 96px 96px; }
            }
            .animate-gridShift {
              animation: gridShift 18s linear infinite;
            }

            .noise {
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
              background-size: 220px 220px;
              animation: noiseMove 10s steps(10) infinite;
            }
            @keyframes noiseMove {
              0% { transform: translate3d(0, 0, 0); }
              25% { transform: translate3d(-2%, 1%, 0); }
              50% { transform: translate3d(1%, -2%, 0); }
              75% { transform: translate3d(2%, 2%, 0); }
              100% { transform: translate3d(0, 0, 0); }
            }
          `}</style>
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
