"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ChevronDown,
  ShieldCheck,
  Network,
  FileText,
  Landmark,
  CalendarDays,
  Users,
  BriefcaseBusiness,
  LifeBuoy,
  Globe,
  ArrowRight,
  Sparkles,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { fetchCms } from "@/lib/cms-client";

type NavItem = {
  id?: number | string;
  label: string;
  url: string;

  // server may call these differently, we handle common variants
  location?: "HEADER" | "FOOTER" | string;
  position?: "HEADER" | "FOOTER" | string;
  type?: "HEADER" | "FOOTER" | string;

  order?: number;
  visible?: boolean;
  external?: boolean;
  isCta?: boolean;

  parentId?: number | string | null;
  children?: NavItem[];

  // optional “nice to have” for mega menu cards
  desc?: string;
  icon?: string; // must match keys in iconMap below
  g1?: string;
  g2?: string;
};

type Item = {
  title: string;
  desc: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
  g1: string;
  g2: string;
};

type MenuT = {
  id: string;
  label: string;
  items: Item[];
  width?: number;
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}
function normalizeId(s: string) {
  return (s || "").toLowerCase().trim().replace(/\s+/g, "-");
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

/**
 * Works in BOTH App Router and Pages Router
 * Closes menus on any navigation:
 * - Link pushes (pushState/replaceState)
 * - Back/forward (popstate)
 */
function useCloseOnRouteChange(onChange: () => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const fire = () => onChange();

    const origPush = history.pushState;
    const origReplace = history.replaceState;

    const patchedPush: History["pushState"] = (...args) => {
      const ret = origPush.apply(history, args);
      setTimeout(() => window.dispatchEvent(new Event("locationchange")));
      return ret;
    };

    const patchedReplace: History["replaceState"] = (...args) => {
      const ret = origReplace.apply(history, args);
      setTimeout(() => window.dispatchEvent(new Event("locationchange")));
      return ret;
    };

    history.pushState = patchedPush;
    history.replaceState = patchedReplace;

    window.addEventListener("popstate", fire);
    window.addEventListener("locationchange", fire);

    return () => {
      window.removeEventListener("popstate", fire);
      window.removeEventListener("locationchange", fire);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, [onChange]);
}

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
    <div className="relative h-11 w-11 shrink-0 rounded-2xl ring-1 ring-white/10 bg-white/[0.035] overflow-hidden">
      <div
        className="absolute -inset-6 opacity-45 blur-2xl"
        style={{
          background: `radial-gradient(closest-side, ${g2}55, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-85"
        style={{
          background: `linear-gradient(135deg, ${g1}55, ${g2}55)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-30" />
      <div className="absolute inset-0 grid place-items-center">
        <Icon className="h-[18px] w-[18px] text-white/95" />
      </div>
    </div>
  );
}

// Accepts either:
// - { header: [...], footer: [...] }
// - { headerItems: [...], footerItems: [...] }
// - flat array with location/type/position
function extractHeaderFooter(payload: any): { header: NavItem[]; footer: NavItem[] } {
  if (!payload) return { header: [], footer: [] };

  const pickArray = (x: any) => (Array.isArray(x) ? x : []);
  const tryObj =
    typeof payload === "object" && !Array.isArray(payload) ? payload : null;

  if (tryObj) {
    const header =
      pickArray(tryObj.header) ||
      pickArray(tryObj.headerItems) ||
      pickArray(tryObj.HEADER);
    const footer =
      pickArray(tryObj.footer) ||
      pickArray(tryObj.footerItems) ||
      pickArray(tryObj.FOOTER);

    if ((header?.length || 0) + (footer?.length || 0) > 0) {
      return { header: header || [], footer: footer || [] };
    }
  }

  if (Array.isArray(payload)) {
    const header = payload.filter((it) => {
      const loc = (it?.location || it?.position || it?.type || "").toString().toUpperCase();
      return loc === "HEADER";
    });
    const footer = payload.filter((it) => {
      const loc = (it?.location || it?.position || it?.type || "").toString().toUpperCase();
      return loc === "FOOTER";
    });
    return { header, footer };
  }

  return { header: [], footer: [] };
}

function sortVisible(items: NavItem[]) {
  return (items || [])
    .filter((x) => x && x.visible !== false)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function buildTree(items: NavItem[]) {
  const byId = new Map<string, NavItem>();
  const roots: NavItem[] = [];

  const keyOf = (id: any) => (id === null || id === undefined ? "" : String(id));

  // clone
  const cloned = items.map((x) => ({ ...x, children: (x.children || []).slice() }));

  cloned.forEach((it) => {
    const k = keyOf(it.id ?? `${it.label}:${it.url}`);
    byId.set(k, it);
  });

  cloned.forEach((it) => {
    const parentKey = keyOf(it.parentId);
    if (parentKey && byId.has(parentKey)) {
      const parent = byId.get(parentKey)!;
      parent.children = parent.children || [];
      parent.children.push(it);
    } else {
      roots.push(it);
    }
  });

  // if server already sends children, keep them
  // but still sort children
  const sortRec = (arr: NavItem[]) => {
    arr.forEach((x) => {
      if (x.children?.length) {
        x.children = sortVisible(x.children);
        sortRec(x.children);
      }
    });
  };
  roots.forEach((x) => {
    if (x.children?.length) x.children = sortVisible(x.children);
  });
  sortRec(roots);

  return sortVisible(roots);
}

export default function Navbar() {
  const reduceMotion = useReducedMotion();

  const BRAND_BLUE = "#60A5FA";
  const BRAND_BLUE_2 = "#22D3EE";

  const iconMap: Record<string, ComponentType<{ className?: string }>> = useMemo(
    () => ({
      Sparkles,
      Landmark,
      Network,
      CalendarDays,
      BriefcaseBusiness,
      ShieldCheck,
      Users,
      FileText,
      LifeBuoy,
      Globe,
    }),
    []
  );

  // Fallback mega menus
  const fallbackMenus: MenuT[] = useMemo(
    () => [
      {
        id: "services",
        label: "Services",
        width: 720,
        items: [
          {
            title: "AI Solutions",
            desc: "Cutting-edge Artificial Intelligence to power your business.",
            href: "/ai-solutions",
            Icon: Sparkles,
            g1: "#5EEAD4",
            g2: "#3B82F6",
          },
          {
            title: "FinTech Innovations",
            desc: "Transforming finance with technology.",
            href: "/fintech-innovations",
            Icon: Landmark,
            g1: "#60A5FA",
            g2: "#A78BFA",
          },
          {
            title: "Digital Twins",
            desc: "Create virtual replicas of physical assets.",
            href: "/digital-twins",
            Icon: Network,
            g1: "#FB7185",
            g2: "#F59E0B",
          },
          {
            title: "EduTech",
            desc: "Training programs and learning pathways for modern teams.",
            href: "/education-events",
            Icon: CalendarDays,
            g1: "#34D399",
            g2: "#22C55E",
          },
          {
            title: "Consulting",
            desc: "Expert guidance to navigate the tech landscape.",
            href: "/consulting",
            Icon: BriefcaseBusiness,
            g1: "#A78BFA",
            g2: "#60A5FA",
          },
        ],
      },
      {
        id: "company",
        label: "Company",
        width: 720,
        items: [
          {
            title: "Our Vision & Mission",
            desc: "Discover the purpose that drives us.",
            href: "/vision-mission",
            Icon: ShieldCheck,
            g1: "#A78BFA",
            g2: "#F472B6",
          },
          {
            title: "Team",
            desc: "Meet the minds behind HOPn.",
            href: "/team",
            Icon: Users,
            g1: "#60A5FA",
            g2: "#22C55E",
          },
          {
            title: "Projects",
            desc: "Explore our innovative work.",
            href: "/projects",
            Icon: FileText,
            g1: "#FB7185",
            g2: "#A78BFA",
          },
          {
            title: "Partners",
            desc: "Collaborating for a better future.",
            href: "/partners",
            Icon: LifeBuoy,
            g1: "#22C55E",
            g2: "#14B8A6",
          },
        ],
      },
    ],
    []
  );

  const fallbackTopLinks = useMemo(
    () => [
      { id: "home", label: "Home", href: "/" },
      { id: "labs", label: "HOPn Labs", href: "/labs" },
      { id: "events", label: "Events", href: "/events" },
      { id: "insights", label: "Insights", href: "/insights" },
    ],
    []
  );

  const [menus, setMenus] = useState<MenuT[]>(fallbackMenus);
  const [topLinks, setTopLinks] = useState(fallbackTopLinks);
  const [cta, setCta] = useState({ label: "Contact Us", href: "/contact" });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const raw = await fetchCms<any>("/navigation");
        const { header } = extractHeaderFooter(raw);
        const headerSorted = buildTree(sortVisible(header));

        if (!mounted) return;
        if (!headerSorted.length) {
          setMenus(fallbackMenus);
          setTopLinks(fallbackTopLinks);
          return;
        }

        // CTA: first item with isCta
        const ctaItem = headerSorted
          .filter((x) => x.isCta)
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0];

        if (ctaItem?.label && ctaItem?.url) {
          setCta({ label: ctaItem.label, href: ctaItem.url });
        }

        // Menus: any header item that has children
        const menuRoots = headerSorted.filter((x) => (x.children?.length || 0) > 0 && !x.isCta);

        const builtMenus: MenuT[] = menuRoots.map((root) => {
          const id = normalizeId(root.label);
          const items: Item[] = (root.children || []).map((ch) => {
            const Icon = (ch.icon && iconMap[ch.icon]) || Sparkles;
            return {
              title: ch.label,
              desc: ch.desc || "",
              href: ch.url,
              Icon,
              g1: ch.g1 || BRAND_BLUE,
              g2: ch.g2 || BRAND_BLUE_2,
            };
          });
          return { id, label: root.label, items, width: 720 };
        });

        // Top links: items without children and not CTA
        const flatLinks = headerSorted.filter((x) => !x.isCta && !(x.children?.length));
        const builtTopLinks = flatLinks.map((l) => ({
          id: normalizeId(l.label || l.url),
          label: l.label,
          href: l.url,
          external: l.external ?? isExternalUrl(l.url),
        }));

        // Ensure "Home" exists
        const hasHome = builtTopLinks.some((x) => x.href === "/");
        const finalTopLinks = hasHome
          ? builtTopLinks
          : [{ id: "home", label: "Home", href: "/", external: false }, ...builtTopLinks];

        setMenus(builtMenus.length ? builtMenus : fallbackMenus);
        setTopLinks(finalTopLinks.length ? finalTopLinks : fallbackTopLinks);
      } catch {
        if (!mounted) return;
        setMenus(fallbackMenus);
        setTopLinks(fallbackTopLinks);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fallbackMenus, fallbackTopLinks, iconMap]);

  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [activeId, setActiveId] = useState<string>(menus[0]?.id || "services");

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [panelLeft, setPanelLeft] = useState(0);
  const [panelWidth, setPanelWidth] = useState(720);

  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 420, damping: 40 });
  const sy = useSpring(my, { stiffness: 420, damping: 40 });

  function closeAll() {
    setOpen(false);
    setLocked(false);
    setMobileOpen(false);
    setMobileSection(null);
  }

  useOnClickOutside(headerRef, closeAll);
  useCloseOnRouteChange(closeAll);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  function computePanelFor(id: string) {
    const nav = navRef.current;
    const btn = btnRefs.current[id];
    if (!nav || !btn) return;

    const menu = menus.find((m) => m.id === id);
    const w = menu?.width ?? 720;
    setPanelWidth(w);

    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const center = btnRect.left - navRect.left + btnRect.width / 2;
    const desiredLeft = center - w / 2;

    const left = clamp(desiredLeft, 8, navRect.width - w - 8);
    setPanelLeft(left);
  }

  function setActive(id: string) {
    setActiveId(id);
    requestAnimationFrame(() => computePanelFor(id));
  }

  function openWithIntent(id: string) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    if (openTimer.current) window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => {
      setActive(id);
      setOpen(true);
    }, 60);
  }

  function closeWithIntent() {
    if (locked) return;
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  }

  useEffect(() => {
    function onResize() {
      if (open) computePanelFor(activeId);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, activeId, menus]);

  const activeMenu = menus.find((m) => m.id === activeId) ?? menus[0];

  const ctaX = useMotionValue(0);
  const ctaY = useMotionValue(0);
  const ctaSX = useSpring(ctaX, { stiffness: 600, damping: 35 });
  const ctaSY = useSpring(ctaY, { stiffness: 600, damping: 35 });

  return (
    <>
      {/* overlay */}
      <div
        className={cx(
          "fixed inset-0 z-40 transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{
          background:
            "radial-gradient(1200px 500px at 50% 0%, rgba(0,0,0,0.25), rgba(0,0,0,0.55))",
        }}
        onClick={() => {
          if (!locked) closeAll();
        }}
      />

      <header className="sticky top-0 z-[999]">
        <div
          ref={headerRef}
          className="border-b border-white/5 bg-[#070b13]/75 backdrop-blur-xl supports-[backdrop-filter]:bg-[#070b13]/45"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-3" onClick={closeAll}>
                <div className="relative h-10 w-10 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/[0.06] shadow-[0_14px_60px_rgba(96,165,250,0.18)]">
                  <Image
                    src="/home/hopn-logo-2026.png"
                    alt="HOPn"
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />
                  <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent" />
                </div>
                <span className="text-white font-semibold tracking-wide">HOPn</span>
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-white/75 hover:text-white hover:bg-white/5 transition focus:outline-none focus:ring-2 focus:ring-white/10"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>

              {/* Desktop nav */}
              <div
                className="relative hidden lg:flex items-center"
                onMouseLeave={closeWithIntent}
                onMouseEnter={() => {
                  if (openTimer.current) window.clearTimeout(openTimer.current);
                  if (closeTimer.current) window.clearTimeout(closeTimer.current);
                }}
              >
                <div ref={navRef} className="relative flex items-center gap-1">
                  {/* top links */}
                  {topLinks.map((l) => {
                    const external = (l as any).external ?? isExternalUrl(l.href);
                    if (external) {
                      return (
                        <a
                          key={l.id}
                          href={l.href}
                          onClick={closeAll}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white/75 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(96,165,250,0.45)]"
                        >
                          {l.label}
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={l.id}
                        href={l.href}
                        onClick={closeAll}
                        className="relative z-10 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white/75 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(96,165,250,0.45)]"
                      >
                        {l.label}
                      </Link>
                    );
                  })}

                  {/* dropdown triggers from menus */}
                  {menus.map((m) => (
                    <div key={m.id} className="relative">
                      <button
                        ref={(el) => {
                          btnRefs.current[m.id] = el;
                        }}
                        type="button"
                        onMouseEnter={() => openWithIntent(m.id)}
                        onFocus={() => {
                          setActive(m.id);
                          setOpen(true);
                        }}
                        onClick={() => {
                          setActive(m.id);
                          setOpen(true);
                          setLocked((v) => !v);
                        }}
                        className={cx(
                          "relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                          activeId === m.id ? "text-white" : "text-white/75 hover:text-white",
                          "focus:outline-none focus:ring-2 focus:ring-[rgba(96,165,250,0.45)]"
                        )}
                        aria-haspopup="menu"
                        aria-expanded={open && activeId === m.id}
                      >
                        {m.label}
                        <motion.span
                          animate={{ rotate: open && activeId === m.id ? 180 : 0 }}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 560, damping: 34 }
                          }
                          className="inline-flex"
                        >
                          <ChevronDown className="h-4 w-4 text-white/55" />
                        </motion.span>
                      </button>
                    </div>
                  ))}

                  {/* Shared dropdown panel */}
                  <AnimatePresence>
                    {open && activeMenu && (
                      <motion.div
                        key="shared-panel"
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
                        className="absolute top-full z-50 mt-3 rounded-2xl p-[1px] bg-gradient-to-b from-white/12 via-white/7 to-white/0 shadow-[0_45px_140px_rgba(0,0,0,0.88)]"
                        style={{ left: panelLeft, width: panelWidth }}
                        onMouseEnter={() => {
                          if (closeTimer.current) window.clearTimeout(closeTimer.current);
                        }}
                        onMouseLeave={closeWithIntent}
                        onMouseMove={(e) => {
                          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                          mx.set(e.clientX - rect.left);
                          my.set(e.clientY - rect.top);
                        }}
                        role="menu"
                      >
                        <div className="relative rounded-2xl bg-[#070b13]/92 backdrop-blur-2xl ring-1 ring-white/10 overflow-hidden">
                          <motion.div
                            className="pointer-events-none absolute h-28 w-28 rounded-full blur-2xl opacity-30"
                            style={{
                              x: sx,
                              y: sy,
                              translateX: "-50%",
                              translateY: "-50%",
                              background:
                                "radial-gradient(closest-side, rgba(255,255,255,0.35), transparent 70%)",
                            }}
                          />

                          <div className="flex items-center justify-between px-4 pt-4 pb-2">
                            <div className="flex items-center gap-2 text-white/80">
                              <Sparkles className="h-4 w-4 text-white/60" />
                              <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                                {activeMenu.label}
                              </span>
                              {locked && (
                                <span className="ml-2 text-[11px] text-white/45">• locked</span>
                              )}
                            </div>
                            <button
                              onClick={() => setLocked((v) => !v)}
                              className="text-xs text-white/55 hover:text-white/80 transition"
                            >
                              {locked ? "Unlock" : "Lock"}
                            </button>
                          </div>

                          <div className="px-2 pb-2 grid grid-cols-2 gap-1">
                            {activeMenu.items.map((it) => {
                              const external = isExternalUrl(it.href);
                              const Card = (
                                <>
                                  <IconChip Icon={it.Icon} g1={it.g1} g2={it.g2} />
                                  <div className="min-w-0">
                                    <div className="text-[13.5px] font-semibold text-white leading-tight">
                                      {it.title}
                                    </div>
                                    {it.desc ? (
                                      <div className="mt-1 text-xs text-white/55 leading-snug">
                                        {it.desc}
                                      </div>
                                    ) : null}
                                  </div>
                                  <ArrowRight className="ml-auto mt-1 h-4 w-4 text-white/45 group-hover:text-white/80 transition-colors" />
                                </>
                              );

                              return external ? (
                                <a
                                  key={it.title}
                                  href={it.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={closeAll}
                                  className="group flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-white/7 transition focus:outline-none focus:ring-2 focus:ring-white/10"
                                  role="menuitem"
                                >
                                  {Card}
                                </a>
                              ) : (
                                <Link
                                  key={it.title}
                                  href={it.href}
                                  onClick={closeAll}
                                  className="group flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-white/7 transition focus:outline-none focus:ring-2 focus:ring-white/10"
                                  role="menuitem"
                                >
                                  {Card}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop right */}
              <div className="hidden lg:flex items-center gap-2">
                <button className="hidden sm:inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/10">
                  <Globe className="h-4 w-4 text-white/55" />
                  EN
                  <ChevronDown className="h-4 w-4 text-white/45" />
                </button>

                <ThemeToggle />

                <motion.div
                  style={{ x: ctaSX, y: ctaSY }}
                  onMouseMove={(e) => {
                    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    const dx = (e.clientX - (r.left + r.width / 2)) * 0.08;
                    const dy = (e.clientY - (r.top + r.height / 2)) * 0.08;
                    ctaX.set(dx);
                    ctaY.set(dy);
                  }}
                  onMouseLeave={() => {
                    ctaX.set(0);
                    ctaY.set(0);
                  }}
                >
                  <Link
                    href={cta.href}
                    onClick={closeAll}
                    className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-white hover:brightness-110 transition focus:outline-none focus:ring-2 focus:ring-[rgba(96,165,250,0.45)] focus:ring-offset-2 focus:ring-offset-[#070b13]"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE_2})`,
                      boxShadow: "0 16px 70px rgba(96,165,250,0.33)",
                    }}
                  >
                    {cta.label}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="lg:hidden border-t border-white/5"
              >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
                  <div className="grid gap-2">
                    {topLinks.map((l) => {
                      const external = (l as any).external ?? isExternalUrl(l.href);
                      return external ? (
                        <a
                          key={l.id}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeAll}
                          className="rounded-xl px-3 py-3 text-sm font-medium text-white/85 hover:bg-white/5"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          key={l.id}
                          href={l.href}
                          onClick={closeAll}
                          className="rounded-xl px-3 py-3 text-sm font-medium text-white/85 hover:bg-white/5"
                        >
                          {l.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid gap-2">
                    {menus.map((m) => (
                      <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.03]">
                        <button
                          type="button"
                          onClick={() => setMobileSection((v) => (v === m.id ? null : m.id))}
                          className="flex w-full items-center justify-between px-3 py-3 text-sm font-semibold text-white/90"
                          aria-expanded={mobileSection === m.id}
                        >
                          {m.label}
                          <ChevronDown
                            className={cx(
                              "h-4 w-4 text-white/60 transition-transform",
                              mobileSection === m.id ? "rotate-180" : "rotate-0"
                            )}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {mobileSection === m.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-1 px-2 pb-2">
                                {m.items.map((it) => (
                                  <Link
                                    key={it.title}
                                    href={it.href}
                                    onClick={closeAll}
                                    className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                                  >
                                    {it.title}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <ThemeToggle />

                    <Link
                      href={cta.href}
                      onClick={closeAll}
                      className="flex-1 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE_2})`,
                        boxShadow: "0 16px 70px rgba(96,165,250,0.33)",
                      }}
                    >
                      {cta.label}
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
