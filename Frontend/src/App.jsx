import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Github, Linkedin, Code, Award, Calendar,
  ExternalLink, ChevronDown, User, GraduationCap, Trophy,
  Terminal, Database, Cloud, Monitor, Cpu, Globe, X
} from 'lucide-react';
import StarsCanvas from './components/Stars';

// ✅ Skeleton loader + image
const ImageWithSkeleton = ({ src, alt, className, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl cursor-pointer ${className}`}
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const profileImage = "/assets/arunsk.jpg"; // Replace with your profile image path

  const projects = [
    {
        title: 'CollabNest -- Real-Time Collaboration Platform',
        img: "/assets/collab.png",
        tech: ['Node.js', 'React.js', 'MongoDB', 'Redis', 'Socket.io', 'Docker'],
        points: [
            'Engineered scalable microservices backend with Node.js and Express.js handling 20+ concurrent users, implementing Redis caching strategy that reduced database queries by 60% and achieved 47ms average response time for real-time operations',
            'Built WebSocket-based notification and collaboration system using Socket.io delivering sub-50ms latency for task updates, comments, and live synchronization across multiple user sessions with 99.5% uptime',
            'Implemented role-based access control (RBAC) supporting 3 user roles with JWT (JSON Web Token) authentication, structured error handling, and horizontal scalability enabling fault-tolerant production deployment',
            'Developed responsive frontend with React.js and Redux Toolkit for state management, integrating RESTful APIs with MongoDB database design optimized for complex task management and team collaboration workflows'
        ],
        detailedDescription: 'Engineered scalable microservices backend with Node.js and Express.js handling 20+ concurrent users, implementing Redis caching strategy that reduced database queries by 60% and achieved 47ms average response time for real-time operations. Built WebSocket-based notification and collaboration system using Socket.io delivering sub-50ms latency for task updates, comments, and live synchronization across multiple user sessions with 99.5% uptime. Implemented role-based access control (RBAC) supporting 3 user roles with JWT (JSON Web Token) authentication, structured error handling, and horizontal scalability enabling fault-tolerant production deployment. Developed responsive frontend with React.js and Redux Toolkit for state management, integrating RESTful APIs with MongoDB database design optimized for complex task management and team collaboration workflows.',
        links: { github: 'https://github.com/arunsk1310', demo: '#' }
    },
    {
        title: 'AI-Powered FIR Classification System',
        img: "/assets/fir.png",
        tech: ['Python', 'Django', 'React.js', 'NLP', 'RAG', 'AWS'],
        points: [
            'Developed Natural Language Processing (NLP) classification system achieving 87% accuracy on 2,000+ real First Information Report (FIR) cases using Retrieval-Augmented Generation (RAG) architecture with LLaMA2 model, reducing manual processing time by 60%',
            'Led 4-member team to full-stack deployment on AWS handling 50MB+ document processing with Django backend and React.js frontend, implementing parallelized document retrieval and high-reliability legal analysis dashboards',
            'Architected scalable file processing backend with asynchronous APIs ensuring fault tolerance and low latency for disaster scenarios, integrating observability hooks including logging and alerting for production monitoring',
            'Top 10 finalist among 400+ teams at Rajasthan Police Hackathon 2024, delivering production-grade predictive analytics solution for legal section recommendations from unstructured FIR documents'
        ],
        detailedDescription: 'Developed Natural Language Processing (NLP) classification system achieving 87% accuracy on 2,000+ real First Information Report (FIR) cases using Retrieval-Augmented Generation (RAG) architecture with LLaMA2 model, reducing manual processing time by 60%. Led 4-member team to full-stack deployment on AWS handling 50MB+ document processing with Django backend and React.js frontend, implementing parallelized document retrieval and high-reliability legal analysis dashboards. Architected scalable file processing backend with asynchronous APIs ensuring fault tolerance and low latency for disaster scenarios, integrating observability hooks including logging and alerting for production monitoring. Top 10 finalist among 400+ teams at Rajasthan Police Hackathon 2024, delivering production-grade predictive analytics solution for legal section recommendations from unstructured FIR documents.',
        links: { github: 'https://github.com/arunsk1310' }
    },
    {
        title: 'AI Resume Analyzer -- ATS Optimization Platform',
        img: "/assets/rr.png",
        tech: ['FastAPI', 'React.js', 'Python', 'Docker', 'LLMs'],
        points: [
            'Developed Application Tracking System (ATS) analysis platform leveraging Large Language Models (LLMs) including Qwen3, DeepSeek, and Google Gemini API for semantic parsing, skill extraction, and keyword optimization generating compatibility scores for job descriptions',
            'Built high-performance FastAPI backend with 95%+ accuracy parser for reliable data extraction across diverse file formats (PDF, DOCX), processing 100+ daily analysis requests with average response time under 300ms',
            'Engineered React.js frontend with intuitive UX/UI for resume upload, real-time analysis feedback, and actionable improvement suggestions deployed via Docker containerization for consistent cross-environment performance'
        ],
        detailedDescription: 'Developed Application Tracking System (ATS) analysis platform leveraging Large Language Models (LLMs) including Qwen3, DeepSeek, and Google Gemini API for semantic parsing, skill extraction, and keyword optimization generating compatibility scores for job descriptions. Built high-performance FastAPI backend with 95%+ accuracy parser for reliable data extraction across diverse file formats (PDF, DOCX), processing 100+ daily analysis requests with average response time under 300ms. Engineered React.js frontend with intuitive UX/UI for resume upload, real-time analysis feedback, and actionable improvement suggestions deployed via Docker containerization for consistent cross-environment performance.',
        links: { github: 'https://github.com/arunsk1310' }
    },
    {
        title: 'ResQTerra -- IoT Emergency Response System',
        img: "/assets/resq.png",
        tech: ['Python', 'FastAPI', 'React.js', 'WebSockets', 'IoT'],
        points: [
            'Engineered asynchronous backend processing live telemetry from 5+ IoT sensors with auto-reconnect and failover handling ensuring high availability and low latency for disaster response scenarios',
            'Designed WebSocket-based real-time monitoring dashboards with FastAPI backend displaying sensor data streams, emergency alerts, and geolocation tracking for rescue operations',
            'Implemented comprehensive error handling, logging frameworks, and observability metrics for reliable deployment in critical emergency situations with 99.9% uptime target',
            'Selected as finalist by Department of Telecommunications, Government of India at 5G Innovation Hackathon for innovative IoT infrastructure solution'
        ],
        detailedDescription: 'Engineered asynchronous backend processing live telemetry from 5+ IoT sensors with auto-reconnect and failover handling ensuring high availability and low latency for disaster response scenarios. Designed WebSocket-based real-time monitoring dashboards with FastAPI backend displaying sensor data streams, emergency alerts, and geolocation tracking for rescue operations. Implemented comprehensive error handling, logging frameworks, and observability metrics for reliable deployment in critical emergency situations with 99.9% uptime target. Selected as finalist by Department of Telecommunications, Government of India at 5G Innovation Hackathon for innovative IoT infrastructure solution.',
        links: { github: 'https://github.com/ResQTerra' }
    },
    {
      title: 'Self-Driving Car Neural Network Simulation',
      img: "/assets/nn.png",
      tech: ['JavaScript', 'Canvas', 'Neural Networks', 'Genetic Algorithms'],
      points: [
            'Built autonomous driving simulator with collision detection & obstacle modeling.',
            'Implemented ray-casting sensor system enabling 360° perception.',
            'Scaled rendering to 200+ vehicles at 30 FPS.'
          ],
      detailedDescription: 'Engineered asynchronous backend processing live telemetry from 5+ IoT sensors with auto-reconnect and failover handling ensuring high availability and low latency for disaster response scenarios. Designed WebSocket-based real-time monitoring dashboards with FastAPI backend displaying sensor data streams, emergency alerts, and geolocation tracking for rescue operations. Implemented comprehensive error handling, logging frameworks, and observability metrics for reliable deployment in critical emergency situations with 99.9% uptime target. Selected as finalist by Department of Telecommunications, Government of India at 5G Innovation Hackathon for innovative IoT infrastructure solution.',
      links: { github: 'https://github.com/Arun-kushwaha007/Self-Driving-Car-Simulation', demo: 'https://self-driving-car-simulation-five.vercel.app/' }
    },
    {
        title: 'Chat app',
        img: "/assets/chat.png",
        tech: ['MERN Stack', 'Redux Toolkit', 'JWT', 'CI/CD'],
        points: [
            'Built full-stack question-and-answer platform replicating core Stack Overflow features including voting systems, tagging mechanisms, rich-text editing, and user reputation tracking using MERN stack and Redux Toolkit for state management',
            'Implemented JWT authentication, scalable database architecture with MongoDB, and automated CI/CD pipelines using GitHub Actions for continuous deployment, achieving 99% uptime in production environment'
        ],
        detailedDescription: 'Built full-stack question-and-answer platform replicating core Stack Overflow features including voting systems, tagging mechanisms, rich-text editing, and user reputation tracking using MERN stack and Redux Toolkit for state management. Implemented JWT authentication, scalable database architecture with MongoDB, and automated CI/CD pipelines using GitHub Actions for continuous deployment, achieving 99% uptime in production environment.',
        links: { github: 'https://github.com/Arun-kushwaha007/RealTime-Chat-app' ,demo: 'https://real-time-chat-app-client-taupe.vercel.app/'}
    }
];

  const skills = {
    'Programming Languages': ['Python', 'JavaScript (ES6+)', 'TypeScript', 'C++', 'Golang', 'Java', 'Bash', 'SQL', 'NoSQL'],
    'Backend Development': ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'GraphQL', 'WebSockets', 'Socket.io', 'Microservices Architecture'],
    'Frontend Development': ['React.js', 'Next.js', 'Redux', 'Redux Toolkit', 'HTML5', 'CSS3', 'Tailwind CSS', 'Material-UI', 'Responsive Design'],
    'Databases': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Database Design', 'Query Optimization', 'SQL', 'NoSQL'],
    'Cloud & DevOps': ['AWS', 'GCP', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'GitHub Actions',  'Linux', 'Git'],
    // 'System Design': ['Distributed Systems', 'Microservices', 'Scalability', 'Fault Tolerance', 'Load Balancing', 'Caching Strategies', 'High Availability'],
    // 'Machine Learning & AI': ['Natural Language Processing (NLP)', 'Large Language Models (LLMs)', 'YOLOv5', 'RAG', 'LLaMA2', 'TensorFlow'],
    'Computer Science Fundamentals': ['Data Structures & Algorithms', 'Object-Oriented Programming (OOP)', 'Operating Systems', 'Computer Networks', 'System Design', 'Database Management Systems (DBMS)'],
    'Testing & Security': ['Unit Testing', 'Integration Testing', 'JWT Authentication', 'OAuth 2.0', 'API Security'],
    // 'Agile Methodologies': ['Scrum', 'SAFe', 'Sprint Planning', 'JIRA', 'Confluence', 'Agile Project Management', 'Cross-Functional Collaboration'],
    'Tools': ['Postman', 'Firebase', 'Microsoft Excel', 'GitHub', 'VS Code','Linux', 'Chrome DevTools', 'Figma', 'Adobe suite']
  };

  const experiences = [
    {
        role: 'President',
        organization: 'SPEC Society, NIT Hamirpur',
        period: 'Aug 2024 – Present',
        points: [
            'Led 80-member technical society organizing Electrothon 7.0 national hackathon attracting 2,000+ participants across India, managing $3,000+ budget and securing sponsorships from 10+ industry partners',
            'Mentored 200+ students through 8 workshops on full-stack development, backend engineering, DevOps practices, and system design improving project delivery success rate by 35% through Agile workflows'
        ]
    },
    {
        role: 'Web Development Coordinator',
        organization: 'Electrothon 6.0, SPEC Society',
        period: 'Oct 2023 – July 2024',
        points: [
            'Led 8-member team to architect event management platform serving 2,000+ attendees with React.js, Node.js, and MongoDB achieving 40% reduction in page load times and 99.9% uptime during 48-hour event',
            'Implemented CI/CD pipelines using GitHub Actions reducing bug resolution time by 45%, delivered platform 2 weeks ahead of schedule with zero critical production issues'
        ]
    },
    {
        role: 'Freelance',
        organization: 'Full-Stack Software Engineer',
        period: 'Jun 2024 – Aug 2024',
        points: [
            'Architected mentorship platform connecting 500+ mentors with dynamic slot booking using MERN stack, implementing JWT and OAuth 2.0 authentication handling 1,000+ daily API requests with 99.5% uptime'
        ]
    }
];

  const achievements = [
    'Top 10 finalist at Rajasthan Police Hackathon 2024 among 400+ teams',
    'Finalist at 5G Innovation Hackathon by Department of Telecommunications, Government of India',
    'Solved 150+ algorithmic problems on LeetCode focusing on dynamic programming and graph algorithms',
    'Codeforces rating: 1058 demonstrating strong data structures and algorithms expertise',
    'Organized Electrothon 7.0 attracting 2,000+ participants and securing ₹2 lakh in sponsorships from technology companies'
];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'achievements', 'contact'];
      const scrollPosition = window.scrollY + 100;
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skillIcons = {
    'Systems / Backend': <Terminal className="w-6 h-6" />,
    'Programming Languages': <Code className="w-6 h-6" />,
    'Databases / Storage': <Database className="w-6 h-6" />,
    'Cloud / Infra': <Cloud className="w-6 h-6" />,
    'Frontend': <Monitor className="w-6 h-6" />,
    'Core CS': <Cpu className="w-6 h-6" />,
    'Other': <Globe className="w-6 h-6" />
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            AK
          </motion.div>
          <div className="hidden md:flex space-x-8">
            {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className={`transition-colors hover:text-teal-400 ${
                  activeSection === item.toLowerCase() ? 'text-teal-400' : 'text-gray-400'
                }`}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

   

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative">
        <StarsCanvas />
        
        <div className="text-center z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
                <ImageWithSkeleton src={profileImage} alt="Profile"
                        className="w-40 h-40 mx-auto mb-6 rounded-full border-4 border-teal-400 shadow-xl"/>
              
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-teal-400 to-gray-300 bg-clip-text text-transparent">
              Arun Kushwaha
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              I'm a passionate Software Engineer with expertise in C++, JavaScript, and Python, specializing in operating systems, cloud infrastructure, and virtualization.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <a href="mailto:arunsk1310@gmail.com" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
              <Mail className="w-4 h-4" />
              <span>arunsk1310@gmail.com</span>
            </a>
            <a href="tel:+919555547363" className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91-9555547363</span>
            </a>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>Hamirpur, Himachal Pradesh</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex justify-center gap-6"
          >
            <a href="https://github.com/arunsk1310" className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors group" target='_blank'>
              <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://linkedin.com/in/arunsk1310" className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors group" target='_blank'>
              <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://leetcode.com/u/ArunKush007/" className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors group" target='_blank'>
              <Code className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16"
          >
            <ChevronDown className="w-8 h-8 mx-auto animate-bounce text-teal-400" />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              About Me
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-6 h-6 text-teal-400" />
                  <h3 className="text-xl font-semibold">Education</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">Bachelor of Technology in Electronics and Communication Engineering</h4>
                    <p className="text-blue-300">National Institute of Technology Hamirpur</p>
                    <p className="text-gray-400">Aug 2022 – May 2026 • CGPA: 8.05/10.0</p>
                    <p className="text-sm text-gray-300 mt-2">
                      Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks, System Design
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-semibold">Profile</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                I'm a passionate Software Engineer with expertise in C++, JavaScript, and Python, specializing in 
                operating systems, cloud infrastructure, and virtualization. I have hands-on experience developing 
                scalable backend systems, storage-aware applications, and implementing Kubernetes for containerized 
                deployments. My focus areas include reliability engineering, performance optimization, and building 
                cloud-native infrastructure solutions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Technical Skills
            </h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
          >
            {Object.entries(skills).map(([category, skillList], index) => (
              <motion.div
                key={category}
                variants={item}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-teal-400/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
                    {skillIcons[category]}
                  </div>
                  <h3 className="text-lg font-semibold">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 hover:bg-white/20 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

  
      

      {/* PROJECTS */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <motion.div className="grid md:grid-cols-2 gap-10"
            variants={container}
            initial="hidden"
            whileInView="show"
          >
            {projects.map((project, index) => (
              <motion.div key={project.title}
                variants={item}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-teal-400/30 transition-colors flex flex-col">
                <ImageWithSkeleton src={project.img} alt={project.title} className="h-48 w-full"
                  onClick={() => setLightboxImage(project.img)} />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech.map((tech) => (
                      <span key={tech}
                        className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-md text-xs text-teal-300 border border-teal-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm mb-4 flex-grow">{project.points[0]}</p>
                  <div className="flex gap-3 mt-auto">
                    {project.links.github && (
                      <a href={project.links.github} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                        <Github className="w-4 h-4"/>
                      </a>
                    )}
                    {project.links.demo && (
                      <a href={project.links.demo} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                        <ExternalLink className="w-4 h-4"/>
                      </a>
                    )}
                     <button onClick={() => setSelectedProject(project)} className="ml-auto bg-teal-500/20 text-teal-300 px-3 py-1 rounded-md text-sm hover:bg-teal-500/40 transition-colors">
                      Read More
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    {/* Experience Section */}
          <section id="experience" className="py-20 px-6 bg-black/20">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Experience
                </h2>
              </motion.div>
    
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.role}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-teal-400/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-teal-400 mb-1">{exp.role}</h3>
                        <p className="text-lg text-blue-300 mb-2">{exp.organization}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-2 text-gray-300">
                      {exp.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="leading-relaxed">
                          • {point}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
    
          {/* Achievements Section */}
          <section id="achievements" className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Achievements
                </h2>
              </motion.div>
    
              <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                whileInView="show"
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    variants={item}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-teal-400/30 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{achievement}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
    
          {/* Contact Section */}
          <section id="contact" className="py-20 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Get in Touch
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                I'm currently open to new opportunities and would love to hear from you. Whether you have a question or just want to say hi, feel free to reach out.
              </p>
              <a href="mailto:arunsk1310@gmail.com" className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform">
                Say Hello
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 px-6 bg-black/40 backdrop-blur-sm border-t border-gray-700/50">
            <div className="max-w-6xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Let's Connect
                </h3>
                <p className="text-gray-400 mb-6">
                  Open to opportunities in software engineering, cloud infrastructure, and backend development.
                </p>
                <div className="flex justify-center gap-6">
                  <a href="mailto:arunsk1310@gmail.com" className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors group">
                    <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://github.com/Arun-kushwaha007" className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors group">
                    <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://www.linkedin.com/in/arun-kushwaha-394b5a340/" className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors group">
                    <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </motion.div>
              <div className="text-gray-500 text-sm">
                © 2024 Arun Kushwaha. Built with React, Tailwind CSS, and Framer Motion.
              </div>
            </div>
          </footer>
      {/* ✅ LIGHTBOX */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
            onClick={() => setLightboxImage(null)}
          >
            <motion.img
              src={lightboxImage}
              alt="Project Preview"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="max-h-[90%] max-w-[90%] rounded-xl shadow-2xl"
            />
            <button
              className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full hover:bg-white/20"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6"/>
            </button>
          </motion.div>
        )}
         {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-gray-800 rounded-2xl max-w-2xl w-full p-8 border border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-teal-400">{selectedProject.title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.tech.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded-md text-xs">{tech}</span>
                ))}
              </div>
              <p className="text-gray-300 mb-6">{selectedProject.detailedDescription}</p>
              <div className="flex gap-4">
                {selectedProject.links.github && <a href={selectedProject.links.github} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"><Github className="w-5 h-5" /> GitHub</a>}
                {selectedProject.links.demo && <a href={selectedProject.links.demo} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20"><ExternalLink className="w-5 h-5" /> Demo</a>}
              </div>
              <button
                className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full hover:bg-white/20"
                onClick={() => setSelectedProject(null)}
              >
                <X className="w-6 h-6"/>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
