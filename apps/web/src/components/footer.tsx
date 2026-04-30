"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Linkedin, ArrowUpRight } from "lucide-react";
import { fetchCms, normalizeCollection, normalizeSingle } from "@/lib/cms-client";

type NavItem = {
  id: number;
  label: string;
  url: string;
  location: "HEADER" | "FOOTER";
  isCta: boolean;
  external: boolean;
  order: number;
  visible: boolean;
};

function FooterLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const container = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 18,
        mass: 0.9,
        staggerChildren: 0.06,
        delayChildren: 0.06,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 220, damping: 18, mass: 0.9 },
    },
  };

  const linkHover =
    "relative inline-flex items-center gap-2 text-sm text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] transition-colors";

  const fallbackQuick = useMemo(
    () => [
      { label: "Services", href: "/services", external: false },
      { label: "HOPn Labs", href: "/labs", external: false },
      { label: "Our Vision", href: "/vision-mission", external: false },
      { label: "Contact", href: "/contact", external: false },
    ],
    []
  );

  const fallbackResources = useMemo(
    () => [
      { label: "Insights/Blog", href: "/insights", external: false },
      { label: "Events", href: "/events", external: false },
      { label: "Careers", href: "/carres", external: false },
    ],
    []
  );

  const fallbackLegal = useMemo(
    () => [
      { label: "Imprint", href: "/imprint", external: false },
      { label: "Privacy", href: "/privacy", external: false },
      { label: "Cookie Policy", href: "/cookies", external: false },
    ],
    []
  );

  const [quickLinks, setQuickLinks] = useState(fallbackQuick);
  const [resourceLinks, setResourceLinks] = useState(fallbackResources);
  const [legalLinks, setLegalLinks] = useState(fallbackLegal);

  const shouldHideFooterItem = (label?: string, href?: string) => {
    const l = (label || "").toLowerCase();
    const h = (href || "").toLowerCase();
    return l.includes("partner") || h.includes("/partner");
  };

  const [brand, setBrand] = useState("HOPn");
  const [companyText, setCompanyText] = useState("Driving innovation through technology.");
  const [social, setSocial] = useState({
    linkedin: "https://www.linkedin.com/company/hopn-ug/?viewAsMember=true",
    email: "mailto:hello@hopn.com",
  });

  useEffect(() => {
    let mounted = true;

    // NAV: header + footer links
    fetchCms<NavItem[]>("/navigation")
      .then((res) => {
        const items = normalizeCollection<NavItem>(res as any) || [];
        if (!mounted) return;

        const header = items
          .filter((x) => x.location === "HEADER" && x.visible !== false && !x.isCta)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((x) => ({ label: x.label, href: x.url, external: x.external }));

        const footer = items
          .filter((x) => x.location === "FOOTER" && x.visible !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((x) => ({ label: x.label, href: x.url, external: x.external }));

        const resources = items
          .filter((x) => (x as any).location === "RESOURCES" && x.visible !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((x) => ({ label: x.label, href: x.url, external: x.external }));

        const headerFiltered = header.filter((l) => !shouldHideFooterItem(l.label, l.href));
        const resourcesFiltered = resources.filter((l) => !shouldHideFooterItem(l.label, l.href));
        const footerFiltered = footer.filter((l) => !shouldHideFooterItem(l.label, l.href));

        if (headerFiltered.length) setQuickLinks(headerFiltered);
        if (resourcesFiltered.length) setResourceLinks(resourcesFiltered);
        if (footerFiltered.length) setLegalLinks(footerFiltered);
      })
      .catch(() => {
        // keep fallbacks
      });

    // Settings: footer quick links & resources overrides
    fetchCms<{ key: string; valueJson?: any }>("/settings/public?key=footer_quick_links")
      .then((res) => {
        const settings = normalizeSingle<{ valueJson?: any }>(res as any);
        const value = settings?.valueJson;
        if (!mounted || !Array.isArray(value) || !value.length) return;
        const mapped = value
          .filter((x: any) => x?.visible !== false && x?.label && x?.url)
          .map((x: any) => ({ label: x.label, href: x.url, external: x.external }));
        if (mapped.length) setQuickLinks(mapped);
      })
      .catch(() => {});

    fetchCms<{ key: string; valueJson?: any }>("/settings/public?key=footer_resources")
      .then((res) => {
        const settings = normalizeSingle<{ valueJson?: any }>(res as any);
        const value = settings?.valueJson;
        if (!mounted || !Array.isArray(value) || !value.length) return;
        const mapped = value
          .filter((x: any) => x?.visible !== false && x?.label && x?.url)
          .map((x: any) => ({ label: x.label, href: x.url, external: x.external }));
        if (mapped.length) setResourceLinks(mapped);
      })
      .catch(() => {});

    // Settings: brand + footer text + social
    fetchCms<{ key: string; valueJson?: any }>("/settings/public?key=site")
      .then((res) => {
        const settings = normalizeSingle<{ valueJson?: any }>(res as any);
        const value = settings?.valueJson;
        if (!mounted || !value) return;

        if (value.brand_name) setBrand(value.brand_name);
        if (value.footer_company_text) setCompanyText(value.footer_company_text);

        if (value.social_links) {
          setSocial({
            linkedin:
              value.social_links?.linkedin ||
              "https://www.linkedin.com/company/hopn-ug/?viewAsMember=true",
            email: value.social_links?.email
              ? `mailto:${value.social_links.email}`
              : "mailto:hello@hopn.com",
          });
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [fallbackLegal, fallbackQuick, fallbackResources]);

  return (
    <footer className="relative border-t border-[hsl(var(--border))] bg-[hsl(var(--bg))] text-[hsl(var(--fg))] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 left-1/2 h-72 w-[52rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
        />
        <div className="absolute -bottom-40 right-[-8rem] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:12px_12px]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto max-w-6xl px-4 py-12"
      >
        <div className="grid gap-12 md:grid-cols-[1.25fr_1fr_1fr_0.9fr]">
          {/* Left */}
          <motion.div variants={item}>
            <div className="flex items-center gap-3">
              <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))] overflow-hidden">
                <div
                  className="absolute -inset-6 opacity-40 blur-2xl"
                  style={{ background: "color-mix(in srgb, var(--accent) 25%, transparent)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                <Image src="/home/hopn-logo-2026.png" alt="HOPn" fill sizes="44px" className="object-cover" />
              </div>
              <div className="text-base font-semibold tracking-wide text-[hsl(var(--fg))]">{brand}</div>
            </div>

            <p className="mt-6 max-w-sm text-sm text-[hsl(var(--muted))]">{companyText}</p>
          </motion.div>

          {/* Quick Links (HEADER items, admin-driven) */}
          <motion.div variants={item}>
            <div className="text-base font-semibold text-[hsl(var(--fg))]">Quick Links</div>
            <div className="mt-5 space-y-3">
              {(quickLinks.length ? quickLinks : fallbackQuick).map((l) => (
                <motion.div
                  key={l.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                >
                  <FooterLink className={linkHover} href={l.href} external={l.external}>
                    <span>{l.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-[hsl(var(--muted))]" />
                  </FooterLink>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div variants={item}>
            <div className="text-base font-semibold text-[hsl(var(--fg))]">Resources</div>
            <div className="mt-5 space-y-3">
              {(resourceLinks.length ? resourceLinks : fallbackResources).map((l) => (
                <motion.div
                  key={l.href}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                >
                  <FooterLink className={linkHover} href={l.href} external={l.external}>
                    <span>{l.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-[hsl(var(--muted))]" />
                  </FooterLink>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connect */}
          <motion.div variants={item}>
            <div className="text-base font-semibold text-[hsl(var(--fg))]">Connect</div>
            <div className="mt-5 flex items-center gap-4">
              <motion.a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--card))]/70 ring-1 ring-[hsl(var(--border))] text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))] transition overflow-hidden"
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 520, damping: 28 }}
              >
                <span className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.35),transparent_55%)]" />
                <Linkedin className="relative h-[18px] w-[18px]" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={item}
          className="mt-12 border-t border-[hsl(var(--border))] pt-6 text-xs text-[hsl(var(--muted))]"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} {brand}. All rights reserved.</div>
            <div className="flex items-center gap-4">
              {legalLinks.map((l) => (
                <FooterLink key={l.href} href={l.href} external={l.external} className="hover:text-[hsl(var(--fg))] transition">
                  {l.label}
                </FooterLink>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
