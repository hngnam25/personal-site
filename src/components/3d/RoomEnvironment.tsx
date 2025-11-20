import { useLayoutEffect, useRef } from "react";
import { useGLTF, useTexture, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store";

export function RoomEnvironment(props: any) {
  // 1. Load the Room
  const room = useGLTF("/room/scene.gltf");
  
  // 2. Load the Computer Desk
  const { scene: computerScene } = useGLTF("/computer_desk/scene.glb");
  
  // Load textures for Computer
  const computerTextures = useTexture({
    map: "/computer_desk/textures/texture_pbr_v128_1.png",
    roughnessMap: "/computer_desk/textures/texture_pbr_v128_metallic-texture_pbr_v128_roughness_2@chann.png",
    metallicMap: "/computer_desk/textures/texture_pbr_v128_metallic-texture_pbr_v128_roughness_2@chann.png",
  });

  useLayoutEffect(() => {
    // Configure Computer Textures
    computerTextures.map.colorSpace = THREE.SRGBColorSpace;
    // Reverting to default flipY=true to match MacModel.tsx behavior (which works)
    // Note: Manual overrides are removed to use default behavior
    
    computerScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.map = computerTextures.map;
          mesh.material.roughnessMap = computerTextures.roughnessMap;
          mesh.material.metalnessMap = computerTextures.metallicMap;

          // Adjust material properties to match the aged beige plastic look
          // Reduce the influence of the metallic map if it's making it too shiny/grainy
          // Plastic is generally non-metallic
          mesh.material.metalness = 0.1; 
          mesh.material.roughness = 0.6; // Slightly rough plastic
          
          // Tint the color to match beige plastic if the texture is too white
          // The texture itself seems to have the color, but let's ensure we aren't washing it out
          // mesh.material.color = new THREE.Color('#e8e4d0'); // Uncomment if texture is grey/white

          mesh.material.envMapIntensity = 0.5; // Reduce environmental reflections
          mesh.material.needsUpdate = true;
        }
      }
    });
    
    // Room Scaling/Shadows
    room.scene.traverse((child) => {
       if ((child as THREE.Mesh).isMesh) {
         child.castShadow = true;
         child.receiveShadow = true;
       }
    });

  }, [computerScene, computerTextures, room.scene]);

  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const setPhase = useStore((state) => state.setPhase);
  const phase = useStore((state) => state.phase);
  
  useFrame((state) => {
     if (!scroll) return;
     const offset = scroll.offset;

     // Adjust camera logic for rotated room
     // When room rotates -90 deg (Y), the 'computer' which was at X: -1.16, Z: 0.05 
     // is now roughly at Z: -1.16, X: -0.05 (following standard rotation rules).
     // Let's re-calculate or simply adjust the camera to look at the "new" location.
     
     // New Computer World Position (Approximate after parent rotation)
     // Original: [-1.16, 0.85, 0.05]
     // Rotated -90 Y: [0.05, 0.85, 1.16] (Signs depend on rotation direction, let's verify visually)
     // Math: x' = x cos(-90) - z sin(-90) = 0 - 0.05(-1) = 0.05
     //       z' = x sin(-90) + z cos(-90) = -1.16(-1) + 0 = 1.16
     
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const endPos = new THREE.Vector3(0.05, 0.85, 2.5); // Zoomed out slightly in front of new Z
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const endLookAt = new THREE.Vector3(0.05, 0.85, 1.16); // The computer position
     
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const startPos = new THREE.Vector3(0, 2, 6);
     const startLookAt = new THREE.Vector3(0, 0, 0);
     
     const currentLookAtX = THREE.MathUtils.lerp(startLookAt.x, endLookAt.x, offset);
     const currentLookAtY = THREE.MathUtils.lerp(startLookAt.y, endLookAt.y, offset);
     const currentLookAtZ = THREE.MathUtils.lerp(startLookAt.z, endLookAt.z, offset);
     
     state.camera.lookAt(currentLookAtX, currentLookAtY, currentLookAtZ);

     // Threshold check for phase change
     if (offset > 0.95 && phase === 'analog') {
        setPhase('digital');
      }
  
      if (offset < 0.95 && phase === 'digital') {
        setPhase('analog');
      }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* 
         Room Scene 
         Scaling by 0.01 because the GLTF nodes have scale 100, 
         and we want to normalize the scene to meters roughly.
      */}
      <primitive 
        object={room.scene} 
        scale={0.01} 
        rotation={[0, -Math.PI / 2, 0]} 
      />

      {/* 
         Computer Desk Positioned on Table (Left)
         Position Y increased to 0.9 (20% higher).
         Rotation adjusted: User asked to turn 90 deg "right on x axis". 
         Assuming they meant turning it to face the correct direction (Y-axis rotation).
         Changed rotation from [0, Math.PI/2, 0] to [0, 0, 0] (90 deg turn).
         If this is incorrect (e.g. they wanted it tilted), we can adjust.
      */}
      <group position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <group position={[0, 0.85, 1.17]} rotation={[0, 3, 0]}>
             <primitive object={computerScene} scale={0.5} />
          </group>
      </group>
    </group>
  );
}

useGLTF.preload("/room/scene.gltf");
useGLTF.preload("/computer_desk/scene.glb");
