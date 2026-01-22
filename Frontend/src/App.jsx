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
import Footer from './components/Footer';
import CustomCursor from './components/ui/CustomCursor';
import CyberpunkOverlay from './components/ui/CyberpunkOverlay';
import { MatrixProvider } from './context/MatrixContext';
import { CursorProvider } from './context/CursorProvider';
import MatrixRain from './components/ui/MatrixRain';
import useKonamiCode from './hooks/useKonamiCode';
import GlitchChaos from './components/ui/GlitchChaos';
import TerminalCLI from './components/ui/TerminalCLI';

function App() {
  const konamiTriggered = useKonamiCode();
  const [showChaos, setShowChaos] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (konamiTriggered) {
      setShowChaos(true);
    }
  }, [konamiTriggered]);

  return (
    <CursorProvider>
      <MatrixProvider>
        <div className="min-h-screen text-white selection:bg-blue-500/30 relative z-0">
        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingScreen onComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>

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
      </MatrixProvider>
    </CursorProvider>
  );
}

export default App;