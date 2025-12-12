import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/3d/Experience';
import { Overlay } from './components/Overlay';
import { useStore } from './store';

function App() {
  const { isMobile, setIsMobile, setPhase, hasEntered, setHasEntered, hasZoomed, isScreenFocused, phase } = useStore();

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasEntered && e.key === 'Enter') {
        setHasEntered(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasEntered, setHasEntered]);

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
      
      {/* Welcome Screen */}
      {!isMobile && !hasEntered && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Left Corner Text */}
          <div className="absolute top-10 left-10 max-w-md text-white/80 font-['DearPix'] text-lg leading-relaxed pointer-events-auto">
            <h2 className="text-2xl mb-4">nhà [ɲaː˨˩]:</h2>
            <ol className="list-decimal pl-5 space-y-4">
              
                A physical place or spiritual state where one lives or returns to; a dwelling that provides safety, shelter, and familiarity.
              

            </ol>
          </div>

          {/* Right Corner Welcome */}
          <div className="absolute bottom-0 right-0 p-20 pb-20 flex flex-col items-end gap-8 pointer-events-auto">
             <h1 className="text-6xl font-bold text-white text-right drop-shadow-lg leading-tight font-['Ransom']">
               Happy Birthday Baby!   <br/>
               <span className="text-[#FFD700]">Welcome In</span> 
             </h1>
             <button 
               onClick={() => setHasEntered(true)}
               className="relative w-32 h-16 bg-[#e5e5e5] rounded-md shadow-[0_4px_0_#a3a3a3] active:shadow-none active:translate-y-1 transition-all group"
               aria-label="Enter"
             >
                {/* Key Cap */}
                <div className="absolute inset-1 bg-[#f0f0f0] rounded flex items-center justify-center border-b-4 border-[#d4d4d4]">
                  <span className="text-gray-600 text-xl font-['DearPix'] group-hover:text-black transition-colors">enter ↵</span>
                </div>
             </button>
          </div>
        </div>
      )}

      {/* Manual / Instructions */}
      {!isMobile && hasEntered && (
        <div className="absolute bottom-10 right-10 text-white/70 text-sm font-['DearPix'] pointer-events-none z-10">
          <div className="space-y-1">
            {isScreenFocused ? (
              <div>Enjoy the Music or Press Tab to Go Back</div>
            ) : hasZoomed ? (
              phase === 'digital' ? (
                <div>Scroll Down to Get Back in the Room</div>
              ) : (
                <div>Scroll Up to Check Out the Computer</div>
              )
            ) : (
              <>
                <div>+ Press Space to check out the workspace</div>
                <div>+ Press Tab to listen to some music</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Initial Loading / Scroll Prompt (Optional) */}
      {/* Temporarily disabled
      {!isMobile && hasEntered && phase === 'analog' && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white opacity-50 animate-bounce pointer-events-none z-10">
          Scroll to explore
        </div>
      )}
      */}
    </div>
  );
}

export default App;
