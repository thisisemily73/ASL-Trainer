// src/components/AvatarCanvas.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useGLTFAvatarAnimation } from '../hooks/useGLTFAvatarAnimation'; // We'll create this clean hook next

function AvatarModel({ currentLetter }) {
  // Pulls your web-optimized file straight out of public/models/
  const { nodes } = useGLTF('/models/avatar-transformed.glb');
  
  // Custom hook that binds your specific bone paths to your animation targets
  const boneRefs = useGLTFAvatarAnimation(nodes, currentLetter);

  return (
    <group dispose={null}>
      {/* Skeleton Base Object Anchor */}
      <primitive object={nodes.Hips} />
      
      {/* Hand Rig Target Groups hooked into your refs */}
      <primitive object={nodes.RightHand} ref={boneRefs.wrist} />
      
      <primitive object={nodes.RightHandThumb1} ref={boneRefs.thumb1} />
      <primitive object={nodes.RightHandThumb2} ref={boneRefs.thumb2} />
      
      <primitive object={nodes.RightHandIndex1} ref={boneRefs.index1} />
      <primitive object={nodes.RightHandIndex2} ref={boneRefs.index2} />
      
      <primitive object={nodes.RightHandMiddle1} ref={boneRefs.middle1} />
      <primitive object={nodes.RightHandMiddle2} ref={boneRefs.middle2} />
      
      <primitive object={nodes.RightHandRing1} ref={boneRefs.ring1} />
      <primitive object={nodes.RightHandRing2} ref={boneRefs.ring2} />
      
      <primitive object={nodes.RightHandPinky1} ref={boneRefs.pinky1} />
      <primitive object={nodes.RightHandPinky2} ref={boneRefs.pinky2} />

      {/* Skinned Avatar Meshes Renderers */}
      <skinnedMesh 
        geometry={nodes.Wolf3D_Avatar.geometry} 
        skeleton={nodes.Wolf3D_Avatar.skeleton} 
      />
    </group>
  );
}

export function AvatarCanvas({ currentLetter }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', background: '#18181c', borderRadius: '12px' }}>
      <Canvas camera={{ position: [0, 1.2, 0.55], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[1, 2, 1]} intensity={1.2} castShadow />
        <directionalLight position={[-1, 1, -1]} intensity={0.4} />

        <Suspense fallback={null}>
          <AvatarModel currentLetter={currentLetter} />
        </Suspense>

        <OrbitControls 
          enableZoom={true} 
          maxDistance={1.5} 
          minDistance={0.3} 
          target={[0.15, 1.05, 0]} // Focuses camera alignment squarely on the right hand chest zone
        />
      </Canvas>
    </div>
  );
}
