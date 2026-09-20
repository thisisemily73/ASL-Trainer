// Alphabet Recognizer
import * as alphabetRecognizers from "../signRecognizers/alphabetRecognizer.js";
const detectSignA = alphabetRecognizers.detectSignA;
const detectSignB = alphabetRecognizers.detectSignB;

export const detectSign = (landmarks) => {
    if (detectSignA(landmarks)) {
        return "Detected sign: A";
    } else if (detectSignB(landmarks)) {
        return "Detected sign: B";
    } else {
        return "No sign detected";
    }
};