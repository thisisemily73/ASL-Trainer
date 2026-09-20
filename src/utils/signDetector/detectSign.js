// Alphabet Recognizer
import { detectAlphabet } from "./detectAlphabet.js";

export const detectSign = (landmarks) => {
    const alphabetResult = detectAlphabet(landmarks);
    if (alphabetResult) return `${alphabetResult}`;
};