// src/hooks/useGLTFAvatarAnimation.js
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FINGER_BASE_ROTATIONS, THUMB_BASE_ROTATIONS, WRIST_BASE_ROTATIONS, getPoseForLetter } from '../utils/signRecognizers/staticRecognizers/avatarAngles';
// Import your matrix directly from where you have it written
import { ALPHABET_SIGN_MATRIX } from '../utils/signRecognizers/staticRecognizers/staticAlphabet';

export function useGLTFAvatarAnimation(nodes, currentLetter) {
  const refs = {
    wrist: useRef(), thumb1: useRef(), thumb2: useRef(),
    index1: useRef(), index2: useRef(), middle1: useRef(), middle2: useRef(),
    ring1: useRef(), ring2: useRef(), pinky1: useRef(), pinky2: useRef()
  };

  useEffect(() => {
    const pose = getPoseForLetter(ALPHABET_SIGN_MATRIX, currentLetter);
    if (!pose) return;

    const transitionTime = 0.35;
    const smoothEase = "power2.out";

    // 1. Process Wrist Angles
    const wRot = WRIST_BASE_ROTATIONS[pose.wrist] || WRIST_BASE_ROTATIONS.PALM_OUT;
    gsap.to(refs.wrist.current.rotation, { x: wRot.x, y: wRot.y, z: wRot.z, duration: transitionTime, ease: smoothEase });

    // 2. Process Thumb Angles
    const tRot = THUMB_BASE_ROTATIONS[pose.thumb] || THUMB_BASE_ROTATIONS.IN;
    gsap.to(refs.thumb1.current.rotation, { x: tRot.x, y: tRot.y, z: tRot.z, duration: transitionTime, ease: smoothEase });

    // 3. Process Fingers Matrix States via Loop
    const fingerKeys = ['index', 'middle', 'ring', 'pinky'];
    fingerKeys.forEach((finger) => {
      const state = pose[finger];
      const targetAngles = FINGER_BASE_ROTATIONS[state] || FINGER_BASE_ROTATIONS.TUCKED;

      // Smoothly bend individual knuckle references
      gsap.to(refs[`${finger}1`].current.rotation, { x: targetAngles.knuckle, duration: transitionTime, ease: smoothEase });
      gsap.to(refs[`${finger}2`].current.rotation, { x: targetAngles.mid, duration: transitionTime, ease: smoothEase });
    });

  }, [currentLetter]);

  return refs;
}
