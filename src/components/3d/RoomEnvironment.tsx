import { useLayoutEffect, useRef, useEffect } from "react";
import { useGLTF, useTexture, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store";

// --- Configuration ---
const CONFIG = {
  scrollSpeed: 0.003,
  animationSpeed: 5,
  zoomDepth: 3 ,
  // Camera moves in Negative X direction during deep zoom (Forward into screen)
  zoomDirection: new THREE.Vector3(-1, 0, 0),
  phaseThreshold: 1.7,
};

// Camera Waypoints (in scene-relative coordinates)
// The scene is offset by [0, -1.2, -6] so (0,0,0) is the start
const WAYPOINTS = {
  intro: {
    pos: new THREE.Vector3(3, 5, 5), // Way above and slightly back, shifted right to make room for text
    lookAt: new THREE.Vector3(0, -1.2, -6), // Looking at the center of the room
  },
  start: {
    pos: new THREE.Vector3(0, 0, 0),
    lookAt: new THREE.Vector3(0, -0.25, -6),
  },
  base: {
    pos: new THREE.Vector3(1.17, -0.35, -5.8),
    lookAt: new THREE.Vector3(1.17, -0.35, -6),
  },
  screen: {
    // Move straight to the back of the room
    pos: new THREE.Vector3(0, -0.25, -6), 
    
    // Keep looking forward/slightly down or straight at the wall
    lookAt: new THREE.Vector3(0, -0.25  , -6), // Exact match to start.lookAt
  },
};

export function RoomEnvironment(props: any) {
  // --- State & Store ---
  const setPhase = useStore((state) => state.setPhase);
  const setHasZoomed = useStore((state) => state.setHasZoomed);
  const hasZoomed = useStore((state) => state.hasZoomed);
  const hasEntered = useStore((state) => state.hasEntered);
  const phase = useStore((state) => state.phase);
  const isScreenFocused = useStore((state) => state.isScreenFocused);
  const setIsScreenFocused = useStore((state) => state.setIsScreenFocused);

  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  // Animation State Refs
  const progressRef = useRef(0); // Smoothed zoom progress (0 -> 2)
  const rotationRef = useRef(0); // Smoothed camera rotation
  const scrollProgressRef = useRef(0); // User scroll input (-1 -> 1)
  const introProgressRef = useRef(0); // Transition from Intro -> Start (0 -> 1)

  // --- Resource Loading ---
  const room = useGLTF("/room/scene.gltf");
  const { scene: computerScene } = useGLTF("/computer_desk/scene.glb");

  const computerTextures = useTexture({
    map: "/computer_desk/textures/texture_pbr_v128_1.png",
    roughnessMap:
      "/computer_desk/textures/texture_pbr_v128_metallic-texture_pbr_v128_roughness_2@chann.png",
    metallicMap:
      "/computer_desk/textures/texture_pbr_v128_metallic-texture_pbr_v128_roughness_2@chann.png",
  });

  // --- Scene Setup (Materials & Shadows) ---
  useLayoutEffect(() => {
    computerTextures.map.colorSpace = THREE.SRGBColorSpace;

    // Configure Computer Desk Materials
    computerScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.map = computerTextures.map;
          mesh.material.roughnessMap = computerTextures.roughnessMap;
          mesh.material.metalnessMap = computerTextures.metallicMap;

          // Aesthetic adjustments for "aged beige plastic" look
          mesh.material.metalness = 0.1;
          mesh.material.roughness = 0.6;
          mesh.material.envMapIntensity = 0.5;
          mesh.material.needsUpdate = true;
        }
      }
    });

    // Configure Room Shadows
    room.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [computerScene, computerTextures, room.scene]);

  // --- Input Handling ---

  // 1. Spacebar: Toggle initial zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only allow spacebar zoom if we have entered
      if (!hasEntered) return; 

      if (e.code === "Space") {
        setHasZoomed(!hasZoomed);
        if (!hasZoomed) scrollProgressRef.current = 0; // Reset scroll on zoom out
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasZoomed, setHasZoomed, hasEntered]);

  // 2. Tab: Toggle Cupboard Focus
  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      // Only allow Tab zoom if we have entered and NOT zoomed into desk
      if (!hasEntered || hasZoomed) return;

      if (e.code === 'Tab') {
        e.preventDefault();
        setIsScreenFocused(!isScreenFocused);
      }
    };
    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [hasEntered, hasZoomed, isScreenFocused, setIsScreenFocused]);

  // 3. Mouse Wheel: Deep zoom interaction
  useEffect(() => {
    if (!hasZoomed || !hasEntered || isScreenFocused) return; // Disable scroll zoom if focused

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Accumulate scroll delta, clamped between -1 (zoom out past base) and 1 (max deep zoom)
      scrollProgressRef.current += e.deltaY * CONFIG.scrollSpeed;
      scrollProgressRef.current = Math.max(
        -1,
        Math.min(1, scrollProgressRef.current)
      );
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [hasZoomed, hasEntered]);

  // --- Animation Loop ---
  useFrame((state, delta) => {
    if (!scroll) return;

    // --- Intro Transition ---
    // If hasEntered, lerp introProgress to 1. Else stay at 0.
    const targetIntro = hasEntered ? 1 : 0;
    introProgressRef.current = THREE.MathUtils.lerp(
        introProgressRef.current,
        targetIntro,
        delta * 2 // Slower transition for intro
    );

    // 1. Determine Targets for Main Interaction (Start -> Base -> Zoom)
    let targetProgress = 0;
    let targetRotation = 0;

    if (hasZoomed && hasEntered && !isScreenFocused) {
      // Base zoom (1) + Scroll offset (-1 to 1) = Target range (0 to 2)
      targetProgress = 1 + scrollProgressRef.current;

      // Rotate camera 90deg when fully zoomed in (target=1), 0deg when zoomed out (target=0)
      const rotationFactor = Math.max(0, Math.min(1, targetProgress));
      targetRotation = (Math.PI / 2) * rotationFactor;

      // Auto-exit if scrolled out too far
      if (targetProgress < 0.5) {
        setHasZoomed(false);
        scrollProgressRef.current = 0;
      }
    }

    // 2. Smooth State Transitions
    progressRef.current = THREE.MathUtils.lerp(
      progressRef.current,
      targetProgress,
      delta * CONFIG.animationSpeed
    );
    rotationRef.current = THREE.MathUtils.lerp(
      rotationRef.current,
      targetRotation,
      delta * CONFIG.animationSpeed
    );

    const currentProgress = progressRef.current;

    // --- Screen Focus Override ---
    if (isScreenFocused) {
      // Smoothly move towards Screen Waypoint
      state.camera.position.lerp(WAYPOINTS.screen.pos, delta * 4);
      
      // HARD SET: Use the start lookAt directly. No lerping, no calculation.
      // This guarantees the camera angle remains exactly constant.
      state.camera.lookAt(WAYPOINTS.start.lookAt);
      
      return; // Skip standard logic
    }

    // 3. Interpolate Base Position & LookAt
    // Split progress into Stage 1 (0->1) and Stage 2 (1->2)
    const stage1Progress = Math.min(1, currentProgress);
    const stage2Progress = Math.max(0, currentProgress - 1);

    // Base Interpolation (Stage 1)
    let currentPos = new THREE.Vector3().lerpVectors(
      WAYPOINTS.start.pos,
      WAYPOINTS.base.pos,
      stage1Progress
    );

    let currentLookAt = new THREE.Vector3().lerpVectors(
      WAYPOINTS.start.lookAt,
      WAYPOINTS.base.lookAt,
      stage1Progress
    );

    // Deep Zoom Extension (Stage 2)
    if (stage2Progress > 0) {
      // Move both camera and lookAt target deeper
      const deepOffset = CONFIG.zoomDirection
        .clone()
        .multiplyScalar(CONFIG.zoomDepth * stage2Progress);
      
      currentPos.add(deepOffset);
      currentLookAt.add(deepOffset);
    }

    // 4. Apply Orbital Rotation
    // Rotates the camera around the LookAt point
    if (rotationRef.current !== 0) {
      const rotationMatrix = new THREE.Matrix4().makeRotationY(
        rotationRef.current
      );
      const cameraOffset = new THREE.Vector3().subVectors(
        currentPos,
        currentLookAt
      );

      cameraOffset.applyMatrix4(rotationMatrix);
      
      // Re-apply offset to LookAt
      // Note: We use currentLookAt as the pivot
      state.camera.position.addVectors(currentLookAt, cameraOffset);
    } else {
      state.camera.position.copy(currentPos);
    }

    // --- Apply Intro Interpolation ---
    // We interpolate between the calculated "Interactive State" (Start/Base/Zoom) and the "Intro State"
    // If introProgress is 0 (Start of intro), we are at WAYPOINTS.intro
    // If introProgress is 1 (Entered), we are at calculated state.
    
    if (introProgressRef.current < 0.999) {
         const introPos = WAYPOINTS.intro.pos;
         const introLookAt = WAYPOINTS.intro.lookAt;
         
         state.camera.position.lerpVectors(introPos, state.camera.position, introProgressRef.current);
         // For LookAt, we need to interpolate the target point, then look at it.
         // We can't just lerp the lookAt call, we have to lerp the vector we are looking at.
         // currentLookAt holds the target for the interactive state.
         
         const finalLookAt = new THREE.Vector3().lerpVectors(introLookAt, currentLookAt, introProgressRef.current);
         state.camera.lookAt(finalLookAt);
    } else {
         state.camera.lookAt(currentLookAt);
    }

    // 5. Handle Phase Switching (Analog <-> Digital)
    if (hasZoomed) {
      if (
        currentProgress > CONFIG.phaseThreshold &&
        phase === "analog"
      ) {
        setPhase("digital");
      } else if (
        currentProgress < CONFIG.phaseThreshold &&
        phase === "digital"
      ) {
        setPhase("analog");
      }
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Scene Offset: Moves world origin to camera start position */}
      <group position={[0, -1.2, -6]}>
        {/* Room Model */}
        <primitive
          object={room.scene}
          scale={0.01}
          rotation={[0, -Math.PI / 2, 0]}
        />

        {/* Computer Desk Model */}
        {/* Positioned on the left table, rotated 90deg to face room center */}
        <group position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <group position={[0, 0.85, 1.17]} rotation={[0, 3, 0]}>
            <primitive object={computerScene} scale={0.5} />
          </group>
        </group>
      </group>
    </group>
  );
}

// Preload assets
useGLTF.preload("/room/scene.gltf");
useGLTF.preload("/computer_desk/scene.glb");
