"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin, Clock, Sparkles, Building2 } from "lucide-react";
import { useCmsPageData } from "@/lib/use-cms-page-data";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function useMotion() {
  const reduced = useReducedMotion();
  return {
    reveal: reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: "blur(8px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, amount: 0.25 },
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as any },
        },
    hoverLift: reduced
      ? {}
      : {
          whileHover: { y: -6, scale: 1.01 },
          transition: { type: "spring", stiffness: 260, damping: 22 },
        },
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
        "group relative rounded-3xl border p-6 md:p-7",
        "bg-[hsl(var(--card))]/80 backdrop-blur-xl",
        "border-[hsl(var(--border))]",
        "shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-[1px] rounded-3xl opacity-70",
          "bg-[radial-gradient(1200px_circle_at_15%_0%,rgba(34,211,238,0.22),transparent_45%),radial-gradient(900px_circle_at_90%_30%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(900px_circle_at_20%_90%,rgba(139,92,246,0.14),transparent_45%)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-[hsl(var(--border))]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-3 py-1 text-xs text-[hsl(var(--muted))]">
      <Sparkles className="h-4 w-4 text-[hsl(var(--accent))]" />
      <span>{children}</span>
    </div>
  );
}

const defaultInfoCards = [
  {
    title: "Our Office",
    lines: ["Weichterstr 1,", "Buchloe, 86807, Germany"],
    Icon: Building2,
    iconAlt: MapPin,
  },
  {
    title: "Call Us",
    lines: ["+49 179 41 70 592"],
    Icon: Phone,
  },
  {
    title: "General Inquiries",
    lines: ["info@hopn.eu"],
    Icon: Mail,
  },
];

export default function ContactPage() {
  const m = useMotion();
  const content = useCmsPageData("contact", {
    hero: {
      title: "Get In Touch With Us",
      subtitle:
        "We're here to answer your questions, discuss potential collaborations, or explore how our innovative solutions can benefit your organization. Reach out and let's start a conversation.",
      primaryCta: "Explore Our Services",
      secondaryCta: "Get In Touch",
    },
    availability: {
      title: "We respond within 24 hours",
      subtitle: "Send us a message and we will follow up quickly with next steps.",
      stats: [
        { k: "Response", v: "< 24h" },
        { k: "Hours", v: "9am - 6pm" },
        { k: "Timezone", v: "CET" },
        { k: "Coverage", v: "Global" },
      ],
    },
    form: {
      title: "Contact Form",
      subtitle: "Send us a message directly. We aim to respond within 24 hours.",
      namePlaceholder: "e.g. Jane Doe",
      emailPlaceholder: "e.g. jane.doe@example.com",
      subjectPlaceholder: "e.g. AI Solution Inquiry",
      messagePlaceholder: "Tell us more about your needs or questions...",
      consentText: "By submitting, you agree to our response and privacy policies.",
      submitLabel: "Send Message",
    },
    infoCards: defaultInfoCards.map((c) => ({
      title: c.title,
      lines: c.lines,
      icon: c.Icon.name,
      iconAlt: c.iconAlt?.name,
    })),
  });

  const iconMap: Record<string, any> = { Building2, Phone, Mail, MapPin, Clock };
  const infoCards = content.infoCards.map((card, idx) => {
    const fallback = defaultInfoCards[idx] ?? defaultInfoCards[0];
    const Icon = iconMap[(card as any).icon] || fallback.Icon;
    const AltIcon = iconMap[(card as any).iconAlt] || fallback.iconAlt;
    return { ...fallback, ...card, Icon, iconAlt: AltIcon };
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      <style>{`
        :root {
          --bg: 210 40% 98%;
          --fg: 222 47% 11%;
          --muted: 215 16% 42%;
          --card: 0 0% 100%;
          --border: 214 22% 86%;
          --ring: 199 89% 48%;

          --accent: 199 89% 48%;
          --accent-2: 245 83% 62%;
          --accent-ink: 0 0% 100%;

          --contact-grid: rgba(2, 6, 23, 0.08);
          --contact-grid-opacity: 0.12;
          --contact-vignette: 0.06;
        }
        .dark,
        [data-theme="dark"] {
          --bg: 228 58% 6%;
          --fg: 210 40% 98%;
          --muted: 215 20% 70%;
          --card: 224 46% 10%;
          --border: 225 24% 22%;
          --ring: 191 92% 44%;

          --accent: 191 92% 44%;
          --accent-2: 245 83% 67%;
          --accent-ink: 222 47% 11%;

          --contact-grid: rgba(255, 255, 255, 0.08);
          --contact-grid-opacity: 0.14;
          --contact-vignette: 0.78;
        }

        .contact-shimmer {
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
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.55] [background:radial-gradient(1200px_circle_at_10%_0%,rgba(34,211,238,0.18),transparent_45%),radial-gradient(900px_circle_at_90%_20%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(900px_circle_at_40%_110%,rgba(139,92,246,0.14),transparent_50%)]" />
        <div className="absolute inset-0 contact-shimmer" />
        <div
          className="absolute inset-0 [background-image:linear-gradient(to_right,var(--contact-grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--contact-grid)_1px,transparent_1px)] [background-size:48px_48px]"
          style={{ opacity: "var(--contact-grid-opacity)" as any }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(closest-side, transparent, rgba(0,0,0, var(--contact-vignette)))",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <motion.section
          {...m.reveal}
          className="relative rounded-[2.2rem] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 p-7 backdrop-blur-xl md:p-10"
        >
          <div className="absolute inset-0 rounded-[2.2rem] bg-[radial-gradient(900px_circle_at_25%_15%,rgba(34,211,238,0.16),transparent_45%),radial-gradient(800px_circle_at_80%_30%,rgba(99,102,241,0.14),transparent_45%)]" />

          <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
                  <Mail className="h-6 w-6 text-[hsl(var(--accent))]" />
                </div>
              </div>
              <h1 className="text-balance text-4xl font-extrabold tracking-tight text-[hsl(var(--accent))] md:text-6xl">
                {content.hero.title}
              </h1>
              <p className="mx-auto max-w-2xl text-pretty text-base leading-relaxed text-[hsl(var(--muted))] md:mx-0 md:text-lg">
                {content.hero.subtitle}
              </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link prefetch href="#services" className="btn-primary">
                    {content.hero.primaryCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link prefetch href="#contact" className="btn-secondary">
                    {content.hero.secondaryCta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
            </div>

            <GlassCard className="p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-[hsl(var(--muted))]">Availability</p>
                  <p className="mt-1 text-lg font-semibold text-[hsl(var(--fg))]">
                    {content.availability.title}
                  </p>
                  <p className="mt-2 text-sm text-[hsl(var(--muted))]">
                    {content.availability.subtitle}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--accent))]/15 ring-1 ring-[hsl(var(--accent))]/25">
                  <Clock className="h-5 w-5 text-[hsl(var(--accent))]" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {content.availability.stats.map((x) => (
                  <div
                    key={x.k}
                    className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-3 py-2"
                  >
                    <p className="text-[11px] text-[hsl(var(--muted))]">{x.k}</p>
                    <p className="text-sm font-semibold text-[hsl(var(--fg))]">{x.v}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <motion.section {...m.reveal} className="mt-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
                <Mail className="h-5 w-5 text-[hsl(var(--accent))]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[hsl(var(--fg))]">{content.form.title}</h3>
                <p className="text-sm text-[hsl(var(--muted))]">
                  {content.form.subtitle}
                </p>
              </div>
            </div>

            <form className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-3 text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  placeholder={content.form.namePlaceholder}
                  type="text"
                  name="name"
                  autoComplete="name"
                />
                <input
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-3 text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                  placeholder={content.form.emailPlaceholder}
                  type="email"
                  name="email"
                  autoComplete="email"
                />
              </div>
              <input
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-3 text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                placeholder={content.form.subjectPlaceholder}
                type="text"
                name="subject"
                autoComplete="off"
              />
              <textarea
                className="min-h-[150px] w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-3 text-sm text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                placeholder={content.form.messagePlaceholder}
                name="message"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[hsl(var(--muted))]">
                  {content.form.consentText}
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[hsl(var(--fg))] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[rgba(96,165,250,0.45)]"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--accent-2)), hsl(var(--accent)))",
                    boxShadow: "0 16px 70px rgba(96,165,250,0.33)",
                  }}
                >
                  {content.form.submitLabel} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </GlassCard>

          <div className="grid gap-5">
            {infoCards.map((card) => {
              const Icon = card.Icon;
              const AltIcon = card.iconAlt;
              return (
                <GlassCard key={card.title} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
                      <Icon className="h-5 w-5 text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[hsl(var(--fg))]">{card.title}</h3>
                      <div className="mt-3 space-y-1 text-sm text-[hsl(var(--muted))]">
                        {card.lines.map((line) => (
                          <div key={line} className="flex items-center gap-2">
                            {AltIcon ? (
                              <AltIcon className="h-4 w-4 text-[hsl(var(--accent))]" />
                            ) : (
                              <Icon className="h-4 w-4 text-[hsl(var(--accent))]" />
                            )}
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </motion.section>
      </div>
    </main>
  );
}









