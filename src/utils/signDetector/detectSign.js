// Alphabet Recognizer
import * as alphabetRecognizers from "../signRecognizers/alphabetRecognizer.js";
const detectSignA = alphabetRecognizers.detectSignA;
const detectSignB = alphabetRecognizers.detectSignB;
const detectSignE = alphabetRecognizers.detectSignE;
const detectSignI = alphabetRecognizers.detectSignI;
const detectSignL = alphabetRecognizers.detectSignL;
const detectSignS = alphabetRecognizers.detectSignS;
const detectSignU = alphabetRecognizers.detectSignU;
const detectSignV = alphabetRecognizers.detectSignV;

export const detectSign = (landmarks) => {
    if (detectSignA(landmarks)) {
        return "Detected sign: A";
    } else if (detectSignB(landmarks)) {
        return "Detected sign: B";
    } else if (detectSignE(landmarks)) {
        return "Detected sign: E";
    } else if (detectSignI(landmarks)) {
        return "Detected sign: I";
    } else if (detectSignL(landmarks)) {
        return "Detected sign: L";
    } else if (detectSignS(landmarks)) {
        return "Detected sign: S";
    } else if (detectSignU(landmarks)) {
        return "Detected sign: U";
    } else if (detectSignV(landmarks)) {
        return "Detected sign: V";
    } else {
        return "No sign detected";
    }
};