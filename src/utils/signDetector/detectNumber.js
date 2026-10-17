// detectNumber.js
import { detectNumberSign } from "../signRecognizers/staticRecognizers/numberRecognizer";

export const detectNumber = (landmarks) => {
    if (!landmarks || landmarks.length === 0) {
        return null;
    }

    // 1. Pass raw landmarks down into your flexible pattern arrays loop
    const matchedLetter = detectNumberSign(landmarks);

    // 2. Safely output the text to your front-end component container display
    if (matchedLetter) {
        return `${matchedLetter}`;
    }

    return null;
};

