import Link from "next/link";
import ContactFormBlock from "@/components/cms/blocks/ContactFormBlock";
import ProjectsGridBlock from "@/components/cms/blocks/ProjectsGridBlock";

type CmsProject = {
  id?: number;
  title?: string;
  short_desc?: string;
  industry?: string;
  tech_tags?: string[];
  cover_image?: { url?: string };
  external_url?: string;
};

type CmsPartner = {
  id?: number;
  name?: string;
  description?: string;
  logo?: { url?: string };
  url?: string;
  partnership_type?: string;
};

type CmsTeamMember = {
  id?: number;
  name?: string;
  role?: string;
  bio?: string;
  photo?: { url?: string };
};

type CmsSolution = {
  id?: number;
  title?: string;
  description?: string;
  caseSnippet?: string | null;
  bulletsProblems?: string[];
  bulletsDeliverables?: string[];
  icon?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  visible?: boolean;
  order?: number;
};

type Section = {
  id?: number;
  type: string;

  // backend might return either
  content_json?: any;
  contentJson?: any;

  visible?: boolean;
  order?: number;
};

type Props = {
  sections: Section[];
  projects?: CmsProject[];
  partners?: CmsPartner[];
  team?: CmsTeamMember[];
  solutions?: CmsSolution[];
  partnerSettings?: { displayMode?: "carousel" | "grid"; carouselSpeed?: number };
};

function getData(section: Section) {
  const raw = (section as any)?.content_json ?? (section as any)?.contentJson ?? {};
  // normalize “text/body/subtitle” drift from admin editors
  return {
    ...raw,
    subtitle: raw.subtitle ?? raw.text ?? raw.lead ?? "",
    body: raw.body ?? raw.text ?? raw.content ?? "",
    cta: raw.cta ?? (raw.ctaLabel || raw.ctaUrl ? { label: raw.ctaLabel, href: raw.ctaUrl } : undefined),
  };
}

function CTAButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white"
      style={{
        background: "hsl(var(--accent))",
        boxShadow: "0 16px 70px rgba(0,0,0,0.25)",
      }}
    >
      {label}
    </Link>
  );
}

function HeroBlock({ data }: { data: any }) {
  // support either data.ctas[] OR single ctaLabel/ctaUrl OR data.cta
  const ctas =
    (Array.isArray(data?.ctas) && data.ctas) ||
    (data?.cta?.label && data?.cta?.href ? [{ label: data.cta.label, href: data.cta.href }] : []) ||
    (data?.ctaLabel && data?.ctaUrl ? [{ label: data.ctaLabel, href: data.ctaUrl }] : []);

  return (
    <section className="relative z-10 pt-16 sm:pt-20 pb-10 border-b border-[hsl(var(--border))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[hsl(var(--fg))]">
          {data?.title || "Page Title"}
        </h1>

        {data?.subtitle ? (
          <p className="mt-4 mx-auto max-w-3xl text-[hsl(var(--muted))] text-base sm:text-lg leading-relaxed">
            {data.subtitle}
          </p>
        ) : null}

        {ctas.length ? (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {ctas.map((c: any) => (
              <CTAButton key={`${c.label}-${c.href}`} label={c.label} href={c.href} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RichTextBlock({ data }: { data: any }) {
  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {data?.title ? (
          <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">{data.title}</h2>
        ) : null}
        {data?.body ? (
          <p className="mt-4 text-[hsl(var(--muted))] leading-relaxed whitespace-pre-wrap">
            {data.body}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function CardsBlock({ data }: { data: any }) {
  const items = Array.isArray(data?.items) ? data.items : [];
  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {data?.title ? (
          <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))] text-center">
            {data.title}
          </h2>
        ) : null}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it: any, i: number) => (
            <div
              key={`${it.title || "card"}-${i}`}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-6"
            >
              <div className="text-lg font-extrabold text-[hsl(var(--fg))]">{it.title}</div>
              {it.desc ? <div className="mt-2 text-[hsl(var(--muted))]">{it.desc}</div> : null}
              {it.cta?.label && (it.cta?.href || it.cta?.url) ? (
                <div className="mt-4">
                  <Link className="text-[hsl(var(--accent))] font-semibold" href={it.cta.href || it.cta.url}>
                    {it.cta.label}
                  </Link>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASectionBlock({ data }: { data: any }) {
  const cta = data?.cta?.label && data?.cta?.href ? data.cta : data?.ctaLabel && data?.ctaUrl ? { label: data.ctaLabel, href: data.ctaUrl } : null;

  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-8 sm:p-10">
          {data?.title ? (
            <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">{data.title}</h2>
          ) : null}
          {data?.subtitle ? <p className="mt-4 text-[hsl(var(--muted))]">{data.subtitle}</p> : null}
          {cta ? (
            <div className="mt-6">
              <CTAButton label={cta.label} href={cta.href} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ProjectsPreviewBlock({ data, projects }: { data: any; projects: CmsProject[] }) {
  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
            {data?.title || "Projects"}
          </h2>
          {data?.subtitle ? <p className="mt-3 text-[hsl(var(--muted))]">{data.subtitle}</p> : null}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id || p.title}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-6"
            >
              <div className="text-lg font-extrabold text-[hsl(var(--fg))]">{p.title}</div>
              {p.industry ? <div className="mt-1 text-xs text-[hsl(var(--muted))]">{p.industry}</div> : null}
              {p.short_desc ? <div className="mt-3 text-[hsl(var(--muted))]">{p.short_desc}</div> : null}
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
                  <Link className="text-[hsl(var(--accent))] font-semibold" href={p.external_url}>
                    View project
                  </Link>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersCarouselBlock({
  data,
  partners,
  settings,
}: {
  data: any;
  partners: CmsPartner[];
  settings?: { displayMode?: "carousel" | "grid"; carouselSpeed?: number };
}) {
  const mode = settings?.displayMode || "carousel";
  const speed = Math.max(10, Number(settings?.carouselSpeed || 30));
  const items = partners.filter((p) => p.name);

  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
          {data?.title || "Partners"}
        </h2>
        {data?.subtitle ? <p className="mt-3 text-[hsl(var(--muted))]">{data.subtitle}</p> : null}

        {mode === "grid" ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p) => (
              <div
                key={p.id || p.name}
                className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-4"
              >
                <div className="text-sm font-semibold text-[hsl(var(--fg))]">{p.name}</div>
                {p.partnership_type ? (
                  <div className="mt-1 text-xs text-[hsl(var(--muted))]">{p.partnership_type}</div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 overflow-hidden">
            <div className="hopn-marquee flex gap-4" style={{ animation: `hopn-marquee ${speed}s linear infinite` }}>
              {[...items, ...items].map((p, idx) => (
                <div
                  key={`${p.id || p.name}-${idx}`}
                  className="min-w-[220px] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-4"
                >
                  <div className="text-sm font-semibold text-[hsl(var(--fg))]">{p.name}</div>
                  {p.partnership_type ? (
                    <div className="mt-1 text-xs text-[hsl(var(--muted))]">{p.partnership_type}</div>
                  ) : null}
                </div>
              ))}
            </div>
            <style>{`
              @keyframes hopn-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
              @media (prefers-reduced-motion: reduce) {
                .hopn-marquee { animation: none !important; transform: none !important; }
              }
            `}</style>
          </div>
        )}
      </div>
    </section>
  );
}

function TeamGridBlock({ data, team }: { data: any; team: CmsTeamMember[] }) {
  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">{data?.title || "Team"}</h2>
        {data?.subtitle ? <p className="mt-3 text-[hsl(var(--muted))]">{data.subtitle}</p> : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.id || m.name}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-6"
            >
              <div className="text-lg font-extrabold text-[hsl(var(--fg))]">{m.name}</div>
              {m.role ? <div className="mt-1 text-sm text-[hsl(var(--muted))]">{m.role}</div> : null}
              {m.bio ? <div className="mt-3 text-[hsl(var(--muted))]">{m.bio}</div> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DividerBlock() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="h-px w-full bg-[hsl(var(--border))]" />
    </div>
  );
}

function SpacerBlock({ data }: { data: any }) {
  const h = Math.max(8, Number(data?.height || 24));
  return <div style={{ height: `${h}px` }} />;
}

function SimplePlaceholder({ title }: { title: string }) {
  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-8">
          <div className="text-xl font-extrabold text-[hsl(var(--fg))]">{title}</div>
          <div className="mt-2 text-[hsl(var(--muted))]">This block can be configured in the CMS.</div>
        </div>
      </div>
    </section>
  );
}

function SolutionsListBlock({ data, solutions }: { data: any; solutions: CmsSolution[] }) {
  const list = [...solutions]
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
            {data?.title || "Solutions"}
          </h2>
          {data?.subtitle ? <p className="mt-3 text-[hsl(var(--muted))]">{data.subtitle}</p> : null}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {list.map((s) => (
            <div
              key={s.id || s.title}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-6"
            >
              <div className="text-lg font-extrabold text-[hsl(var(--fg))]">{s.title}</div>
              {s.description ? <div className="mt-2 text-[hsl(var(--muted))]">{s.description}</div> : null}
              {s.caseSnippet ? (
                <div className="mt-3 text-sm text-[hsl(var(--muted))] italic">{s.caseSnippet}</div>
              ) : null}

              {s.bulletsProblems?.length ? (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-[hsl(var(--fg))]">Problems solved</div>
                  <ul className="mt-2 space-y-1 text-sm text-[hsl(var(--muted))]">
                    {s.bulletsProblems.map((b) => (
                      <li key={b}>- {b}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {s.bulletsDeliverables?.length ? (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-[hsl(var(--fg))]">Typical deliverables</div>
                  <ul className="mt-2 space-y-1 text-sm text-[hsl(var(--muted))]">
                    {s.bulletsDeliverables.map((b) => (
                      <li key={b}>- {b}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {s.ctaLabel && s.ctaUrl ? (
                <div className="mt-4">
                  <Link className="text-[hsl(var(--accent))] font-semibold" href={s.ctaUrl}>
                    {s.ctaLabel}
                  </Link>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SectionRenderer({
  sections,
  projects = [],
  partners = [],
  team = [],
  solutions = [],
  partnerSettings,
}: Props) {
  const ordered = [...sections]
    .filter((s) => s?.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      {ordered.map((section) => {
        const data = getData(section);
        const key = section.id ?? `${section.type}-${section.order ?? 0}`;

        switch (section.type) {
          case "HeroBlock":
            return <HeroBlock key={key} data={data} />;
          case "RichTextBlock":
            return <RichTextBlock key={key} data={data} />;
          case "CardsBlock":
            return <CardsBlock key={key} data={data} />;
          case "CTASectionBlock":
          case "CTA":
            return <CTASectionBlock key={key} data={data} />;
          case "ProjectsPreviewBlock":
            return <ProjectsPreviewBlock key={key} data={data} projects={projects} />;
          case "ProjectsGridBlock":
          case "Projects":
            return (
              <ProjectsGridBlock
                key={key}
                title={data?.title}
                subtitle={data?.subtitle}
                showFilters={!!(data?.showFilters ?? data?.filters ?? data?.enableFilters)}
                projects={projects}
              />
            );
          case "PartnersCarouselBlock":
          case "Partners":
            return (
              <PartnersCarouselBlock key={key} data={data} partners={partners} settings={partnerSettings} />
            );
          case "TeamGridBlock":
          case "Team":
            return <TeamGridBlock key={key} data={data} team={team} />;
          case "SolutionsListBlock":
          case "Solutions":
            return <SolutionsListBlock key={key} data={data} solutions={solutions} />;
          case "ContactFormBlock":
          case "Contact":
            return (
              <ContactFormBlock
                title={data?.title}
                subtitle={data?.subtitle}
                info={data?.contactInfo || data?.info}
              />
            );
          case "DividerBlock":
            return <DividerBlock key={key} />;
          case "SpacerBlock":
            return <SpacerBlock key={key} data={data} />;
          default:
            return <SimplePlaceholder key={key} title={section.type || "Section"} />;
        }
      })}
    </>
  );
}
