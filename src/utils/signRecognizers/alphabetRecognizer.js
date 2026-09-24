// alphabetRecognizer.js
import * as signPositions from '../signRecognizers/signPositions';
import * as specialPositions from '../signRecognizers/specialPositions'

/**
 * Legend:
 * Fingers:  "CURLED"=Straight, "CLAWED"=Curved/Bent, "TUCKED"=Closed/Curled Fist
 * Thumb:    "UP"=Up (Over front), "OUT"=Out (To the side), "PALM_IN"=In (Tucked inside/across palm)
 * Rotation: "PALM_OUT"=Vertical (Palm facing out), "SIDEWAYS"=Horizontal (Hand turned on side), "PALM_IN"=Inward (Palm facing body)
 * Spacing:  "UP"=Together, "A"=Apart
 */
const ALPHABET_SIGN_MATRIX = {
    "A": {
        fingers: [["TUCKED"], ["TUCKED"], ["TUCKED"], ["TUCKED"]], // Strict: no "CLAWED" (clawed) allowed here!
        thumb:   ["OUT", "UP"],
        rotation: ["PALM_IN", "PALM_OUT"],
        spacing:  ["TOGETHER"]
    },
    // B: All fingers strictly extended straight up ("EXTENDED").
    "B": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["EXTENDED"]],
        thumb:   ["UP", "PALM_IN"],
        rotation: ["PALM_OUT"],
        spacing:  ["TOGETHER"]
    },
    // C: Fingers relaxed or curved ("CURLED" or "CLAWED"). Hand sideways.
    "C": {
        fingers: [["CURLED", "CLAWED"], ["CURLED", "CLAWED"], ["CURLED", "CLAWED"], ["CURLED", "CLAWED"]],
        thumb:   ["OUT", "UP"],
        rotation: ["SIDEWAYS", "PALM_OUT"],
        spacing:  ["TOGETHER", "APART"]
    },
    "D": {
        fingers: [["EXTENDED"], ["CLAWED"], ["CLAWED"], ["CLAWED", "CURLED"]],
        thumb:   ["UP", "OUT"], // Thumb touches curled middle fingertips
        rotation: ["SIDEWAYS"],
        spacing:  ["APART"]
    },
    // E: Fingers MUST be clawed/scrunched up high ("CLAWED"). Thumb is up up-front ("UP").
    // --- PROBLEMS --- vv
    "E": {
        fingers: [["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]],
        thumb:   ["UP", "PALM_IN"], 
        rotation: ["PALM_OUT", "PALM_IN"],
        spacing:  ["TOGETHER"]
    },
    "F": {
        fingers: [["TUCKED","CLAWED"], ["CURLED", "EXTENDED"], ["EXTENDED"], ["CURLED", "EXTENDED"]], // Index down holding thumb
        thumb:   ["OUT"],
        rotation: ["SIDEWAYS"],
        spacing:  ["APART"]
    },
    "G": {
        fingers: [["EXTENDED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED","CLAWED"]], // Index out horizontal
        thumb:   ["PALM_IN"], // Thumb pointing out parallel to index
        rotation: ["PALM_OUT"],
        spacing:  ["APART"]
    },
    "H": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"]], // Index & Middle out horizontal
        thumb:   ["OUT", "PALM_IN"],
        rotation: ["PALM_OUT"],
        spacing:  ["TOGETHER", "APART"] // Index and Middle stacked together
    },
    "PALM_IN": {
        fingers: [["TUCKED"], ["TUCKED"], ["TUCKED"], ["EXTENDED"]], // Strictly pinky up
        thumb:   ["UP"],
        rotation: ["PALM_OUT", "PALM_IN"],
        spacing:  ["TOGETHER", "APART"]
    },
    "K": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED"], ["TUCKED"]], // Index up, middle out/forward
        thumb:   ["UP", "OUT"], // Thumb touches middle finger joint
        rotation: ["SIDEWAYS"],
        spacing:  ["APART"]
    },
    "L": {
        fingers: [["EXTENDED"], ["TUCKED"], ["TUCKED"], ["TUCKED"]],
        thumb:   ["OUT"], // Strict: Thumb MUST point far out forming an 'L'
        rotation: ["PALM_OUT", "SIDEWAYS"],
        spacing:  ["APART"]
    },
    // --- PROBLEM --- vv
    "M": {
        fingers: [["TUCKED","CLAWED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"]],
        thumb:   ["PALM_IN"], // Thumb tucked deep inside over the pinky/ring region
        rotation: ["PALM_OUT"],
        spacing:  ["TOGETHER", "APART"]
    },
    // --- PROBLEM --- vv
    "N": {
        fingers: [["TUCKED","CLAWED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"]],
        thumb:   ["PALM_IN"], // Thumb tucked under index and middle
        rotation: ["PALM_OUT"],
        spacing:  ["TOGETHER", "APART"]
    },
    "OUT": {
        fingers: [["CLAWED"], ["CLAWED"], ["CLAWED"], ["CLAWED", "CURLED"]],
        thumb:   ["OUT"], // Curved hand forming a closed loop shape
        rotation: ["SIDEWAYS"],
        spacing:  ["TOGETHER"]
    },
    // --- PROBLEM (glitches as "K" or "P") --- vv
    "P": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED"], ["TUCKED","CLAWED"]], // Downward pointed K shape
        thumb:   ["OUT"],
        rotation: ["SIDEWAYS"],
        spacing:  ["APART"]
    },
    // // --- PROBLEM (glitches as "L" or "Q") --- vv
    "Q": {
        fingers: [["EXTENDED"], ["CLAWED"], ["TUCKED","CLAWED"], ["TUCKED"]], // Downward pointed G shape
        thumb:   ["OUT"],
        rotation: ["SIDEWAYS"],
        spacing:  ["APART"]
    },
    "R": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"]], // Fingers up and crossed
        thumb:   ["PALM_IN", "UP"],
        rotation: ["PALM_OUT"],
        spacing:  ["TOGETHER"] // Crossed counts as tightly together
    },
    // S: Strict flat punch fist. Fingers tight ("TUCKED"). Thumb locked over front ("PALM_IN").
    // --- PROBLEM (recognized as "R") --- vv
    "S": {
        fingers: [["TUCKED"], ["TUCKED", "CLAWED"], ["TUCKED"], ["TUCKED"]],
        thumb:   ["UP"],
        rotation: ["PALM_IN"],
        spacing:  ["TOGETHER"]
    },
    // --- PROBLEM --- vv
    "UP": {
        fingers: [["TUCKED","CLAWED"], ["TUCKED"], ["TUCKED"], ["TUCKED"]],
        thumb:   ["OUT"], // Thumb peeking out between index and middle
        rotation: ["PALM_OUT", "PALM_IN"],
        spacing:  ["TOGETHER", "APART"]
    },
    "U": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"]],
        thumb:   ["PALM_IN", "UP"],
        rotation: ["PALM_OUT"],
        spacing:  ["TOGETHER"] // Tightly guards against V!
    },
    "V": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"]],
        thumb:   ["PALM_IN", "UP"],
        rotation: ["PALM_OUT"],
        spacing:  ["APART"] // Tightly guards against U!
    },
    "W": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["TUCKED","CLAWED"]], // Three fingers extended straight up
        thumb:   ["PALM_IN", "UP"],
        rotation: ["PALM_OUT"],
        spacing:  ["APART"]
    },
    "X": {
        fingers: [["CURLED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"]], // Index hooked like a claw
        thumb:   ["PALM_IN", "UP"],
        rotation: ["SIDEWAYS"],
        spacing:  ["TOGETHER", "APART"]
    },
    "Y": {
        fingers: [["TUCKED","CLAWED"], ["TUCKED","CLAWED"], ["TUCKED","CLAWED"], ["EXTENDED"]],
        thumb:   ["OUT"], // Strict: Thumb must span completely out sideways
        rotation: ["PALM_OUT"],
        spacing:  ["TOGETHER"]
    }
};

export const detectAlphabetSign = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return null;

    // ... (Keep your live state variable bindings exactly as they are here) ...
    const indexS  = signPositions.getIndexState(landmarks);
    const middleS = signPositions.getMiddleState(landmarks);
    const ringS   = signPositions.getRingState(landmarks);
    const pinkyS  = signPositions.getPinkyState(landmarks);
    const thumbS  = signPositions.getThumbState(landmarks);
    const rotationS = signPositions.getHandRotation(landmarks);
    const spacingS  = signPositions.getFingerSpacing(landmarks);

    const liveFingers = [indexS, middleS, ringS, pinkyS];

    // Helper to see if all 4 fingers are down in fist state "TUCKED"
    const isFistState = liveFingers.every(fingerState => fingerState === "TUCKED");

    // LOG IN CONSOLE
    // console.log(`👉 FINGERS: [${liveFingers.join(", ")}] | Thumb: ${thumbS} | Rot: ${rotationS} | Space: ${spacingS}`);

    for (const [letter, rules] of Object.entries(ALPHABET_SIGN_MATRIX)) {
        const fingersMatch   = liveFingers.every((fingerState, i) => rules.fingers[i].includes(fingerState));
        const thumbMatches   = rules.thumb.includes(thumbS);
        const rotationMatches = rules.rotation.includes(rotationS);
        const spacingMatches  = rules.spacing.includes(spacingS);

        if (fingersMatch && thumbMatches && rotationMatches && spacingMatches) {
            
            // O VS C
            if (letter === "C" || letter === "OUT") {
                const isClosedCircle = specialPositions.isHandClosedO(landmarks); // (Fixed naming here to stay matched to your file)
                return isClosedCircle ? "OUT" : "C"; // Touching means O, wide gap means C!
            }
            
            // 🎯 THE A, M, N, S, T FIST GROUP TIE-BREAKER
            // If the matrix catches a generic fist block, intercept and delegate by knuckle zones
            if (isFistState && ["A", "M", "N", "S", "UP"].includes(letter)) {
                const thumbZone = specialPositions.getFistThumbZone(landmarks);
                
                if (thumbZone === "EDGE") return "A";
                if (thumbZone === "INDEX_SLOT") return "UP";
                if (thumbZone === "MIDDLE_SLOT") return "M";
                if (thumbZone === "RING_SLOT") return "N";
                if (thumbZone === "FRONT") return "S";
            }
            
            return letter;
        }
    }

    return null;
};
