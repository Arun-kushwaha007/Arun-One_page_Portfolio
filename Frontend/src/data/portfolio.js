import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Code, 
  Terminal, 
  Database, 
  Cloud, 
  Cpu, 
  Globe,
  Server,
  Layout,
  Smartphone,
  Layers,
  Box
} from 'lucide-react';

export const profile = {
  name: "Arun Kushwaha",
  role: "Full-Stack Developer | DevOps Enthusiast | AI/ML Innovator",
  summary: "Final-year B.Tech (NIT Hamirpur). Backend / systems engineer focused on low-latency, real-time services and production-grade cloud deployments. Built and load-tested MERN backends (Socket.IO + Redis), designed scalable document-processing pipelines on GCP, and productionized ML+RAG inference. Strong in system design, observability, CI/CD and performance tuning.",
  location: "Hamirpur, Himachal Pradesh, India",
  email: "arunsk1310@gmail.com",
  phone: "+91-9555547363",
  social: {
    github: "https://github.com/Arun-kushwaha007",
    linkedin: "https://www.linkedin.com/in/arun-kushwaha-394b5a340/",
    leetcode: "https://leetcode.com/u/ArunKush007/",
    codeforces: "https://codeforces.com/profile/Arun_Kushwaha"
  },
  image: "/assets/arunsk.jpg"
};

export const skills = {
  "Languages": {
    icon: Code,
    items: ["JavaScript", "TypeScript", "Python", "C++", "SQL", "Golang", "Java", "Bash"]
  },
  "Backend": {
    icon: Server,
    items: ["Node.js", "Express", "FastAPI", "REST", "GraphQL", "WebSockets", "Socket.IO"]
  },
  "Data & Infra": {
    icon: Database,
    items: ["MongoDB", "PostgreSQL", "Redis", "Cloud SQL", "GCS"]
  },
  "Cloud & DevOps": {
    icon: Cloud,
    items: ["GCP (Cloud Run, Document AI)", "AWS", "Docker", "Kubernetes", "CI/CD"]
  },
  "Frontend": {
    icon: Layout,
    items: ["React", "Vite","Next.js", "Tailwind", "WebSocket clients"]
  },
  "Core": {
    icon: Layers,
    items: ["System Design", "Performance Testing", "Observability", "RBAC", "Microservices"]
  }
};

export const experiences = [
  {
    id: "creditmitra-intern",
    role: "Software Developer Intern",
    company: "CreditMitra ",
    period: "Nov 2025 – Present",
    description: [
        "Built core frontend modules for a fintech web platform using Next.js, converting business wireframes into responsive user interfaces.",
        "Integrated third-party APIs for credit score checks and customer inquiry forms, handling asynchronous data flows and UI state management.",
        "Collaborated with team members to structure reusable UI components and application routing.",
        "Worked closely with senior developers to integrate frontend features with backend REST APIs."
      ]
  },
   {
      id: "freelance-pdf",
      role: "Full-Stack Software Engineer (Freelance)",
      company: "PDF Data Extraction Platform",
      period: "oct 2025 – nov 2025",
      description: [
        "Built a production document pipeline: batch PDF → Document AI OCR → validation → CSV/Cloud SQL.",
        "Designed concurrency & throttling: dynamic worker scaling (2→75 workers) with a hard cap of 15 concurrent Document AI calls.",
        "Implemented deterministic data-validation and per-batch success-rate logging.",
        "Cut DB overhead by batching: transformed 5,000+ individual writes into 2 bulk transactional operations per large batch."
      ]
    },
  {
    id: "spec-president",
    role: "President",
    company: "SPEC Society (Technical), NIT Hamirpur",
    period: "Aug 2024 – Jul 2025",
    description: [
      "Led 80+ members, managed a $3,000 budget and 5+ industry partnerships.",
      "Organized campus events with 2,000+ participants and standardized release/incident processes used by 8 dev teams."
    ]
  },
 
  {
    id: "electrothon",
    role: "Web Development Coordinator",
    company: "Electrothon 6.0, SPEC Society",
    period: "Oct 2023 – Jul 2024",
    description: [
      "Led an 8-person team to deliver a participant management platform for 400+ users (99.8% uptime).",
      "Introduced Git workflows and CI/CD, cutting deployment time by 45%."
    ]
  }
];

export const projects = [
  {
    id: "pdf-csv-pipeline",
    title: "Enterprise PDF to CSV Pipeline",
    tech: ["React", "Node.js", "GCP Document AI", "Cloud SQL", "Docker", "Pandas"],
    description: "High-throughput document processing pipeline converting batch PDFs to structured CSV/SQL data.",
    points: [
      "Built a production pipeline processing 5,000+ documents per batch using GCP Document AI.",
      "Designed dynamic worker scaling (2→75 workers) with rate-limiting for API quotas.",
      "Optimized database performance by transforming individual writes into bulk transactional operations."
    ],
    links: {
      github: "https://github.com/Arun-kushwaha007/pdf-to-csv/", 
     
    },
    image: "/assets/pdf2csv.png"
  },
  {
    id: "collabnest",
    title: "CollabNest — Real-Time Collaboration Platform",
    tech: ["Node.js", "Socket.IO", "Redis", "MongoDB", "Vite", "Firebase"],
    description: "Architected a multi-tenant real-time task platform with RBAC, optimistic UI, and cron-based deadline alerts.",
    points: [
      "Validated backend performance under sustained load: p50=52.3ms, p90=151.1ms, p95=241.6ms; sustained 101.38 req/s across 6,000 requests with 0% error rate.",
      "Proven WebSocket stability in load tests (0% connection failures; session length p50=1118.4ms).",
      "Reduced DB reads by 60% via Redis-backed Socket.IO session & task cache."
    ],
    links: {
      github: "https://github.com/Arun-kushwaha007/Deadline",
      demo: "https://collab-nest-home.vercel.app/"
    },
    image: "/assets/collab.png"
  },
  {
    id: "ai-fir",
    title: "AI FIR Analysis & Legal-Act Prediction",
    tech: ["Python", "Django", "RAG", "LLaMA2", "AWS"],
    description: "Built a retrieval-augmented LLM pipeline for FIRs; deployed scalable inference for large documents (50MB+).",
    points: [
      "Ranked Top 10 / 400+ teams at Rajasthan Police Hackathon 2024 for system design and accuracy of legal-section predictions.",
      "Evaluated model on a held-out dataset (reported accuracy in project notes)."
    ],
    links: {
      github: "https://github.com/Arun-kushwaha007/RJPOLICE_HACK_991_The-Crusade_4"
    },
    image: "/assets/fir.png"
  },
  {
    id: "resume-roaster",
    title: "AI Resume Analyzer",
    tech: ["FastAPI", "React.js", "Python", "Docker", "LLMs"],
    description: "ATS optimization platform leveraging LLMs for semantic parsing and keyword optimization.",
    points: [
      "Built high-performance FastAPI backend with 95%+ accuracy parser.",
      "Processing 100+ daily analysis requests with average response time under 300ms."
    ],
    links: {
      github: "https://github.com/Arun-kushwaha007/Resume-Roaster.git"
    },
    image: "/assets/rr.png"
  },
  {
    id: "resqterra",
    title: "ResQTerra - IoT Emergency Response",
    tech: ["Python", "FastAPI", "React.js", "WebSockets", "IoT"],
    description: "Drone-based rescue system utilizing LiDAR, GPR, and Jetson Nano for disaster response.",
    points: [
      "Engineered asynchronous backend processing live telemetry from 5+ IoT sensors.",
      "Selected as finalist by Department of Telecommunications, Government of India at 5G Innovation Hackathon."
    ],
    links: {
      github: "https://github.com/ResQTerra"
    },
    image: "/assets/resq.png"
  },
  {
    id: "self-driving-car",
    title: "Self-Driving Car Simulation",
    tech: ["JavaScript", "Neural Networks", "Genetic Algorithms"],
    description: "Autonomous driving simulator with collision detection, ray-casting sensors, and genetic evolution.",
    points: [
      "Built autonomous driving simulator with collision detection & obstacle modeling.",
      "Implemented ray-casting sensor system enabling 360° perception.",
      "Scaled rendering to 200+ vehicles at 30 FPS."
    ],
    links: {
      github: "https://github.com/Arun-kushwaha007/Self-Driving-Car-Simulation",
      demo: "https://self-driving-car-simulation-five.vercel.app/"
    },
    image: "/assets/nn.png"
  },
  {
    id: "chat-app",
    title: "Real-Time Chat Application",
    tech: ["MERN Stack", "Socket.io", "Redux Toolkit"],
    description: "Full-stack chat platform with real-time messaging, secure authentication, and chat rooms.",
    points: [
      "Built full-stack real-time chat platform with WebSocket-based messaging.",
      "Implemented JWT authentication and scalable database architecture.",
      "Deployed with CI/CD pipelines achieving 99% uptime."
    ],
    links: {
      github: "https://github.com/Arun-kushwaha007/RealTime-Chat-app",
      demo: "https://real-time-chat-app-client-taupe.vercel.app/"
    },
    image: "/assets/chat.png"
  }
];

export const education = {
  degree: "B.Tech in Electronics & Communication",
  institution: "NIT Hamirpur",
  period: "Aug 2022 – May 2026",
  cgpa: "8.05/10.0",
  coursework: "Algorithms, OS, DBMS, Networking, System Design"
};
