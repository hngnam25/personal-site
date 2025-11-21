import React, { useEffect, useState } from 'react';
import { useStore } from '../../store';

// Mock Data
const MOCK_PLAYLISTS = [
  { id: 'p1', name: 'Lofi Beats', cover: 'https://picsum.photos/id/10/50' },
  { id: 'p2', name: 'Retro Wave', cover: 'https://picsum.photos/id/20/50' },
  { id: 'p3', name: 'Coding Focus', cover: 'https://picsum.photos/id/30/50' },
];

const MOCK_TRACKS = {
  p1: { title: 'Chill Study', artist: 'Lofi Girl', duration: '2:30' },
  p2: { title: 'Neon Sunset', artist: 'Synthwave Boy', duration: '3:45' },
  p3: { title: 'Deep Focus', artist: 'Brain.fm', duration: '5:00' },
};

export const SpotifyPlayer: React.FC = () => {
  const { spotifyState, setSpotifyState } = useStore();
  const [progress, setProgress] = useState(0);

  // Simulation Effect
  useEffect(() => {
    let interval: number;
    if (spotifyState.isPlaying) {
      interval = window.setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [spotifyState.isPlaying]);

  const togglePlay = () => {
    setSpotifyState({ isPlaying: !spotifyState.isPlaying });
  };

  const selectPlaylist = (id: string) => {
    setSpotifyState({
      selectedPlaylist: id,
      currentTrack: {
        title: MOCK_TRACKS[id as keyof typeof MOCK_TRACKS].title,
        artist: MOCK_TRACKS[id as keyof typeof MOCK_TRACKS].artist,
        albumArt: MOCK_PLAYLISTS.find((p) => p.id === id)?.cover || '',
      },
      isPlaying: true,
    });
    setProgress(0);
  };

  return (
    <div className="pointer-events-auto w-80 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 p-1 shadow-xl font-sans select-none">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-0.5 text-xs font-bold flex justify-between items-center mb-1">
        <span>WinAmp - Spotify Edition</span>
        <button className="text-xs hover:bg-red-500 px-1">x</button>
      </div>

      {/* Main Display Area */}
      <div className="bg-black text-[#00ff00] p-2 mb-2 font-mono text-xs border-2 border-gray-600 inset-shadow">
        <div className="flex justify-between mb-1">
          <span>{spotifyState.isPlaying ? 'PLAYING' : 'PAUSED'}</span>
          <span>128kbps</span>
        </div>
        <div className="marquee whitespace-nowrap overflow-hidden">
          {spotifyState.currentTrack
            ? `${spotifyState.currentTrack.artist} - ${spotifyState.currentTrack.title}`
            : 'Select a Playlist...'}
        </div>
        {/* Visualizer Mock */}
        <div className="flex gap-0.5 h-8 mt-2 items-end">
           {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-[#00ff00] transition-all duration-75"
                style={{ height: spotifyState.isPlaying ? `${Math.random() * 100}%` : '10%' }}
              />
           ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-2 px-1">
         <div className="flex gap-1">
            <button className="w-6 h-6 bg-[#c0c0c0] border-outset text-[10px] active:border-inset" onClick={() => setProgress(0)}>⏮</button>
            <button className="w-8 h-6 bg-[#c0c0c0] border-outset text-[10px] active:border-inset" onClick={togglePlay}>
                {spotifyState.isPlaying ? '⏸' : '▶'}
            </button>
            <button className="w-6 h-6 bg-[#c0c0c0] border-outset text-[10px] active:border-inset">⏭</button>
         </div>
         <div className="flex items-center gap-1">
             <span className="text-[10px]">VOL</span>
             <input type="range" className="w-16 h-2 accent-[#00ff00]" />
         </div>
      </div>

      {/* Playlist Selection */}
      <div className="bg-white border-2 border-gray-600 h-32 overflow-y-auto p-1 text-xs">
        {MOCK_PLAYLISTS.map((playlist, index) => (
            <div 
                key={playlist.id}
                onClick={() => selectPlaylist(playlist.id)}
                className={`cursor-pointer p-1 hover:bg-blue-600 hover:text-white flex items-center gap-2 ${spotifyState.selectedPlaylist === playlist.id ? 'bg-blue-600 text-white' : 'text-black'}`}
            >
                <span className="font-mono">{index + 1}.</span>
                <span>{playlist.name}</span>
            </div>
        ))}
      </div>
      
      <div className="text-[10px] flex justify-between mt-1 px-1 text-gray-600">
        <span>0:0{Math.floor(progress / 10)} / {spotifyState.currentTrack ? '3:45' : '0:00'}</span>
        <span>Stereo</span>
      </div>
    </div>
  );
};

