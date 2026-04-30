export const DEFAULT_HOME_CONTENT = {
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
  servicesSection: {
    title: "Our Core",
    titleAccent: "Services",
    titleSuffix: "& Expertise",
    subtitle:
      "We offer a comprehensive suite of technology services and solutions designed to empower your business, drive digital transformation, and unlock new avenues for growth and innovation.",
    icon: "cpu",
  },
  partners: {
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
      { name: "Infineon", logo: "/partners/infineon.png" },
    ],
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
      { name: "Digital Twin Research Group" },
    ],
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
      icon: "eye",
    },
    mission: {
      title: "Our Mission",
      body:
        "HOPn's mission is to empower individuals, universities, and startups by uniting smart services and practical education in one seamless ecosystem. Through digital twins, AI, FinTech, automation, and hands-on training, we build bridges between research, innovation, and real-world impact, simplifying complexity and accelerating progress.",
      icon: "rocket",
    },
    coreValues: {
      title: "Our Core Values",
      subtitle: "The standards that shape how we work, build, and collaborate-every day.",
      icon: "target",
    },
    values: [
      { icon: "rocket", title: "Innovation", desc: "Pioneering breakthroughs and novel solutions." },
      { icon: "shield", title: "Integrity", desc: "Upholding honesty and ethical principles." },
      { icon: "handshake", title: "Collaboration", desc: "Achieving collective success through teamwork." },
      { icon: "target", title: "Excellence", desc: "Consistently striving for the highest quality." },
    ],
  },
  cta: {
    title: "Ready to Innovate Together?",
    body:
      "Let's discuss how HOPn's expertise can propel your business forward. Whether you have a specific project in mind, seek strategic advice, or wish to explore potential collaborations, we're eager to connect and explore the possibilities.",
    primaryCta: { label: "Send Us a Message", href: "/contact" },
    secondaryCta: { label: "Call Us Now", href: "/contact" },
    image: { url: "/home/cta.png", alt: "Innovation visual" },
    badgeLogoUrl: "/home/hopn-logo-2026.png",
    footerPrefix: "Or, ",
    footerLinkLabel: "explore our comprehensive services",
    footerLinkHref: "/services",
    footerSuffix: "to see how we can tailor solutions for your unique needs.",
  },
};

export const DEFAULT_CONSULTING_CONTENT = {
  hero: {
    title: "Technology Consulting by HOPn",
    subtitle:
      "Expert guidance to navigate complex technology decisions — turning ambiguity into a clear plan, secure execution, and measurable business impact.",
    primaryCta: "Explore Expertise",
    secondaryCta: "Request Consultation",
  },
  expertiseTitle: "Our Core Consulting Expertise Areas",
};

export const DEFAULT_DIGITAL_TWINS_CONTENT = {
  hero: {
    title: "Digital Twins by HOPn",
    subtitle:
      "Creating dynamic virtual representations of physical assets, processes, and systems to unlock new levels of insight, control, and predictive capability.",
    cta: "Start Your Digital Twin Journey",
  },
  lifecycle: {
    title: "The Digital Twin Lifecycle",
    subtitle: "A practical path from instrumentation to optimization—built to run in production.",
  },
  socialProof: {
    title: "Real outcomes, clear value",
    subtitle: "What teams tend to highlight after shipping Digital Twins with us.",
  },
  cta: {
    kicker: "Start your journey",
    title: "Start your Digital Twin journey",
    body:
      "Let’s explore how Digital Twin technology can revolutionize your operations—offering predictive insights and a distinct competitive advantage.",
    button: "Start Your Digital Twin Journey",
  },
};

export const DEFAULT_FINTECH_INNOVATIONS_CONTENT = {
  hero: {
    title: "FinTech Innovations by HOPn",
    subtitle:
      "Build secure, scalable, and modern financial products — from digital banking and payments to RegTech and tokenization — with engineering rigor and exceptional UX.",
    cta: "Explore FinTech Solutions",
  },
  servicesTitle: "FinTech Service Areas",
  servicesSubtitle:
    "Built to help you launch, modernize, and scale financial services with strong security, governance, and performance.",
  approachTitle: "A delivery approach that reduces risk and speeds up outcomes",
  approachSubtitle:
    "We combine product thinking, security engineering, and platform reliability to ship compliant systems that teams can run confidently.",
  benefitsTitle: "Benefits you can feel in production",
  socialTitle: "Trusted delivery, clear outcomes",
  socialSubtitle: "A few examples of what teams value when working with us.",
  ctaTitle: "Ready to modernize your financial services?",
  ctaBody:
    "Tell us what you’re building — we’ll respond with a suggested approach, timeline, and the fastest path to a secure launch.",
  ctaButton: "Explore FinTech Solutions",
};

export const DEFAULT_EDUCATION_EVENTS_CONTENT = {
  hero: {
    title: "EduTech by HOPn",
    subtitle: "Empowering people and organizations through training programs and applied learning.",
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
  offeringsSubtitle: "From corporate training to cohort programs - built to upskill, practice, and deliver.",
  offerings: [
    {
      title: "Corporate Training Programs",
      desc:
        "Customized training sessions and workshops designed to upskill your workforce in the latest technologies, methodologies, and digital best practices.",
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
  levelsSubtitle: "Clear pathways for individuals and teams - from fundamentals to advanced delivery.",
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
};

export const DEFAULT_CONTACT_CONTENT = {
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
    {
      title: "Headquarters",
      lines: ["Germany"],
      icon: "Building2",
      iconAlt: "MapPin",
    },
    {
      title: "Talk to us",
      lines: ["+49 151 29400489", "+49 176 81603494"],
      icon: "Phone",
    },
    {
      title: "General Inquiries",
      lines: ["info@hopn.eu"],
      icon: "Mail",
    },
  ],
};

export const DEFAULT_CARRES_CONTENT = {
  hero: {
    title: "Careers at HOPn",
    subtitle:
      "Join our team of innovators, thinkers, and builders. Explore exciting career opportunities and help us shape the future of technology.",
  },
  whyTitle: "Why Work With Us?",
  whyCards: [
    { title: "Work with impact", desc: "Build products that solve real-world problems.", icon: "Award" },
    { title: "Grow fast", desc: "Mentorship, learning, and real responsibility from day one.", icon: "TrendingUp" },
    { title: "Innovate daily", desc: "Work alongside ambitious teams on cutting-edge tech.", icon: "Lightbulb" },
  ],
  openingsTitle: "Current Openings",
  openings: [
    {
      title: "AI/ML Engineer",
      dept: "Engineering",
      desc:
        "Join our AI team to design, develop, and deploy cutting-edge machine learning models and AI solutions for diverse client projects.",
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
      desc:
        "Work on exciting Digital Twin projects, helping clients create virtual replicas of their assets and processes for optimization.",
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
};

export const DEFAULT_PARTNERS_CONTENT = {
  hero: {
    title: "Our Valued Partners",
    subtitle:
      "At HOPn, we believe in the power of synergy. We collaborate with leading organizations worldwide to drive innovation, create exceptional value, and achieve shared success for a better future.",
    chips: ["Co-build", "Research", "FinTech", "Sustainability"],
    highlights: [
      { title: "Secure collaboration", desc: "Shared governance and trust." },
      { title: "Fast integration", desc: "APIs plus delivery playbooks." },
      { title: "Measured outcomes", desc: "Innovation to real-world impact." },
    ],
  },
  section: {
    kicker: "ECOSYSTEM • COLLABORATION • IMPACT",
    title: "Built with partners who raise the bar",
    subtitle:
      "From strategic technology alliances to academic research and sustainability collaborations - each partnership is designed to create measurable outcomes.",
  },
  cta: {
    title: "Become a HOPn Partner",
    body:
      "We believe in the profound power of collaboration. If your organization shares our passion for technology, innovation, and positive impact, let's explore synergistic partnership opportunities.",
    primaryCta: { label: "Partner With Us", href: "/contact" },
    tags: ["AI & Research", "FinTech", "Education", "Sustainability", "Product Co-Development"],
  },
};

export const DEFAULT_INSIGHTS_CONTENT = {
  hero: {
    title: "HOPn Insights & News",
    subtitle:
      "Stay updated with the latest technology trends, expert analyses, research findings, and news from HOPn and the wider world of innovation.",
    note:
      "Thought leadership, research, and perspectives from HOPn experts and innovation labs.",
  },
  filters: [
    "All",
    "Artificial Intelligence",
    "Emerging Technologies",
    "Sustainability & Tech",
    "Digital Transformation",
    "Innovation & Startups",
  ],
};

export const DEFAULT_EVENTS_CONTENT = {
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
      desc:
        "Join 500+ industry leaders for a deep dive into generative AI strategies for the modern enterprise.",
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
      desc:
        "Learn how to secure your microservices architecture against the latest OWASP threats.",
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
};

export const DEFAULT_AI_SOLUTIONS_CONTENT = {
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
  capabilities: [
    {
      id: "ml",
      title: "Machine Learning Models",
      desc:
        "Custom ML for prediction, detection, forecasting, and decision intelligence — tuned to your real data and constraints.",
      outcomes: ["Higher accuracy forecasts", "Fraud / anomaly detection", "Smarter segmentation"],
      examples: ["Risk scoring", "Churn prediction", "Demand forecasting"],
    },
    {
      id: "analytics",
      title: "Data Analytics & Insights",
      desc:
        "Turn raw data into decision systems: KPI frameworks, dashboards, experimentation, and insight pipelines that teams actually use.",
      outcomes: ["Clear KPI ownership", "Faster decisions", "Reliable reporting"],
      examples: ["Executive dashboards", "Cohort analysis", "Attribution"],
    },
    {
      id: "nlp",
      title: "Natural Language Processing (NLP)",
      desc:
        "Build AI that understands text: semantic search, chat assistants, document intelligence, classification, and summarization.",
      outcomes: ["Faster knowledge access", "Better support", "Reduced manual review"],
      examples: ["Doc Q&A", "Ticket triage", "Contract extraction"],
    },
    {
      id: "automation",
      title: "AI-Powered Automation",
      desc:
        "Automate repetitive work with AI: intelligent routing, extraction, approvals, and workflow copilots that scale operations.",
      outcomes: ["Lower cycle time", "Fewer errors", "Operational scale"],
      examples: ["Ops automation", "Invoice parsing", "Process copilots"],
    },
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
};

export const DEFAULT_SOLUTIONS_PAGE_CONTENT = {
  title: "Solutions",
  slug: "solutions",
  seoTitle: "Solutions",
  seoDescription: "",
  ogImage: "",
  sections: [
    {
      type: "HeroBlock",
      visible: true,
      order: 0,
      content_json: {
        title: "Solutions",
        subtitle:
          "Explore HOPn’s core service areas—from AI and automation to digital transformation and cloud.",
      },
    },
    {
      type: "SolutionsListBlock",
      visible: true,
      order: 1,
      content_json: {
        title: "Solutions",
        subtitle: "Built to deliver measurable outcomes and long‑term impact.",
      },
    },
  ],
};
export const DEFAULT_LABS_CONTENT = {
  nav: {
    items: [
      { label: "Overview", href: "#overview" },
      { label: "Core", href: "#core" },
      { label: "Programs", href: "#programs" },
      { label: "Contact", href: "#contact" },
    ],
  },
  hero: {
    pills: [
      { label: "Innovation engine", tone: "cyan", icon: true },
      { label: "Research - Prototyping", tone: "green" },
      { label: "Programs - Community", tone: "violet" },
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
      { label: "Partnerships & community", icon: "globe" },
    ],
    quickStats: [
      { title: "Governance", sub: "Evidence, controls, audit trails", icon: "shield" },
      { title: "Velocity", sub: "Fast cycles, measurable learning", icon: "zap" },
      { title: "Network", sub: "Labs, partners, programs", icon: "globe" },
    ],
  },
  core: {
    header: {
      prefix: "HOPn Labs",
      title: "Core Functions",
      subtitle: "Four pillars that power experimentation, partnerships, and delivery.",
      icon: "flask",
    },
    items: [
      {
        title: "Research & Development Hub",
        desc:
          "A focused environment for experimentation and delivery - turning ideas into secure, usable prototypes and products.",
        icon: "flask",
        tags: ["Rapid prototyping", "Applied research", "Delivery-ready"],
      },
      {
        title: "University Partnerships",
        desc:
          "We collaborate with universities to connect theoretical research to real deployments and measurable outcomes.",
        icon: "building",
        tags: ["Joint research", "Curriculum", "Talent pipeline"],
      },
      {
        title: "Idea Incubation & Prototyping",
        desc:
          "From concept to clickable demo fast - validate assumptions, iterate, and learn with real feedback.",
        icon: "lightbulb",
        tags: ["Experiments", "MVPs", "Validation"],
      },
      {
        title: "Support for Emerging Projects",
        desc:
          "Resources, mentorship, and a collaborative ecosystem to accelerate partner projects and internal initiatives.",
        icon: "users2",
        tags: ["Mentorship", "Partnerships", "Acceleration"],
      },
    ],
  },
  focus: {
    header: {
      prefix: "HOPn Labs",
      title: "Key Focus Areas",
      subtitle: "Applied research and product thinking across AI and FinTech.",
      icon: "cpu",
    },
    items: [
      {
        title: "AI Ahead: Learn - Lead - Innovate",
        desc: "Applied AI research and productization for practical solutions and real-world value.",
        icon: "cpu",
        tags: ["LLMs", "Vision", "MLOps"],
      },
      {
        title: "Empowering FinTech with AI",
        desc: "AI-driven FinTech solutions that reduce friction, increase trust, and improve decision-making.",
        icon: "dollar",
        tags: ["Fraud", "Credit", "Personalization"],
      },
      {
        title: "AI-Powered Automation",
        desc: "Transform workflows with intelligent automation that improves speed, quality, and cost efficiency.",
        icon: "settings",
        tags: ["Workflows", "RPA+", "Observability"],
      },
    ],
  },
  approach: {
    header: {
      prefix: "HOPn Labs",
      title: "How We Work",
      subtitle: "A repeatable way to learn fast, reduce risk, and ship outcomes.",
      icon: "shield",
    },
    items: [
      { k: "01", title: "Discover", desc: "Define goals, constraints, and success metrics with stakeholders.", icon: "users2" },
      { k: "02", title: "Design", desc: "Architecture, data flows, and risk controls built around outcomes.", icon: "wand" },
      { k: "03", title: "Deliver", desc: "Iterative prototypes and pilots with feedback loops and measurable results.", icon: "server" },
      { k: "04", title: "Scale", desc: "Production hardening, governance, and a roadmap to grow adoption.", icon: "badge" },
    ],
  },
  programs: {
    header: {
      prefix: "HOPn Labs",
      title: "Programs & Initiatives",
      subtitle: "Learn, build, and collaborate through hands-on programs and community projects.",
      icon: "zap",
    },
    items: [
      {
        title: "Bootcamps & Workshops",
        desc: "Hands-on learning with real projects - practical skills designed to create real impact.",
        icon: "pencil",
        tags: ["Hands-on", "Mentored", "Project-based"],
      },
      {
        title: "Opportunities for Students",
        desc: "Internships, mentoring, and participation in innovation - learn by shipping real work.",
        icon: "graduation",
        tags: ["Internships", "Mentoring", "Experience"],
      },
      {
        title: "Hackathons & Open Source",
        desc: "Collaborate, build fast, and contribute to initiatives that matter in AI and FinTech.",
        icon: "code",
        tags: ["Hackathons", "Open source", "Community"],
      },
    ],
  },
  testimonials: {
    header: {
      prefix: "HOPn Labs",
      title: "What People Say",
      subtitle: "A few examples of what partners and participants value.",
      icon: "quote",
    },
    items: [
      {
        quote:
          "The lab structure made experimentation safe and fast - we went from idea to pilot with confidence.",
        name: "Product Lead",
        meta: "Innovation Program",
      },
      {
        quote:
          "University collaboration helped us turn research into something teams could actually ship and measure.",
        name: "Engineering Manager",
        meta: "Applied AI",
      },
      {
        quote:
          "The workshops produced real projects, not just certificates - the outcomes were immediately useful.",
        name: "Program Partner",
        meta: "Talent & Training",
      },
    ],
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
      { title: "Built to ship", desc: "Pilots that scale into production." },
    ],
  },
};
