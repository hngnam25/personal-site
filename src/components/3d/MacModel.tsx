import { useRef, useLayoutEffect } from "react";
import { useGLTF, useScroll, Center, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store";

export function MacModel(props: any) {
  const { scene } = useGLTF("/computer_desk/scene.glb");
  
  // Load textures
  const textures = useTexture({
    map: "/computer_desk/textures/texture_pbr_v128_1.png",
    roughnessMap: "/computer_desk/textures/texture_pbr_v128_metallic-texture_pbr_v128_roughness_2@chann.png",
    metallicMap: "/computer_desk/textures/texture_pbr_v128_metallic-texture_pbr_v128_roughness_2@chann.png",
  });

  useLayoutEffect(() => {
    // Configure textures
    // default flipY is true, which is usually correct for standard textures not embedded in GLTF
    // If the texture looks upside down, we can set this to false.
    // textures.map.flipY = false; 
    textures.map.colorSpace = THREE.SRGBColorSpace;
    // textures.roughnessMap.flipY = false;
    // textures.metallicMap.flipY = false;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Apply textures if it's a StandardMaterial
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.map = textures.map;
          mesh.material.roughnessMap = textures.roughnessMap;
          mesh.material.metalnessMap = textures.metallicMap;
          mesh.material.needsUpdate = true;
        }
      }
    });
  }, [scene, textures]);

  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const setPhase = useStore((state) => state.setPhase);
  const phase = useStore((state) => state.phase);

  useFrame((state) => {
    if (!scroll) return;

    const offset = scroll.offset;

    // Camera Animation Logic
    // Adjusted for likely scale of new model, assuming it's roughly unit scale or similar
    const startZ = 4; // Reduced from 450 as we probably don't need to be that far if we Scale correctly
    const endZ = 1; 
    // If we keep the large numbers, we might need to scale the model up significantly.
    // Let's try to keep the original logic for now but maybe check scale.
    // The previous model had scale={100}.
    
    // Let's use a more standard viewing distance for now.
    // Or keep the original large values if we scale the model up.
    // Let's assume we want to fit it in view.
    
    // Retaining original logic structure but values might need tuning.
    // Let's try scaling the model up to match the previous one's presence.
    
    const targetZ = startZ - (offset * (startZ - endZ)); 
    
    // Z-axis movement (Zoom)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 1);

    // Y-axis movement
    const targetY = THREE.MathUtils.lerp(0, 0.1, offset); 
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
           {/* Scale adjusted. Previous was 100. Let's start with 1 and see. 
               If it's too small, we increase. 
               Usually downloaded models are unit scale (meters) or cm. 
               Previous code used scale 100 which implies the previous model was tiny (cm -> m?).
           */}
        <primitive object={scene} scale={2} />
      </Center>
    </group>
  );
}

useGLTF.preload("/computer_desk/scene.glb");
