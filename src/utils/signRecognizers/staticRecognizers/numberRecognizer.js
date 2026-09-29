// numberRecognizer.js
import * as signPositions from './signPositions';
import * as specialPositions from './specialPositions'

// NUMBER SIGN MATRIX
const NUMBER_SIGN_MATRIX = {
    "1": {
        fingers: [["EXTENDED"], ["TUCKED"], ["TUCKED"], ["TUCKED"]],
        thumb: ["IN", "PALM_IN"],
        rotation: ["PALM_IN"],
        spacing: ["APART", "TOGETHER"]
    },
    "2": {
        // Index & Middle extended; Ring & Pinky can be tucked or clawed/curled
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED", "CLAWED", "CURLED"], ["TUCKED", "CLAWED", "CURLED"]],
        thumb: ["IN", "UP"],
        rotation: ["PALM_IN", "SIDEWAYS"],
        spacing: ["APART", "TOGETHER"]
    },
    "3": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED"], ["TUCKED"]],
        thumb: ["OUT", "UP"],
        rotation: ["PALM_IN"],
        spacing: ["APART"]
    },
    "4": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["EXTENDED"]],
        thumb: ["IN", "PALM_IN"],
        rotation: ["PALM_IN"],
        spacing: ["APART"]
    },
    "5": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["EXTENDED"]],
        thumb: ["OUT", "UP"],
        rotation: ["PALM_IN", "PALM_OUT"],
        spacing: ["APART"]
    },
    "6": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["TUCKED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "7": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["CLAWED", "CURLED"], ["EXTENDED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "8": {
        fingers: [["EXTENDED"], ["CLAWED", "CURLED"], ["EXTENDED"], ["EXTENDED"]],
        thumb: ["OUT"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "9": {
        fingers: [["CLAWED", "CURLED"], ["EXTENDED"], ["EXTENDED"], ["EXTENDED"]],
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

    // Loop through your matrix using the per-finger check (.every)
    for (const [number, rules] of Object.entries(NUMBER_SIGN_MATRIX)) {
        const fingersMatch = liveFingers.every((fingerState, i) => rules.fingers[i].includes(fingerState));
        const thumbMatches = rules.thumb.includes(thumbS);
        const rotationMatches = rules.rotation.includes(rotationS);
        const spacingMatches = rules.spacing.includes(spacingS);

        if (fingersMatch && thumbMatches && rotationMatches && spacingMatches) {
            return number; // Successfully returns the correct number!
        }
    }

    return null; // No match found
};