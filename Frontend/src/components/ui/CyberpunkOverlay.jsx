import React from 'react';

const CyberpunkOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      {/* Corner Accents */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 w-16 h-16 md:w-32 md:h-32 border-l-2 border-t-2 border-neon-blue/30 rounded-tl-3xl" />
      <div className="absolute top-4 right-4 md:top-8 md:right-8 w-16 h-16 md:w-32 md:h-32 border-r-2 border-t-2 border-neon-purple/30 rounded-tr-3xl" />
      <div className="absolute bottom-20 left-4 md:bottom-8 md:left-8 w-16 h-16 md:w-32 md:h-32 border-l-2 border-bottom-2 border-neon-green/30 rounded-bl-3xl border-b-2" />
      <div className="absolute bottom-20 right-4 md:bottom-8 md:right-8 w-16 h-16 md:w-32 md:h-32 border-r-2 border-bottom-2 border-neon-blue/30 rounded-br-3xl border-b-2" />

      {/* System Status Text */}
      <div className="absolute top-6 left-6 md:top-12 md:left-12 font-mono text-[10px] md:text-xs text-neon-blue/50 tracking-widest">
        SYSTEM_STATUS: ONLINE
        <br />
        SECURE_CONNECTION: ESTABLISHED
      </div>

      <div className="absolute bottom-24 right-6 md:bottom-10 md:right-10 text-[10px] font-mono text-neon-blue/40 tracking-widest block">
        RENDER_ENGINE: ACTIVE
        <br />
        <span className="text-red-500/40 animate-pulse hidden md:inline-block">
          ⚠ WARNING: DO NOT INPUT KONAMI SEQUENCE
        </span>
      </div>

      {/* Decorative Lines - Hidden on mobile */}
      <div className="hidden md:block absolute top-1/2 left-8 w-1 h-24 bg-gradient-to-b from-transparent via-neon-blue/50 to-transparent" />
      <div className="hidden md:block absolute top-1/2 right-8 w-1 h-24 bg-gradient-to-b from-transparent via-neon-purple/50 to-transparent" />
    </div>
  );
};

export default CyberpunkOverlay;
