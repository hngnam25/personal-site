import { create } from 'zustand';

export type AppPhase = 'analog' | 'digital';

export interface WindowState {
  id: string;
  title: string;
  content: string; // Markdown content
  isOpen: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
}

interface AppState {
  phase: AppPhase;
  isMobile: boolean;
  hasZoomed: boolean; // Track if we are zoomed in via spacebar
  setPhase: (phase: AppPhase) => void;
  setIsMobile: (isMobile: boolean) => void;
  setHasZoomed: (hasZoomed: boolean) => void;
  
  // Window Management
  windows: WindowState[];
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void; // Bring to front (optional implementation detail)
}

export const useStore = create<AppState>((set) => ({
  phase: 'analog',
  isMobile: false,
  hasZoomed: false,
  setPhase: (phase) => set({ phase }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setHasZoomed: (hasZoomed) => set({ hasZoomed }),

  windows: [
    {
      id: 'about',
      title: 'About Me.txt',
      content: '# About Me\n\nHi, I am a Senior Creative Developer...',
      isOpen: false,
      isMinimized: false,
      position: { x: 100, y: 50 },
    },
    {
      id: 'projects',
      title: 'My Projects.folder',
      content: '# Projects\n\n- **Scrollytelling Site**: You are here!\n- **Three.js Game**: Coming soon.',
      isOpen: false,
      isMinimized: false,
      position: { x: 150, y: 100 },
    },
    {
      id: 'writings',
      title: 'Writings.doc',
      content: '# Thoughts\n\nThinking about the intersection of retro UI and 3D web...',
      isOpen: false,
      isMinimized: false,
      position: { x: 200, y: 150 },
    }
  ],

  openWindow: (id) => set((state) => ({
    windows: state.windows.map((w) => 
      w.id === id ? { ...w, isOpen: true, isMinimized: false } : w
    )
  })),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) => 
      w.id === id ? { ...w, isOpen: false } : w
    )
  })),

  focusWindow: (id) => {
    // Simple implementation: just ensure it's open. 
    // For z-index management, we'd need an activeWindowId or z-index array.
    set((state) => ({
        windows: state.windows.map((w) =>
            w.id === id ? { ...w, isOpen: true } : w
        )
    }));
  }
}));

