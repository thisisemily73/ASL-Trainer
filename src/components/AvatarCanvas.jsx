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
        // 1. Always reset to clean bind pose first
        const initialQuat = initialRotations.current.get(node.uuid);
        if (initialQuat) {
          node.quaternion.copy(initialQuat);
        }

        if (!rule) return;

        const name = node.name.toLowerCase();

        // Helper to apply curls to 4 fingers
        // Helper to apply curls strictly to the upper finger joints, leaving the palm/MCP steady
        const applyFingerBend = (fingerIndex) => {
          const state = rule.fingers[fingerIndex]?.[0];
          const curlWeight = state === 'EXTENDED' ? 0.0 : state === 'CLAWED' ? 0.7 : 1.2;

          if (name.includes('_mcp')) {
            node.rotateX(curlWeight * 0.1); // palm rotation near finger
          } else if (name.includes('_pip')) {
            node.rotateX(curlWeight * 1.1); // Main knuckle bend
          } else if (name.includes('_dip')) {
            node.rotateX(curlWeight * 1.2); // mid joint curl
          } else if (name.includes('_tip')) { // tip curl
            node.rotateX(curlWeight * 1.3);
          }
        };

        if (name.includes('index_finger')) {
          applyFingerBend(0);
        } else if (name.includes('middle_finger')) {
          applyFingerBend(1);
        } else if (name.includes('ring_finger')) {
          applyFingerBend(2);
        } else if (name.includes('pinky')) {
          applyFingerBend(3);
        } else if (name.includes('thumb')) {
          const thumbStates = rule.thumb || [];
          const isThumbExtended = thumbStates.includes('UP') || thumbStates.includes('SIDE') || thumbStates[0] === 'UP' || thumbStates[0] === 'SIDE';
          
          if (isThumbExtended) {
            if (name.includes('thumb_cmc')) {
              node.rotation.order = 'YXZ';
              node.rotateX(0.1); // forward (straight at cam) vs up  
              node.rotateY(0.3); // back and forth
              node.rotateZ(0.3);  // up and down (pos is down)
            } else if (name.includes('thumb_mcp')) {
              node.rotateZ(-0.6);  // up and down
              node.rotateX(0.4);
              node.rotateY(0);
            } else if (name.includes('thumb_ip')) {
              node.rotateX(0);  // Natural tip curve
              node.rotateZ(0);
            }
          } else {
            // Tucked position for closed fists (like 'S')
            if (name.includes('thumb_cmc')) {
              node.rotateX(0.5);
              node.rotateY(0.8);
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