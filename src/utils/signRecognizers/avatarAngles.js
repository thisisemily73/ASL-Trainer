// src/utils/signRecognizers/staticRecognizers/avatarAngles.js

// 1. Base joint rotations mapped directly to your exact string types
export const FINGER_BASE_ROTATIONS = {
  EXTENDED: { knuckle: 0,    mid: 0,    tip: 0 },
  CURLED:   { knuckle: 0.5,  mid: 0.6,  tip: 0.4 },
  CLAWED:   { knuckle: 0.2,  mid: 1.1,  tip: 0.9 },
  TUCKED:   { knuckle: 1.4,  mid: 1.4,  tip: 1.1 }
};

export const THUMB_BASE_ROTATIONS = {
  OUT:     { x: 0,    y: -0.6, z: -0.2 },
  UP:      { x: -0.4, y: 0,    z: 0.5 },
  PALM_IN: { x: 0.8,  y: 0.3,  z: 0.6 }
};

export const WRIST_BASE_ROTATIONS = {
  PALM_OUT: { x: 0,    y: 0,    z: 0 },
  SIDEWAYS: { x: 0,    y: 0,    z: -1.35 }, // Tilts the hand sideways (~75-90 deg)
  PALM_IN:  { x: 0,    y: 3.14, z: 0 }      // Rotates hand completely backward
};

// 2. Import your existing matrix rules or define a simplified copy here
// This reads your matrix and strips it down to clean targets for GSAP
export const getPoseForLetter = (matrix, letter) => {
  const rules = matrix[letter];
  if (!rules) return null;

  return {
    index:  rules.fingers[0][0], // Pull the primary target state
    middle: rules.fingers[1][0],
    ring:   rules.fingers[2][0],
    pinky:  rules.fingers[3][0],
    thumb:  rules.thumb[0],
    wrist:  rules.rotation[0]
  };
};
