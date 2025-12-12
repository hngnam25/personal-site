import { create } from 'zustand';
import { generatePhotoWindows } from './utils/photos';

export type AppPhase = 'analog' | 'digital';

export interface WindowState {
  id: string;
  title: string;
  content: string; // Markdown content
  imageUrl?: string; // Optional image URL for photo windows
  isOpen: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  zIndex?: number; // Z-index for layering windows
}

export interface SpotifyState {
  currentTrack: {
    title: string;
    artist: string;
    albumArt: string;
  } | null;
  isPlaying: boolean;
  selectedPlaylist: string | null;
}

interface AppState {
  phase: AppPhase;
  isMobile: boolean;
  hasZoomed: boolean; // Track if we are zoomed in via spacebar
  hasEntered: boolean; // Track if user has clicked "Enter" from intro
  isScreenFocused: boolean; // Track if user has pressed "Tab" for screen focus
  isUnlocked: boolean; // Track if user has unlocked the OS
  spotifyState: SpotifyState;

  setPhase: (phase: AppPhase) => void;
  setIsMobile: (isMobile: boolean) => void;
  setHasZoomed: (hasZoomed: boolean) => void;
  setHasEntered: (hasEntered: boolean) => void;
  setIsScreenFocused: (isScreenFocused: boolean) => void;
  setIsUnlocked: (isUnlocked: boolean) => void;
  setSpotifyState: (state: Partial<SpotifyState>) => void;
  
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
  hasEntered: false,
  isScreenFocused: false,
  isUnlocked: false,
  spotifyState: {
    currentTrack: null,
    isPlaying: false,
    selectedPlaylist: null
  },
  setPhase: (phase) => set({ phase }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setHasZoomed: (hasZoomed) => set({ hasZoomed }),
  setHasEntered: (hasEntered) => set({ hasEntered }),
  setIsScreenFocused: (isScreenFocused) => set({ isScreenFocused }),
  setIsUnlocked: (isUnlocked) => set({ isUnlocked }),
  setSpotifyState: (newState) => set((state) => ({
    spotifyState: { ...state.spotifyState, ...newState }
  })),

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
    },
    // Photo windows - dynamically generated from public/photos/
    ...generatePhotoWindows()
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

