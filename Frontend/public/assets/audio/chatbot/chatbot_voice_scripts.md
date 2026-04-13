# Chatbot Voice Recording Script

Use this script to record high-quality MP3 files for your chatbot. Each section corresponds to a specific "Intent ID". 

> [!IMPORTANT]
> **Recording Instructions:**
> 1. Name the files exactly as the **ID** (e.g., `intro.mp3`).
> 2. Save them in: `Frontend/public/assets/audio/chatbot/`
> 3. Ensure they are in **MP3** format.

---

## 0. Global Interface Sounds

### ID: `bot-open`
**Text:**
"Hello, I am your digital assistant. How can I help you today?"

### ID: `bot-close`
**Text:**
"System shutting down. Bye, see you!"

---

## 1. Core Conversations

### ID: `intro`
**Text:**
"Arun Kushwaha is a Full-Stack Developer specializing in scalable backend systems and cloud infrastructure. He is a final-year student at NIT Hamirpur with a focus on low-latency architectures and production-grade services."

### ID: `fallback`
**Text:**
"I only answer from Arun's portfolio content. Try asking about his latest projects, tech stack, professional experience, or education. How else can I assist you today?"

### ID: `clear`
**Text:**
"Resetting our conversation. I'm returning to the default portfolio prompts. How can I help you from the beginning?"

---

## 2. Professional Details

### ID: `projects`
**Text:**
"Arun has several high-impact projects. The main highlights include an Enterprise PDF to CSV Pipeline, the Collab-Nest real-time platform, AI FIR analysis, and a Self-Driving Car simulation. Which one would you like to hear more about?"

### ID: `stack`
**Text:**
"Arun's tech stack is quite extensive. He works with JavaScript, Python, and Go for languages. For backend, he uses Node.js, Express, and FastAPI with databases like PostgreSQL and Redis. He's also proficient in Cloud and DevOps tools like GCP, AWS, Docker, and Kubernetes."

### ID: `experience`
**Text:**
"Arun has professional experience as a Software Developer Intern at Credit-Mitra and as a Freelance Full-Stack Engineer. He also has significant leadership experience as the President of the SPEC Society at NIT Hamirpur."

### ID: `education`
**Text:**
"Arun is pursuing a B-Tech in Electronics and Communication from NIT Hamirpur. He maintains a strong CGPA of 8.05 and has completed advanced coursework in System Design, Algorithms, and Operating Systems."

### ID: `contact`
**Text:**
"You can reach Arun via email at arunsk1310@gmail.com. You can also connect with him on LinkedIn or check out his latest code contributions on GitHub."

---

## 3. Project Specifics

### ID: `project-pdf-csv-pipeline`
**Text:**
"The Enterprise PDF to CSV Pipeline is a production-grade system using GCP Document AI. It processes over 5,000 documents per batch and features dynamic worker scaling with rate-limiting."

### ID: `project-collabnest`
**Text:**
"Collab-Nest is a real-time collaboration platform. It was build with Node.js, Socket-IO, and Redis. It's designed for high performance, handling over 100 requests per second with near-zero connection failures."

### ID: `project-ai-fir`
**Text:**
"The AI FIR analysis project uses a RAG pipeline for legal-act prediction. It ranked in the top 10 out of over 400 teams at the Rajasthan Police Hackathon for its accuracy and system design."

### ID: `project-resume-roaster`
**Text:**
"Resume Roaster is an AI-powered ATS optimizer. It uses LLMs for semantic parsing and keyword optimization, currently processing over 100 requests daily with very low response times."

### ID: `project-self-driving-car`
**Text:**
"This is a JavaScript-based self-driving car simulation. It uses Neural Networks and Genetic Algorithms for autonomous navigation, complete with ray-casting sensors and collision detection."
