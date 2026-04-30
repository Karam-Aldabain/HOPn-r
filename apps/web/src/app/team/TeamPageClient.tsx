"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
} from "framer-motion";
import {
  Users,
  Linkedin,
  Mail,
  Briefcase,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { buildCmsUrl, normalizeCollection, resolveCmsMediaUrl } from "@/lib/cms-client";
import { useCmsPageData } from "@/lib/use-cms-page-data";

/**
 * âœ… TEAM PAGE â€” Inspired by your Portfolio page (same color system + theme-safe bg)
 * - Real light mode + premium dark mode
 * - Same neo-card language, grid, vignette, orbs
 * - Avatar fallback + smooth motion
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
 * Theme-safe NeoCard (same language as Portfolio page)
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

/**
 * Avatar (no Next/Image optimizer issues)
 */
function Avatar({
  src,
  alt,
  name,
  size = 112,
}: {
  src: string;
  alt: string;
  name: string;
  size?: number;
}) {
  const [imgOk, setImgOk] = useState(true);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div
      className="relative grid place-items-center rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,0.14),transparent_55%)]" />
      <div className="absolute inset-0 rounded-full ring-2 ring-[hsl(var(--accent))]/25 bg-[hsl(var(--card))]/40 backdrop-blur-xl" />

      {!imgOk ? (
        <div className="relative font-black text-2xl tracking-tight text-[hsl(var(--fg))]">
          {initials}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="relative h-full w-full object-cover"
          onError={() => setImgOk(false)}
        />
      )}
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

/* ------------------------------ team types ------------------------------ */

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  highlights?: string[];
  featured?: boolean;
};
export type { TeamMember };

export type TeamPageContent = {
  hero?: { title?: string; subtitle?: string };
  chips?: string[];
  cta?: {
    title?: string;
    body?: string;
    buttonLabel?: string;
    buttonHref?: string;
    tags?: string[];
  };
};

export const DEFAULT_TEAM_CONTENT: TeamPageContent = {
  hero: {
    title: "Meet Our Hard Working Team",
    subtitle:
      "The passionate minds and experienced professionals driving innovation and delivering excellence at HOPn.",
  },
  chips: ["Innovation-led", "Production-grade", "Secure-by-design", "Leadership"],
  cta: {
    title: "Interested in Joining Our Team?",
    body:
      "Weâ€™re always looking for builders and problem-solvers. Explore opportunities and help ship production-grade products with real-world impact.",
    buttonLabel: "View Open Positions",
    buttonHref: "/carres",
    tags: ["Remote-friendly", "Fast-paced", "Mentorship", "Real-world impact"],
  },
};

type CmsTeamMember = {
  name: string;
  role?: string;
  bio?: string;
  linkedin_url?: string;
  photo?: { url?: string } | string | null;
};

/* ------------------------------ team card ------------------------------- */

function TeamCard({ member }: { member: TeamMember }) {
  const reduce = useReducedMotion();

  return (
    <m.article
      variants={fadeUp}
      transition={
        reduce ? { duration: 0.01 } : { type: "spring", stiffness: 320, damping: 26 }
      }
      className="h-full lg:col-span-1"
    >
      <NeoCard className="h-full flex flex-col">
        {/* Top â€œmediaâ€ strip like portfolio cards */}
        <div className="relative overflow-hidden rounded-t-[26px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.14),transparent_55%),linear-gradient(180deg,rgba(0,0,0,var(--img-top)),rgba(0,0,0,0.00),rgba(0,0,0,var(--img-bottom)))]" />
          <div className="relative px-7 pt-8 pb-6 flex items-center gap-5">
            <m.div
              initial={false}
              animate={reduce ? undefined : { y: [0, -2.5, 0] }}
              transition={
                reduce ? { duration: 0.01 } : { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <Avatar src={member.image} alt={member.name} name={member.name} size={92} />
            </m.div>

            <div className="min-w-0">
              <div className="text-[11px] font-extrabold tracking-[0.22em] text-[hsl(var(--accent))]/80">
                TEAM
              </div>

              <h3 className="mt-2 text-2xl sm:text-3xl font-black text-[hsl(var(--fg))] leading-tight">
                {member.name}
              </h3>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--chip-cyan))] text-[hsl(var(--accent))] ring-1 ring-[hsl(var(--chip-cyan-ring))] px-3 py-1.5 text-sm font-extrabold">
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]/80" />
                {member.role}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Body */}
        <div className="relative p-6 sm:p-7 flex-1 flex flex-col">
          <p className="text-[hsl(var(--muted))] leading-relaxed">{member.bio}</p>

          {member.highlights?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {member.highlights.map((h) => (
                <TagPill key={h}>{h}</TagPill>
              ))}
            </div>
          ) : null}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href={member.linkedin || "#"}
              aria-disabled={!member.linkedin}
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition",
                "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]",
                member.linkedin
                  ? "border-[hsl(var(--border))] bg-[hsl(var(--btn))] hover:bg-[hsl(var(--accent))]/10 text-[hsl(var(--fg))]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--btn))] text-[hsl(var(--muted))] cursor-not-allowed"
              )}
            >
              <Linkedin className="h-4 w-4 text-[hsl(var(--accent))]" />
              LinkedIn
            </Link>

            <Link
              href={member.email ? `mailto:${member.email}` : "#"}
              aria-disabled={!member.email}
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-extrabold transition",
                "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]",
                member.email
                  ? "border-[hsl(var(--border))] bg-[hsl(var(--btn))] hover:bg-[hsl(var(--accent))]/10 text-[hsl(var(--fg))]"
                  : "border-[hsl(var(--border))] bg-[hsl(var(--btn))] text-[hsl(var(--muted))] cursor-not-allowed"
              )}
            >
              <Mail className="h-4 w-4 text-[hsl(var(--accent))]" />
              Email
            </Link>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </NeoCard>
    </m.article>
  );
}

/* ---------------------------------- CTA --------------------------------- */

function CTA() {
  const reduce = useReducedMotion();
  const pageContent = useCmsPageData("team", DEFAULT_TEAM_CONTENT);
  const cta = pageContent.cta || DEFAULT_TEAM_CONTENT.cta || {};

  return (
    <m.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-140px" }}
      transition={reduce ? { duration: 0.01 } : { type: "spring", stiffness: 260, damping: 26 }}
      className="relative z-10 py-14 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <NeoCard className="p-10 sm:p-12 text-center" interactive={!reduce}>
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-[hsl(var(--accent))]/12 blur-[80px]" />
            <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[90px]" />
          </div>

          <div className="relative">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
              <Briefcase className="h-8 w-8 text-[hsl(var(--accent))]" />
            </div>

            <h3 className="text-3xl sm:text-5xl font-black text-[hsl(var(--fg))]">
              {cta.title || "Interested in Joining Our Team?"}
            </h3>

            <p className="mt-5 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
              {cta.body ||
                "Weâ€™re always looking for builders and problem-solvers. Explore opportunities and help ship production-grade products with real-world impact."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={cta.buttonHref || "/carres"}
                className={cx(
                  "group inline-flex items-center justify-center gap-2 rounded-xl",
                  "bg-[hsl(var(--accent))] px-7 py-4 text-sm sm:text-base font-extrabold text-[hsl(var(--accent-ink))]",
                  "shadow-[0_18px_80px_rgba(34,211,238,0.18)] hover:brightness-110 transition"
                )}
              >
                {cta.buttonLabel || "View Open Positions"}
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {(cta.tags?.length ? cta.tags : DEFAULT_TEAM_CONTENT.cta?.tags || []).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[hsl(var(--chip))] text-[hsl(var(--muted))] ring-1 ring-[hsl(var(--border))] px-4 py-2 text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </NeoCard>
      </div>
    </m.section>
  );
}

/* ---------------------------------- page --------------------------------- */

export default function TeamPageClient({ cmsTeam }: { cmsTeam?: TeamMember[] }) {
  const reduce = useReducedMotion();
  const pageContent = useCmsPageData("team", DEFAULT_TEAM_CONTENT);

  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 1200], [0, 120]);
  const orbY2 = useTransform(scrollY, [0, 1200], [0, -90]);
  const sOrbY = useSpring(orbY, { stiffness: 120, damping: 26 });
  const sOrbY2 = useSpring(orbY2, { stiffness: 120, damping: 26 });

  const fallbackTeam = useMemo<TeamMember[]>(
    () => [
      {
        name: "Prof. Dr. Ebada",
        role: "CEO",
        bio: "A visionary leader driving HOPnâ€™s strategic direction and fostering a culture of innovation to achieve transformative technological advancements.",
        image: "/team/ebada.jpg",
        linkedin: "#",
        email: "info@hopn.com",
        highlights: ["Strategy & innovation", "Ecosystem partnerships", "Execution at scale"],
        featured: true,
      },
      {
        name: "Dr. Nour Howeidi",
        role: "CGO",
        bio: "A visionary strategist and entrepreneurial leader dedicated to building growth systems that transform business performance and drive sustainable innovation.",
        image: "/team/nour.jpg",
        linkedin: "#",
        email: "info@hopn.com",
        highlights: ["Growth strategy", "Go-to-market", "Customer value creation"],
      },
    ],
    []
  );
  const initialCmsTeam = useRef(cmsTeam);
  const [team, setTeam] = useState<TeamMember[]>(cmsTeam?.length ? cmsTeam : fallbackTeam);
  const displayTeam = team.length ? team : fallbackTeam;

  useEffect(() => {
    if (initialCmsTeam.current?.length) return;
    let mounted = true;
    fetch(buildCmsUrl("/team?visible=true"))
      .then((res) => res.json())
      .then((payload) => {
        const raw = payload?.data ?? payload;
        const items = Array.isArray(raw)
          ? (raw as CmsTeamMember[])
          : normalizeCollection<CmsTeamMember>({ data: raw } as any);

        if (!items.length || !mounted) {
          if (mounted) setTeam(fallbackTeam);
          return;
        }

        const mapped = items.map((m) => {
          const rawPhoto = (m as any).photo;
          const photoUrl = resolveCmsMediaUrl(
            typeof rawPhoto === "string" ? rawPhoto : rawPhoto?.url || ""
          );
          return {
            name: m.name || "Team Member",
            role: m.role || "Team Member",
            bio: m.bio || "Bio coming soon.",
            image: photoUrl || "/team/ebada.jpg",
            linkedin: (m as any).linkedin_url || (m as any).linkedinUrl || "#",
            email: "info@hopn.com",
            highlights: [],
          } as TeamMember;
        });

        setTeam(mapped.length ? mapped : fallbackTeam);
      })
      .catch(() => {
        if (mounted) setTeam(fallbackTeam);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion={reduce ? "always" : "never"}>
        <main className="relative min-h-screen text-[hsl(var(--fg))] bg-[hsl(var(--bg))]">
          {/* Theme system (same spirit as Portfolio page) */}
          <style>{`
            :root {
              /* Core palette */
              --bg: 210 40% 98%;
              --fg: 222 47% 11%;
              --muted: 215 16% 38%;
              --card: 0 0% 100%;
              --border: 215 20% 88%;

              /* Accents (same vibe as your portfolio) */
              --accent: 191 92% 45%;
              --accent-1: 191 92% 45%;
              --accent-2: 245 83% 60%;
              --accent-ink: 210 40% 98%;
              --ring: 191 92% 45%;

              /* Neomorphism */
              --neo-from: 0 0% 100%;
              --neo-to: 210 40% 96%;
              --neo-sheen: 191 92% 45%;
              --neo-grid: 215 20% 50%;
              --shadow: 0.14;
              --sheen: 0.55;

              /* Chips / tags */
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

              /* Image overlay tuning */
              --img-top: 0.10;
              --img-bottom: 0.08;

              /* Background tuning */
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
              --sheen: 0.70;

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

              --img-top: 0.34;
              --img-bottom: 0.26;

              --vignette: 0.78;
              --grid: 0.05;
            }
          `}</style>

          {/* BACKGROUND SYSTEM (adapts to theme) */}
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
                    icon={<Users className="h-8 w-8 text-[hsl(var(--accent))]" />}
                    title={pageContent.hero?.title || DEFAULT_TEAM_CONTENT.hero?.title || "Meet Our Hard Working Team"}
                    subtitle={
                      pageContent.hero?.subtitle ||
                      DEFAULT_TEAM_CONTENT.hero?.subtitle ||
                      "The passionate minds and experienced professionals driving innovation and delivering excellence at HOPn."
                    }
                  />
                </m.div>

                <m.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-2">
                  {(pageContent.chips?.length ? pageContent.chips : DEFAULT_TEAM_CONTENT.chips || []).map(
                    (chip, idx) => (
                      <Chip key={`${chip}-${idx}`} tone={idx % 3 === 1 ? "indigo" : idx % 3 === 2 ? "slate" : "cyan"}>
                        {chip}
                      </Chip>
                    )
                  )}
                </m.div>
              </m.div>
            </div>
          </section>

          {/* TEAM GRID */}
          <section className="relative z-10 pb-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <m.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-120px" }}
                className="grid items-stretch gap-7 lg:grid-cols-2"
              >
                {displayTeam.map((member) => (
                  <TeamCard key={member.name} member={member} />
                ))}
              </m.div>
            </div>
          </section>

          <CTA />

          <div className="relative z-10 h-10" />
        </main>
      </MotionConfig>
    </LazyMotion>
  );
}
