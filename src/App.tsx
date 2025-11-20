import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/3d/Experience';
import { Overlay } from './components/Overlay';
import { useStore } from './store';

function App() {
  const { phase, isMobile, setIsMobile, setPhase } = useStore();

  useEffect(() => {
    const checkMobile = () => {
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
      if (isMob) {
        setPhase('digital');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile, setPhase]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* 3D Scene Layer - Always rendered to maintain scroll state */}
      {!isMobile && (
        <div className="absolute inset-0 z-0">
          {/* Camera Z reset for new model */}
          <Canvas camera={{ position: [0, 0, 8], fov: 35, near: 0.1, far: 100 }}>
            <Experience />
          </Canvas>
        </div>
      )}

      {/* OS Interface Layer - Visible in digital phase or mobile */}
      <Overlay />
      
      {/* Initial Loading / Scroll Prompt (Optional) */}
      {!isMobile && phase === 'analog' && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white opacity-50 animate-bounce pointer-events-none z-10">
          Scroll to enter
        </div>
      )}
    </div>
  );
}

export default App;
