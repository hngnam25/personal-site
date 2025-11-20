import React, { useRef } from "react";
import { useGLTF, useScroll, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store";

export function MacModel(props: any) {
  const { nodes, materials } = useGLTF("/macintosh/scene.gltf") as any;
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const setPhase = useStore((state) => state.setPhase);
  const phase = useStore((state) => state.phase);

  useFrame((state) => {
    if (!scroll) return;

    const offset = scroll.offset;

    // Camera Animation Logic
    const startZ = 450;
    const endZ = 20; 
    const targetZ = startZ - (offset * (startZ - endZ)); 
    
    // Z-axis movement (Zoom)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);

    // Y-axis movement (Height Adjustment)
    // We want to move UP 20% as we zoom in.
    // Start Y = 0 (Centered)
    // End Y = 20 (or whatever value feels like "20% higher" relative to the screen size)
    const targetY = THREE.MathUtils.lerp(0, 50, offset); 
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1);
    
    // Rotation
    if (groupRef.current) {
       groupRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.1, offset);
       groupRef.current.rotation.y = THREE.MathUtils.lerp(0, -0.1, offset);
    }

    // Threshold check
    if (offset > 0.95 && phase === 'analog') {
      setPhase('digital');
    }

    if (offset < 0.95 && phase === 'digital') {
      setPhase('analog');
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <Center>
          {/* 
             The raw mesh is rotated -90 degrees on X (facing up).
             We need to rotate it back 90 degrees on X to face forward.
             If it's showing the bottom, it might be rotated 90 degrees the wrong way.
             Let's try explicit rotation to fix orientation.
           */}
        <group rotation={[Math.PI / 2, 0, 0]}> 
           <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
              <mesh
                castShadow
                receiveShadow
                geometry={nodes['Circle032__0'].geometry}
                material={materials['Scene_-_Root']}
              />
            </group>
        </group>
      </Center>
    </group>
  );
}

useGLTF.preload("/macintosh/scene.gltf");
