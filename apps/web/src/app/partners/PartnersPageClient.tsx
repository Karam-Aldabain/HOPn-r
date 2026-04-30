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
  useTransform,
} from "framer-motion";
import {
  HeartHandshake,
  Bolt,
  Briefcase,
  GraduationCap,
  Leaf,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Network,
  Rocket,
} from "lucide-react";
import { fetchCms, normalizeCollection, resolveCmsMediaUrl } from "@/lib/cms-client";

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
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
  tone?: "cyan" | "indigo" | "slate";
}) {
  const toneCls =
    tone === "indigo"
      ? "bg-[hsl(var(--chip-indigo))] text-[hsl(var(--chip-indigo-fg))] ring-1 ring-[hsl(var(--chip-indigo-ring))]"
      : tone === "slate"
        ? "bg-[hsl(var(--chip))] text-[hsl(var(--muted))] ring-1 ring-[hsl(var(--border))]"
        : "bg-[hsl(var(--chip-cyan))] text-[hsl(var(--accent))] ring-1 ring-[hsl(var(--chip-cyan-ring))]";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide",
        toneCls
      )}
    >
      <Sparkles className="h-3.5 w-3.5 opacity-80" />
      {children}
    </span>
  );
}

/** One unified card treatment (same palette as your other pages) */
function UnifiedCard({
  children,
  className = "",
  interactive = true,
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
}) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-[30px] border border-[hsl(var(--border))]",
        "shadow-[0_28px_120px_rgba(0,0,0,var(--shadow))]",
        "bg-[radial-gradient(circle_at_14%_18%,hsl(var(--accent)/0.30),transparent_55%),radial-gradient(circle_at_86%_22%,hsl(var(--accent-2)/0.22),transparent_60%),linear-gradient(135deg,hsl(var(--neo-from))/0.32,hsl(var(--neo-to))/0.28,hsl(var(--neo-to))/0.22)]",
        // gloss + grid
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-[var(--sheen)]",
        "before:bg-[radial-gradient(circle_at_22%_0%,hsl(var(--neo-sheen)/0.18),transparent_55%)]",
        "after:pointer-events-none after:absolute after:inset-0 after:opacity-[0.055]",
        "after:[background-image:linear-gradient(to_right,hsl(var(--neo-grid)/0.28)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--neo-grid)/0.18)_1px,transparent_1px)]",
        "after:[background-size:92px_92px]",
        glow &&
          "ring-1 ring-transparent hover:ring-[hsl(var(--ring))]/25 hover:shadow-[0_30px_140px_rgba(34,211,238,0.10)]",
        interactive &&
          "transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.01]",
        className
      )}
    >
      {/* animated sheen */}
      <div className="pointer-events-none absolute -inset-[40%] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.10),transparent)] blur-md" />
      </div>
      {children}
    </div>
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
    <div className={cx("rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70", className)}>
      {children}
    </div>
  );
}

/**
 * ✅ Fixes your image problem by avoiding Next/Image optimizer entirely.
 * - Uses plain <img src="/..."> from /public
 * - If the file is missing, it auto-falls back to a nice inline SVG placeholder (no broken UI)
 *
 * Put your files in:
 *   /public/partners/innovatech.jpg
 *   /public/partners/future-finance.jpg
 *   /public/partners/global-university.jpg
 *   /public/partners/ecosolutions.jpg
 */
function SafeImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const placeholder =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="rgba(14,116,144,0.55)"/>
            <stop offset="0.55" stop-color="rgba(37,99,235,0.35)"/>
            <stop offset="1" stop-color="rgba(30,64,175,0.25)"/>
          </linearGradient>
          <pattern id="p" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill="rgba(255,255,255,0.18)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <rect width="100%" height="100%" fill="url(#p)" opacity="0.55"/>
        <g opacity="0.9">
          <rect x="90" y="120" width="250" height="330" rx="28" fill="rgba(255,255,255,0.09)"/>
          <rect x="275" y="145" width="270" height="330" rx="28" fill="rgba(255,255,255,0.07)"/>
          <rect x="455" y="110" width="270" height="360" rx="28" fill="rgba(255,255,255,0.06)"/>
        </g>
      </svg>
    `);

  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc(placeholder)}
    />
  );
}

type Partner = {
  name: string;
  role: string;
  desc: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
  accent: "cyan" | "indigo";
  logoSrc: string;
};

type CmsPartner = {
  id: number;
  name: string;
  logo?: { url?: string } | string | null;
  url?: string | null;
  description?: string | null;
  partnershipType?: string | null;
  visible?: boolean | null;
  order?: number | null;
};

function pickPartnerIcon(role: string) {
  const hay = role.toLowerCase();
  if (hay.includes("academic") || hay.includes("research") || hay.includes("university")) {
    return GraduationCap;
  }
  if (hay.includes("sustain") || hay.includes("impact") || hay.includes("eco")) {
    return Leaf;
  }
  if (hay.includes("security") || hay.includes("trust")) {
    return ShieldCheck;
  }
  if (hay.includes("network") || hay.includes("platform")) {
    return Network;
  }
  if (hay.includes("launch") || hay.includes("growth")) {
    return Rocket;
  }
  if (hay.includes("tech") || hay.includes("ai") || hay.includes("innovation")) {
    return Bolt;
  }
  return Briefcase;
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
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-1))] via-[hsl(var(--accent-2))] to-[hsl(var(--accent-1))]">
          {title}
        </span>
      </div>
      {subtitle ? (
        <div className="mt-4 text-[hsl(var(--muted))] max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

function PartnerCard({ p, reduce }: { p: Partner; reduce: boolean }) {
  const isCyan = p.accent === "cyan";

  return (
    <m.div
      variants={fadeUp}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className="group"
      whileHover={reduce ? undefined : { y: -6 }}
    >
      <UnifiedCard className="p-6 sm:p-7" interactive={!reduce}>
        <div className="flex items-center justify-between">
          {/* big round icon like your screenshot */}
          <div
            className={cx(
              "grid h-16 w-16 place-items-center rounded-full ring-1",
              isCyan
                ? "bg-[hsl(var(--accent))]/10 ring-[hsl(var(--ring))]/20"
                : "bg-[hsl(var(--accent-2))]/10 ring-[hsl(var(--ring))]/20"
            )}
          >
            <p.Icon className={cx("h-7 w-7", isCyan ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--accent-2))]")} />
          </div>

          {/* subtle moving dot */}
          <m.div
            aria-hidden
            className={cx(
              "h-2.5 w-2.5 rounded-full",
              isCyan ? "bg-[hsl(var(--accent))]/70" : "bg-[hsl(var(--accent-2))]/70"
            )}
            animate={reduce ? undefined : { opacity: [0.35, 1, 0.35], scale: [1, 1.25, 1] }}
            transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* center thumbnail like screenshot */}
        <div className="mt-6 grid place-items-center">
          <div className="relative">
            <div
              className={cx(
                "absolute -inset-4 rounded-full blur-2xl opacity-35",
                isCyan ? "bg-[hsl(var(--accent))]/20" : "bg-[hsl(var(--accent-2))]/20"
              )}
            />
            <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-2">
              <SafeImage
                src={p.logoSrc}
                alt={p.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-2xl font-black text-[hsl(var(--fg))]">{p.name}</div>
          <div
            className={cx(
              "mt-1 text-sm font-bold",
              isCyan ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--accent-2))]"
            )}
          >
            {p.role}
          </div>

          <div className="mt-5 text-[hsl(var(--muted))] leading-relaxed text-base">
            {p.desc}
          </div>
        </div>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />

        <div className="mt-6 flex items-center justify-center">
          <Link
            href={p.href}
            className={cx(
              "group/btn inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold",
              "border border-[hsl(var(--border))] bg-[hsl(var(--btn))] text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition",
              "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/20"
            )}
          >
            Visit Website
            <ExternalLink className="h-4 w-4 opacity-85 transition group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </UnifiedCard>
    </m.div>
  );
}

export default function PartnersPage() {
  const reduce = useReducedMotion();

  // subtle parallax in hero
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 900], [0, 90]);
  const orbY2 = useTransform(scrollY, [0, 900], [0, -70]);

  const fallbackPartners = useMemo<Partner[]>(
    () => [
      {
        name: "Innovatech Corp.",
        role: "Strategic Technology Partner",
        desc: "Collaborating on pioneering AI research and co-developing next-generation intelligent systems for enterprise applications.",
        href: "#",
        Icon: Bolt,
        accent: "cyan",
        logoSrc: "/partners/innovatech.jpg",
      },
      {
        name: "Future Finance Group",
        role: "FinTech Ecosystem Collaborator",
        desc: "Jointly building and integrating advanced financial solutions, focusing on DeFi, secure payments, and regulatory technology for a dynamic market.",
        href: "#",
        Icon: Briefcase,
        accent: "indigo",
        logoSrc: "/partners/future-finance.jpg",
      },
      {
        name: "Global University Network Initiative",
        role: "Academic & Research Partner",
        desc: "Partnering on cutting-edge educational programs, joint R&D initiatives, and fostering talent development in emerging tech fields like quantum computing and biotech.",
        href: "#",
        Icon: GraduationCap,
        accent: "cyan",
        logoSrc: "/partners/global-university.jpg",
      },
      {
        name: "EcoSolutions International",
        role: "Sustainability & Impact Partner",
        desc: "Co-creating technology solutions that champion environmental sustainability, promote circular economies, and enhance resource efficiency globally.",
        href: "#",
        Icon: Leaf,
        accent: "indigo",
        logoSrc: "/partners/ecosolutions.jpg",
      },
    ],
    []
  );
  const [partners, setPartners] = useState<Partner[]>(fallbackPartners);
  const displayPartners = partners.length ? partners : fallbackPartners;

  useEffect(() => {
    let mounted = true;
    fetchCms<CmsPartner[]>("/partners?visible=true")
      .then((res) => {
        const raw = (res as any)?.data ?? res;
        const items = Array.isArray(raw) ? (raw as CmsPartner[]) : normalizeCollection<CmsPartner>(res as any);
        if (!items.length || !mounted) {
          if (mounted) setPartners(fallbackPartners);
          return;
        }

        const mapped: Partner[] = items.map((p, idx) => {
          const role = p.partnershipType || "Partner";
          const rawLogo = p.logo;
          const logoUrl = typeof rawLogo === "string" ? rawLogo : rawLogo?.url || "";
          const logoSrc = logoUrl ? resolveCmsMediaUrl(logoUrl) : "/partners/innovatech.jpg";
          return {
            name: p.name || "Partner",
            role,
            desc: p.description || "Partnering with HOPn to build meaningful outcomes.",
            href: p.url || "#",
            Icon: pickPartnerIcon(role),
            accent: idx % 2 === 0 ? "cyan" : "indigo",
            logoSrc,
          };
        });

        setPartners(mapped.length ? mapped : fallbackPartners);
      })
      .catch(() => {
        if (mounted) setPartners(fallbackPartners);
      });

    return () => {
      mounted = false;
    };
  }, [fallbackPartners]);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={reduce ? "always" : "never"}>
        <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
          {/* BACKGROUND SYSTEM */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 [background-image:linear-gradient(to_right,hsl(var(--fg)/0.12)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--fg)/0.08)_1px,transparent_1px)] [background-size:100px_100px]"
              style={{ opacity: "var(--grid)" as never }}
            />

            <m.div
              aria-hidden="true"
              style={{ y: orbY }}
              className="absolute -top-52 left-1/4 h-[620px] w-[620px] rounded-full bg-[hsl(var(--accent))]/12 blur-[160px]"
              animate={reduce ? undefined : { x: [0, 14, 0], scale: [1, 1.03, 1] }}
              transition={reduce ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <m.div
              aria-hidden="true"
              style={{ y: orbY2 }}
              className="absolute top-0 -right-64 h-[760px] w-[760px] rounded-full bg-[hsl(var(--accent-2))]/12 blur-[180px]"
              animate={reduce ? undefined : { x: [0, -16, 0], scale: [1, 1.02, 1] }}
              transition={reduce ? undefined : { duration: 12, repeat: Infinity, ease: "easeInOut" }}
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
              <m.div variants={stagger} initial="hidden" animate="show" className="text-center">
                <m.div
                  variants={fadeUp}
                  className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[hsl(var(--accent))]/12 ring-1 ring-[hsl(var(--ring))]/25"
                >
                  <HeartHandshake className="h-8 w-8 text-[hsl(var(--accent))]" />
                </m.div>

                <m.h1 variants={fadeUp} className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-1))] via-[hsl(var(--accent-2))] to-[hsl(var(--accent-1))]">
                    Our Valued Partners
                  </span>
                </m.h1>

                <m.p variants={fadeUp} className="mt-5 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                  At HOPn, we believe in the power of synergy. We collaborate with leading organizations
                  worldwide to drive innovation, create exceptional value, and achieve shared success for a better future.
                </m.p>

                <m.div variants={fadeUp} className="mt-7 flex flex-wrap justify-center gap-2">
                  <Chip tone="cyan">Co-build</Chip>
                  <Chip tone="indigo">Research</Chip>
                  <Chip tone="cyan">FinTech</Chip>
                  <Chip tone="slate">Sustainability</Chip>
                </m.div>

                {/* quick "alive" strip */}
                <m.div
                  variants={fadeUp}
                  className="mt-10 mx-auto max-w-4xl"
                >
                  <UnifiedCard interactive={false} className="p-5 sm:p-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { k: "Secure collaboration", v: "Shared governance & trust", Icon: ShieldCheck },
                        { k: "Fast integration", v: "APIs + delivery playbooks", Icon: Network },
                        { k: "Measured outcomes", v: "Innovation -> real-world impact", Icon: Rocket },
                      ].map((x) => (
                        <Surface key={x.k} className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))]">
                              <x.Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-extrabold text-[hsl(var(--fg))]">{x.k}</div>
                              <div className="text-sm text-[hsl(var(--muted))]">{x.v}</div>
                            </div>
                          </div>
                        </Surface>
                      ))}
                    </div>
                  </UnifiedCard>
                </m.div>
              </m.div>
            </div>
          </section>

          {/* PARTNERS GRID */}
          <section className="relative z-10 py-12 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-120px" }}
              >
                <SectionTitle
                  kicker="ECOSYSTEM • COLLABORATION • IMPACT"
                  title="Built with partners who raise the bar"
                  subtitle="From strategic technology alliances to academic research and sustainability collaborations — each partnership is designed to create measurable outcomes."
                />
              </m.div>

              <m.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-140px" }}
                className="mt-10 grid gap-6 lg:gap-8 lg:grid-cols-2"
              >
                {displayPartners.map((p) => (
                  <PartnerCard key={p.name} p={p} reduce={!!reduce} />
                ))}
              </m.div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative z-10 py-14 sm:py-16 pb-20 border-t border-[hsl(var(--border))]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-140px" }}
              >
                <UnifiedCard className="p-7 sm:p-10" interactive={false}>
                  <div className="text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--ring))]/20">
                      <Bolt className="h-7 w-7 text-[hsl(var(--accent))]" />
                    </div>

                    <div className="mt-5 text-3xl sm:text-4xl font-black text-[hsl(var(--fg))]">
                      Become a HOPn Partner
                    </div>

                    <div className="mt-4 mx-auto max-w-2xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                      We believe in the profound power of collaboration. If your organization shares our passion for
                      technology, innovation, and positive impact, let&apos;s explore synergistic partnership opportunities.
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                      <Link
                        href="/contact"
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-7 py-4 text-sm sm:text-base font-extrabold text-[hsl(var(--accent-ink))] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30"
                      >
                        Partner With Us
                        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                      </Link>

                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                      {["AI & Research", "FinTech", "Education", "Sustainability", "Product Co-Development"].map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-2 text-xs font-semibold text-[hsl(var(--fg))]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </UnifiedCard>
              </m.div>
            </div>
          </section>

          <div className="relative z-10 h-10" />

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

              --btn: 224 46% 10%;

              --vignette: 0.78;
              --grid: 0.05;
            }
          `}</style>
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
