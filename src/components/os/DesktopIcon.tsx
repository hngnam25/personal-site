import React from 'react';
import { useStore } from '../../store';

interface DesktopIconProps {
  id: string;
  label: string;
  icon?: React.ReactNode; // Placeholder for an icon component or image
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ id, label, icon }) => {
  const openWindow = useStore((state) => state.openWindow);

  return (
    <div 
      className="flex flex-col items-center gap-1 w-24 cursor-pointer group p-2 active:bg-[#ccccff]/50 rounded-none transition-colors"
      onClick={() => openWindow(id)}
    >
        {/* Classic Mac Folder / File Icon */}
      <div className="w-12 h-10 relative">
           {/* Folder Body */}
           <div className="absolute bottom-0 w-full h-[85%] bg-[#99CCFF] border border-[#000000] shadow-[1px_1px_0_rgba(0,0,0,0.5)] z-10 flex items-center justify-center">
                {/* Inner shadow/detail */}
                <div className="w-[80%] h-[1px] bg-blue-300 mb-4"></div>
           </div>
           {/* Folder Tab */}
           <div className="absolute top-0 left-0 w-[40%] h-[20%] bg-[#99CCFF] border-t border-l border-r border-[#000000] rounded-t-sm z-0"></div>
      </div>

      <span className="text-black text-center text-xs font-sans bg-white px-1 border border-dashed border-transparent group-active:border-black group-active:bg-black group-active:text-white select-none" style={{ fontFamily: 'Chicago, sans-serif' }}>
        {label}
      </span>
    </div>
  );
};
