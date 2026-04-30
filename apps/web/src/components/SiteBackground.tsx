"use client";

import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";

export default function SiteBackground({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(40);
  const gSX = useSpring(glowX, { stiffness: 180, damping: 30 });
  const gSY = useSpring(glowY, { stiffness: 180, damping: 30 });

  return (
    <main
      className="relative min-h-screen bg-hopn text-hopn"
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        glowX.set((e.clientX / w) * 100);
        glowY.set((e.clientY / h) * 100);
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 hopn-vignette" />
        <div className="absolute inset-0 hopn-grid" />

        <div
          className="absolute -top-44 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full blur-[95px]"
          style={{ background: "color-mix(in oklab, var(--accent) 18%, transparent)" }}
        />
        <div
          className="absolute -left-44 top-28 h-[430px] w-[430px] rounded-full blur-[95px]"
          style={{ background: "var(--glow-2)" }}
        />
        <div
          className="absolute -right-56 top-52 h-[650px] w-[650px] rounded-full blur-[115px]"
          style={{ background: "var(--glow-1)" }}
        />

        <div className="absolute inset-0 hopn-shimmer" />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(650px 300px at var(--x) var(--y), rgba(255,255,255,0.10), transparent 72%)",
          // @ts-ignore
          "--x": gSX,
          // @ts-ignore
          "--y": gSY,
        }}
      />

      <div className="relative z-10">{children}</div>
    </main>
  );
}
