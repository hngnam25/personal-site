import { create } from 'zustand';
import { generatePhotoWindows } from './utils/photos';

export type AppPhase = 'analog' | 'digital';

export interface WindowState {
  id: string;
  title: string;
  content: string; // Markdown content
  imageUrl?: string; // Optional image URL for photo windows
  markdownUrl?: string; // Optional URL to load markdown content from external file
  isOpen: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  zIndex?: number; // Z-index for layering windows
  width?: number; // Optional custom width in pixels
  height?: number; // Optional custom height in pixels
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
    // Birthday message window - appears in front of all photos
    {
      id: 'birthday-message',
      title: 'Read Me.txt',
      content: '# Happy Birthday & 5 Month Anniversary Baby!\n\nYour challenge is to close all of these photos to revisit some of our favourite memories captured together <3',
      isOpen: true,
      isMinimized: false,
      position: { 
        x: typeof window !== 'undefined' ? window.innerWidth / 2 - 192 : 960 - 192, 
        y: typeof window !== 'undefined' ? window.innerHeight / 2 - 100 : 540 - 100 
      },
      zIndex: 10, // Highest z-index to appear in front of all photos
    },
    // Background photo - appears behind hidden-message and all photos
    {
      id: 'background-photo',
      title: 'ILMGF.jpg',
      content: '',
      imageUrl: '/photos/ILMGF.jpg',
      isOpen: true,
      isMinimized: false,
      position: { 
        x: typeof window !== 'undefined' ? window.innerWidth / 2 - 500 : 960 - 500, // Center horizontally (1000px / 2 = 500px)
        y: typeof window !== 'undefined' ? window.innerHeight / 2 - 400 : 540 - 400 // Center vertically (800px / 2 = 400px)
      },
      zIndex: -2, // Behind hidden-message and all photos (lowest z-index)
    },
    // Hidden message window - appears behind all photos, revealed when all photos are closed
    {
      id: 'hidden-message',
      title: 'Message.txt',
      content: '', // Content will be loaded from markdownUrl
      markdownUrl: '/hidden-message.md', // Path to markdown file in public folder
      isOpen: true,
      isMinimized: false,
      width: 768, // 2x the default width (384px * 2)
      height: 512, // 2x the default height (256px * 2)
      position: { 
        x: typeof window !== 'undefined' ? window.innerWidth / 2 - 384 : 960 - 384, // Center horizontally (768px / 2 = 384px)
        y: typeof window !== 'undefined' ? window.innerHeight / 2 - 256 : 540 - 256 // Center vertically (512px / 2 = 256px)
      },
      zIndex: -1, // Behind all photos but above background photo
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

