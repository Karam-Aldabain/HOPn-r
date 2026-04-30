type StrapiInstance = {
  entityService: {
    count(uid: string, params?: any): Promise<number>;
    findMany(uid: string, params?: any): Promise<any>;
    create(uid: string, params: { data: any }): Promise<any>;
  };
};

function now() {
  return new Date().toISOString();
}

async function ensureSiteSettings(strapi: StrapiInstance) {
  const existing = await strapi.entityService.findMany(
    "api::site-setting.site-setting",
    { limit: 1 }
  );
  if (Array.isArray(existing) && existing.length > 0) return;

  await strapi.entityService.create("api::site-setting.site-setting", {
    data: {
      brand_name: "HOPn",
      footer_company_text: "Driving innovation through technology.",
      social_links: {
        twitter: "#",
        linkedin: "#",
        github: "#",
        email: "hello@hopn.com",
      },
      legal_imprint: "Imprint content can be managed here.",
      legal_privacy: "Privacy policy content can be managed here.",
      legal_cookie: "Cookie policy content can be managed here.",
      publishedAt: now(),
    },
  });
}

async function ensureNavigation(strapi: StrapiInstance) {
  const existing = await strapi.entityService.count("api::navigation.navigation");
  if (existing > 0) return;

  await strapi.entityService.create("api::navigation.navigation", {
    data: {
      location: "header",
      items_json: {
        links: [
          { label: "Home", href: "/" },
          { label: "HOPn Labs", href: "/labs" },
          { label: "Events", href: "/events" },
          { label: "Insights", href: "/insights" },
        ],
        menus: [
          {
            id: "services",
            label: "Services",
            width: 720,
            items: [
              {
                title: "AI Solutions",
                desc: "Cutting-edge Artificial Intelligence to power your business.",
                href: "/ai-solutions",
                icon: "Sparkles",
                g1: "#5EEAD4",
                g2: "#3B82F6",
              },
              {
                title: "FinTech Innovations",
                desc: "Transforming finance with technology.",
                href: "/fintech-innovations",
                icon: "Landmark",
                g1: "#60A5FA",
                g2: "#A78BFA",
              },
              {
                title: "Digital Twins",
                desc: "Create virtual replicas of physical assets.",
                href: "/digital-twins",
                icon: "Network",
                g1: "#FB7185",
                g2: "#F59E0B",
              },
              {
                title: "Education & Events",
                desc: "Empowering through knowledge and insightful events.",
                href: "/education-events",
                icon: "CalendarDays",
                g1: "#34D399",
                g2: "#22C55E",
              },
              {
                title: "Consulting",
                desc: "Expert guidance to navigate the tech landscape.",
                href: "/consulting",
                icon: "BriefcaseBusiness",
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
                icon: "ShieldCheck",
                g1: "#A78BFA",
                g2: "#F472B6",
              },
              {
                title: "Team",
                desc: "Meet the minds behind HOPn.",
                href: "/team",
                icon: "Users",
                g1: "#60A5FA",
                g2: "#22C55E",
              },
              {
                title: "Projects",
                desc: "Explore our innovative work.",
                href: "/projects",
                icon: "FileText",
                g1: "#FB7185",
                g2: "#A78BFA",
              },
              {
                title: "Partners",
                desc: "Collaborating for a better future.",
                href: "/partners",
                icon: "LifeBuoy",
                g1: "#22C55E",
                g2: "#14B8A6",
              },
            ],
          },
        ],
        cta: { label: "Contact Us", href: "/contact" },
      },
      publishedAt: now(),
    },
  });

  await strapi.entityService.create("api::navigation.navigation", {
    data: {
      location: "footer",
      items_json: {
        quick_links: [
          { label: "Services", href: "/services" },
          { label: "Labs", href: "/labs" },
          { label: "Vision", href: "/vision-mission" },
          { label: "Contact", href: "/contact" },
        ],
        resources: [
          { label: "Insights", href: "/insights" },
          { label: "Events", href: "/events" },
          { label: "Careers", href: "/carres" },
        ],
        legal: [
          { label: "Imprint", href: "/imprint" },
          { label: "Privacy", href: "/privacy" },
          { label: "Cookie Policy", href: "/cookies" },
        ],
      },
      publishedAt: now(),
    },
  });
}

async function ensurePages(strapi: StrapiInstance) {
  const existing = await strapi.entityService.count("api::page.page");
  if (existing > 0) return;

  const pages = [
    { title: "Home", slug: "home" },
    { title: "About Us", slug: "about" },
    { title: "Our Solutions", slug: "solutions" },
    { title: "Projects", slug: "projects" },
    { title: "Partnerships", slug: "partnerships" },
    { title: "Imprint", slug: "imprint" },
    { title: "Privacy Policy", slug: "privacy" },
    { title: "Cookie Policy", slug: "cookies" },
  ];

  for (const p of pages) {
    await strapi.entityService.create("api::page.page", {
      data: {
        title: p.title,
        slug: p.slug,
        seo_title: p.title,
        seo_description: `${p.title} page`,
        sections: [
          {
            type: "HeroBlock",
            content_json: {
              title: p.title,
              subtitle: "This content can be updated in the CMS.",
              ctas: [{ label: "Get in Touch", href: "/contact" }],
            },
            visible: true,
            order: 0,
          },
        ],
        publishedAt: now(),
      },
    });
  }
}

async function ensureSolutions(strapi: StrapiInstance) {
  const existing = await strapi.entityService.count("api::solution.solution");
  if (existing > 0) return;

  const solutions = [
    {
      title: "AI and Automation",
      description: "AI-powered solutions to automate processes and enhance decision-making.",
      icon: "BrainCircuit",
      cta_label: "Explore AI Solutions",
      cta_url: "/ai-solutions",
    },
    {
      title: "Custom Software Development",
      description: "Scalable web and mobile applications tailored to business needs.",
      icon: "Code2",
      cta_label: "Build with Us",
      cta_url: "/contact",
    },
    {
      title: "Digital Transformation",
      description: "Modernizing systems, workflows, and digital experiences.",
      icon: "Sparkles",
      cta_label: "Start Transformation",
      cta_url: "/contact",
    },
    {
      title: "IT and Technology Consulting",
      description: "Strategic guidance for architecture, tools, and execution.",
      icon: "MessageSquareText",
      cta_label: "Talk to an Expert",
      cta_url: "/contact",
    },
  ];

  for (const s of solutions) {
    await strapi.entityService.create("api::solution.solution", {
      data: {
        ...s,
        problems: [],
        deliverables: [],
        visible: true,
        order: 0,
        publishedAt: now(),
      },
    });
  }
}

async function ensureProjects(strapi: StrapiInstance) {
  const existing = await strapi.entityService.count("api::project.project");
  if (existing > 0) return;

  const projects = [
    {
      title: "AI-Powered Market Analysis Platform",
      short_desc: "Predictive analytics for financial institutions with advanced AI models.",
      industry: "AI + FinTech",
      tech_tags: ["AI", "FinTech", "Predictive Analytics"],
      featured: true,
    },
    {
      title: "HealthTech Pharmacy Network",
      short_desc: "Connecting patients with essential medications through a pharmacy network.",
      industry: "HealthTech",
      tech_tags: ["Network", "Logistics", "AI Search"],
    },
    {
      title: "Fleet Optimization Platform",
      short_desc: "Advanced fleet management and real-time tracking for logistics.",
      industry: "Logistics",
      tech_tags: ["IoT", "Tracking", "Analytics"],
    },
  ];

  for (const p of projects) {
    await strapi.entityService.create("api::project.project", {
      data: {
        ...p,
        published: true,
        order: 0,
        publishedAt: now(),
      },
    });
  }
}

async function ensurePartners(strapi: StrapiInstance) {
  const existing = await strapi.entityService.count("api::partner.partner");
  if (existing > 0) return;

  const partners = ["SAP", "Siemens", "Deutsche Telekom", "Bosch", "BMW Group"];

  for (const name of partners) {
    await strapi.entityService.create("api::partner.partner", {
      data: {
        name,
        partnership_type: "Industry",
        description: "Strategic partner.",
        visible: true,
        order: 0,
        publishedAt: now(),
      },
    });
  }
}

async function ensureTeam(strapi: StrapiInstance) {
  const existing = await strapi.entityService.count("api::team-member.team-member");
  if (existing > 0) return;

  const team = [
    { name: "Dr. Innovate", role: "CEO" },
    { name: "Ms. Tech Savvy", role: "CTO" },
    { name: "Mr. Product", role: "Head of Product" },
  ];

  for (const t of team) {
    await strapi.entityService.create("api::team-member.team-member", {
      data: {
        ...t,
        visible: true,
        order: 0,
        publishedAt: now(),
      },
    });
  }
}

export async function seed(strapi: StrapiInstance) {
  await ensureSiteSettings(strapi);
  await ensureNavigation(strapi);
  await ensurePages(strapi);
  await ensureSolutions(strapi);
  await ensureProjects(strapi);
  await ensurePartners(strapi);
  await ensureTeam(strapi);
}
