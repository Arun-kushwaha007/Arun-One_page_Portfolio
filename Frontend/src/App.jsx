import { useState, useEffect } from 'react';
import Background3D from './components/Background3D';
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
import MatrixRain from './components/ui/MatrixRain';
import useKonamiCode from './hooks/useKonamiCode';
import GlitchChaos from './components/ui/GlitchChaos';
import TerminalCLI from './components/ui/TerminalCLI';

function App() {
  const konamiTriggered = useKonamiCode();
  const [showChaos, setShowChaos] = useState(false);

  useEffect(() => {
    if (konamiTriggered) {
      setShowChaos(true);
    }
  }, [konamiTriggered]);

  return (
    <MatrixProvider>
      <div className="min-h-screen text-white selection:bg-blue-500/30 relative z-0">
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
  );
}

export default App;