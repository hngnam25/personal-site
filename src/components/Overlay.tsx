import React from 'react';
import { useStore } from '../store';
import { Taskbar } from './os/Taskbar';
import { DesktopIcon } from './os/DesktopIcon';
import { Window } from './os/Window';
import { AnimatePresence } from 'framer-motion';

export const Overlay: React.FC = () => {
  const { phase, isMobile, windows } = useStore();
  const showOS = phase === 'digital' || isMobile;

  if (!showOS) return null;

  // We want to allow scrolling to pass through to the 3D scene to trigger the "zoom out"
  // but we still need pointer events for clicking icons and windows.
  // Solution: We listen to the wheel event and manually pass it or allow it to propagate?
  // Actually, if this div is pointer-events-auto, it captures the scroll.
  // We can set pointer-events-none on the container, but re-enable it on interactive elements.
  
  return (
    <div className="fixed inset-0 w-full h-full bg-[#004E98] pointer-events-none overflow-hidden font-sans">
      {/* Background Color - we need this to be visible but not block clicks? 
          Actually, if we want the background to be the OS blue, it has to be visible.
          If we make it pointer-events-none, we can click "through" it to the canvas? 
          BUT the canvas is behind it.
          
          Wait, if we want to scroll "out", we are essentially scrolling UP.
          If we are in the OS, we are likely "at the bottom" of the scroll page.
          
          The ScrollControls attaches a scroll listener to the gl.domElement (canvas) OR a global scroll container.
          In standard ScrollControls, it creates a <div> on top of everything.
          Our Overlay is currently z-indexed on top of that? 
          
          Let's check where ScrollControls puts its div. It usually appends to the container of the Canvas.
          
          If Overlay has `pointer-events-auto`, it blocks the scroll events from reaching the ScrollControls div if it's behind it.
          
          Strategy: 
          1. Keep the main container pointer-events-none so scroll goes through.
          2. Make the background color applied to a -1 z-index div that IS pointer-events-auto (to block view) BUT we want scroll to pass? 
             No, standard DOM events: if an element has a background, it captures scroll.
          
          Better Strategy:
          Use a wheel event listener on the Overlay to programmatically update the scroll?
          OR: Just set the Overlay container to pointer-events-none?
          
          If we set pointer-events-none, we can't click the empty desktop. That's fine? 
          But we need the Blue Background.
          
          Let's try this: 
          The Overlay container is pointer-events-none.
          We add a background div that is pointer-events-none (just visual).
          We enable pointer-events-auto on Icons, Taskbar, and Windows.
          
          Issue: If we click/drag on the empty blue space, it will click through to the Canvas (if visible).
          In 'digital' phase, the Canvas is hidden? No, we just enabled it in the last step to stay mounted.
          
          If we want to scroll OUT, we just need the wheel event to bubble up or reach the listener.
          
          Let's try just making the main container `pointer-events-none` and adding a background div.
      */}
      
      {/* Visual Background - Pass through clicks/scrolls - Platinum Grey instead of Blue */}
      <div className="absolute inset-0 bg-[#7e7e7e] -z-10 pointer-events-none">
          {/* Mac OS 9 Pattern (Dotted/Grid) */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
      </div>

      {/* Desktop Icons - Enable Pointer Events - Push down below menu bar */}
      <div className="absolute top-10 left-4 flex flex-col gap-6 z-0 pointer-events-auto text-right items-end right-4 left-auto">
        <DesktopIcon id="projects" label="My Projects" />
        <DesktopIcon id="writings" label="Writings" />
        <DesktopIcon id="about" label="About Me" />
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {windows.map((window) => (
            <div key={window.id} className="pointer-events-auto">
                <Window window={window} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Taskbar - Enable Pointer Events - Moved to TOP for Mac OS style */}
      <div className="pointer-events-auto fixed top-0 w-full z-50">
         <Taskbar />
      </div>
    </div>
  );
};

