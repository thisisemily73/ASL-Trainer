
import { detectAlphabet } from "./detectAlphabet.js";
import { detectNumber } from "./detectNumber.js";

// Require a sign to be detected consistently before changing the result.
const REQUIRED_FRAMES = 4;
const MAX_MISSED_FRAMES = 5;

let candidateSign = null;
let candidateCount = 0;
let stableSign = null;
let missedFrames = 0;

export const detectSign = (landmarks) => {
    const alphabetResult = detectAlphabet(landmarks);
    const numberResult = alphabetResult
        ? null
        : detectNumber(landmarks);

    const detectedSign = alphabetResult || numberResult || null;

    if (detectedSign === stableSign) {
        candidateSign = null;
        candidateCount = 0;
        missedFrames = 0;
        return stableSign;
    }

    if (!detectedSign) {
        missedFrames++;

        candidateSign = null;
        candidateCount = 0;

        if (missedFrames >= MAX_MISSED_FRAMES) {
            stableSign = null;
            missedFrames = 0;
        }

        return stableSign;
    }

    missedFrames = 0;

    if (detectedSign === candidateSign) {
        candidateCount++;
    } else {
        candidateSign = detectedSign;
        candidateCount = 1;
    }

    if (candidateCount >= REQUIRED_FRAMES) {
        stableSign = candidateSign;
        candidateSign = null;
        candidateCount = 0;
    }

    return stableSign;
};
