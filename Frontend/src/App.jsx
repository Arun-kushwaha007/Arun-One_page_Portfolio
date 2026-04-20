import { useState, useEffect, lazy, Suspense } from 'react';
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
import useKonamiCode from './hooks/useKonamiCode';
import SmoothScroll from './components/ui/SmoothScroll';
import { preloadDeferredAssets } from './utils/assetLoader';

// ── Lazy-loaded heavy components ──
// Three.js bundle (~500KB+) deferred from critical path
const Background3D = lazy(() => import('./components/Background3D'));
// Chatbot (~26KB source + triggers ~4MB chatbot avatar loading)
const PortfolioChatbot = lazy(() => import('./components/chatbot/PortfolioChatbot'));
// Non-critical overlays
const MatrixRain = lazy(() => import('./components/ui/MatrixRain'));
const GlitchChaos = lazy(() => import('./components/ui/GlitchChaos'));
const TerminalCLI = lazy(() => import('./components/ui/TerminalCLI'));

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

  // ── Start loading deferred assets (chatbot avatar + audio) after page loads ──
  useEffect(() => {
    if (!isLoading) {
      // Small delay to let the main content settle first
      const timer = setTimeout(() => {
        preloadDeferredAssets();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isChatOpen) {
      return undefined;
    }

    const { body } = document;
    const scrollY = window.scrollY;
    const previousStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      body.style.overflow = previousStyles.overflow;
      body.style.position = previousStyles.position;
      body.style.top = previousStyles.top;
      body.style.width = previousStyles.width;
      window.scrollTo(0, scrollY);
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
              <Suspense fallback={null}>
                <MatrixRain />
                <GlitchChaos triggered={showChaos} onComplete={() => setShowChaos(false)} />
                <TerminalCLI />
                <Background3D />
              </Suspense>
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

            <Suspense fallback={null}>
              <PortfolioChatbot isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
            </Suspense>
          </div>
        </SmoothScroll>
      </MatrixProvider>
    </CursorProvider>
  );
}

export default App;
