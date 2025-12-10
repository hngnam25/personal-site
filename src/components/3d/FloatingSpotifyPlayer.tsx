import React from 'react';
import { Html } from '@react-three/drei';

export const FloatingSpotifyPlayer: React.FC = () => {
  return (
    <Html
      transform
      occlude
      position={[-0.03, -0.12, 0]} // Center relative to parent
      rotation={[0, 0, 0]}
      scale={0.027} // Scale down to fit 3D scene
      style={{
        width: '320px', 
        height: '160px',
        userSelect: 'none',
      }}
    >
      <div className="pointer-events-auto rounded-xl overflow-hidden shadow-2xl">
        <iframe 
          style={{ borderRadius: '12px' }} 
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0" 
          width="100%" 
          height="160 " 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy" 
          title="Spotify Embed"
        />
      </div>
    </Html>
  );
};
