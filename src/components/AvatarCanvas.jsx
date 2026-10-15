import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Center } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import handModelPath from '../assets/models/rigged_hand.glb';
import { ALPHABET_SIGN_MATRIX } from '../utils/signRecognizers/staticRecognizers/staticAlphabet';
import { isIndexAndMiddleTogether, isMiddleAndRingTogether } from '../utils/signRecognizers/staticRecognizers/signPositions';

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
        // 1. Reset to clean bind pose first
        const initialQuat = initialRotations.current.get(node.uuid);
        if (initialQuat) {
          node.quaternion.copy(initialQuat);
        }

        if (!rule) return;

        const name = node.name.toLowerCase();
        const spacingRule = rule.spacing;

        // Helper to check if a specific gap is spread/apart
        const getSpreadState = (gapIndex) => {
          if (Array.isArray(spacingRule) && spacingRule.length === 3) {
            const targetGap = spacingRule[gapIndex];
            const gapState = Array.isArray(targetGap) ? targetGap[0] : targetGap;
            return gapState === 'APART' || gapState === 'SPREAD';
          }
          const globalState = Array.isArray(spacingRule) ? spacingRule[0] : spacingRule;
          return globalState === 'APART' || globalState === 'SPREAD';
        };

        // index
        if (name.includes('index_finger')) {
          const state = rule.fingers?.[0]?.[0] || 'EXTENDED';
          let curlWeight = 0.0;

          if (state === "TUCKED") curlWeight = 1.2;
          else if (state === "CURLED") curlWeight = 0.7;
          else if (state === "EXTENDED") curlWeight = 0.0;

          const isSpread = getSpreadState(0);
          const splayZ = isSpread ? 0.15 : -0.08;

          if (name.includes('_mcp')) {
            node.rotateX(curlWeight * 0.1);
            node.rotateZ(splayZ);
          } else if (name.includes('_pip')) {
            node.rotateX(curlWeight * 1.1);
          } else if (name.includes('_dip')) {
            node.rotateX(curlWeight * 1.2);
          } else if (name.includes('_tip')) {
            node.rotateX(curlWeight * 1.3);
          }
        }

        // middle
        else if (name.includes('middle_finger')) {
          const state = rule.fingers?.[1]?.[0] || 'EXTENDED';
          let curlWeight = 0.0;

          if (state === "TUCKED") curlWeight = 1.2;
          else if (state === "CURLED") curlWeight = 0.8;
          else if (state === "EXTENDED") curlWeight = 0.0;

          const isSpread = getSpreadState(0);
          const splayZ = isSpread ? 0.05 : -0.02;

          if (name.includes('_mcp')) {
            node.rotateX(curlWeight * 0.1);
            node.rotateZ(splayZ);
          } else if (name.includes('_pip')) {
            node.rotateX(curlWeight * 1.1);
          } else if (name.includes('_dip')) {
            node.rotateX(curlWeight * 1.2);
          } else if (name.includes('_tip')) {
            node.rotateX(curlWeight * 1.3);
          }
        }

        // ring
        else if (name.includes('ring_finger')) {
          const state = rule.fingers?.[2]?.[0] || 'EXTENDED';
          let curlWeight = 0.0;

          if (state === "TUCKED") curlWeight = 1.2;
          else if (state === "CURLED") curlWeight = 0.8;
          else if (state === "EXTENDED") curlWeight = 0.0;

          const isSpread = getSpreadState(1);
          const splayZ = isSpread ? -0.05 : 0.03;

          if (name.includes('_mcp')) {
            node.rotateX(curlWeight * 0.1);
            node.rotateZ(splayZ);
          } else if (name.includes('_pip')) {
            node.rotateX(curlWeight * 1.1);
          } else if (name.includes('_dip')) {
            node.rotateX(curlWeight * 1.2);
          } else if (name.includes('_tip')) {
            node.rotateX(curlWeight * 1.3);
          }
        }

        // pinky
        else if (name.includes('pinky')) {
          const state = rule.fingers?.[3]?.[0] || 'EXTENDED';
          let curlWeight = 0.0;

          if (state === "TUCKED") curlWeight = 1.2;
          else if (state === "CURLED") curlWeight = 0.8;
          else if (state === "EXTENDED") curlWeight = 0.0;

          const isSpread = getSpreadState(1);
          const splayZ = isSpread ? -0.15 : 0.08;

          if (name.includes('_mcp')) {
            node.rotateX(curlWeight * 0.1);
            node.rotateZ(splayZ);
          } else if (name.includes('_pip')) {
            node.rotateX(curlWeight * 1.1);
          } else if (name.includes('_dip')) {
            node.rotateX(curlWeight * 1.2);
          } else if (name.includes('_tip')) {
            node.rotateX(curlWeight * 1.3);
          }
        }

        // thumb
        else if (name.includes('thumb')) {
          node.rotation.order = 'YXZ';

          const thumbStates = rule.thumb || [];
          const thumbPos = rule.thumbPosition;

          // If "IN" is specified, prevent it from triggering the UP/OUT branch
          const isTuckedAcross = thumbStates.includes('IN') || thumbPos === 'IN' || rule.thumbTuckedInFront;
          const isTouchingIndex = !isTuckedAcross && (rule.thumbTouchingIndex || thumbStates.includes('UP') || thumbStates.includes('OUT'));
          const isTuckedUnder = rule.thumbTuckedUnder;

          if (isTuckedAcross) {
            // Across the palm position (Used for B)
            if (name.includes('thumb_cmc')) {
              node.rotateX(0.6); // front/back of palm (higher number, further front)
              node.rotateY(0.5); // closer/farther to front of palm (lower number, closer to palm)
              node.rotateZ(-0.3); // closer/farther to side of palm (lower number, closer to palm) 
            } else if (name.includes('thumb_ip')) {
              node.rotateX(2.5); // up or down (greater pos value, further down)
              node.rotateY(0.7);
              node.rotateZ(-1.0); // tip up or down
            }
          }
          else if (isTouchingIndex || thumbPos === 'UP') {
            // Up / Out position (Used for A)
            if (name.includes('thumb_cmc')) {
              node.rotateX(0.2);
              node.rotateY(0.2);
              node.rotateZ(0.2);
            } else if (name.includes('thumb_mcp')) {
              node.rotateZ(-0.6);
              node.rotateX(0.4);
            }
          }
          else if (isTuckedUnder) {
            // Tucked under position (Used for S/T)
            if (name.includes('thumb_cmc')) {
              node.rotateX(0.5);
              node.rotateY(0.8);
            }
          }
        }

        // combos (multi-finger joint configuration adjustments or compound rules can go here)

        // Check if the Index-Middle gap rule specifies "TOGETHER"
        const isIndexMiddleTogetherRule = Array.isArray(spacingRule)
          ? (Array.isArray(spacingRule[0]) ? spacingRule[0][0] === "TOGETHER" : spacingRule[0] === "TOGETHER")
          : spacingRule === "TOGETHER";

        if (isIndexMiddleTogetherRule) {
          if (name.includes('index_finger') && name.includes('_pip')) {
            node.rotateZ(-0.12);
          }
        }

        // Check if the Middle-Ring gap rule specifies "TOGETHER"
        const isMiddleRingTogetherRule = Array.isArray(spacingRule)
          ? (Array.isArray(spacingRule[1]) ? spacingRule[1][0] === "TOGETHER" : spacingRule[1] === "TOGETHER")
          : spacingRule === "TOGETHER";

        if (isMiddleRingTogetherRule) {
          if (name.includes('ring_finger') && name.includes('_mcp')) {
            node.rotateZ(0.03);
          }
        }

        // Check if the Ring-Pinky gap rule specifies "TOGETHER"
        const isRingPinkyTogetherRule = Array.isArray(spacingRule)
          ? (Array.isArray(spacingRule[2]) ? spacingRule[2][0] === "TOGETHER" : spacingRule[2] === "TOGETHER")
          : spacingRule === "TOGETHER";

        if (isRingPinkyTogetherRule) {
          if (name.includes('pinky') && name.includes('_mcp')) {
            node.rotateZ(0.12);
          }
        }

        // hand rotation (applied based on rule.rotation or orientation matrix targets)
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
  const controlsRef = useRef();

  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner relative">
      <button
        onClick={() => controlsRef.current?.reset()}
        className="absolute top-3 right-3 z-10 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700 backdrop-blur-sm transition-all cursor-pointer"
        title="Reset View"
      >
        Reset
      </button>

      <Canvas camera={{ position: [0, -3.5, 1.5], up: [0, 0, 1], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <HandModel currentSign={currentSign} />
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}