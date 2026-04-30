"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  DollarSign,
  Users,
  GraduationCap,
  MessageSquareText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useCmsPageData } from "@/lib/use-cms-page-data";

const defaultServices = [
  {
    title: "AI Solutions",
    desc: "Custom AI models, data analytics, and automation strategies.",
    href: "/ai-solutions",
    Icon: BrainCircuit,
  },
  {
    title: "FinTech Innovations",
    desc: "Secure, scalable, and compliant financial technology solutions.",
    href: "/fintech-innovations",
    Icon: DollarSign,
  },
  {
    title: "Digital Twins",
    desc: "Dynamic virtual replicas for performance enhancement and optimization.",
    href: "/digital-twins",
    Icon: Users,
  },
  {
    title: "EduTech",
    desc: "Specialized tech training programs and structured learning pathways.",
    href: "/education-events",
    Icon: GraduationCap,
  },
  {
    title: "Tech Consulting",
    desc: "Strategic guidance for navigating the complex technology landscape.",
    href: "/consulting",
    Icon: MessageSquareText,
  },
];

export const DEFAULT_SERVICES_CONTENT = {
  hero: {
    title: "Services & Solutions",
    subtitle:
      "A focused portfolio of services that help you modernize, secure, and scale your digital products.",
  },
  services: defaultServices.map((s) => ({
    title: s.title,
    desc: s.desc,
    href: s.href,
    icon: s.Icon.name,
  })),
} as const;

export default function ServicesPage() {
  const reduceMotion = useReducedMotion();
  const content = useCmsPageData("services", DEFAULT_SERVICES_CONTENT);

  const iconMap: Record<string, any> = {
    BrainCircuit,
    DollarSign,
    Users,
    GraduationCap,
    MessageSquareText,
  };

  const services = content.services.map((s, idx) => {
    const fallback = defaultServices[idx] ?? defaultServices[0];
    const Icon = iconMap[(s as any).icon] || fallback.Icon;
    return { ...fallback, ...s, Icon };
  });

  return (
    <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      <section className="relative pt-16 sm:pt-20 pb-10 border-b border-[hsl(var(--border))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={reduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 260, damping: 26 }}
            className="text-center"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
              <Sparkles className="h-7 w-7 text-[hsl(var(--accent))]" />
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--accent-1))] via-[hsl(var(--accent-2))] to-[hsl(var(--accent-1))]">
                {content.hero.title}
              </span>
            </h1>
            <p className="mt-4 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
              {content.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "0px 0px -120px 0px" }}
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : { type: "spring", stiffness: 260, damping: 26, delay: i * 0.05 }
                }
                className="h-full"
              >
                <div className="relative h-full overflow-hidden rounded-[26px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.18)]">
                  <div className="pointer-events-none absolute -inset-1 opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
                        <s.Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-lg sm:text-xl font-extrabold text-[hsl(var(--fg))]">
                          {s.title}
                        </div>
                        <p className="mt-2 text-[hsl(var(--muted))] leading-relaxed">{s.desc}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-sm text-[hsl(var(--muted))]">
                      <span>Learn more</span>
                      <Link
                        href={s.href}
                        className="inline-flex items-center gap-2 font-semibold text-[hsl(var(--accent))] hover:translate-x-0.5 transition"
                      >
                        Explore <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
