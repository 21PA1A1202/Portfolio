export type EducationItem = {
  school: string
  period: string
  score: string
  note: string
  logo: string
}

export type SkillGroupKey =
  | 'programming'
  | 'frontend'
  | 'backend'
  | 'cloud'
  | 'ai'
  | 'design'

export type SkillGroup = {
  key: SkillGroupKey
  title: string
  summary: string
  items: string[]
}

export type ExperienceItem = {
  company: string
  role: string
  period: string
  location: string
  logo: string
  summary: string
  highlights: string[]
}

export type ProjectItem = {
  title: string
  category: string
  summary: string
  stack: string[]
  image?: string
  repo?: string
  live?: string
  imagePath: string
}

export type CertificateItem = {
  title: string
  issuer: string
  date: string
  image?: string
  note?: string
}

export type SocialLink = {
  label: string
  href: string
  value: string
  kind: 'github' | 'linkedin' | 'leetcode' | 'instagram'
}

export const portfolio = {
  name: 'Adhikari Hari Charan',
  fullName: 'Adhikari Naga Venkata Hari Charan',
  role: 'Software Developer',
  headline:
    'Software developer focused on building practical full-stack products with strong experience in AI workflows, automation, and intelligent systems.',
  summary:
    'Software developer with hands-on experience in AI-driven systems, workflow automation, and full-stack product engineering across frontend, backend, and intelligent integrations.',
  about:
    "Hello! I'm Adhikari Hari Charan, a software developer currently working at ChatFin. I build full-stack products using Vue.js, TypeScript, Node.js, and modern API-driven architectures, while also working deeply with AI technologies such as OpenAI, LangChain, Gemini, and Azure Document Intelligence. My experience includes workflow automation, document intelligence, enterprise integrations, and practical AI-powered product development.",
  location: 'Palakol, Andhra Pradesh, India',
  email: 'cherry2222vi@gmail.com',
  phone: '+91 9390438634',
  resumeUrl: '/Haricharan_Resume_Final.pdf',
  socials: [
    {
      label: 'GitHub',
      href: 'https://github.com/21PA1A1202',
      value: '21PA1A1202',
      kind: 'github'
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/hari-charan-a91771284/',
      value: 'hari-charan-a91771284',
      kind: 'linkedin'
    },
    {
      label: 'LeetCode',
      href: 'https://leetcode.com/u/21pa1a1202/',
      value: '21pa1a1202',
      kind: 'leetcode'
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/cherry.adhikari/',
      value: 'cherry.adhikari',
      kind: 'instagram'
    }
  ] as SocialLink[],
  heroStats: [
    { label: 'Current', value: 'Software Developer at ChatFin' },
    { label: 'Core stack', value: 'Vue, TypeScript, Node.js, AI workflows' },
    { label: 'Focus', value: 'Automation, LLM integrations, product UX' }
  ],
  education: [
    {
      school: 'Vishnu Institute of Technology',
      period: '2021 - 2025',
      score: '8.87 CGPA',
      note: 'Bachelor of Technology in Information Technology',
      logo: '/vishnu.bmp'
    },
    {
      school: 'Aditya Junior College',
      period: '2019 - 2021',
      score: '95.2%',
      note: 'Intermediate education',
      logo: '/aditya.png'
    },
    {
      school: 'Sri Chaitanya Techno School',
      period: 'Passed out in 2019',
      score: '9.8 GPA',
      note: 'Secondary education',
      logo: '/sri caitanya.png'
    }
  ] as EducationItem[],
  skillGroups: [
    {
      key: 'programming',
      title: 'Programming',
      summary: 'Core problem solving languages.',
      items: ['Java', 'Python', 'C', 'TypeScript']
    },
    {
      key: 'frontend',
      title: 'Web Engineering',
      summary: 'Fast UI delivery with modern frontend and API layers.',
      items: ['Vue.js', 'React', 'HTML', 'CSS', 'JavaScript', 'Vite', 'Tailwind CSS']
    },
    {
      key: 'backend',
      title: 'Backend and Data',
      summary: 'Services, integrations, orchestration, and persistent data flows.',
      items: ['Node.js', 'Express', 'MongoDB', 'Supabase', 'DBMS', 'Data Science']
    },
    {
      key: 'cloud',
      title: 'Cloud and Deployment',
      summary: 'Shipping and operating apps across cloud environments.',
      items: ['AWS', 'Microsoft Azure', 'Google Cloud', 'Docker']
    },
    {
      key: 'ai',
      title: 'Applied AI',
      summary: 'LLM-backed workflows for document and business automation.',
      items: ['OpenAI', 'Gemini', 'LangChain', 'Azure Document Intelligence']
    },
    {
      key: 'design',
      title: 'Design and Product',
      summary: 'Visual thinking for interfaces that feel intentional.',
      items: ['Figma', 'Blender', 'Photoshop', 'Illustrator', 'After Effects', 'Design Thinking']
    }
  ] as SkillGroup[],
  supportSkills: [
    'Data structures and algorithms',
    'Web designing',
    'Stakeholder management',
    'Leadership',
    'Effective communication',
    'Problem solving',
    'Time management'
  ],
  experience: [
    {
      company: 'ChatFin',
      role: 'Software Development Engineer',
      period: 'February 2025 - Present',
      location: 'Product engineering',
      logo: '/chatfinance_logo.jpeg',
      summary:
        'Building and improving platform features with Vue.js, TypeScript, modern JavaScript, and AI-first workflows. The work spans product UI, backend services, model orchestration, and automation systems used across the platform.',
      highlights: [
        'Developed and deployed AI-driven automation systems for business workflow execution and decision support.',
        'Integrated and tuned LLM workflows with OpenAI, and LangChain.',
        'Implemented Azure Document Intelligence for structured document parsing and analysis.',
        'Automated email processing for classification, intent extraction, and AI-generated replies.',
        'Integrated NetSuite and Salesforce APIs to trigger enterprise workflows.',
        'Built Node.js backend services for prompt orchestration, failover handling, and model coordination.'
      ]
    },
    {
      company: 'Academor',
      role: 'Cloud Computing Intern',
      period: 'July 2023 - September 2023',
      location: 'Internship',
      logo: '/aCADEMOR.jpeg',
      summary:
        'Worked on cloud computing fundamentals with hands-on deployments across AWS and Azure, while strengthening my base in infrastructure, hosting, and applied engineering practices.',
      highlights: [
        'Deployed and tested applications on AWS and Azure.',
        'Built confidence with cloud service workflows and environment setup.',
        'Strengthened engineering fundamentals that later fed into full-stack and AI project delivery.'
      ]
    }
  ] as ExperienceItem[],
  achievements: [
    {
      title: 'President, LEO Club Palakol 316G',
      meta: 'March 2022',
      description: 'Led club initiatives and represented the chapter in local leadership activities.'
    },
    {
      title: 'Member, JCI Club Palakol',
      meta: 'October 2024',
      description: 'Stayed active in peer leadership, networking, and community-led events.'
    },
    {
      title: 'Flipkart GRID 6.0 Participant',
      meta: 'August 2024',
      description: 'Participated in a competitive problem-solving environment focused on product and engineering thinking.'
    }
  ],
  projects: [
    {
      title: 'Legal Document Risk Analyzer',
      category: 'AI + full-stack product',
      summary:
        'A full-stack document review tool that analyzes clauses, flags risk, finds missing terms, and recommends actions. The system supports multilingual analysis and fallback flows for reliable results across PDF, DOCX, and TXT inputs.',
      stack: ['Vue 3', 'TypeScript', 'Vite', 'Node.js', 'Express', 'Python FastAPI','Gemeni AI API'],
      repo: 'https://github.com/21PA1A1202/Legal-Document-Risk-Analyzer',
      imagePath: '/DRA.png'
    },
    {
      title: 'Top Lead AI',
      category: 'Lead automation platform',
      summary:
        'A lead capture and follow-up system with authentication, analytics, workflow builder templates, branching logic, WhatsApp automation, AI-generated replies, and execution tracking for scalable outreach operations.',
      stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Express', 'Supabase', 'WhatsApp Cloud API', 'Gemeni AI API'],
      repo: 'https://github.com/21PA1A1202/Top-Lead-AI',
      imagePath: '/TopLeadAI.png'
    },
    {
      title: 'AutoYT Studio',
      category: 'Content automation',
      summary:
        'An AI-powered video automation platform for generating shorts and long-form content from prompts and niches. It automates scripts, voiceovers, music, visuals, publishing, and scheduled batch creation for end-to-end media workflows.',
      stack: ['Vue.js', 'Node.js', 'Gemini API', 'LangChain', 'Docker', 'Google Cloud'],
      repo: 'https://github.com/21PA1A1202/AutoYT-Studio',
      imagePath: '/AutoYT.png'
    },
    {
      title: 'ShotsAI',
      category: 'AI website generation',
      summary:
        'A static AI website builder that turns prompts into structured responsive web pages. It uses Gemini-based code generation with a Vue and TypeScript frontend backed by Node.js prompt processing and orchestration.',
      stack: ['Vue.js', 'TypeScript', 'Node.js', 'Gemini AI', 'LangChain'],
      repo: 'https://github.com/21PA1A1202/ShotAI',
      imagePath: '/Shotsai.png'
    },
    {
      title: 'Campus Navigation',
      category: 'Team project',
      summary:
        'A full-stack campus navigation app with interactive maps, live directions, favorites, reviews, and location search. The experience is powered by Geolocation and Leaflet with a Node.js and MongoDB backend.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB', 'Leaflet API', 'Geolocation API'],
      repo: 'https://github.com/21PA1A1202/Campus-Navigation',
      imagePath: '/Campus navication.png'
    },
    {
      title: 'Picasso',
      category: 'Creative design tool',
      summary:
        'A browser-based photo designing tool with layers, drawing tools, shapes, text controls, and real-time preview. It was designed with a clean interactive UI to make design editing feel simple and lightweight.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Figma'],
      repo: 'https://github.com/21PA1A1202/Picasso--Photo-design',
      live: 'https://21pa1a1202.github.io/picasso1/',
      imagePath: '/Picasso.png'
    }
  ] as ProjectItem[],
  certificates: [
    {
      title: 'Full Stack Web Application Development Using NodeJS',
      issuer: 'Codinza',
      date: 'December 2023',
      image: '/fullstack.jpg'
    },
    {
      title: 'Course Completion Certificate - Cloud Computing',
      issuer: 'Academor',
      date: 'September 2023',
      image: '/academor.jpg'
    },
    {
      title: 'Data Engineering Using Databricks',
      issuer: 'Databricks',
      date: 'October 2024',
      image: '/Screenshot 2025-08-15 at 10.37.31 PM.png'
    },
    {
      title: 'Leadership Excellence Certificate',
      issuer: 'Emerging Lions Leadership Institute',
      date: 'September 2023',
      image: '/elli.jpg'
    },
    {
      title: 'Data Science Internship Certificate',
      issuer: 'Unified Mentor',
      date: 'December 2024',
      image: '/Screenshot 2025-08-15 at 10.41.22 PM.png'
    },
    {
      title: 'Programming in C-Language',
      issuer: 'Adhikari Computers',
      date: 'November 2020',
      note: 'Foundational programming certificate highlighted in the resume.'
    }
  ] as CertificateItem[],
  artImages: [
    '/Screenshot 2025-08-15 at 11.23.27 PM.png',
    '/Screenshot 2025-08-15 at 11.24.04 PM.png',
    '/Screenshot 2025-08-15 at 11.24.28 PM.png',
    '/Screenshot 2025-08-15 at 11.25.08 PM.png'
  ],
  interests: [
    'Graphic designing',
    'UI/UX exploration',
    'Game engine exploration',
    'Fitness',
    'Art and sketching',
    'Animation'
  ]
}
