
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls, useGLTF } from '@react-three/drei';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

import handModelPath from '../assets/models/rigged_hand.glb';
import { ALPHABET_SIGN_MATRIX } from '../utils/signRecognizers/staticRecognizers/staticAlphabet';

const AXES = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
};

function rotateBone(node, axis, angle) {
  const rotation = new THREE.Quaternion().setFromAxisAngle(
    AXES[axis],
    angle
  );

  // Apply the rotation in the bone's local coordinate space.
  node.quaternion.multiply(rotation);
}

const FINGER_CONFIG = {
  index_finger: {
    ruleIndex: 0,
    spreadIndex: 0,
    curledWeight: 0.7,
    tuckedWeight: 1.2,
    spreadSplay: 0.15,
    closedSplay: -0.08,
    clawedWeight: 0.8,
    clawedBaseCurl: 0.05,
    clawedPipCurl: 1.1,
    clawedDipCurl: 0.9,
    clawedTipCurl: 0.5,
  },
  middle_finger: {
    ruleIndex: 1,
    spreadIndex: 0,
    curledWeight: 0.8,
    tuckedWeight: 1.2,
    spreadSplay: 0.05,
    closedSplay: -0.02,
    clawedWeight: 0.8,
    clawedBaseCurl: 0.05,
    clawedPipCurl: 1.1,
    clawedDipCurl: 0.9,
    clawedTipCurl: 0.5,
  },
  ring_finger: {
    ruleIndex: 2,
    spreadIndex: 1,
    curledWeight: 0.8,
    tuckedWeight: 1.2,
    spreadSplay: -0.05,
    closedSplay: 0.03,
    clawedWeight: 0.8,
    clawedBaseCurl: 0.05,
    clawedPipCurl: 1.1,
    clawedDipCurl: 0.9,
    clawedTipCurl: 0.5,
  },
  pinky: {
    ruleIndex: 3,
    spreadIndex: 1,
    curledWeight: 0.8,
    tuckedWeight: 1.2,
    spreadSplay: -0.15,
    closedSplay: 0.08,
    clawedWeight: 0.8,
    clawedBaseCurl: 0.04,
    clawedPipCurl: 1.0,
    clawedDipCurl: 0.9,
    clawedTipCurl: 0.5,
  },
};

function getSpreadState(spacingRule, gapIndex) {
  if (Array.isArray(spacingRule) && spacingRule.length === 3) {
    const gap = spacingRule[gapIndex];
    const state = Array.isArray(gap) ? gap[0] : gap;

    return state === 'APART' || state === 'SPREAD';
  }

  const state = Array.isArray(spacingRule)
    ? spacingRule[0]
    : spacingRule;

  return state === 'APART' || state === 'SPREAD';
}

function getTogetherState(spacingRule, gapIndex) {
  if (Array.isArray(spacingRule)) {
    const gap = spacingRule[gapIndex];
    return Array.isArray(gap)
      ? gap[0] === 'TOGETHER'
      : gap === 'TOGETHER';
  }

  return spacingRule === 'TOGETHER';
}

function getCurlWeight(state, config) {
  if (state === 'TUCKED') return config.tuckedWeight;
  if (state === 'CURLED') return config.curledWeight;
  if (state === 'CLAWED') return config.clawedWeight;
  return 0;
}

function applyFingerRotation(node, state, isSpread, config) {
  const name = node.name.toLowerCase();
  const curl = getCurlWeight(state, config);
  const splay = isSpread
    ? config.spreadSplay
    : config.closedSplay;

  if (state === 'CLAWED') {
    if (name.includes('_mcp')) {
      rotateBone(node, 'x', config.clawedBaseCurl);
      rotateBone(node, 'z', splay);
    } else if (name.includes('_pip')) {
      rotateBone(node, 'x', config.clawedPipCurl);
    } else if (name.includes('_dip')) {
      rotateBone(node, 'x', config.clawedDipCurl);
    } else if (name.includes('_tip')) {
      rotateBone(node, 'x', config.clawedTipCurl);
    }

    return;
  }

  if (name.includes('_mcp')) {
    rotateBone(node, 'x', curl * 0.1);
    rotateBone(node, 'z', splay);
  } else if (name.includes('_pip')) {
    rotateBone(node, 'x', curl * 1.1);
  } else if (name.includes('_dip')) {
    rotateBone(node, 'x', curl * 1.2);
  } else if (name.includes('_tip')) {
    rotateBone(node, 'x', curl * 1.3);
  }
}

function applyThumbRotation(node, rule, letter) {
  const name = node.name.toLowerCase();
  const state = rule.thumb || [];
  const thumbPos = rule.thumbPosition;
  const primaryThumbPos = state[0] || thumbPos;

  const thumbShape = Array.isArray(rule.thumbShape)
    ? rule.thumbShape[0]
    : rule.thumbShape;

  const isThumbBent = thumbShape === 'BENT';

  const isTuckedAcross =
    state.includes('IN') ||
    thumbPos === 'IN' ||
    rule.thumbTuckedInFront;

  const isOutFront =
    state.includes('OUT_FRONT') ||
    thumbPos === 'OUT_FRONT' ||
    primaryThumbPos === 'OUT_FRONT';

  const isOutSide =
    state.includes('OUT_SIDE') ||
    thumbPos === 'OUT_SIDE' ||
    primaryThumbPos === 'OUT_SIDE' ||
    (
      !isOutFront &&
      (
        state.includes('OUT') ||
        thumbPos === 'OUT' ||
        primaryThumbPos === 'OUT' ||
        letter === 'C'
      )
    );

  const isThumbOut = isOutFront || isOutSide;
  const isTuckedUnder = rule.thumbTuckedUnder;

  const isTouchingIndex =
    !isTuckedAcross &&
    !isThumbOut &&
    (rule.thumbTouchingIndex || state.includes('UP'));

  // Forward-facing thumb.
  if (isOutFront) {
    if (name.includes('thumb_cmc')) {
      rotateBone(node, 'x', 0.4);
      rotateBone(node, 'y', 0.1); // whether the thumb sticks out in front or behind the palm (more negative = more behind)
      rotateBone(node, 'z', -0.1);
    } else if (name.includes('thumb_mcp')) {
      rotateBone(node, 'x', 0.7);
      rotateBone(node, 'y', 0.4);
      rotateBone(node, 'z', 0.3);
    } else if (name.includes('thumb_ip')) {
      rotateBone(node, 'x', 0.0);
    }
  }

  // Sideways thumb, like the L handshape.
  else if (isOutSide) {
    if (name.includes('thumb_cmc')) {
      rotateBone(node, 'x', 0.2);
      rotateBone(node, 'y', 0.2);
      rotateBone(node, 'z', 0.8);
    } else if (name.includes('thumb_mcp')) {
      rotateBone(node, 'z', -0.6);
      rotateBone(node, 'x', 0.4);
    } else if (name.includes('thumb_ip')) {
      rotateBone(node, 'x', 0.1);
    }
  }

  // Thumb tucked across the palm.
  else if (isTuckedAcross) {
    if (name.includes('thumb_cmc')) {
      rotateBone(node, 'x', 0.6);
      rotateBone(node, 'y', 0.5);
      rotateBone(node, 'z', -0.3);
    } else if (name.includes('thumb_ip')) {
      rotateBone(node, 'x', 2.5);
      rotateBone(node, 'y', 0.7);
      rotateBone(node, 'z', -1.0);
    }
  }

  // Thumb pointing up or touching the index finger.
  else if (isTouchingIndex || primaryThumbPos === 'UP') {
    if (name.includes('thumb_cmc')) {
      rotateBone(node, 'x', 0.2);
      rotateBone(node, 'y', 0.2);
      rotateBone(node, 'z', 0.2);
    } else if (name.includes('thumb_mcp')) {
      rotateBone(node, 'z', -0.6);
      rotateBone(node, 'x', 0.4);
    }
  }

  // Thumb tucked underneath.
  else if (isTuckedUnder) {
    if (name.includes('thumb_cmc')) {
      rotateBone(node, 'x', 0.5);
      rotateBone(node, 'y', 0.8);
    }
  }

  // Bend at the joint nearest the thumb tip.
  if (isThumbBent && name === 'thumb_tip') {
    rotateBone(node, 'x', 1.0);
    rotateBone(node, 'z', -0.7);
  }
}

function applyFingerSpacing(node, spacingRule) {
  const name = node.name.toLowerCase();

  if (
    getTogetherState(spacingRule, 0) &&
    name.includes('index_finger') &&
    name.includes('_pip')
  ) {
    rotateBone(node, 'z', -0.12);
  }

  if (
    getTogetherState(spacingRule, 1) &&
    name.includes('ring_finger') &&
    name.includes('_mcp')
  ) {
    rotateBone(node, 'z', 0.03);
  }

  if (
    getTogetherState(spacingRule, 2) &&
    name.includes('pinky') &&
    name.includes('_mcp')
  ) {
    rotateBone(node, 'z', 0.12);
  }
}

function applySignPose(scene, rule, letter, initialRotations) {
  const spacingRule = rule?.spacing;

  scene.traverse((node) => {
    // Restore the bind pose before applying this sign.
    const initialQuaternion = initialRotations.get(node.uuid);

    if (initialQuaternion) {
      node.quaternion.copy(initialQuaternion);
    }

    if (!rule || !node.isBone) return;

    const name = node.name.toLowerCase();

    for (const [fingerName, config] of Object.entries(FINGER_CONFIG)) {
      if (!name.includes(fingerName)) continue;

      const state =
        rule.fingers?.[config.ruleIndex]?.[0] || 'EXTENDED';

      const isSpread = getSpreadState(
        spacingRule,
        config.spreadIndex
      );

      applyFingerRotation(node, state, isSpread, config);
      break;
    }

    if (name.includes('thumb')) {
      applyThumbRotation(node, rule, letter);
    }

    applyFingerSpacing(node, spacingRule);
  });
}

function HandModel({ currentSign }) {
  const { scene } = useGLTF(handModelPath);
  const clonedScene = useRef(null);
  const initialRotations = useRef(new Map());

  if (!clonedScene.current) {
    clonedScene.current = clone(scene);

    clonedScene.current.traverse((node) => {
      if (node.isBone) {
        initialRotations.current.set(
          node.uuid,
          node.quaternion.clone()
        );
      }
    });
  }

  useEffect(() => {
    const letter = currentSign?.toUpperCase();
    const rule = ALPHABET_SIGN_MATRIX[letter];

    applySignPose(
      clonedScene.current,
      rule,
      letter,
      initialRotations.current
    );
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
  const controlsRef = useRef(null);

  return (
    <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-inner">
      <button
        type="button"
        onClick={() => controlsRef.current?.reset()}
        className="absolute right-3 top-3 z-10 cursor-pointer rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 backdrop-blur-sm transition-all hover:bg-slate-700"
        title="Reset View"
      >
        Reset
      </button>

      <Canvas
        camera={{
          position: [0, -3.5, 1.5],
          up: [0, 0, 1],
          fov: 45,
        }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />

        <HandModel currentSign={currentSign} />

        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan
          enableRotate
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}