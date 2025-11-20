import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useStore, WindowState } from '../../store';

interface WindowProps {
  window: WindowState;
}

export const Window: React.FC<WindowProps> = ({ window: windowState }) => {
  const closeWindow = useStore((state) => state.closeWindow);

  if (!windowState.isOpen) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: 0, top: 24, right: globalThis.innerWidth - 50, bottom: globalThis.innerHeight - 50 }} 
      initial={{ scale: 0.95, opacity: 0, x: windowState.position.x, y: windowState.position.y }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="absolute w-96 bg-[#DDDDDD] border border-black shadow-[2px_2px_0_rgba(0,0,0,0.2)] flex flex-col overflow-hidden font-sans"
      style={{ fontFamily: 'Chicago, sans-serif' }}
    >
      {/* Mac OS 9 Title Bar */}
      <div className="h-6 bg-[#DDDDDD] border-b border-[#555555] flex items-center justify-center relative px-1 select-none cursor-grab active:cursor-grabbing">
        {/* Close Button Box */}
        <button 
            onClick={() => closeWindow(windowState.id)}
            className="absolute left-1 w-3 h-3 border border-[#555555] bg-white active:bg-black shadow-[inset_1px_1px_0_#888] flex items-center justify-center group"
        >
            {/* Inner square implies functionality */}
        </button>

        {/* Horizontal Stripes + Title */}
        <div className="w-full h-full flex items-center justify-center px-6">
             {/* Stripes Background */}
             <div className="absolute inset-x-6 top-1 bottom-1 flex flex-col justify-between z-0 opacity-30 pointer-events-none">
                <div className="h-[1px] bg-black w-full mb-[1px]"></div>
                <div className="h-[1px] bg-black w-full mb-[1px]"></div>
                <div className="h-[1px] bg-black w-full mb-[1px]"></div>
                <div className="h-[1px] bg-black w-full mb-[1px]"></div>
                <div className="h-[1px] bg-black w-full"></div>
             </div>
             
             {/* Title Text with Background to cover stripes */}
             <span className="relative z-10 px-2 bg-[#DDDDDD] font-bold text-black text-xs tracking-wide">
                 {windowState.title}
             </span>
        </div>

        {/* Collapse / Maximize Button (Right Side) */}
         <div className="absolute right-1 w-3 h-3 border border-[#555555] bg-[#DDDDDD] shadow-[inset_1px_1px_0_#fff]">
            {/* Often empty or minimal icon in OS 9 */}
             <div className="absolute inset-[2px] border border-[#555555]"></div>
         </div>
      </div>

      {/* Content Area with Inner Bezel */}
      <div className="flex-1 p-[2px]">
          <div className="bg-white border-l border-t border-[#555555] border-r border-b border-[#fff] h-64 overflow-y-auto custom-scrollbar p-3 text-black text-sm font-mono leading-relaxed">
            <ReactMarkdown className="prose prose-sm max-w-none font-sans">
              {windowState.content}
            </ReactMarkdown>
          </div>
      </div>
      
      {/* Status Bar / Resize Grip */}
       <div className="h-4 bg-[#DDDDDD] flex items-center px-2 justify-between border-t border-white relative">
          <span className="text-[10px] text-[#555]">{windowState.id}</span>
          {/* Resize Grip Lines */}
          <div className="w-3 h-3 flex flex-col items-end justify-end gap-[2px]">
             <div className="w-3 h-[1px] bg-[#888]"></div>
             <div className="w-2 h-[1px] bg-[#888]"></div>
             <div className="w-1 h-[1px] bg-[#888]"></div>
          </div>
      </div>
    </motion.div>
  );
};
