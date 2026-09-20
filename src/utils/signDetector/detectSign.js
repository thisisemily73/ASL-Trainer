// Alphabet Recognizer
import { detectAlphabet } from "./detectAlphabet.js";
import { detectFingerPositions } from "./detectFingerPos.js";

export const detectSign = (landmarks) => {

    // const fingerPosResult = detectFingerPositions(landmarks);
    // if (fingerPosResult) return `${fingerPosResult}`;

    const alphabetResult = detectAlphabet(landmarks);
    if (alphabetResult) return `${alphabetResult}`;

};