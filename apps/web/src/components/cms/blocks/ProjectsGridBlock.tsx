"use client";

import { useMemo, useState } from "react";

type Project = {
  id?: number;
  title?: string;
  short_desc?: string;
  industry?: string;
  tech_tags?: string[];
  cover_image?: { url?: string };
  external_url?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
  projects: Project[];
};

function uniq(list: string[]) {
  return Array.from(new Set(list)).filter(Boolean);
}

export default function ProjectsGridBlock({ title, subtitle, showFilters, projects }: Props) {
  const industries = useMemo(
    () => uniq(projects.map((p) => p.industry || "").filter(Boolean)),
    [projects],
  );
  const techTags = useMemo(
    () => uniq(projects.flatMap((p) => p.tech_tags || [])),
    [projects],
  );

  const [industry, setIndustry] = useState<string>("all");
  const [tech, setTech] = useState<string>("all");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const okIndustry = industry === "all" || p.industry === industry;
      const okTech = tech === "all" || (p.tech_tags || []).includes(tech);
      return okIndustry && okTech;
    });
  }, [projects, industry, tech]);

  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
            {title || "Projects"}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-[hsl(var(--muted))]">{subtitle}</p>
          ) : null}
        </div>

        {showFilters ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <select
              className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-2 text-sm text-[hsl(var(--fg))]"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="all">All industries</option>
              {industries.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <select
              className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 px-4 py-2 text-sm text-[hsl(var(--fg))]"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
            >
              <option value="all">All technologies</option>
              {techTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id || p.title}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-6"
            >
              <div className="text-lg font-extrabold text-[hsl(var(--fg))]">{p.title}</div>
              {p.industry ? (
                <div className="mt-1 text-xs text-[hsl(var(--muted))]">{p.industry}</div>
              ) : null}
              {p.short_desc ? (
                <div className="mt-3 text-[hsl(var(--muted))]">{p.short_desc}</div>
              ) : null}
              {p.tech_tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech_tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-xs text-[hsl(var(--muted))]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              {p.external_url ? (
                <div className="mt-4">
                  <a
                    className="text-[hsl(var(--accent))] font-semibold"
                    href={p.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View project
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
