import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, MapPin, Github, Linkedin, Code, Award, Calendar,
  ExternalLink, ChevronDown, User, GraduationCap, Trophy,
  Terminal, Database, Cloud, Monitor, Cpu, Globe, X
} from 'lucide-react';

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
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const profileImage = "/assets/arunsk.jpg"; // Replace with your profile image path

  const projects = [
    {
      title: 'CollabNest - Real-time Collaboration Platform',
      img: "/assets/collab.png",
      tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Redis', 'Socket.io', 'Docker'],
      points: [
        'Designed and deployed a real-time collaboration system handling 20+ concurrent users.',
        'Enhanced storage and communication with Redis caching, achieving 47ms avg response time.',
        'Implemented fault-tolerant role-based access control supporting 3 user roles.'
      ],
      links: { github: 'https://github.com/Arun-kushwaha007/Deadline', demo: 'https://collab-nest-home.vercel.app/' }
    },
    {
      title: 'AI FIR Analysis and Legal Act Prediction System',
      img: "/assets/fir.png",
      tech: ['Django', 'React.js', 'AWS', 'LLaMA2', 'RAG'],
      points: [
        'Engineered ML pipeline predicting legal sections with 87% accuracy on 2000+ cases.',
        'Integrated RAG pipeline for high-reliability legal analysis.',
        'Top 10 finish at Rajasthan Police Hackathon 2024.'
      ],
      links: { github: 'https://github.com/Arun-kushwaha007/RJPOLICE_HACK_991_The-Crusade_4' }
    },
    {
      title: 'AI Resume Analyzer',
      img: "/assets/rr.png",
      tech: ['React.js', 'Node.js', 'FastAPI', 'Python', 'Docker', 'LLMs', 'Gemini API'],
      points: [
        'Developed ATS resume analysis tool with compatibility scores & keyword suggestions.',
        'Used LLMs (Qwen3, DeepSeek) + Gemini API for semantic parsing and skill extraction.',
        '95%+ accuracy parser for reliable data extraction across diverse file formats.'
      ],
      links: { github: 'https://github.com/Arun-kushwaha007/Resume-Roaster' }
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
      links: { github: 'https://github.com/Arun-kushwaha007/Self-Driving-Car-Simulation', demo: 'https://self-driving-car-simulation-five.vercel.app/' }
    }
  ];

  const skills = {
    'Systems / Backend': ['Distributed Systems', 'Microservices', 'Node.js', 'Express.js', 'FastAPI'],
    'Programming Languages': ['C++', 'C', 'Python', 'GoLang', 'JavaScript', 'TypeScript'],
    'Databases / Storage': ['MongoDB', 'PostgreSQL', 'Redis', 'MySQL', 'AWS S3'],
    'Cloud / Infra': ['AWS', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    'Frontend': ['React.js', 'Next.js', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
    'Core CS': ['Data Structures', 'Algorithms', 'OS', 'CN', 'System Design'],
    'Other': ['Socket.io', 'JWT', 'Scalability', 'Reliability']
  };

  const experiences = [
    {
      role: 'President',
      organization: 'SPEC Society, NIT Hamirpur',
      period: 'Aug 2024 – July 2025',
      points: [
        'Led 80+ member society, managing workshops & hackathons with 400+ participants.',
        'Mentored 6 projects, improving delivery speed by 30%.'
      ]
    },
    {
      role: 'Web Development Coordinator',
      organization: 'Electrothon 6.0, NIT Hamirpur',
      period: 'Oct 2023 – July 2024',
      points: [
        'Led 8-member dev team for event platform used by 400+ participants.',
        'Improved bug resolution speed by 45% via Git workflow standardization.'
      ]
    }
  ];

  const achievements = [
    'Top 10 Finalist - Rajasthan Police Hackathon 2024',
    'Finalist - 5G Innovation Hackathon, Govt. of India',
    'Solved 150+ problems on LeetCode; Codeforces rating: 1058',
    'Organized Electrothon 7.0 with 2000+ participants, 2L sponsorships',
    'Mentored 200+ students through 8 workshops on full-stack & cloud infra'
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'achievements'];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            AK
          </motion.div>
          <div className="hidden md:flex space-x-8">
            {['About', 'Skills', 'Projects', 'Experience'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className={`transition-colors hover:text-cyan-400 ${
                  activeSection === item.toLowerCase() ? 'text-cyan-400' : 'text-gray-300'
                }`}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

   

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative">
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
        />
        
        <div className="text-center z-10 max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
                <ImageWithSkeleton src={profileImage} alt="Profile"
                        className="w-40 h-40 mx-auto mb-6 rounded-full border-4 border-cyan-400 shadow-xl"/>
              
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ARUN KUSHWAHA
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Software Engineer specializing in cloud infrastructure, distributed systems, and scalable backend development. 
              Passionate about reliability, performance engineering, and cloud-native solutions.
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
              <span>Hamirpur, HP</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex justify-center gap-6"
          >
            <a href="https://github.com/Arun-kushwaha007" className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors group" target='_blank'>
              <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.linkedin.com/in/arun-kushwaha-394b5a340/" className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors group" target='_blank'>
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
            <ChevronDown className="w-8 h-8 mx-auto animate-bounce text-cyan-400" />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
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
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-semibold">Education</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">B.Tech in Electronics and Communication</h4>
                    <p className="text-purple-300">National Institute of Technology (NIT) Hamirpur</p>
                    <p className="text-gray-400">Nov 2022 – July 2026 • CGPA: 8.05/10.0</p>
                    <p className="text-sm text-gray-300 mt-2">
                      Coursework: Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, System Design
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Senior Secondary Certificate (Class XII)</h4>
                    <p className="text-purple-300">Sunbeam School, Varanasi</p>
                    <p className="text-gray-400">2022 • 94.8%</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-purple-400" />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Technical Skills
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, skillList], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg">
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
          </div>
        </div>
      </section>

  
      

      {/* PROJECTS */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            {projects.map((project, index) => (
              <motion.div key={project.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/30 transition-colors">
                <ImageWithSkeleton src={project.img} alt={project.title} className="h-48 w-full"
                  onClick={() => setLightboxImage(project.img)} />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tech.map((tech) => (
                      <span key={tech}
                        className="px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-md text-xs text-cyan-300 border border-cyan-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-1 text-gray-300 text-sm mb-4">
                    {project.points.map((point, i) => <li key={i}>• {point}</li>)}
                  </ul>
                  <div className="flex gap-3">
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
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-cyan-400 mb-1">{exp.role}</h3>
                        <p className="text-lg text-purple-300 mb-2">{exp.organization}</p>
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
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Achievements
                </h2>
              </motion.div>
    
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{achievement}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
    
          {/* Footer */}
          <footer className="py-12 px-6 bg-black/40 backdrop-blur-sm border-t border-white/10">
            <div className="max-w-6xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
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
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
