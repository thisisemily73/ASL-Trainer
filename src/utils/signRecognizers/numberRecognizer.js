// numberRecognizer.js
import * as signPositions from '../signRecognizers/signPositions';
import * as specialPositions from '../signRecognizers/specialPositions'

// NUMBER SIGN MATRIX
const NUMBER_SIGN_MATRIX = {
    "CLAWED": {
        fingers: [["EXTENDED"], ["TUCKED"], ["TUCKED"], ["TUCKED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "CURLED": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED","CLAWED","CURLED", "EXTENDED"], ["CURLED","EXTENDED"]],
        thumb: ["OUT"],
        rotation: [["PALM_OUT", "SIDEWAYS"], ["IA"]],
        spacing: ["APART", "TOGETHER"]
    },
    "EXTENDED": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED"], ["TUCKED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "4": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["EXTENDED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "5": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["EXTENDED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "6": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["TUCKED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "7": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["CLAWED"], ["EXTENDED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "8": {
        fingers: [["EXTENDED"], ["CLAWED"], ["EXTENDED"], ["EXTENDED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "9": {
        fingers: [["CLAWED"], ["EXTENDED"], ["EXTENDED"], ["EXTENDED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    }
};

export const detectNumberSign = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return null;

    const indexS = signPositions.getIndexState(landmarks);
    const middleS = signPositions.getMiddleState(landmarks);
    const ringS = signPositions.getRingState(landmarks);
    const pinkyS = signPositions.getPinkyState(landmarks);
    const thumbS = signPositions.getThumbState(landmarks);
    const rotationS = signPositions.getHandRotation(landmarks);
    const spacingS = signPositions.getFingerSpacing(landmarks);

    const liveFingers = [indexS, middleS, ringS, pinkyS];

    console.log(`👉 FINGERS: [${liveFingers.join(", ")}] | Thumb: ${thumbS} | Rot: ${rotationS} | Space: ${spacingS}`);

    // Loop through your matrix to find a match
    for (const [number, data] of Object.entries(NUMBER_SIGN_MATRIX)) {
        // Check if the live fingers match any allowed pattern for this number
        const matchesFingers = data.fingers.some(pattern => 
            pattern.every((val, i) => val === liveFingers[i])
        );

        if (matchesFingers) {
            return number; // Returns "CLAWED", "CURLED", "EXTENDED", etc.
        }
    }

    return null; // No match found in the matrix
};