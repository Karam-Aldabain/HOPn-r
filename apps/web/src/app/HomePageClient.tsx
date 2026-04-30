"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Lightbulb,
  Zap,
  Cpu,
  DollarSign,
  Users,
  GraduationCap,
  MessageCircle,
  Rocket,
  HeartHandshake,
  ShieldCheck,
  Target,
  Eye,
  Phone,
  Mail,
} from "lucide-react";
import React from "react";
import { DEFAULT_HOME_CONTENT } from "@/lib/page-defaults";


const ACCENT = "text-[hsl(var(--accent))]";
const ACCENT_BG = "bg-[hsl(var(--accent))]";
const ACCENT_BG_HOVER = "hover:bg-[hsl(var(--accent))]";

type HomeCta = { label: string; href: string };
type HomeMedia = { url: string; alt?: string };
type HomeListItem = { icon?: string; title?: string; desc?: string; href?: string };
type HomeMarqueeItem = { name: string; logo?: string };
type HomeSectionKey = "hero" | "highlights" | "services" | "partners" | "principles" | "cta";
type HomeLayout = {
  sections?: Array<{ key: HomeSectionKey; visible?: boolean; order?: number }>;
};

export type HomeContent = {
  layout?: HomeLayout;
  hero?: {
    pill?: string;
    titleAccent?: string;
    titleRest?: string;
    subtitle?: string;
    primaryCta?: HomeCta;
    secondaryCta?: HomeCta;
    image?: HomeMedia & { tag?: string };
  };
  highlights?: HomeListItem[];
  services?: HomeListItem[];
  servicesSection?: { title?: string; titleAccent?: string; titleSuffix?: string; subtitle?: string; icon?: string };
  partners?: {
    title?: string;
    titleAccent?: string;
    subtitle?: string;
    icon?: string;
    speed?: number;
    items?: HomeMarqueeItem[];
    useCms?: boolean;
  };
  academic?: {
    title?: string;
    titleAccent?: string;
    subtitle?: string;
    icon?: string;
    speed?: number;
    items?: HomeMarqueeItem[];
  };
  principles?: {
    title?: string;
    titleAccent?: string;
    subtitle?: string;
    icon?: string;
    vision?: { title?: string; body?: string; icon?: string };
    mission?: { title?: string; body?: string; icon?: string };
    coreValues?: { title?: string; subtitle?: string; icon?: string };
    values?: HomeListItem[];
  };
  cta?: {
    title?: string;
    body?: string;
    primaryCta?: HomeCta;
    secondaryCta?: HomeCta;
    image?: HomeMedia;
    badgeLogoUrl?: string;
    footerPrefix?: string;
    footerLinkLabel?: string;
    footerLinkHref?: string;
    footerSuffix?: string;
  };
};

type HomePageClientProps = {
  home?: HomeContent | null;
  settings?: HomeContent | null;
  cmsPartners?: HomeMarqueeItem[];
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  brain: Brain,
  lightbulb: Lightbulb,
  zap: Zap,
  cpu: Cpu,
  dollar: DollarSign,
  users: Users,
  graduation: GraduationCap,
  message: MessageCircle,
  rocket: Rocket,
  handshake: HeartHandshake,
  shield: ShieldCheck,
  target: Target,
  eye: Eye,
  phone: Phone,
  mail: Mail,
};

function iconNode(name: string | undefined, className: string) {
  const Icon = (name && ICONS[name]) || Brain;
  return <Icon className={className} />;
}

export const DEFAULT_HOME: HomeContent = DEFAULT_HOME_CONTENT as HomeContent;

function mergeHomeContent(override?: HomeContent | null): HomeContent {
  const o = override || {};
  return {
    ...DEFAULT_HOME,
    ...o,
    hero: { ...DEFAULT_HOME.hero, ...o.hero },
    servicesSection: { ...DEFAULT_HOME.servicesSection, ...o.servicesSection },
    partners: { ...DEFAULT_HOME.partners, ...o.partners },
    academic: { ...DEFAULT_HOME.academic, ...o.academic },
    principles: {
      ...DEFAULT_HOME.principles,
      ...o.principles,
      vision: { ...DEFAULT_HOME.principles?.vision, ...o.principles?.vision },
      mission: { ...DEFAULT_HOME.principles?.mission, ...o.principles?.mission },
      coreValues: { ...DEFAULT_HOME.principles?.coreValues, ...o.principles?.coreValues },
      values: Array.isArray(o.principles?.values) ? o.principles?.values : DEFAULT_HOME.principles?.values,
    },
    cta: { ...DEFAULT_HOME.cta, ...o.cta },
    highlights: Array.isArray(o.highlights) ? o.highlights : DEFAULT_HOME.highlights,
    services: Array.isArray(o.services) ? o.services : DEFAULT_HOME.services,
  };
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function useEnterVariants(reduced: boolean) {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 18 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduced ? 0 : i * 0.06,
        duration: reduced ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };
}

function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
        "backdrop-blur-xl",
        className
      )}
    >
      {/* inner glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.16),transparent_60%)]" />
      {children}
    </div>
  );
}

function GlowIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative grid h-14 w-14 place-items-center rounded-2xl border border-[hsl(var(--accent))]/25 bg-[hsl(var(--accent))]/10",
        "shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_10px_30px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-80 [background:radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.25),transparent_55%)]" />
      <div className="text-[hsl(var(--accent))]">{children}</div>
    </div>
  );
}

function SafeImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
  sizes,
}: {
  src?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const [bad, setBad] = React.useState(false);

  if (!src || bad) {
    return (
      <div
        className={cn(
          "relative grid h-full w-full place-items-center overflow-hidden",
          "bg-gradient-to-br from-[hsl(var(--bg))]/6 via-[hsl(var(--accent-1))]/5 to-[hsl(var(--bg))]/2",
          className
        )}
      >
        <div className="absolute inset-0 opacity-70 [background:radial-gradient(70%_60%_at_50%_0%,rgba(34,211,238,0.18),transparent_55%)]" />
        <div className="absolute -left-24 top-8 h-56 w-56 rounded-full bg-[hsl(var(--accent))]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-8 h-56 w-56 rounded-full bg-[hsl(var(--accent))]/10 blur-3xl" />
        <div className="relative text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-2xl border border-[hsl(var(--accent))]/25 bg-[hsl(var(--accent))]/10" />
          <p className="text-sm text-[hsl(var(--muted))]">Image placeholder</p>
          <p className="text-xs text-[hsl(var(--muted))]">Put file in /public then update src</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      unoptimized
      onError={() => setBad(true)}
    />
  );
}

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl border border-[hsl(var(--accent))]/20 bg-[hsl(var(--accent))]/10">
        <div className="text-[hsl(var(--accent))]">{icon}</div>
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-[hsl(var(--fg))] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-pretty text-base leading-relaxed text-[hsl(var(--fg))]/75 dark:text-[hsl(var(--muted))] sm:text-lg">
        {subtitle}
      </p>
    </div>
  );
}

function Pill({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/75 px-4 py-2 text-sm text-[hsl(var(--muted))] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      {icon ? <span className="text-[hsl(var(--accent))]">{icon}</span> : null}
      <span className="tracking-wide">{children}</span>
    </div>
  );
}

function PrimaryButton({
  href,
  children,
  iconRight,
}: {
  href: string;
  children: React.ReactNode;
  iconRight?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold",
        "bg-[hsl(var(--accent))] text-[hsl(var(--accent-ink))]",
        "shadow-[0_18px_60px_color-mix(in_oklab,hsl(var(--accent))_35%,transparent)]",
        "hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
      )}
    >
      <span>{children}</span>
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
        {iconRight ?? <ArrowRight className="h-4 w-4" />}
      </span>
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
  iconRight,
}: {
  href: string;
  children: React.ReactNode;
  iconRight?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold",
        "border border-[hsl(var(--border))] bg-[hsl(var(--card))]/55 text-[hsl(var(--fg))]",
        "hover:bg-[hsl(var(--card))]/75 hover:border-[hsl(var(--accent))]/35",
        "transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/40"
      )}
    >
      <span>{children}</span>
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">
        {iconRight ?? <ArrowRight className="h-4 w-4" />}
      </span>
    </Link>
  );
}

function Marquee({
  items,
  speed = 38,
}: {
  items: Array<{ name: string; logo?: string }>;
  speed?: number;
}) {
  // duplicate list for seamless scroll
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[hsl(var(--bg))] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[hsl(var(--bg))] to-transparent" />
      <div
        className="flex gap-4 py-3"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {row.map((it, idx) => (
          <div
            key={`${it.name}-${idx}`}
            className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3"
          >
            {it.logo ? (
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70">
                <SafeImage src={it.logo} alt={it.name} fill className="object-contain p-1" />
              </div>
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 text-[11px] font-semibold text-[hsl(var(--muted))]">
                {it.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
            <div className="text-sm font-medium text-[hsl(var(--muted))]">{it.name}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

export default function HomePage({ home, settings, cmsPartners = [] }: HomePageClientProps) {
  const reduced = useReducedMotion();
  const enter = useEnterVariants(!!reduced);
  const content = mergeHomeContent(settings ?? home);
  const hero = content.hero || {};
  const highlights = content.highlights || [];
  const services = content.services || [];
  const partnersBlock = content.partners || {};
  const academicBlock = content.academic || {};
  const principles = content.principles || {};
  const values = principles.values || [];

  const cmsPartnerItems = cmsPartners.filter((p) => p?.name && p.logo);
  const partnersItems =
    partnersBlock.useCms === false
      ? partnersBlock.items || []
      : cmsPartnerItems.length
      ? cmsPartnerItems
      : partnersBlock.items || [];

  const defaultOrder: HomeSectionKey[] = ["hero", "highlights", "services", "partners", "principles", "cta"];
  const layoutSections = content.layout?.sections || [];
  const sectionConfig = (key: HomeSectionKey) => {
    const idx = defaultOrder.indexOf(key);
    const cfg = layoutSections.find((s) => s.key === key);
    return { visible: cfg?.visible !== false, order: cfg?.order ?? idx };
  };

  return (
    <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/10 blur-3xl" />
        <div className="absolute -bottom-52 left-1/3 h-[520px] w-[800px] -translate-x-1/2 rounded-full bg-[hsl(var(--accent))]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.14),transparent_65%)]" />

        {/* subtle animated noise */}
      <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col">
      {/* HERO */}
      <div style={{ order: sectionConfig("hero").order }} className={sectionConfig("hero").visible ? "" : "hidden"}>
      <section className="relative">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-20 sm:pt-24">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduced ? 0 : 0.08 } },
            }}
            className="text-center"
          >
            <motion.div variants={enter} custom={0} className="mb-6 flex justify-center">
              <Pill icon={<Zap className="h-4 w-4" />}>{hero.pill || "Innovate. Transform. Lead."}</Pill>
            </motion.div>

            <motion.h1
              variants={enter}
              custom={1}
              className={cn(
                "mx-auto max-w-5xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl",
                "text-[hsl(var(--fg))]"
              )}
            >
              <span className={cn("text-[hsl(var(--accent))]", "drop-shadow-[0_0_30px_rgba(34,211,238,0.25)]")}>
                {hero.titleAccent || "Pioneering Tomorrow's Technology,"}
              </span>{" "}
              {hero.titleRest || "Today."}
            </motion.h1>

            <motion.p
              variants={enter}
              custom={2}
              className="mx-auto mt-6 max-w-3xl text-pretty text-base leading-relaxed text-[hsl(var(--fg))]/75 dark:text-[hsl(var(--muted))] sm:text-lg"
            >
              {hero.subtitle ||
                "HOPn is your dedicated partner in navigating the complexities of the digital age. We deliver transformative solutions in AI, FinTech, Digital Twins, and beyond—empowering your business to thrive."}
            </motion.p>

            {hero.primaryCta || hero.secondaryCta ? (
              <motion.div
                variants={enter}
                custom={3}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                {hero.primaryCta ? (
                  <PrimaryButton href={hero.primaryCta.href} iconRight={<ArrowRight className="h-4 w-4" />}>
                    {hero.primaryCta.label}
                  </PrimaryButton>
                ) : null}
                {hero.secondaryCta ? (
                  <SecondaryButton href={hero.secondaryCta.href} iconRight={<ArrowRight className="h-4 w-4" />}>
                    {hero.secondaryCta.label}
                  </SecondaryButton>
                ) : null}
              </motion.div>
            ) : null}

            {/* Hero visual strip (optional image grid overlay) */}
            <motion.div
              variants={enter}
              custom={4}
              className="relative mx-auto mt-14 max-w-5xl overflow-hidden rounded-[2rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70"
            >
              <div className="relative h-[180px] w-full overflow-hidden rounded-[2rem] sm:h-[220px] md:h-[260px]">
                <SafeImage
                  src={hero.image?.url || "/home/hero.png"}
                  alt={hero.image?.alt || "HOPn hero visual"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover object-top scale-[1.0] translate-y-0 brightness-[1.08] contrast-[1.02] saturate-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.20),rgba(0,0,0,0.04),rgba(0,0,0,0.18))]" />
                <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(80%_60%_at_50%_10%,rgba(34,211,238,0.14),transparent_60%)]" />
                {hero.image?.tag ? (
                  <div className="absolute bottom-4 left-5 rounded-full bg-black/45 px-4 py-2 text-xs font-semibold tracking-[0.25em] text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
                    {hero.image.tag}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      </div>

      {/* HIGHLIGHTS */}
      <div style={{ order: sectionConfig("highlights").order }} className={sectionConfig("highlights").visible ? "" : "hidden"}>
      <section className="relative">
        <div className="mx-auto max-w-6xl px-5 pb-10">
          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={enter}
                custom={i}
              >
                <GlassCard className="group h-full p-7 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <GlowIcon className="shrink-0">{iconNode(h.icon, "h-7 w-7")}</GlowIcon>
                    <div>
                      <div className="text-lg font-semibold text-[hsl(var(--fg))]">{h.title}</div>
                      <div className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted))]">{h.desc}</div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[hsl(var(--accent))]/10 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* SERVICES */}
      <div style={{ order: sectionConfig("services").order }} className={sectionConfig("services").visible ? "" : "hidden"}>
      <section className="relative py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle
            icon={iconNode(content.servicesSection?.icon || "cpu", "h-8 w-8")}
            title={
              <>
                {content.servicesSection?.title || "Our Core"}{" "}
                <span className={ACCENT}>{content.servicesSection?.titleAccent || "Services"}</span>{" "}
                {content.servicesSection?.titleSuffix || "& Expertise"}
              </>
            }
            subtitle={
              content.servicesSection?.subtitle ||
              "We offer a comprehensive suite of technology services and solutions designed to empower your business, drive digital transformation, and unlock new avenues for growth and innovation."
            }
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={enter}
                custom={i}
              >
                <GlassCard className="group h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent))]/25">
                  <div className="flex items-center justify-between">
                    <GlowIcon>{iconNode(s.icon, "h-8 w-8")}</GlowIcon>
                    <div className="h-10 w-10 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="mt-5 text-xl font-semibold text-[hsl(var(--accent))]">{s.title}</div>
                  <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted))]">{s.desc}</p>

                  {s.href ? (
                    <div className="mt-6">
                      <Link
                        href={s.href}
                        className="inline-flex items-center gap-2 font-medium text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
                      >
                        Learn More{" "}
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Link>
                    </div>
                  ) : null}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-0 [background:radial-gradient(70%_100%_at_50%_100%,rgba(34,211,238,0.16),transparent_55%)] transition-opacity duration-300 group-hover:opacity-100" />
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>

      {/* TRUST / PARTNERS */}
      <div style={{ order: sectionConfig("partners").order }} className={sectionConfig("partners").visible ? "" : "hidden"}>
      <section className="relative py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle
            icon={iconNode(partnersBlock.icon || "handshake", "h-8 w-8")}
            title={
              <>
                {partnersBlock.title || "Trusted by"}{" "}
                <span className={ACCENT}>{partnersBlock.titleAccent || "Industry Leaders"}</span>
              </>
            }
            subtitle={
              partnersBlock.subtitle ||
              "We are proud to collaborate with global pioneers and innovators who trust HOPn to drive their technological transformation."
            }
          />

          <div className="mt-10">
            <Marquee items={partnersItems} speed={partnersBlock.speed || 42} />
          </div>

          {/* Academic row */}
          <div className="mt-12">
            <SectionTitle
              icon={iconNode(academicBlock.icon || "graduation", "h-8 w-8")}
              title={
                <>
                  {academicBlock.title || "Research &"}{" "}
                  <span className={ACCENT}>{academicBlock.titleAccent || "Academic Excellence"}</span>
                </>
              }
              subtitle={
                academicBlock.subtitle ||
                "Collaborating with prestigious universities and research institutions to bridge the gap between theoretical breakthroughs and practical application."
              }
            />
            <div className="mt-8">
              <Marquee items={academicBlock.items || []} speed={academicBlock.speed || 48} />
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* GUIDING PRINCIPLES */}
      <div style={{ order: sectionConfig("principles").order }} className={sectionConfig("principles").visible ? "" : "hidden"}>
      <section className="relative py-16">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle
            icon={iconNode(principles.icon || "brain", "h-8 w-8")}
            title={
              <>
                {principles.title || "Our Guiding"}{" "}
                <span className={ACCENT}>{principles.titleAccent || "Principles"}</span>
              </>
            }
            subtitle={
              principles.subtitle ||
              "Articulating our fundamental purpose, our ambitious aspirations for the future, and the core tenets that steer our every endeavor."
            }
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={enter}
              custom={0}
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-4">
                  <GlowIcon>{iconNode(principles.vision?.icon || "eye", "h-7 w-7")}</GlowIcon>
                  <div className="text-2xl font-semibold text-[hsl(var(--accent))]">{principles.vision?.title || "Our Vision"}</div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[hsl(var(--muted))]">
                  {principles.vision?.body ||
                    "To become the leading platform where innovation, education, and technology converge—simplifying life through connected services in AI, FinTech, automation, and digital transformation."}
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={enter}
              custom={1}
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-4">
                  <GlowIcon>{iconNode(principles.mission?.icon || "rocket", "h-7 w-7")}</GlowIcon>
                  <div className="text-2xl font-semibold text-[hsl(var(--accent))]">{principles.mission?.title || "Our Mission"}</div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[hsl(var(--muted))]">
                  {principles.mission?.body ||
                    "HOPn’s mission is to empower individuals, universities, and startups by uniting smart services and practical education in one seamless ecosystem. Through digital twins, AI, FinTech, automation, and hands-on training, we build bridges between research, innovation, and real-world impact—simplifying complexity and accelerating progress."}
                </p>
              </GlassCard>
            </motion.div>
          </div>

          {/* Core Values */}
          <div className="mt-12">
            <GlassCard className="p-8">
              <div className="mx-auto mb-8 flex max-w-xl flex-col items-center text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-[hsl(var(--accent))]/20 bg-[hsl(var(--accent))]/10">
                  {iconNode(principles.coreValues?.icon || "target", "h-7 w-7")}
                </div>
                <h3 className="text-2xl font-semibold text-[hsl(var(--fg))]">{principles.coreValues?.title || "Our Core Values"}</h3>
                <p className="mt-3 text-sm text-[hsl(var(--muted))]">
                  {principles.coreValues?.subtitle || "The standards that shape how we work, build, and collaborate—every day."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                {values.map((v, i) => (
                  <motion.div
                    key={v.title}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={enter}
                    custom={i}
                    className="h-full"
                  >
                    <div className="group h-full rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent))]/25">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-xl border border-[hsl(var(--accent))]/20 bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]">
                          {iconNode(v.icon, "h-6 w-6")}
                        </div>
                        <div className="font-semibold text-[hsl(var(--accent))]">{v.title}</div>
                      </div>
                      <div className="mt-3 text-sm text-[hsl(var(--muted))]">{v.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
      </div>

      {/* FINAL CTA */}
      <div style={{ order: sectionConfig("cta").order }} className={sectionConfig("cta").visible ? "" : "hidden"}>
      <section className="relative pb-20 pt-6">
        <div className="mx-auto max-w-6xl px-5">
          <GlassCard className="overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="p-10 sm:p-12">
                <div className="text-4xl font-semibold tracking-tight text-[hsl(var(--accent))] sm:text-5xl">
                  {content.cta?.title || "Ready to Innovate Together?"}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[hsl(var(--fg))]/90 sm:text-base">
                  {content.cta?.body ||
                    "Let's discuss how HOPn's expertise can propel your business forward. Whether you have a specific project in mind, seek strategic advice, or wish to explore potential collaborations, we're eager to connect and explore the possibilities."}
                </p>

                {content.cta?.primaryCta || content.cta?.secondaryCta ? (
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    {content.cta?.primaryCta ? (
                      <PrimaryButton href={content.cta.primaryCta.href} iconRight={<Mail className="h-4 w-4" />}>
                        {content.cta.primaryCta.label}
                      </PrimaryButton>
                    ) : null}
                    {content.cta?.secondaryCta ? (
                      <SecondaryButton href={content.cta.secondaryCta.href} iconRight={<Phone className="h-4 w-4" />}>
                        {content.cta.secondaryCta.label}
                      </SecondaryButton>
                    ) : null}
                  </div>
                ) : null}

                <p className="mt-6 text-sm text-[hsl(var(--fg))]/90">
                  {content.cta?.footerPrefix || "Or, "}
                  <Link
                    href={content.cta?.footerLinkHref || "/services"}
                    className="font-medium text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
                  >
                    {content.cta?.footerLinkLabel || "explore our comprehensive services"}
                  </Link>{" "}
                  {content.cta?.footerSuffix || "to see how we can tailor solutions for your unique needs."}
                </p>
              </div>

              <div className="relative min-h-[220px] sm:min-h-[280px] lg:min-h-[420px]">
                <SafeImage
                  src={content.cta?.image?.url || "/home/cta.png"}
                  alt={content.cta?.image?.alt || "Innovation visual"}
                  fill
                  className="object-cover object-center brightness-[1.08] contrast-[1.02] saturate-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl border border-white/30 bg-white/10 p-2.5 backdrop-blur-sm">
                  <div className="relative h-full w-full overflow-hidden rounded-lg bg-white/80">
                    <SafeImage src={content.cta?.badgeLogoUrl || "/home/hopn-logo-2026.png"} alt="HOPn logo" fill className="object-cover" />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.03),rgba(0,0,0,0.16))]" />
                <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(70%_60%_at_50%_20%,rgba(34,211,238,0.14),transparent_60%)]" />
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
      </div>
      </div>
    </main>
  );
}
