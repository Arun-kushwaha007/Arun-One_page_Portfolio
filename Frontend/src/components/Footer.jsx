import { profile } from '../data/portfolio';
import { Github, Linkedin, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-8 border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        
        <div className="flex gap-6">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={profile.social.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Code className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
