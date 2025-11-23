import { profile } from '../data/portfolio';
import { Section } from './ui/Section';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <Section id="contact">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Get in Touch
        </h2>
        
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          I'm currently open to new opportunities and would love to hear from you. 
          Whether you have a question or just want to say hi, feel free to reach out.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <a 
            href={`mailto:${profile.email}`}
            className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white font-medium">{profile.email}</p>
            </div>
          </a>

          <a 
            href={`tel:${profile.phone}`}
            className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Phone className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white font-medium">{profile.phone}</p>
            </div>
          </a>

          <div className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-400">Location</p>
              <p className="text-white font-medium">{profile.location}</p>
            </div>
          </div>
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/25"
        >
          Say Hello
        </a>
      </div>
    </Section>
  );
};

export default Contact;
