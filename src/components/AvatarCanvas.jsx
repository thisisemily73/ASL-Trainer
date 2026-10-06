import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import handModelPath from '../assets/models/rigged_hand.glb';
import { ALPHABET_SIGN_MATRIX } from '../utils/signRecognizers/staticRecognizers/staticAlphabet';

function HandModel({ currentSign }) {
  const { scene } = useGLTF(handModelPath);

  const clonedScene = useRef();
  const initialRotations = useRef(new Map());

  if (!clonedScene.current) {
    clonedScene.current = clone(scene);

    // Save natural bind-pose quaternions on initial load
    clonedScene.current.traverse((node) => {
      if (node.isBone) {
        initialRotations.current.set(node.uuid, node.quaternion.clone());
      }
    });
  }

  useEffect(() => {
    const letter = currentSign?.toUpperCase();
    const rule = ALPHABET_SIGN_MATRIX[letter];

    clonedScene.current.traverse((node) => {
      if (node.isBone) {
        // Reset to clean bind pose first
        const initialQuat = initialRotations.current.get(node.uuid);
        if (initialQuat) {
          node.quaternion.copy(initialQuat);
        }

        if (!rule) return;

        const name = node.name.toLowerCase();
        const bendStrength = 0.35;

        const applyFingerBend = (fingerIndex) => {
          const state = rule.fingers[fingerIndex]?.[0];
          const curlWeight = state === 'EXTENDED' ? 0.0 : state === 'CURLED' ? 0.4 : state === 'CLAWED' ? 0.7 : 1.0;

          if (name.includes('_01r')) {
            node.rotateX(curlWeight * bendStrength);
          } else if (name.includes('_02r')) {
            node.rotateX(curlWeight * (bendStrength * 0.8));
          } else if (name.includes('_03r')) {
            node.rotateX(curlWeight * (bendStrength * 0.5));
          }
        };

        if (name.includes('index')) {
          applyFingerBend(0);
        } else if (name.includes('middle')) {
          applyFingerBend(1);
        } else if (name.includes('ring')) {
          applyFingerBend(2);
        } else if (name.includes('pinky')) {
          applyFingerBend(3);
      } else if (name.includes('thumb')) {
        const thumbStates = rule.thumb || [];
        const isThumbExtended = thumbStates.includes('UP') || thumbStates.includes('SIDE') || thumbStates[0] === 'UP' || thumbStates[0] === 'SIDE';
        
        if (isThumbExtended) {
          if (name.includes('_01r') || name.includes('base') || name.includes('1')) {
            node.rotation.x = 0.0;   
            node.rotation.y = -1.1;  // Swings it inward toward the palm plane
            node.rotation.z = 1.4;   // Points the thumb straight UP alongside the index finger
          } else if (name.includes('_02r') || name.includes('2')) {
            node.rotation.z = 0.3;   // Gentle curve at the tip
          }
        } else {
          // Tucked position for closed fists (like 'S')
          if (name.includes('_01r') || name.includes('base')) {
            node.rotation.x = 0.5;
            node.rotation.y = 1.0;
          }
        }
      }
      }
    });
  }, [currentSign]);

  return (
    <Center>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={clonedScene.current} scale={1.5} />
      </group>
    </Center>
  );
}

export function AvatarCanvas({ currentSign }) {
  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
      <Canvas camera={{ position: [0, -3.5, 1.5], up: [0, 0, 1], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <HandModel currentSign={currentSign} />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}