// alphabetRecognizer.js
import * as signPositions from '../signRecognizers/signPositions';
import * as specialPositions from '../signRecognizers/specialPositions'

/**
 * Legend:
 * Fingers:  "2"=Straight, "1"=Curved/Bent, "0"=Closed/Curled Fist
 * Thumb:    "T"=Up (Over front), "O"=Out (To the side), "I"=In (Tucked inside/across palm)
 * Rotation: "VT"=Vertical (Palm facing out), "HZ"=Horizontal (Hand turned on side), "IN"=Inward (Palm facing body)
 * Spacing:  "T"=Together, "A"=Apart
 */
const ALPHABET_SIGN_MATRIX = {
    "A": {
        fingers: [["0"], ["0"], ["0"], ["0"]], // Strict: no "1" (clawed) allowed here!
        thumb:   ["O", "T"],
        rotation: ["IN", "VT"],
        spacing:  ["T"]
    },
    // B: All fingers strictly extended straight up ("3").
    "B": {
        fingers: [["3"], ["3"], ["3"], ["3"]],
        thumb:   ["T", "I"],
        rotation: ["VT"],
        spacing:  ["T"]
    },
    // C: Fingers relaxed or curved ("2" or "1"). Hand sideways.
    "C": {
        fingers: [["2", "1"], ["2", "1"], ["2", "1"], ["2", "1"]],
        thumb:   ["O", "T"],
        rotation: ["HZ", "VT"],
        spacing:  ["T", "A"]
    },
    "D": {
        fingers: [["3"], ["1"], ["1"], ["1", "2"]],
        thumb:   ["T", "O"], // Thumb touches curled middle fingertips
        rotation: ["HZ"],
        spacing:  ["A"]
    },
    // E: Fingers MUST be clawed/scrunched up high ("1"). Thumb is up up-front ("T").
    // --- PROBLEMS --- vv
    "E": {
        fingers: [["0", "1"], ["0", "1"], ["0", "1"], ["0", "1"]],
        thumb:   ["T", "I"], 
        rotation: ["VT", "IN"],
        spacing:  ["T"]
    },
    "F": {
        fingers: [["0","1"], ["2", "3"], ["3"], ["2", "3"]], // Index down holding thumb
        thumb:   ["O"],
        rotation: ["HZ"],
        spacing:  ["A"]
    },
    "G": {
        fingers: [["3"], ["0", "1"], ["0", "1"], ["0","1"]], // Index out horizontal
        thumb:   ["I"], // Thumb pointing out parallel to index
        rotation: ["VT"],
        spacing:  ["A"]
    },
    "H": {
        fingers: [["3"], ["3"], ["0","1"], ["0","1"]], // Index & Middle out horizontal
        thumb:   ["O", "I"],
        rotation: ["VT"],
        spacing:  ["T", "A"] // Index and Middle stacked together
    },
    "I": {
        fingers: [["0"], ["0"], ["0"], ["3"]], // Strictly pinky up
        thumb:   ["T"],
        rotation: ["VT", "IN"],
        spacing:  ["T", "A"]
    },
    "K": {
        fingers: [["3"], ["3"], ["0"], ["0"]], // Index up, middle out/forward
        thumb:   ["T", "O"], // Thumb touches middle finger joint
        rotation: ["HZ"],
        spacing:  ["A"]
    },
    "L": {
        fingers: [["3"], ["0"], ["0"], ["0"]],
        thumb:   ["O"], // Strict: Thumb MUST point far out forming an 'L'
        rotation: ["VT", "HZ"],
        spacing:  ["A"]
    },
    // --- PROBLEM --- vv
    "M": {
        fingers: [["0","1"], ["0","1"], ["0","1"], ["0","1"]],
        thumb:   ["I"], // Thumb tucked deep inside over the pinky/ring region
        rotation: ["VT"],
        spacing:  ["T", "A"]
    },
    // --- PROBLEM --- vv
    "N": {
        fingers: [["0","1"], ["0","1"], ["0","1"], ["0","1"]],
        thumb:   ["I"], // Thumb tucked under index and middle
        rotation: ["VT"],
        spacing:  ["T", "A"]
    },
    "O": {
        fingers: [["1"], ["1"], ["1"], ["1", "2"]],
        thumb:   ["O"], // Curved hand forming a closed loop shape
        rotation: ["HZ"],
        spacing:  ["T"]
    },
    // --- PROBLEM (glitches as "K" or "P") --- vv
    "P": {
        fingers: [["3"], ["3"], ["0"], ["0","1"]], // Downward pointed K shape
        thumb:   ["O"],
        rotation: ["HZ"],
        spacing:  ["A"]
    },
    // // --- PROBLEM (glitches as "L" or "Q") --- vv
    "Q": {
        fingers: [["3"], ["1"], ["0","1"], ["0"]], // Downward pointed G shape
        thumb:   ["O"],
        rotation: ["HZ"],
        spacing:  ["A"]
    },
    "R": {
        fingers: [["3"], ["3"], ["0","1"], ["0","1"]], // Fingers up and crossed
        thumb:   ["I", "T"],
        rotation: ["VT"],
        spacing:  ["T"] // Crossed counts as tightly together
    },
    // S: Strict flat punch fist. Fingers tight ("0"). Thumb locked over front ("I").
    // --- PROBLEM (recognized as "R") --- vv
    "S": {
        fingers: [["0"], ["0", "1"], ["0"], ["0"]],
        thumb:   ["T"],
        rotation: ["IN"],
        spacing:  ["T"]
    },
    // --- PROBLEM --- vv
    "T": {
        fingers: [["0","1"], ["0"], ["0"], ["0"]],
        thumb:   ["O"], // Thumb peeking out between index and middle
        rotation: ["VT", "IN"],
        spacing:  ["T", "A"]
    },
    "U": {
        fingers: [["3"], ["3"], ["0","1"], ["0","1"]],
        thumb:   ["I", "T"],
        rotation: ["VT"],
        spacing:  ["T"] // Tightly guards against V!
    },
    "V": {
        fingers: [["3"], ["3"], ["0","1"], ["0","1"]],
        thumb:   ["I", "T"],
        rotation: ["VT"],
        spacing:  ["A"] // Tightly guards against U!
    },
    "W": {
        fingers: [["3"], ["3"], ["3"], ["0","1"]], // Three fingers extended straight up
        thumb:   ["I", "T"],
        rotation: ["VT"],
        spacing:  ["A"]
    },
    "X": {
        fingers: [["2"], ["0","1"], ["0","1"], ["0","1"]], // Index hooked like a claw
        thumb:   ["I", "T"],
        rotation: ["HZ"],
        spacing:  ["T", "A"]
    },
    "Y": {
        fingers: [["0","1"], ["0","1"], ["0","1"], ["3"]],
        thumb:   ["O"], // Strict: Thumb must span completely out sideways
        rotation: ["VT"],
        spacing:  ["T"]
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

    // Helper to see if all 4 fingers are down in fist state "0"
    const isFistState = liveFingers.every(fingerState => fingerState === "0");

    // LOG IN CONSOLE
    // console.log(`👉 FINGERS: [${liveFingers.join(", ")}] | Thumb: ${thumbS} | Rot: ${rotationS} | Space: ${spacingS}`);

    for (const [letter, rules] of Object.entries(ALPHABET_SIGN_MATRIX)) {
        const fingersMatch   = liveFingers.every((fingerState, i) => rules.fingers[i].includes(fingerState));
        const thumbMatches   = rules.thumb.includes(thumbS);
        const rotationMatches = rules.rotation.includes(rotationS);
        const spacingMatches  = rules.spacing.includes(spacingS);

        if (fingersMatch && thumbMatches && rotationMatches && spacingMatches) {
            
            // O VS C
            if (letter === "C" || letter === "O") {
                const isClosedCircle = specialPositions.isHandClosedO(landmarks); // (Fixed naming here to stay matched to your file)
                return isClosedCircle ? "O" : "C"; // Touching means O, wide gap means C!
            }
            
            // 🎯 THE A, M, N, S, T FIST GROUP TIE-BREAKER
            // If the matrix catches a generic fist block, intercept and delegate by knuckle zones
            if (isFistState && ["A", "M", "N", "S", "T"].includes(letter)) {
                const thumbZone = specialPositions.getFistThumbZone(landmarks);
                
                if (thumbZone === "EDGE") return "A";
                if (thumbZone === "INDEX_SLOT") return "T";
                if (thumbZone === "MIDDLE_SLOT") return "M";
                if (thumbZone === "RING_SLOT") return "N";
                if (thumbZone === "FRONT") return "S";
            }
            
            return letter;
        }
    }

    return null;
};
