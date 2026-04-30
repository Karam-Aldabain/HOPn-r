"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  GraduationCap,
  Users2,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BadgeCheck,
  BookOpen,
  Layers,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { useCmsPageData } from "@/lib/use-cms-page-data";

type Feature = {
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  tag?: string;
};

type Benefit = { text: string };

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "cyan",
  icon = true,
}: {
  children: React.ReactNode;
  tone?: "cyan" | "green" | "violet";
  icon?: boolean;
}) {
  const toneVar =
    tone === "green"
      ? "var(--tone-green)"
      : tone === "violet"
      ? "var(--tone-violet)"
      : "var(--tone-cyan)";

  const toneInkVar =
    tone === "green"
      ? "var(--tone-green-ink)"
      : tone === "violet"
      ? "var(--tone-violet-ink)"
      : "var(--tone-cyan-ink)";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide ring-1"
      )}
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
    <div className={cx("gcard group relative", className)}>
      <div className="gcard__border" />
      <div className="gcard__inner">{children}</div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -90px 0px" }}
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 260, damping: 26 }
      }
      className="text-center"
    >
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20 shadow-[0_30px_100px_rgba(34,211,238,0.12)]">
        {icon}
      </div>

      <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[hsl(var(--fg))]">
        <span className="grad-text">HOPn</span> {title}
      </h2>

      {subtitle ? (
        <p className="mt-4 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}

function OfferCard({
  item,
  index,
}: {
  item: Feature;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const Icon = item.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -110px 0px" }}
      transition={
        reduceMotion
          ? { duration: 0.01 }
          : { type: "spring", stiffness: 340, damping: 30, delay: index * 0.06 }
      }
      className="h-full"
    >
      <GradientCard className="h-full p-0">
        <div className="relative overflow-hidden rounded-[22px] p-6 sm:p-7 h-full">
          <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-[hsl(var(--accent))]/0 blur-[75px] transition group-hover:bg-[hsl(var(--accent))]/12" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.16),transparent_58%)]" />
          </div>

          <div className="relative flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 grid place-items-center">
              <Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-[hsl(var(--fg))]">
                  {item.title}
                </h3>
                {item.tag ? (
                  <Pill icon={false} tone="violet">
                    {item.tag}
                  </Pill>
                ) : null}
              </div>

              <p className="mt-2 text-[hsl(var(--muted))] leading-relaxed">{item.desc}</p>
            </div>
          </div>

          <div className="relative mt-6 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
              Learn more
            </span>
            <span className="inline-flex items-center gap-2 font-semibold text-[hsl(var(--accent))] transition group-hover:translate-x-0.5">
              Explore <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </GradientCard>
    </motion.div>
  );
}

function MiniTracks() {
  return (
    <GradientCard className="p-0">
      <div className="rounded-[22px] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[hsl(var(--muted))]">
              Learning Tracks
            </div>
            <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">EduTech Pathways</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 grid place-items-center">
            <BookOpen className="h-5 w-5 text-[hsl(var(--accent))]" />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {[
            { t: "Foundations", d: "Digital Skills for Teams", meta: "Self-paced - Guided" },
            { t: "Applied AI", d: "From Use-Case to Prototype", meta: "Cohort - Project-based" },
            { t: "Leadership", d: "Tech Strategy and Governance", meta: "Executive - Workshop" },
          ].map((e) => (
            <div
              key={e.d}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 hover:bg-[hsl(var(--card))]/75 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-[hsl(var(--muted))]">{e.t}</div>
                  <div className="mt-0.5 font-extrabold text-[hsl(var(--fg))] truncate">{e.d}</div>
                  <div className="mt-1 text-xs text-[hsl(var(--muted))]">{e.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[hsl(var(--muted))]">
          <span>Updated monthly</span>
          <span className="inline-flex items-center gap-1 text-[hsl(var(--accent))]/80">Curriculum-led</span>
        </div>
      </div>
    </GradientCard>
  );
}

function LearningLevels() {
  const reduceMotion = useReducedMotion();

  const levels = [
    {
      title: "Foundation",
      Icon: BookOpen,
      desc: "Build core digital skills and modern workflows with guided exercises and hands-on labs.",
      points: ["Beginner-friendly", "Practical projects", "Mentor support"],
    },
    {
      title: "Professional",
      Icon: Layers,
      desc: "Deepen expertise with structured modules, case studies, and industry-ready deliverables.",
      points: ["Intermediate tracks", "Real scenarios", "Portfolio outcomes"],
    },
    {
      title: "Advanced",
      Icon: ShieldCheck,
      desc: "Mastery-level programs focused on leadership, strategy, and high-impact delivery at scale.",
      points: ["Advanced topics", "Governance and quality", "Capstone demo day"],
    },
  ] as const;

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-3">
      {levels.map((l, i) => (
        <motion.div
          key={l.title}
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "0px 0px -110px 0px" }}
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : { type: "spring", stiffness: 340, damping: 30, delay: i * 0.06 }
          }
        >
          <GradientCard className="p-0">
            <div className="rounded-[22px] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 grid place-items-center">
                  <l.Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
                </div>
                <Pill icon={false} tone={i === 0 ? "green" : i === 1 ? "cyan" : "violet"}>
                  Level {i + 1}
                </Pill>
              </div>

              <div className="mt-4 text-xl font-extrabold text-[hsl(var(--fg))]">{l.title}</div>
              <div className="mt-2 text-[hsl(var(--muted))] leading-relaxed">{l.desc}</div>

              <div className="mt-5 space-y-3">
                {l.points.map((p) => (
                  <div key={p} className="flex items-center gap-3 text-[hsl(var(--muted))]">
                    <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </GradientCard>
        </motion.div>
      ))}
    </div>
  );
}

export default function EducationEventsPage() {
  const reduceMotion = useReducedMotion();

  const content = useCmsPageData("education-events", {
    hero: {
      title: "EduTech by HOPn",
      subtitle:
        "Empowering people and organizations through training programs and applied learning.",
      body:
        "We deliver high-quality training, interactive workshops, and cohort-based learning designed to grow skills, share knowledge, and build stronger communities.",
      cta: "Our Offerings",
    },
    narrative: {
      title: "Fostering Growth Through Continuous Learning",
      body: [
        "At HOPn, we champion the power of continuous learning and collaborative knowledge exchange. Our EduTech division is dedicated to providing relevant training programs, interactive workshops, and applied practice labs.",
        "We collaborate with industry experts and academic institutions to deliver engaging, up-to-date content and help individuals and organizations thrive in a fast-changing digital world.",
      ],
    },
    offeringsTitle: "Educational Offerings and Programs",
    offeringsSubtitle:
      "From corporate training to cohort programs - built to upskill, practice, and deliver.",
    offerings: [
      {
        title: "Corporate Training Programs",
        desc: "Customized training sessions and workshops designed to upskill your workforce in the latest technologies, methodologies, and digital best practices.",
        icon: "Building2",
        tag: "Team Upskilling",
      },
      {
        title: "Learning Design and Curriculum",
        desc: "Structured curricula and learning paths tailored to roles, levels, and business outcomes.",
        icon: "BookOpen",
        tag: "Outcome-based",
      },
      {
        title: "Cohorts and Bootcamps",
        desc: "Intensive, project-focused programs that help teams ship real deliverables.",
        icon: "Users2",
        tag: "Hands-on",
      },
      {
        title: "Mentorship and Enablement",
        desc: "Guided mentorship, feedback loops, and enablement to sustain long-term capability growth.",
        icon: "BadgeCheck",
        tag: "Sustained",
      },
    ],
    whyTitle: "Why Choose HOPn EduTech?",
    whyLeft: [
      { text: "Upskilled and future-ready workforce" },
      { text: "Role-based learning paths" },
      { text: "Practical skill development" },
    ],
    whyRight: [
      { text: "Applied, project-based learning" },
      { text: "Enhanced innovation culture" },
    ],
    levelsTitle: "Learning Levels",
    levelsSubtitle:
      "Clear pathways for individuals and teams - from fundamentals to advanced delivery.",
    levels: [
      {
        title: "Foundation",
        icon: "BookOpen",
        desc: "Build core digital skills and modern workflows with guided exercises and hands-on labs.",
        points: ["Beginner-friendly", "Practical projects", "Mentor support"],
      },
      {
        title: "Professional",
        icon: "Layers",
        desc: "Deepen expertise with structured modules, case studies, and industry-ready deliverables.",
        points: ["Intermediate tracks", "Real scenarios", "Portfolio outcomes"],
      },
      {
        title: "Advanced",
        icon: "ShieldCheck",
        desc: "Mastery-level programs focused on leadership, strategy, and high-impact delivery at scale.",
        points: ["Advanced topics", "Governance and quality", "Capstone demo day"],
      },
    ],
    cta: {
      title: "Join Our Learning Community",
      body:
        "Explore learning tracks and training programs to enhance your skills, expand your knowledge, and build real capability.",
      button: "View Learning Tracks",
    },
  });

  const iconMap: Record<string, any> = {
    Building2,
    BookOpen,
    Users2,
    BadgeCheck,
    Layers,
    ShieldCheck,
  };

  const offerings: Feature[] = useMemo(
    () =>
      (content.offerings || []).map((o, idx) => {
        const Icon = iconMap[(o as any).icon] || Building2;
        return { ...o, Icon } as Feature;
      }),
    [content.offerings]
  );

  const benefitsLeft: Benefit[] = useMemo(
    () => content.whyLeft || [],
    [content.whyLeft]
  );

  const benefitsRight: Benefit[] = useMemo(
    () => content.whyRight || [],
    [content.whyRight]
  );

  return (
    <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-44 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/10 blur-[95px]" />
        <div className="absolute -left-44 top-28 h-[430px] w-[430px] rounded-full bg-indigo-500/10 blur-[95px]" />
        <div className="absolute -right-56 top-52 h-[650px] w-[650px] rounded-full bg-[hsl(var(--accent))]/10 blur-[115px]" />
        <div className="absolute inset-0 opacity-[0.18] shimmer" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, transparent, rgba(0,0,0, var(--edu-vignette)))",
          }}
        />
        <div
          className="absolute inset-0 [background-image:linear-gradient(to_right,var(--edu-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--edu-grid)_1px,transparent_1px)] [background-size:56px_56px]"
          style={{ opacity: "var(--edu-grid-opacity)" as any }}
        />
      </div>

      {/* HERO */}
      <section className="relative z-10 pt-16 sm:pt-20 pb-12 border-b border-[hsl(var(--border))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { type: "spring", stiffness: 260, damping: 26 }
              }
            >
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="cyan">Education</Pill>
                <Pill tone="green">Workshops</Pill>
                <Pill tone="violet">Learning Programs</Pill>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20 shadow-[0_30px_100px_rgba(34,211,238,0.14)]">
                  <GraduationCap className="h-9 w-9 text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                    <span className="grad-text">{content.hero.title.split(" ")[0]}</span>{" "}
                    <span className="text-[hsl(var(--fg))]">
                      {content.hero.title.split(" ").slice(1).join(" ")}
                    </span>
                  </h1>
                  <p className="mt-2 text-[hsl(var(--muted))] text-base sm:text-lg">
                    {content.hero.subtitle}
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                {content.hero.body}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="#offerings"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-bold text-[hsl(var(--accent-ink))] shadow-[0_20px_65px_rgba(34,211,238,0.25)] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                >
                  {content.hero.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--muted))]">
                <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  Skills you can apply
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-2">
                  <Globe className="h-4 w-4 text-[hsl(var(--accent))]/80" />
                  Community + cohorts
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-violet-200/80" />
                  Built for quality
                </span>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { type: "spring", stiffness: 260, damping: 26, delay: 0.1 }
              }
            >
              <div className="relative">
                <div className="absolute -inset-6 -z-10 rounded-[36px] bg-[hsl(var(--accent))]/10 blur-[55px]" />
                <MiniTracks />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="relative z-10 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -110px 0px" }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { type: "spring", stiffness: 260, damping: 26 }
            }
          >
            <GradientCard className="p-0">
              <div className="relative overflow-hidden rounded-[28px] px-6 py-10 sm:px-10 sm:py-12">
                <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/12 blur-[70px]" />
                <div className="pointer-events-none absolute -bottom-44 right-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-[95px]" />

                <h2 className="text-center text-2xl sm:text-3xl font-black text-[hsl(var(--accent))]">
                  {content.narrative.title}
                </h2>

                <div className="mt-8 space-y-6 text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                  {(content.narrative.body || []).map((p: string) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <Pill tone="cyan">Practical</Pill>
                  <Pill tone="green">Interactive</Pill>
                  <Pill tone="violet">Industry-connected</Pill>
                </div>
              </div>
            </GradientCard>
          </motion.div>
        </div>
      </section>

      {/* Offerings */}
      <section id="offerings" className="relative z-10 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            icon={<GraduationCap className="h-9 w-9 text-[hsl(var(--accent))]" />}
            title={content.offeringsTitle}
            subtitle={content.offeringsSubtitle}
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {offerings.map((o, i) => (
              <OfferCard key={o.title} item={o} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="relative z-10 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -110px 0px" }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { type: "spring", stiffness: 260, damping: 26 }
            }
          >
            <GradientCard className="p-0">
              <div className="relative overflow-hidden rounded-[28px] px-6 py-10 sm:px-10 sm:py-12">
                <h3 className="text-center text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
                  {content.whyTitle.replace("HOPn EduTech", "")}{" "}
                  <span className="grad-text">HOPn EduTech</span>?
                </h3>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  <div className="space-y-5">
                    {benefitsLeft.map((b) => (
                      <div key={b.text} className="flex items-center gap-3 text-[hsl(var(--muted))]">
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                        <span className="text-base sm:text-lg">{b.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-5">
                    {benefitsRight.map((b) => (
                      <div key={b.text} className="flex items-center gap-3 text-[hsl(var(--muted))]">
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                        <span className="text-base sm:text-lg">{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-center gap-3 text-[hsl(var(--muted))] text-sm">
                  <ShieldCheck className="h-4 w-4 text-[hsl(var(--accent))]/70" />
                  Built for outcomes, not just attendance.
                </div>
              </div>
            </GradientCard>
          </motion.div>
        </div>
      </section>

      {/* Learning Levels */}
      <section className="relative z-10 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            icon={<Layers className="h-9 w-9 text-[hsl(var(--accent))]" />}
            title={content.levelsTitle}
            subtitle={content.levelsSubtitle}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {(content.levels || []).map((l: any, i: number) => {
              const Icon = iconMap[l.icon] || BookOpen;
              return (
                <motion.div
                  key={l.title}
                  initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "0px 0px -110px 0px" }}
                  transition={
                    reduceMotion
                      ? { duration: 0.01 }
                      : { type: "spring", stiffness: 340, damping: 30, delay: i * 0.06 }
                  }
                >
                  <GradientCard className="p-0">
                    <div className="rounded-[22px] p-6 sm:p-7">
                      <div className="flex items-start justify-between gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/15 grid place-items-center">
                          <Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
                        </div>
                        <Pill icon={false} tone={i === 0 ? "green" : i === 1 ? "cyan" : "violet"}>
                          Level {i + 1}
                        </Pill>
                      </div>

                      <div className="mt-4 text-xl font-extrabold text-[hsl(var(--fg))]">{l.title}</div>
                      <div className="mt-2 text-[hsl(var(--muted))] leading-relaxed">{l.desc}</div>

                      <div className="mt-5 space-y-3">
                        {(l.points || []).map((p: string) => (
                          <div key={p} className="flex items-center gap-3 text-[hsl(var(--muted))]">
                            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GradientCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative z-10 py-16 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -140px 0px" }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { type: "spring", stiffness: 260, damping: 26 }
            }
            className="text-center"
          >
            <div className="mx-auto max-w-3xl">
              <div className="mx-auto overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-2xl shadow-[0_40px_160px_rgba(0,0,0,0.65)]">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
                    alt="Learning community"
                    className="h-[220px] w-full object-cover sm:h-[360px]"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#070b13]/10 via-[#070b13]/40 to-[#070b13]/85" />
                </div>

                <div className="px-6 py-10 sm:px-10 sm:py-12">
                  <h3 className="text-3xl sm:text-4xl font-black text-[hsl(var(--fg))]">
                    {content.cta.title}
                  </h3>
                  <p className="mt-4 text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
                    {content.cta.body}
                  </p>

                  <div className="mt-8 flex items-center justify-center">
                    <Link
                      href="#offerings"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-8 py-4 text-sm sm:text-base font-bold text-[hsl(var(--accent-ink))] shadow-[0_22px_80px_rgba(34,211,238,0.25)] hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                    >
                      {content.cta.button}
                      <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* styles */}
      <style>{`
        :root {
          --tone-cyan: hsl(199 89% 48%);
          --tone-cyan-ink: 199 89% 18%;
          --tone-green: hsl(160 84% 39%);
          --tone-green-ink: 160 84% 18%;
          --tone-violet: hsl(245 83% 62%);
          --tone-violet-ink: 245 83% 20%;

          --edu-grid: rgba(2, 6, 23, 0.08);
          --edu-grid-opacity: 0.14;
          --edu-vignette: 0.06;
        }
        .dark,
        [data-theme="dark"] {
          --tone-cyan: hsl(191 92% 44%);
          --tone-cyan-ink: 191 92% 86%;
          --tone-green: hsl(160 84% 39%);
          --tone-green-ink: 160 84% 86%;
          --tone-violet: hsl(245 83% 67%);
          --tone-violet-ink: 245 83% 90%;

          --edu-grid: rgba(255, 255, 255, 0.10);
          --edu-grid-opacity: 0.14;
          --edu-vignette: 0.74;
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
            rgba(99, 102, 241, 0.16),
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
      `}</style>
    </main>
  );
}
