import React from 'react';
import { ScrollControls } from '@react-three/drei';
import { MacModel } from './MacModel';
import { useStore } from '../../store';

export const Experience: React.FC = () => {
  // We keep the Experience mounted to maintain ScrollControls state
  // Visibility is handled by Overlay covering the scene or CSS opacity if needed
  
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="blue" />
      
      <ScrollControls pages={2} damping={0.3}>
        <MacModel />
      </ScrollControls>
    </>
  );
};
