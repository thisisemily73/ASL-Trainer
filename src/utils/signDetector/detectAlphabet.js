// detectAlphabet.js
import { detectStaticAlphabetSign } from "../signRecognizers/staticRecognizers/staticAlphabet"; 
import { updateLandmarkHistory, detectDynamicAlphabet } from '../signRecognizers/dynamicRecognizers/dynamicAlphabet';

// Keep track of the last time a dynamic sign was detected to prevent flickering
let lastDynamicTime = 0;
const DYNAMIC_LOCKOUT_MS = 600; // Lock out static signs for 0.6 seconds after a dynamic motion

export const detectAlphabet = (landmarks) => {
    if (!landmarks || landmarks.length === 0) {
        return null;
    }

    // 1. Always update history
    updateLandmarkHistory(landmarks);

    const now = Date.now();

    // 2. Check dynamic signs
    const matchedDynamicLetter = detectDynamicAlphabet(landmarks);
    if (matchedDynamicLetter) {
        lastDynamicTime = now; // Reset the lockout timer
        return `${matchedDynamicLetter}`;
    }

    // 3. If we are still within the lockout window after a dynamic motion, skip static checks
    if (now - lastDynamicTime < DYNAMIC_LOCKOUT_MS) {
        return null; // Or return the last active dynamic letter to keep it stable
    }

    // 4. Fall back to static alphabet signs
    const matchedStaticLetter = detectStaticAlphabetSign(landmarks);
    if (matchedStaticLetter) {
        return `${matchedStaticLetter}`;
    }

    return null;
};