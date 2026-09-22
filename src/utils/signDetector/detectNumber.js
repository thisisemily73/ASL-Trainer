// detectAlphabet.js
import { detectNumberSign } from "../signRecognizers/numberRecognizer"; 

/**
 * 🚀 THE UNIVERSAL BRIDGE HOOK
 * Receives MediaPipe landmarks, checks the flexible array matrix dictionary,
 * and passes a formatted response directly to your CameraBox front-end UI.
 */
export const detectNumber = (landmarks) => {
    if (!landmarks || landmarks.length === 0) {
        return "No sign detected";
    }

    // 1. Pass raw landmarks down into your flexible pattern arrays loop
    const matchedLetter = detectNumberSign(landmarks);

    // 2. Safely output the text to your front-end component container display
    if (matchedLetter) {
        return `Detected sign: ${matchedLetter}`;
    }

    return "No sign detected";
};

