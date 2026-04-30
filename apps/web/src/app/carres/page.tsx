"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Briefcase,
  Sparkles,
  Award,
  TrendingUp,
  Lightbulb,
  MapPin,
  Clock,
  ArrowRight,
  Send,
} from "lucide-react";
import { useCmsPageData } from "@/lib/use-cms-page-data";

const defaultWhyCards = [
  {
    title: "Impactful Work",
    desc: "Contribute to projects that make a real difference for our clients and society.",
    Icon: Award,
  },
  {
    title: "Growth Opportunities",
    desc: "We invest in your development with continuous learning and career advancement paths.",
    Icon: TrendingUp,
  },
  {
    title: "Innovative Culture",
    desc: "Be part of a dynamic and collaborative environment that fosters creativity and exploration.",
    Icon: Lightbulb,
  },
] as const;

const defaultOpenings = [
  {
    title: "Senior AI Engineer",
    dept: "Technology",
    desc: "Join our AI team to design, develop, and deploy cutting-edge machine learning models and AI solutions for diverse client projects.",
    location: "Brussels, Belgium (Hybrid)",
    type: "Full-time",
  },
  {
    title: "FinTech Product Manager",
    dept: "Product",
    desc: "Lead the strategy and development of innovative FinTech products, from ideation to launch and iteration.",
    location: "Remote (EU)",
    type: "Full-time",
  },
  {
    title: "Digital Twin Specialist",
    dept: "Consulting & Solutions",
    desc: "Work on exciting Digital Twin projects, helping clients create virtual replicas of their assets and processes for optimization.",
    location: "Brussels, Belgium",
    type: "Full-time",
  },
] as const;

export default function CarresPage() {
  const reduceMotion = useReducedMotion();
  const content = useCmsPageData("carres", {
    hero: {
      title: "Careers at HOPn",
      subtitle:
        "Join our team of innovators, thinkers, and builders. Explore exciting career opportunities and help us shape the future of technology.",
    },
    whyTitle: "Why Work With Us?",
    whyCards: defaultWhyCards.map((c) => ({
      title: c.title,
      desc: c.desc,
      icon: c.Icon.name,
    })),
    openingsTitle: "Current Openings",
    openings: defaultOpenings.map((o) => ({
      title: o.title,
      dept: o.dept,
      desc: o.desc,
      location: o.location,
      type: o.type,
    })),
    cta: {
      title: "Don't See a Fit?",
      body:
        "If you don't see an open position that matches your profile, we still encourage you to send us your resume. We are always looking for exceptional talent.",
      button: "Submit Your Resume",
    },
    modal: {
      title: "Apply to HOPn",
      closeLabel: "Close",
      backLabel: "Back",
      submitLabel: "Submit Application",
    },
    form: {
      fullNamePlaceholder: "Your full name",
      emailPlaceholder: "name@email.com",
      phonePlaceholder: "Phone number",
      resumePlaceholder: "Upload resume (PDF, DOC, DOCX)",
    },
  });

  const iconMap: Record<string, any> = {
    Award,
    TrendingUp,
    Lightbulb,
  };

  const whyCards = content.whyCards.map((c, idx) => {
    const fallback = defaultWhyCards[idx] ?? defaultWhyCards[0];
    const Icon = iconMap[(c as any).icon] || fallback.Icon;
    return { ...fallback, ...c, Icon };
  });

  const openings = content.openings.map((o, idx) => {
    const fallback = defaultOpenings[idx] ?? defaultOpenings[0];
    return { ...fallback, ...o };
  });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<null | (typeof openings)[number]>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const formRole = useMemo(
    () =>
      selectedRole ?? {
        title: "General Application",
        dept: "Talent",
        location: "Remote / On-site",
        type: "Flexible",
        desc: "Share your profile and we will match you with upcoming roles.",
      },
    [selectedRole]
  );

  const openForm = (role?: (typeof openings)[number]) => {
    setSelectedRole(role ?? null);
    setIsOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      <section className="relative pt-16 sm:pt-20 pb-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={reduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 260, damping: 26 }}
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
              <Briefcase className="h-8 w-8 text-[hsl(var(--accent))]" />
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[hsl(var(--accent))]">
              {content.hero.title}
            </h1>
            <p className="mt-4 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
              {content.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-xl p-8 sm:p-10">
            <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[hsl(var(--accent))]">
              {content.whyTitle}
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {whyCards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 p-6 text-center"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
                    <c.Icon className="h-6 w-6 text-[hsl(var(--accent))]" />
                  </div>
                  <div className="mt-4 text-lg font-extrabold text-[hsl(var(--fg))]">{c.title}</div>
                  <p className="mt-2 text-sm text-[hsl(var(--muted))] leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-[hsl(var(--accent))]">
            {content.openingsTitle}
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {openings.map((o) => (
              <div
                key={o.title}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 p-6"
              >
                <div className="text-xl font-extrabold text-[hsl(var(--fg))]">{o.title}</div>
                <div className="mt-1 text-sm font-semibold text-[hsl(var(--accent))]">{o.dept}</div>
                <p className="mt-4 text-sm text-[hsl(var(--muted))] leading-relaxed">{o.desc}</p>

                <div className="mt-4 space-y-2 text-sm text-[hsl(var(--muted))]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[hsl(var(--accent))]" />
                    <span>{o.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[hsl(var(--accent))]" />
                    <span>{o.type}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => openForm(o)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--accent))] px-4 py-3 text-sm font-extrabold text-[hsl(var(--accent-ink))] hover:brightness-110 transition"
                  >
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 backdrop-blur-xl p-8 sm:p-10 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 ring-1 ring-[hsl(var(--accent))]/20">
              <Send className="h-6 w-6 text-[hsl(var(--accent))]" />
            </div>
            <h3 className="mt-5 text-2xl sm:text-3xl font-extrabold text-[hsl(var(--fg))]">
              {content.cta.title}
            </h3>
            <p className="mt-3 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
              {content.cta.body}
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => openForm()}
                className="inline-flex items-center justify-center rounded-xl border border-[hsl(var(--border))] px-8 py-3 text-sm font-extrabold text-[hsl(var(--accent))] hover:bg-[hsl(var(--card))]/85 transition"
              >
                {content.cta.button}
              </button>
            </div>
          </div>
        </div>
      </section>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--fg))] shadow-[0_40px_160px_rgba(0,0,0,0.35)] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
              <div className="text-lg font-extrabold text-[hsl(var(--fg))]">{content.modal.title}</div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-sm text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/80 transition"
              >
                {content.modal.closeLabel}
              </button>
            </div>

            <div className="px-6 pt-4">
              <div className="h-1 w-full rounded-full bg-[hsl(var(--border))]">
                <div className="h-1 w-1/3 rounded-full bg-[hsl(var(--accent))]" />
              </div>
              <div className="mt-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-4">
                <div className="text-sm font-semibold text-[hsl(var(--accent))]">Role</div>
                <div className="mt-1 text-lg font-extrabold text-[hsl(var(--fg))]">{formRole.title}</div>
                <div className="mt-1 text-sm text-[hsl(var(--muted))]">
                  {formRole.dept} • {formRole.location} • {formRole.type}
                </div>
              </div>
            </div>

            <form className="px-6 pb-6 pt-6">
              <div className="text-base font-semibold text-[hsl(var(--fg))]">Contact Info</div>

              <div className="mt-4 grid gap-4">
                <label className="text-sm text-[hsl(var(--muted))]">
                  Full name*
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30"
                    placeholder={content.form.fullNamePlaceholder}
                  />
                </label>

                <label className="text-sm text-[hsl(var(--muted))]">
                  Email address*
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30"
                    placeholder={content.form.emailPlaceholder}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-[hsl(var(--muted))]">
                    Phone country code*
                    <select
                      required
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30"
                    >
                      <option value="">Select code</option>
                      <option value="+1">United States (+1)</option>
                      <option value="+44">United Kingdom (+44)</option>
                      <option value="+49">Germany (+49)</option>
                      <option value="+32">Belgium (+32)</option>
                      <option value="+962">Jordan (+962)</option>
                    </select>
                  </label>

                  <label className="text-sm text-[hsl(var(--muted))]">
                    Mobile phone number*
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-3 text-sm text-[hsl(var(--fg))] outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]/30"
                      placeholder={content.form.phonePlaceholder}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 text-base font-semibold text-[hsl(var(--fg))]">Resume</div>
              <p className="mt-2 text-sm text-[hsl(var(--muted))]">Please upload your updated resume.</p>
              <div className="mt-3">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 px-4 py-3 text-sm text-[hsl(var(--muted))] hover:bg-[hsl(var(--card))]/85 transition">
                  <span>{resumeFile ? resumeFile.name : content.form.resumePlaceholder}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setResumeFile(f);
                    }}
                  />
                </label>
              </div>

              <div className="mt-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/70 p-4">
                <div className="text-sm font-semibold text-[hsl(var(--fg))]">Review</div>
                <div className="mt-3 grid gap-2 text-sm text-[hsl(var(--muted))]">
                  <div>
                    <span className="text-[hsl(var(--fg))] font-semibold">Name:</span>{" "}
                    {fullName || "—"}
                  </div>
                  <div>
                    <span className="text-[hsl(var(--fg))] font-semibold">Email:</span>{" "}
                    {email || "—"}
                  </div>
                  <div>
                    <span className="text-[hsl(var(--fg))] font-semibold">Phone:</span>{" "}
                    {countryCode && phone ? `${countryCode} ${phone}` : "—"}
                  </div>
                  <div>
                    <span className="text-[hsl(var(--fg))] font-semibold">Resume:</span>{" "}
                    {resumeFile ? resumeFile.name : "—"}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-[hsl(var(--border))] px-5 py-3 text-sm font-extrabold text-[hsl(var(--fg))] hover:bg-[hsl(var(--card))]/85 transition"
                >
                  {content.modal.backLabel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[hsl(var(--accent))] px-6 py-3 text-sm font-extrabold text-[hsl(var(--accent-ink))] hover:brightness-110 transition"
                >
                  {content.modal.submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
