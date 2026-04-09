import { useState, useEffect } from 'react';
import Background3D from './components/Background3D';
import LoadingScreen from './components/ui/LoadingScreen';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import PortfolioChatbot from './components/chatbot/PortfolioChatbot';
import Footer from './components/Footer';
import CustomCursor from './components/ui/CustomCursor';
import CyberpunkOverlay from './components/ui/CyberpunkOverlay';
import { MatrixProvider } from './context/MatrixContext';
import { CursorProvider } from './context/CursorProvider';
import MatrixRain from './components/ui/MatrixRain';
import useKonamiCode from './hooks/useKonamiCode';
import GlitchChaos from './components/ui/GlitchChaos';
import TerminalCLI from './components/ui/TerminalCLI';

import SmoothScroll from './components/ui/SmoothScroll';

function App() {
  const konamiTriggered = useKonamiCode();
  const [showChaos, setShowChaos] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (konamiTriggered) {
      setShowChaos(true);
    }
  }, [konamiTriggered]);

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;

    body.style.overflow = isChatOpen ? 'hidden' : previousOverflow;

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isChatOpen]);

  return (
    <CursorProvider>
      <MatrixProvider>
        <SmoothScroll>
          <div className="min-h-screen text-white selection:bg-blue-500/30 relative z-0">
            <AnimatePresence mode="wait">
              {isLoading && (
                <LoadingScreen onComplete={() => setIsLoading(false)} />
              )}
            </AnimatePresence>

            <div
              inert={isChatOpen}
              aria-hidden={isChatOpen}
              className={`relative transition-all duration-300 ${
                isChatOpen ? 'pointer-events-none select-none blur-md scale-[0.99]' : ''
              }`}
            >
              <CustomCursor />
              <CyberpunkOverlay />
              <MatrixRain />
              <GlitchChaos triggered={showChaos} onComplete={() => setShowChaos(false)} />
              <TerminalCLI />
              <Background3D />
              <Navbar />
              
              <main>
                <Hero />
                <About />
                <Experience />
                <Projects />
                <Skills />
                <Contact />
              </main>

              <Footer />
            </div>

            <AnimatePresence>
              {isChatOpen && (
                <div className="pointer-events-auto fixed inset-0 z-[125] bg-slate-950/55 backdrop-blur-md" />
              )}
            </AnimatePresence>

            <PortfolioChatbot isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
          </div>
        </SmoothScroll>
      </MatrixProvider>
    </CursorProvider>
  );
}

export default App;
