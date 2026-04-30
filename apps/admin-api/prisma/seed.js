/* eslint-disable no-console */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function upsertSetting(key, valueJson) {
  return prisma.setting.upsert({
    where: { key },
    update: { valueJson },
    create: { key, valueJson },
  });
}

async function seedPages() {
  const pages = [
    {
      slug: "home",
      title: "Home",
      sections: [
        {
          type: "HomePage",
          order: 0,
          contentJson: {
            hero: {
              pill: "Innovate. Transform. Lead.",
              titleAccent: "Pioneering Tomorrow's Technology,",
              titleRest: "Today.",
              subtitle:
                "HOPn is your dedicated partner in navigating the complexities of the digital age. We deliver transformative solutions in AI, FinTech, Digital Twins, and beyond, empowering your business to thrive.",
              primaryCta: { label: "Explore Our Services", href: "/services" },
              secondaryCta: { label: "Get In Touch", href: "/contact" },
              image: { url: "/home/hero.png", alt: "HOPn hero visual", tag: "HOPn" },
            },
            highlights: [
              {
                icon: "brain",
                title: "AI & ML Expertise",
                desc: "Harnessing intelligent algorithms for sustainable growth and efficiency.",
              },
              {
                icon: "lightbulb",
                title: "Innovative Solutions",
                desc: "Crafting unique, cutting-edge tech for your most complex challenges.",
              },
              {
                icon: "zap",
                title: "Future-Focused Strategy",
                desc: "Building resilient, scalable, and forward-thinking technologies.",
              },
            ],
            servicesSection: {
              title: "Our Core",
              titleAccent: "Services",
              titleSuffix: "& Expertise",
              subtitle:
                "We offer a comprehensive suite of technology services and solutions designed to empower your business, drive digital transformation, and unlock new avenues for growth and innovation.",
              icon: "cpu",
            },
            services: [
              {
                icon: "cpu",
                title: "AI Solutions",
                desc: "Leverage Artificial Intelligence and Machine Learning to drive innovation and efficiency. We build custom models and data-driven strategies.",
                href: "/ai-solutions",
              },
              {
                icon: "dollar",
                title: "FinTech Innovations",
                desc: "Revolutionizing financial services with secure platforms and insightful analytics. Explore blockchain, payments, and RegTech with us.",
                href: "/fintech-innovations",
              },
              {
                icon: "users",
                title: "Digital Twins",
                desc: "Create dynamic virtual representations of assets and systems for simulation, predictive maintenance, and operational optimization.",
                href: "/digital-twins",
              },
              {
                icon: "graduation",
                title: "EduTech",
                desc: "Technology training programs, workshops, and structured learning to empower teams and foster growth.",
                href: "/education-events",
              },
              {
                icon: "message",
                title: "Tech Consulting",
                desc: "Expert guidance to navigate complex tech landscapes, make strategic decisions, and implement solutions for sustainable growth.",
                href: "/consulting",
              },
              {
                icon: "lightbulb",
                title: "HOPn Labs",
                desc: "Our R&D hub focusing on emerging technologies, fostering innovation and developing next-generation solutions.",
                href: "/labs",
              },
            ],
            partners: {
              useCms: true,
              title: "Trusted by",
              titleAccent: "Industry Leaders",
              subtitle:
                "We are proud to collaborate with global pioneers and innovators who trust HOPn to drive their technological transformation.",
              icon: "handshake",
              speed: 42,
              items: [
                { name: "SAP", logo: "/partners/sap.png" },
                { name: "Siemens", logo: "/partners/siemens.png" },
                { name: "Deutsche Telekom", logo: "/partners/deutsche-telekom.png" },
                { name: "Bosch", logo: "/partners/bosch.jpg" },
                { name: "BMW Group", logo: "/partners/bmw.png" },
                { name: "Allianz", logo: "/partners/allianz.png" },
                { name: "Deutsche Bahn", logo: "/partners/deutsche-bahn.png" },
                { name: "Infineon", logo: "/partners/infineon.png" }
              ]
            },
            academic: {
              title: "Research &",
              titleAccent: "Academic Excellence",
              subtitle:
                "Collaborating with prestigious universities and research institutions to bridge the gap between theoretical breakthroughs and practical application.",
              icon: "graduation",
              speed: 48,
              items: [
                { name: "Technical University Partner" },
                { name: "Research Institute Network" },
                { name: "Innovation Lab Consortium" },
                { name: "Applied AI Center" },
                { name: "Digital Twin Research Group" }
              ]
            },
            principles: {
              title: "Our Guiding",
              titleAccent: "Principles",
              subtitle:
                "Articulating our fundamental purpose, our ambitious aspirations for the future, and the core tenets that steer our every endeavor.",
              icon: "brain",
              vision: {
                title: "Our Vision",
                body:
                  "To become the leading platform where innovation, education, and technology converge, simplifying life through connected services in AI, FinTech, automation, and digital transformation.",
                icon: "eye"
              },
              mission: {
                title: "Our Mission",
                body:
                  "HOPn's mission is to empower individuals, universities, and startups by uniting smart services and practical education in one seamless ecosystem. Through digital twins, AI, FinTech, automation, and hands-on training, we build bridges between research, innovation, and real-world impact, simplifying complexity and accelerating progress.",
                icon: "rocket"
              },
              coreValues: {
                title: "Our Core Values",
                subtitle: "The standards that shape how we work, build, and collaborate-every day.",
                icon: "target"
              },
              values: [
                { icon: "rocket", title: "Innovation", desc: "Pioneering breakthroughs and novel solutions." },
                { icon: "shield", title: "Integrity", desc: "Upholding honesty and ethical principles." },
                { icon: "handshake", title: "Collaboration", desc: "Achieving collective success through teamwork." },
                { icon: "target", title: "Excellence", desc: "Consistently striving for the highest quality." }
              ]
            },
            cta: {
              title: "Ready to Innovate Together?",
              body:
                "Let's discuss how HOPn's expertise can propel your business forward. Whether you have a specific project in mind, seek strategic advice, or wish to explore potential collaborations, we're eager to connect and explore the possibilities.",
              primaryCta: { label: "Send Us a Message", href: "/contact" },
              secondaryCta: { label: "Call Us Now", href: "/contact" },
              image: { url: "/home/cta.png", alt: "Innovation visual" },
              badgeLogoUrl: "/home/hopn-logo.png",
              footerPrefix: "Or, ",
              footerLinkLabel: "explore our comprehensive services",
              footerLinkHref: "/services",
              footerSuffix: "to see how we can tailor solutions for your unique needs."
            }
          },
        },
        {
          type: "HeroBlock",
          order: 1,
          contentJson: {
            title: "We Build Intelligent Digital Solutions for the Future of Business",
            subtitle:
              "AI, Software Development, Digital Transformation and Innovation Consulting",
            ctas: [
              { label: "Our Solutions", href: "/solutions" },
              { label: "Get in Touch", href: "/contact" },
            ],
          },
        },
        {
          type: "RichTextBlock",
          order: 2,
          contentJson: {
            title: "HOPn Overview",
            body:
              "HOPn is a Germany-based innovation and technology company supporting startups, SMEs, and enterprises in building scalable, future-ready digital solutions. We combine strategy, technology, and creativity to deliver real business impact.",
          },
        },
        {
          type: "CardsBlock",
          order: 3,
          contentJson: {
            title: "Our Solutions",
            items: [
              { title: "AI and Automation", desc: "Automate processes and enhance decisions." },
              { title: "Custom Software Development", desc: "Scalable web and mobile applications." },
              { title: "Digital Transformation", desc: "Modernize systems and workflows." },
              { title: "IT Consulting", desc: "Strategic guidance for architecture and delivery." },
              { title: "Data and Cloud", desc: "Secure infrastructure and analytics." },
              { title: "Innovation Support", desc: "Ideation, MVPs, and product strategy." },
            ],
          },
        },
        {
          type: "ProjectsPreviewBlock",
          order: 4,
          contentJson: {
            title: "Projects",
            subtitle: "Selected projects and case studies.",
          },
        },
        {
          type: "PartnersCarouselBlock",
          order: 5,
          contentJson: {
            title: "Partnerships and Clients",
            subtitle: "We collaborate with leading German and European organizations.",
          },
        },
        {
          type: "CTASectionBlock",
          order: 6,
          contentJson: {
            title: "Ready to build something impactful?",
            subtitle: "Let’s talk about your next initiative.",
            cta: { label: "Let’s Talk", href: "/contact" },
          },
        },
      ],
    },
    {
      slug: "about",
      title: "About",
      sections: [
        {
          type: "HeroBlock",
          order: 1,
          contentJson: {
            title: "About HOPn",
            subtitle: "Innovation-driven technology partner headquartered in Germany.",
          },
        },
        {
          type: "RichTextBlock",
          order: 2,
          contentJson: {
            title: "About HOPn",
            body:
              "HOPn is an innovation-driven technology company headquartered in Germany. We operate at the intersection of business strategy and advanced technology, enabling organizations to innovate faster, scale smarter, and compete globally.",
          },
        },
        {
          type: "RichTextBlock",
          order: 3,
          contentJson: {
            title: "Our Mission",
            body:
              "Our mission is to empower businesses with intelligent digital solutions that drive efficiency, innovation, and sustainable growth.",
          },
        },
        {
          type: "RichTextBlock",
          order: 4,
          contentJson: {
            title: "Our Vision",
            body:
              "Our vision is to become a trusted innovation partner for organizations across Europe, shaping the future of digital transformation through technology excellence and strategic thinking.",
          },
        },
        {
          type: "TeamGridBlock",
          order: 5,
          contentJson: {
            title: "Our Team",
            subtitle:
              "Our team combines deep business understanding, technical expertise, and creative problem-solving.",
          },
        },
        {
          type: "ContactFormBlock",
          order: 6,
          contentJson: {
            title: "Contact Us",
            subtitle:
              "Tell us about your project, partnership, or innovation challenge.",
          },
        },
      ],
    },
    {
      slug: "ai-solutions",
      title: "AI Solutions",
      sections: [
        {
          type: "HeroBlock",
          order: 1,
          contentJson: {
            title: "AI Solutions",
            subtitle: "Production-ready AI, automation, and analytics.",
          },
        },
      ],
    },
    {
      slug: "vision-mission",
      title: "Vision & Mission",
      sections: [
        {
          type: "HeroBlock",
          order: 1,
          contentJson: {
            title: "Vision & Mission",
            subtitle: "Our purpose, aspirations, and principles.",
          },
        },
      ],
    },
    {
      slug: "team",
      title: "Team",
      sections: [
        {
          type: "HeroBlock",
          order: 1,
          contentJson: {
            title: "Team",
            subtitle: "Meet the people driving HOPn.",
          },
        },
      ],
    },
    {
      slug: "solutions",
      title: "Solutions",
      sections: [
        {
          type: "HeroBlock",
          order: 1,
          contentJson: {
            title: "Our Solutions",
            subtitle: "Practical, scalable technology built for business impact.",
            ctas: [{ label: "Get in Touch", href: "/contact" }],
          },
        },
        {
          type: "SolutionsListBlock",
          order: 2,
          contentJson: {
            title: "Solution Areas",
            subtitle: "Each solution block is managed in the Admin Panel.",
          },
        },
        {
          type: "CTASectionBlock",
          order: 3,
          contentJson: {
            title: "Let’s build together",
            subtitle: "Talk to our team about your goals.",
            cta: { label: "Contact", href: "/contact" },
          },
        },
      ],
    },
    {
      slug: "services",
      title: "Services",
      sections: [
        {
          type: "HeroBlock",
          order: 1,
          contentJson: {
            title: "Our Services",
            subtitle: "Flexible engagement models across strategy, build, and delivery.",
            ctas: [{ label: "Contact", href: "/contact" }],
          },
        },
      ],
    },
    {
      slug: "projects",
      title: "Projects",
      sections: [
        {
          type: "ProjectsPage",
          order: 0,
          contentJson: {
            hero: {
              title: "Our Portfolio: Check Our Latest Work",
              subtitle:
                "Discover some of the innovative projects and impactful solutions we've delivered for our clients across various industries.",
              icon: "briefcase"
            },
            chips: [
              { label: "Innovation-led" },
              { label: "Production-grade", tone: "indigo" },
              { label: "Secure-by-design" },
              { label: "Measurable impact", tone: "slate" }
            ],
            projects: {
              useCms: true,
              items: [
                {
                  name: "Goldenia",
                  category: "FinTech",
                  desc:
                    "Invest in gold and ensure your money keeps up with the world's changes. A secure platform for gold investment and portfolio management.",
                  tags: ["FinTech", "Investment", "Security", "AI Insights"],
                  image: "/portfolio/fintech.jpg",
                  href: "#",
                  icon: "dollar"
                },
                {
                  name: "Find your Drug",
                  category: "HealthTech",
                  desc:
                    "Search for missing drugs with our pharmacies network. Connecting patients with essential medications through a vast network of pharmacies.",
                  tags: ["HealthTech", "Network", "Logistics", "AI Search"],
                  image: "/portfolio/healthtech.png",
                  href: "#",
                  icon: "search"
                },
                {
                  name: "KAHRAMAA Fleet",
                  category: "Logistics",
                  desc:
                    "Advanced fleet management and tracking solution. Optimizing logistics, enhancing efficiency, and ensuring real-time monitoring for large-scale fleets.",
                  tags: ["Logistics", "IoT", "Real-time Tracking", "AI Analytics"],
                  image: "/portfolio/logistics.png",
                  href: "#",
                  icon: "truck"
                },
                {
                  name: "AI-Powered Market Analysis Platform",
                  category: "AI + FinTech",
                  desc:
                    "A sophisticated platform providing deep market insights and predictive analytics using advanced AI models for financial institutions.",
                  tags: ["AI", "FinTech", "Big Data", "Predictive Analytics"],
                  image: "/portfolio/market-analysis.avif",
                  href: "#",
                  icon: "chart",
                  featured: true
                }
              ]
            },
            projectCardCtaLabel: "View Project Details",
            projectCardCtaHref: "#",
            cta: {
              title: "Have a Project in Mind?",
              subtitle:
                "If you're looking to develop an innovative solution or transform your business with technology, we'd love to hear from you. Let's discuss how HOPn can bring your vision to life.",
              icon: "users",
              primaryCta: { label: "Let's Build Together", href: "/contact" },
              secondaryCta: { label: "Talk to an Expert", href: "/contact" }
            }
          }
        },
        {
          type: "HeroBlock",
          order: 1,
          contentJson: {
            title: "Projects",
            subtitle: "Selected projects and case studies delivered by HOPn.",
          },
        },
        {
          type: "ProjectsGridBlock",
          order: 2,
          contentJson: {
            title: "Featured Work",
            subtitle: "Explore outcomes across industries.",
            showFilters: true,
          },
        },
      ],
    },
    {
      slug: "labs",
      title: "HOPn Labs",
      sections: [
        {
          type: "LabsPage",
          order: 0,
          contentJson: {
            nav: {
              items: [
                { label: "Overview", href: "#overview" },
                { label: "Core", href: "#core" },
                { label: "Programs", href: "#programs" },
                { label: "Contact", href: "#contact" }
              ]
            },
            hero: {
              pills: [
                { label: "Innovation engine", tone: "cyan", icon: true },
                { label: "Research - Prototyping", tone: "green" },
                { label: "Programs - Community", tone: "violet" }
              ],
              icon: "flask",
              title: "HOPn Labs",
              subtitle: "Where ideas become prototypes - and prototypes become impact.",
              lead:
                "A dynamic ecosystem for research, development, collaboration, and learning - turning visionary ideas into practical, measurable outcomes.",
              primaryCta: { label: "Explore Programs", href: "#programs" },
              secondaryCta: { label: "Collaborate With Us", href: "/contact" },
              trustBadges: [
                { label: "Safe experimentation", icon: "lock" },
                { label: "Delivery discipline", icon: "shield" },
                { label: "Partnerships and community", icon: "globe" }
              ],
              quickStats: [
                { title: "Governance", sub: "Evidence, controls, audit trails", icon: "shield" },
                { title: "Velocity", sub: "Fast cycles, measurable learning", icon: "zap" },
                { title: "Network", sub: "Labs, partners, programs", icon: "globe" }
              ]
            },
            core: {
              header: {
                prefix: "HOPn Labs",
                title: "Core Functions",
                subtitle: "Four pillars that power experimentation, partnerships, and delivery.",
                icon: "flask"
              },
              items: [
                {
                  title: "Research & Development Hub",
                  desc:
                    "A focused environment for experimentation and delivery - turning ideas into secure, usable prototypes and products.",
                  icon: "flask",
                  tags: ["Rapid prototyping", "Applied research", "Delivery-ready"]
                },
                {
                  title: "University Partnerships",
                  desc:
                    "We collaborate with universities to connect theoretical research to real deployments and measurable outcomes.",
                  icon: "building",
                  tags: ["Joint research", "Curriculum", "Talent pipeline"]
                },
                {
                  title: "Idea Incubation & Prototyping",
                  desc:
                    "From concept to clickable demo fast - validate assumptions, iterate, and learn with real feedback.",
                  icon: "lightbulb",
                  tags: ["Experiments", "MVPs", "Validation"]
                },
                {
                  title: "Support for Emerging Projects",
                  desc:
                    "Resources, mentorship, and a collaborative ecosystem to accelerate partner projects and internal initiatives.",
                  icon: "users2",
                  tags: ["Mentorship", "Partnerships", "Acceleration"]
                }
              ]
            },
            focus: {
              header: {
                prefix: "HOPn Labs",
                title: "Key Focus Areas",
                subtitle: "Applied research and product thinking across AI and FinTech.",
                icon: "cpu"
              },
              items: [
                {
                  title: "AI Ahead: Learn - Lead - Innovate",
                  desc: "Applied AI research and productization for practical solutions and real-world value.",
                  icon: "cpu",
                  tags: ["LLMs", "Vision", "MLOps"]
                },
                {
                  title: "Empowering FinTech with AI",
                  desc: "AI-driven FinTech solutions that reduce friction, increase trust, and improve decision-making.",
                  icon: "dollar",
                  tags: ["Fraud", "Credit", "Personalization"]
                },
                {
                  title: "AI-Powered Automation",
                  desc: "Transform workflows with intelligent automation that improves speed, quality, and cost efficiency.",
                  icon: "settings",
                  tags: ["Workflows", "RPA+", "Observability"]
                }
              ]
            },
            approach: {
              header: {
                prefix: "HOPn Labs",
                title: "How We Work",
                subtitle: "A repeatable way to learn fast, reduce risk, and ship outcomes.",
                icon: "shield"
              },
              items: [
                {
                  k: "01",
                  title: "Discover",
                  desc: "Define goals, constraints, and success metrics with stakeholders.",
                  icon: "users2"
                },
                {
                  k: "02",
                  title: "Design",
                  desc: "Architecture, data flows, and risk controls built around outcomes.",
                  icon: "wand"
                },
                {
                  k: "03",
                  title: "Deliver",
                  desc: "Iterative prototypes and pilots with feedback loops and measurable results.",
                  icon: "server"
                },
                {
                  k: "04",
                  title: "Scale",
                  desc: "Production hardening, governance, and a roadmap to grow adoption.",
                  icon: "badge"
                }
              ]
            },
            programs: {
              header: {
                prefix: "HOPn Labs",
                title: "Programs & Initiatives",
                subtitle: "Learn, build, and collaborate through hands-on programs and community projects.",
                icon: "zap"
              },
              items: [
                {
                  title: "Bootcamps & Workshops",
                  desc: "Hands-on learning with real projects - practical skills designed to create real impact.",
                  icon: "pencil",
                  tags: ["Hands-on", "Mentored", "Project-based"]
                },
                {
                  title: "Opportunities for Students",
                  desc: "Internships, mentoring, and participation in innovation - learn by shipping real work.",
                  icon: "graduation",
                  tags: ["Internships", "Mentoring", "Experience"]
                },
                {
                  title: "Hackathons & Open Source",
                  desc: "Collaborate, build fast, and contribute to initiatives that matter in AI and FinTech.",
                  icon: "code",
                  tags: ["Hackathons", "Open source", "Community"]
                }
              ]
            },
            testimonials: {
              header: {
                prefix: "HOPn Labs",
                title: "What People Say",
                subtitle: "A few examples of what partners and participants value.",
                icon: "quote"
              },
              items: [
                {
                  quote: "The lab structure made experimentation safe and fast - we went from idea to pilot with confidence.",
                  name: "Product Lead",
                  meta: "Innovation Program"
                },
                {
                  quote: "University collaboration helped us turn research into something teams could actually ship and measure.",
                  name: "Engineering Manager",
                  meta: "Applied AI"
                },
                {
                  quote: "The workshops produced real projects, not just certificates - the outcomes were immediately useful.",
                  name: "Program Partner",
                  meta: "Talent & Training"
                }
              ]
            },
            contact: {
              imageUrl:
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
              imageAlt: "Collaboration",
              badgeTitle: "Build with the Lab",
              badgeSubtitle: "Research - Pilots - Programs",
              kicker: "Start a conversation",
              title: "Ready to build your next prototype or program?",
              subtitle:
                "Tell us what you want to explore - we'll reply with a suggested collaboration model, timeline, and next steps.",
              primaryCta: { label: "Collaborate With Us", href: "/contact" },
              secondaryCta: { label: "Explore Events", href: "/events" },
              infoCards: [
                { title: "Safe to try", desc: "Governance, guardrails, and evidence." },
                { title: "Built to ship", desc: "Pilots that scale into production." }
              ]
            }
          }
        }
      ]
    },
    {
      slug: "partnerships",
      title: "Partnerships",
      sections: [
        {
          type: "HeroBlock",
          order: 1,
          contentJson: {
            title: "Partnerships",
            subtitle: "We build strong partnerships across Germany and Europe.",
          },
        },
        {
          type: "PartnersCarouselBlock",
          order: 2,
          contentJson: {
            title: "Our Partners",
            subtitle: "Technology, industry, and innovation hubs.",
          },
        },
      ],
    },
    {
      slug: "imprint",
      title: "Imprint",
      sections: [
        {
          type: "RichTextBlock",
          order: 1,
          contentJson: {
            title: "Imprint",
            body: "Imprint content will be managed via the Admin Panel.",
          },
        },
      ],
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      sections: [
        {
          type: "RichTextBlock",
          order: 1,
          contentJson: {
            title: "Privacy Policy",
            body: "Privacy policy content will be managed via the Admin Panel.",
          },
        },
      ],
    },
    {
      slug: "cookies",
      title: "Cookie Policy",
      sections: [
        {
          type: "RichTextBlock",
          order: 1,
          contentJson: {
            title: "Cookie Policy",
            body: "Cookie policy content will be managed via the Admin Panel.",
          },
        },
      ],
    },
  ];

  for (const page of pages) {
    const saved = await prisma.page.upsert({
      where: { slug: page.slug },
      update: { title: page.title },
      create: { slug: page.slug, title: page.title },
    });

    await prisma.section.deleteMany({ where: { pageId: saved.id } });
    await prisma.section.createMany({
      data: page.sections.map((s) => ({
        pageId: saved.id,
        type: s.type,
        contentJson: s.contentJson,
        order: s.order,
        visible: true,
      })),
    });
  }
}

async function main() {
  console.log("Seeding HOPn data...");

  await prisma.navItem.deleteMany();
  await prisma.navItem.createMany({
    data: [
      { label: "Home", url: "/", order: 1, visible: true, location: "HEADER" },
      { label: "About", url: "/about", order: 2, visible: true, location: "HEADER" },
      { label: "Solutions", url: "/solutions", order: 3, visible: true, location: "HEADER" },
      { label: "Projects", url: "/projects", order: 4, visible: true, location: "HEADER" },
      { label: "Partnerships", url: "/partners", order: 5, visible: true, location: "HEADER" },
      {
        label: "Get in Touch",
        url: "/contact",
        order: 6,
        visible: true,
        location: "HEADER",
        isCta: true,
      },
      { label: "Imprint", url: "/imprint", order: 1, visible: true, location: "FOOTER" },
      { label: "Privacy", url: "/privacy", order: 2, visible: true, location: "FOOTER" },
      { label: "Cookies", url: "/cookies", order: 3, visible: true, location: "FOOTER" },
    ],
  });
  await prisma.partnerSettings.upsert({
    where: { id: 1 },
    update: { displayMode: "carousel", carouselSpeed: 30 },
    create: { displayMode: "carousel", carouselSpeed: 30 },
  });

  await prisma.solution.deleteMany();
  await prisma.solution.createMany({
    data: [
      {
        title: "AI and Automation",
        description: "AI-powered solutions to automate processes and enhance decision-making.",
        bulletsProblems: ["Manual processes", "Slow decisions"],
        bulletsDeliverables: ["Automation workflows", "AI models"],
        icon: "sparkles",
        ctaLabel: "Explore AI",
        ctaUrl: "/ai-solutions",
        visible: true,
        order: 1,
      },
      {
        title: "Custom Software Development",
        description: "Scalable web and mobile applications tailored to business needs.",
        bulletsProblems: ["Legacy systems", "Poor UX"],
        bulletsDeliverables: ["Web apps", "Mobile apps"],
        icon: "code",
        ctaLabel: "Build with us",
        ctaUrl: "/contact",
        visible: true,
        order: 2,
      },
      {
        title: "Digital Transformation",
        description: "Modernizing systems, workflows, and digital experiences.",
        bulletsProblems: ["Outdated tooling", "Process gaps"],
        bulletsDeliverables: ["Roadmaps", "Modern stacks"],
        icon: "refresh",
        ctaLabel: "Transform",
        ctaUrl: "/contact",
        visible: true,
        order: 3,
      },
      {
        title: "IT and Technology Consulting",
        description: "Strategic guidance for architecture, tools, and execution.",
        bulletsProblems: ["Unclear architecture", "Delivery risk"],
        bulletsDeliverables: ["Architecture review", "Delivery plan"],
        icon: "compass",
        ctaLabel: "Consult",
        ctaUrl: "/contact",
        visible: true,
        order: 4,
      },
      {
        title: "Data and Cloud Solutions",
        description: "Secure and scalable cloud infrastructure and analytics.",
        bulletsProblems: ["Data silos", "Scaling issues"],
        bulletsDeliverables: ["Cloud setup", "Analytics pipelines"],
        icon: "cloud",
        ctaLabel: "Scale Data",
        ctaUrl: "/contact",
        visible: true,
        order: 5,
      },
      {
        title: "Innovation and Startup Support",
        description: "Support for ideation, MVP delivery, fundraising readiness, and product strategy.",
        bulletsProblems: ["Unvalidated ideas", "Slow MVPs"],
        bulletsDeliverables: ["MVPs", "Pitch support"],
        icon: "rocket",
        ctaLabel: "Start Now",
        ctaUrl: "/contact",
        visible: true,
        order: 6,
      },
    ],
  });

  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: "AI Market Analysis Platform",
        shortDesc: "Predictive analytics for financial institutions.",
        longDesc: "A platform that delivers deep market insights using advanced AI models.",
        industry: "FinTech",
        techTags: ["AI", "Big Data", "Analytics"],
        coverImage: "/portfolio/market-analysis.avif",
        highlights: ["Improved forecasting accuracy", "Faster decision cycles"],
        featured: true,
        published: true,
        order: 1,
      },
      {
        title: "Fleet Management Suite",
        shortDesc: "Real-time tracking and optimization for logistics fleets.",
        longDesc: "Fleet management with live telemetry and operational insights.",
        industry: "Logistics",
        techTags: ["IoT", "Real-time", "Dashboards"],
        coverImage: "/portfolio/logistics.png",
        highlights: ["Reduced downtime", "Operational visibility"],
        featured: false,
        published: true,
        order: 2,
      },
    ],
  });

  await prisma.partner.deleteMany();
  await prisma.partner.createMany({
    data: [
      { name: "SAP", partnershipType: "Technology", visible: true, order: 1 },
      { name: "Siemens", partnershipType: "Industry", visible: true, order: 2 },
      { name: "Deutsche Telekom", partnershipType: "Industry", visible: true, order: 3 },
      { name: "Bosch", partnershipType: "Industry", visible: true, order: 4 },
    ],
  });

  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Prof. Dr. Ebada",
        role: "CEO",
        bio: "Visionary leader driving HOPn’s strategic direction.",
        linkedinUrl: "#",
        visible: true,
        order: 1,
      },
      {
        name: "Dr. Nour Howeidi",
        role: "CGO",
        bio: "Growth strategist focused on delivering customer value.",
        linkedinUrl: "#",
        visible: true,
        order: 2,
      },
    ],
  });

  await upsertSetting("branding", {
    brand_name: "HOPn",
    footer_company_text: "Driving innovation through technology.",
    social_links: {
      linkedin: "https://www.linkedin.com/company/hopn-ug/?viewAsMember=true",
      twitter: "#",
      github: "#",
      email: "hello@hopn.com",
    },
  });

  await upsertSetting("theme", {
    palette_locked: true,
    animations_enabled: true,
  });

  await upsertSetting("integrations", {
    analyticsId: "",
    smtp: {
      host: "",
      port: 587,
      user: "",
    },
    emailNotifications: {
      enabled: true,
      to: "info@hopn.eu",
      from: "no-reply@hopn.eu",
      subject: "New HOPn lead",
      smtp: {
        host: "",
        port: 587,
        user: "",
        pass: "",
        secure: false,
      },
    },
  });

  await upsertSetting("captcha_public", {
    enabled: true,
    provider: "recaptcha",
    siteKey: "",
  });

  await upsertSetting("legal_imprint", {
    body: "Imprint content managed via Admin Panel.",
  });

  await upsertSetting("legal_privacy", {
    body: "Privacy policy content managed via Admin Panel.",
  });

  await upsertSetting("legal_cookies", {
    body: "Cookie policy content managed via Admin Panel.",
  });

  await upsertSetting("seo_defaults", {
    titleTemplate: "%s | HOPn",
    ogImage: "",
  });

  await upsertSetting("security", {
    rateLimitEnabled: true,
    allowedFileTypes: ["image/png", "image/jpeg", "image/webp"],
  });

  await upsertSetting("backups", {
    enabled: false,
  });

  await upsertSetting("tracking", {
    analyticsId: "",
    enableCookies: true,
  });

  await upsertSetting("page_about", {
    eyebrow: "ABOUT HOPN",
    title: "Building the ecosystem for applied innovation",
    body:
      "HOPn connects research, product, and delivery through a single innovation network. We help teams move from idea to real-world impact with practical engineering, fast prototyping, and measurable outcomes.",
    ctas: [
      { label: "Vision & Mission", href: "/vision-mission", variant: "primary" },
      { label: "Meet the Team", href: "/team", variant: "secondary" },
    ],
  });

  await upsertSetting("page_ai_solutions", {
    hero: {
      eyebrow: "AI Solutions • HOPn",
      title: "Build AI that ships, scales, and pays back.",
      subtitle:
        "Bespoke AI services designed for real-world delivery — from proof-of-value to production systems with governance, monitoring, and measurable ROI.",
      primaryCta: { label: "Explore Capabilities", href: "#capabilities" },
      secondaryCta: { label: "Discuss Your AI Project", href: "/contact" },
    },
    chips: ["ML • NLP • Analytics", "Automation", "Secure-by-design", "MVP → Production"],
    stats: [
      { k: "Approach", v: "Outcome-first delivery" },
      { k: "Deployment", v: "Governance + monitoring" },
      { k: "Speed", v: "Prototype in weeks" },
    ],
    roadmap: [
      { k: "Discover", d: "Goals, data readiness, ROI metrics" },
      { k: "Prototype", d: "Proof-of-value with measurable lift" },
      { k: "Deploy", d: "Integrate, monitor, govern" },
      { k: "Optimize", d: "Continuous improvement & adoption" },
    ],
    benefits: [
      "Enhanced Decision-Making",
      "Personalized Customer Experiences",
      "Competitive Advantage",
      "Improved Operational Efficiency",
      "New Revenue Streams",
      "Operational Trust & Governance",
    ],
    cta: {
      eyebrow: "Let’s build something real",
      title: "Ready to implement AI and drive growth?",
      subtitle:
        "Discover how tailored AI solutions can optimize operations, enhance customer experiences, and give you a significant competitive edge.",
      primaryCta: { label: "Discuss Your AI Project", href: "/contact" },
      secondaryCta: { label: "Revisit Capabilities", href: "#capabilities" },
      tags: ["MVP in weeks", "Secure deployment", "Measurable ROI"],
    },
  });

  await upsertSetting("page_services", {
    hero: {
      title: "Services & Solutions",
      subtitle:
        "A focused portfolio of services that help you modernize, secure, and scale your digital products.",
    },
    services: [
      { title: "AI Solutions", desc: "Custom AI models, data analytics, and automation strategies.", href: "/ai-solutions", icon: "BrainCircuit" },
      { title: "FinTech Innovations", desc: "Secure, scalable, and compliant financial technology solutions.", href: "/fintech-innovations", icon: "DollarSign" },
      { title: "Digital Twins", desc: "Dynamic virtual replicas for performance enhancement and optimization.", href: "/digital-twins", icon: "Users" },
      { title: "EduTech", desc: "Specialized tech training programs and structured learning pathways.", href: "/education-events", icon: "GraduationCap" },
      { title: "Tech Consulting", desc: "Strategic guidance for navigating the complex technology landscape.", href: "/consulting", icon: "MessageSquareText" },
    ],
  });

  await upsertSetting("page_contact", {
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
    infoCards: [
      { title: "Our Office", lines: ["Weichterstr 1,", "Buchloe, 86807, Germany"], icon: "Building2", iconAlt: "MapPin" },
      { title: "Call Us", lines: ["+49 179 41 70 592"], icon: "Phone" },
      { title: "General Inquiries", lines: ["info@hopn.eu"], icon: "Mail" },
    ],
  });

  await upsertSetting("page_events", {
    hero: {
      kicker: "CONNECT & LEARN",
      title: "Events & Webinars",
      subtitle:
        "Join our community of developers, architects, and industry leaders to explore the future of digital platforms.",
    },
    events: [
      {
        id: "e1",
        status: "upcoming",
        type: "Conference",
        dateLabel: "MARCH 15, 2026",
        title: "Nexius Summit 2026: The AI Enterprise",
        desc: "Join 500+ industry leaders for a deep dive into generative AI strategies for the modern enterprise.",
        location: "Berlin, Germany",
        cover:
          "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1600&q=80",
      },
      {
        id: "e2",
        status: "upcoming",
        type: "Webinar",
        dateLabel: "APRIL 02, 2026",
        title: "Mastering API Security in the Cloud",
        desc: "Learn how to secure your microservices architecture against the latest OWASP threats.",
        location: "Online",
        cover:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
      },
      {
        id: "e3",
        status: "upcoming",
        type: "Workshop",
        dateLabel: "APRIL 10, 2026",
        title: "DevOps World Tour: London",
        desc: "A hands-on workshop on Kubernetes orchestration and CI/CD pipelines.",
        location: "London, UK",
        cover:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
      },
      {
        id: "e4",
        status: "past",
        type: "Webinar",
        dateLabel: "JAN 01, 2026",
        title: "Identity Management for FinTech",
        desc: "Watch the recording of our deep dive into CIAM for banking applications.",
        location: "Online",
        cover:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    featuredIndex: 0,
    speakers: {
      title: "Call for Speakers",
      body:
        "Are you an expert in API Management, AI, or Cloud Security? We are always looking for thought leaders to speak at our webinars and conferences.",
      ctaLabel: "Apply to Speak",
      reasonsTitle: "Why Speak at Nexius?",
      reasons: [
        "Reach a global audience of 50k+ developers",
        "Network with industry CTOs and Architects",
        "Full marketing support for your session",
      ],
    },
  });

  await upsertSetting("page_carres", {
    hero: {
      title: "Careers at HOPn",
      subtitle:
        "Join our team of innovators, thinkers, and builders. Explore exciting career opportunities and help us shape the future of technology.",
    },
    whyTitle: "Why Work With Us?",
    whyCards: [
      { title: "Impactful Work", desc: "Contribute to projects that make a real difference for our clients and society.", icon: "Award" },
      { title: "Growth Opportunities", desc: "We invest in your development with continuous learning and career advancement paths.", icon: "TrendingUp" },
      { title: "Innovative Culture", desc: "Be part of a dynamic and collaborative environment that fosters creativity and exploration.", icon: "Lightbulb" },
    ],
    openingsTitle: "Current Openings",
    openings: [
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
    ],
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

  await upsertSetting("page_education-events", {
    hero: {
      title: "EduTech by HOPn",
      subtitle:
        "Empowering people and organizations through training programs and applied learning.",
      body:
        "We deliver high-quality training, interactive workshops, and cohort-based learning designed to grow skills, share knowledge, and build stronger communities.",
      cta: "Our Offerings",
    },
    narrative: {
      title: "Fostering Growth Through Continuous Learning",
      body: [
        "At HOPn, we champion the power of continuous learning and collaborative knowledge exchange. Our EduTech division is dedicated to providing relevant training programs, interactive workshops, and applied practice labs.",
        "We collaborate with industry experts and academic institutions to deliver engaging, up-to-date content and help individuals and organizations thrive in a fast-changing digital world.",
      ],
    },
    offeringsTitle: "Educational Offerings and Programs",
    offeringsSubtitle:
      "From corporate training to cohort programs - built to upskill, practice, and deliver.",
    offerings: [
      {
        title: "Corporate Training Programs",
        desc: "Customized training sessions and workshops designed to upskill your workforce in the latest technologies, methodologies, and digital best practices.",
        icon: "Building2",
        tag: "Team Upskilling",
      },
      {
        title: "Learning Design and Curriculum",
        desc: "Structured curricula and learning paths tailored to roles, levels, and business outcomes.",
        icon: "BookOpen",
        tag: "Outcome-based",
      },
      {
        title: "Cohorts and Bootcamps",
        desc: "Intensive, project-focused programs that help teams ship real deliverables.",
        icon: "Users2",
        tag: "Hands-on",
      },
      {
        title: "Mentorship and Enablement",
        desc: "Guided mentorship, feedback loops, and enablement to sustain long-term capability growth.",
        icon: "BadgeCheck",
        tag: "Sustained",
      },
    ],
    whyTitle: "Why Choose HOPn EduTech?",
    whyLeft: [
      { text: "Upskilled and future-ready workforce" },
      { text: "Role-based learning paths" },
      { text: "Practical skill development" },
    ],
    whyRight: [
      { text: "Applied, project-based learning" },
      { text: "Enhanced innovation culture" },
    ],
    levelsTitle: "Learning Levels",
    levelsSubtitle:
      "Clear pathways for individuals and teams - from fundamentals to advanced delivery.",
    levels: [
      {
        title: "Foundation",
        icon: "BookOpen",
        desc: "Build core digital skills and modern workflows with guided exercises and hands-on labs.",
        points: ["Beginner-friendly", "Practical projects", "Mentor support"],
      },
      {
        title: "Professional",
        icon: "Layers",
        desc: "Deepen expertise with structured modules, case studies, and industry-ready deliverables.",
        points: ["Intermediate tracks", "Real scenarios", "Portfolio outcomes"],
      },
      {
        title: "Advanced",
        icon: "ShieldCheck",
        desc: "Mastery-level programs focused on leadership, strategy, and high-impact delivery at scale.",
        points: ["Advanced topics", "Governance and quality", "Capstone demo day"],
      },
    ],
    cta: {
      title: "Join Our Learning Community",
      body:
        "Explore learning tracks and training programs to enhance your skills, expand your knowledge, and build real capability.",
      button: "View Learning Tracks",
    },
  });

  await upsertSetting("page_digital-twins", {
    hero: {
      title: "Digital Twins by HOPn",
      subtitle:
        "Creating dynamic virtual representations of physical assets, processes, and systems to unlock new levels of insight, control, and predictive capability.",
      cta: "Start Your Digital Twin Journey",
    },
    lifecycle: {
      title: "The Digital Twin Lifecycle",
      subtitle:
        "A practical path from instrumentation to optimization—built to run in production.",
    },
    socialProof: {
      title: "Real outcomes, clear value",
      subtitle:
        "What teams tend to highlight after shipping Digital Twins with us.",
    },
    cta: {
      kicker: "Start your journey",
      title: "Start your Digital Twin journey",
      body:
        "Let’s explore how Digital Twin technology can revolutionize your operations—offering predictive insights and a distinct competitive advantage.",
      button: "Start Your Digital Twin Journey",
    },
  });

  await upsertSetting("page_fintech-innovations", {
    hero: {
      title: "FinTech Innovations by HOPn",
      subtitle:
        "Build secure, scalable, and modern financial products — from digital banking and payments to RegTech and tokenization — with engineering rigor and exceptional UX.",
      cta: "Explore FinTech Solutions",
    },
    servicesTitle: "FinTech Service Areas",
    servicesSubtitle:
      "Built to help you launch, modernize, and scale financial services with strong security, governance, and performance.",
    approachTitle:
      "A delivery approach that reduces risk and speeds up outcomes",
    approachSubtitle:
      "We combine product thinking, security engineering, and platform reliability to ship compliant systems that teams can run confidently.",
    benefitsTitle: "Benefits you can feel in production",
    socialTitle: "Trusted delivery, clear outcomes",
    socialSubtitle: "A few examples of what teams value when working with us.",
    ctaTitle: "Ready to modernize your financial services?",
    ctaBody:
      "Tell us what you’re building — we’ll respond with a suggested approach, timeline, and the fastest path to a secure launch.",
    ctaButton: "Explore FinTech Solutions",
  });

  await upsertSetting("page_consulting", {
    hero: {
      title: "Technology Consulting by HOPn",
      subtitle:
        "Expert guidance to navigate complex technology decisions — turning ambiguity into a clear plan, secure execution, and measurable business impact.",
      primaryCta: "Explore Expertise",
      secondaryCta: "Request Consultation",
    },
    expertiseTitle: "Our Core Consulting Expertise Areas",
  });

  await upsertSetting("page_vision_mission", {
    hero: {
      title: "Who We Are",
      subtitle:
        "Understanding HOPn: our purpose, aspirations, and the principles that define us.",
      chips: ["Innovation-led", "Production-grade", "Secure-by-design", "Measurable impact"],
    },
    meaning: [
      { id: "m1", title: "Hop into Innovation", desc: "We move fast, prototype smart, and turn ideas into real outcomes — with measurable impact." },
      { id: "m2", title: "Hub of Projects & Networks", desc: "A connected ecosystem: projects, people, and partnerships working together to ship value." },
      { id: "m3", title: "Higher Order Prototyping Network", desc: "A network designed for repeatable prototyping — production-aware, governed, and scalable." },
    ],
    vision: {
      title: "Our Vision",
      body:
        "To become the leading platform where innovation, education, and technology converge — simplifying life through connected services in AI, FinTech, automation, and digital transformation.",
      tags: ["Platform", "Ecosystem", "Impact"],
    },
    mission: {
      title: "Our Mission",
      body:
        "HOPn’s mission is to empower individuals, universities, and startups by uniting smart services and practical education in one seamless ecosystem. Through digital twins, AI, FinTech, automation, and hands-on training, we build bridges between research, innovation, and real-world impact — simplifying complexity and accelerating progress.",
      tags: ["Education", "Delivery", "Acceleration"],
    },
    values: [
      { id: "v1", title: "Innovation", desc: "Continuously seeking and implementing novel solutions to complex challenges, fostering a culture of creativity and forward-thinking." },
      { id: "v2", title: "Collaboration", desc: "Working together with our clients, partners, and within our teams to achieve shared goals and deliver superior outcomes." },
      { id: "v3", title: "Excellence", desc: "Striving for the highest standards in everything we do, from product development to client service, ensuring quality and reliability." },
      { id: "v4", title: "Integrity", desc: "Operating with transparency, honesty, and ethical principles in all our interactions and business practices." },
    ],
    coreValues: {
      eyebrow: "CORE VALUES",
      title: "What we optimize for",
      subtitle: "Principles that shape how we build, partner, and deliver — across every project.",
    },
    quote: {
      text: "“Together, we build the future, driven by our vision and guided by our values.”",
      primaryCta: { label: "Explore Insights", href: "/insights" },
      secondaryCta: { label: "Collaborate with us", href: "/contact" },
    },
  });

  await seedPages();
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
