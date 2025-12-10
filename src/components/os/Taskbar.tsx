import React, { useState, useEffect } from 'react';
import { Apple } from 'lucide-react'; // Using Apple icon as a proxy for the Apple Logo

export const Taskbar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-6 bg-[#DDDDDD] border-b border-[#999] flex items-center justify-between px-4 fixed top-0 w-full select-none shadow-sm z-50 font-sans" style={{ fontFamily: 'Chicago, sans-serif' }}>
      {/* Left Side: Apple Menu + App Name */}
      <div className="flex items-center gap-4 h-full">
         <div className="flex items-center justify-center h-full px-2 cursor-pointer hover:bg-black hover:text-white transition-colors">
             <Apple size={16} fill="currentColor" />
         </div>
         
         <div className="font-bold text-black text-sm cursor-pointer">
             Finder
         </div>

         <div className="flex items-center gap-3 text-sm text-black ml-2">
            <span className="cursor-pointer hover:underline decoration-dotted">File</span>
            <span className="cursor-pointer hover:underline decoration-dotted">Edit</span>
            <span className="cursor-pointer hover:underline decoration-dotted">View</span>
            <span className="cursor-pointer hover:underline decoration-dotted">Window</span>
            <span className="cursor-pointer hover:underline decoration-dotted">Special</span>
            <span className="cursor-pointer hover:underline decoration-dotted">Help</span>
         </div>
      </div>

      {/* Right Side: Tray / Clock / Application Switcher */}
      <div className="flex items-center gap-4 h-full text-sm text-black">
         <div className="flex items-center gap-1 px-2 border-l border-[#999] h-full cursor-pointer hover:bg-[#ccc]">
            {/* Placeholder Application Icon */}
            <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            <span className="font-bold hidden md:block">Khánh Xinh Gái</span>
         </div>
         
         <div className="px-2 border-l border-[#999] h-full flex items-center font-mono text-xs">
           {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
         </div>
      </div>
    </div>
  );
};
