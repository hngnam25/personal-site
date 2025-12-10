import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store';

export const LoginScreen: React.FC = () => {
  const { setIsUnlocked } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus input on mount
    if (inputRef.current) {
        inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1307') {
      setIsUnlocked(true);
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000); // Reset error state after shake
    }
  };

  return (
    <div className="absolute inset-0 bg-[#5f5f5f] flex items-center justify-center z-50 pointer-events-auto">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
        
        <div className="relative bg-[#e6e6e6] p-1 border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl w-80">
            {/* Header */}
            <div className="bg-[#000080] text-white px-2 py-1 font-bold font-['DearPix'] mb-4 flex justify-between items-center text-sm">
                <span>System Login</span>
                <div className="w-3 h-3 bg-[#c0c0c0] border border-t-white border-l-white border-b-black border-r-black"></div>
            </div>

            <div className="px-4 pb-6 font-['DearPix']">
                <div className="mb-6 flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-[#c0c0c0] border-2 border-black rounded-full flex items-center justify-center mb-2">
                        <span className="text-3xl">🔑</span>
                    </div>
                    <h2 className="text-xl">Authentication Required</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Enter Password:</label>
                        <input
                            ref={inputRef}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-white border-2 border-b-white border-r-white border-t-black border-l-black px-2 py-1 outline-none font-sans ${error ? 'bg-red-100 animate-pulse' : ''}`}
                            maxLength={4}
                            autoFocus
                        />
                    </div>
                    
                    <div className="text-xs text-gray-500 italic text-center">
                        Hint: State Bird Provision
                    </div>

                    <div className="flex justify-end pt-2">
                        <button 
                            type="submit"
                            className="bg-[#c0c0c0] px-4 py-1 border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white"
                        >
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

