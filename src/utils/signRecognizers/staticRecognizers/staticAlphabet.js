// alphabetRecognizer.js
import * as signPositions from './signPositions';
import * as specialPositions from './specialPositions'

/**
 * Legend:
 * Fingers:  "CURLED"=Slight Bend, "CLAWED"=Curved/Bent, "TUCKED"=Closed/Curled Fist, "EXTENDED"=straight
 * Thumb:    "UP"=Up (Over front), "OUT"=Out (To the side), "PALM_IN"=In (Tucked inside/across palm)
 * Rotation: "PALM_OUT"=Vertical (Palm facing out), "SIDEWAYS"=Horizontal (Hand turned on side), "PALM_IN"=Inward (Palm facing body)
 * Spacing:  "TOGETHER"=Together, "APART"=Apart
 */
export const ALPHABET_SIGN_MATRIX = {
    "A": {
        fingers: [["TUCKED"], ["TUCKED"], ["TUCKED"], ["TUCKED"]],
        thumb: ["UP"],
        thumbShape: ["STRAIGHT"],
        rotation: ["PALM_OUT", "PALM_IN"],
        spacing: [["TOGETHER"], ["TOGETHER"], ["TOGETHER"]]
    },
    // B: All fingers strictly extended straight up ("EXTENDED").
    "B": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["EXTENDED"]],
        thumb: ["IN", "UP"],
        thumbShape: ["STRAIGHT"],
        rotation: ["PALM_OUT"],
        spacing: [["TOGETHER"], ["TOGETHER"], ["TOGETHER"]]
    },
    // C: Fingers relaxed or curved ("CURLED" or "CLAWED"). Hand sideways.
    "C": {
        fingers: [["CURLED", "CLAWED"], ["CURLED", "CLAWED"], ["CURLED", "CLAWED"], ["CURLED", "CLAWED"]],
        thumb: ["OUT_FRONT", "UP"],
        thumbShape: ["STRAIGHT"],
        rotation: ["SIDEWAYS", "PALM_OUT"],
        spacing: ["TOGETHER", "APART"]
    },
    "D": {
        fingers: [["EXTENDED"], ["CLAWED"], ["CLAWED"], ["CLAWED", "CURLED"]],
        thumb: ["OUT_FRONT", "UP"], // Thumb touches curled middle fingertips
        thumbShape: ["BENT"],
        rotation: ["SIDEWAYS"],
        spacing: [["APART", "TOGETHER"], ["TOGETHER", "APART"], ["TOGETHER"], ["TOGETHER"]]
    },
    // E: Fingers MUST be clawed/scrunched up high ("CLAWED"). Thumb is up up-front ("UP").
    // --- PROBLEMS --- vv
    "E": {
        fingers: [["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]],
        thumb: ["IN", "UP"],
        thumbShape: ["STRAIGHT"],
        rotation: ["PALM_OUT", "PALM_IN"],
        spacing: ["TOGETHER"]
    },
    "F": {
        fingers: [["TUCKED", "CLAWED"], ["CURLED", "EXTENDED"], ["EXTENDED"], ["CURLED", "EXTENDED"]], // Index down holding thumb
        thumb: ["OUT_FRONT"],
        thumbShape: ["BENT"],
        rotation: ["SIDEWAYS"],
        spacing: ["APART"]
    },
    "G": {
        fingers: [["EXTENDED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]], // Index out horizontal
        thumb: ["IN"], // Thumb pointing out parallel to index
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "H": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]], // Index & Middle out horizontal
        thumb: ["OUT_FRONT", "PALM_IN"],
        thumbShape: ["STRAIGHT"],
        rotation: ["PALM_OUT"],
        spacing: ["TOGETHER", "APART"] // Index and Middle stacked together
    },
    "I": {
        fingers: [["TUCKED"], ["TUCKED"], ["TUCKED"], ["EXTENDED"]], // Strictly pinky up
        thumb: ["UP"],
        thumbShape: ["STRAIGHT"],
        rotation: ["PALM_OUT", "PALM_IN"],
        spacing: ["TOGETHER", "APART"]
    },
    "K": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED"], ["TUCKED"]], // Index up, middle out/forward
        thumb: ["UP", "OUT_FRONT"], // Thumb touches middle finger joint
        rotation: ["SIDEWAYS"],
        spacing: ["APART"]
    },
    "L": {
        fingers: [["EXTENDED"], ["TUCKED"], ["TUCKED"], ["TUCKED"]],
        thumb: ["OUT_SIDE"], // Strict: Thumb MUST point far out forming an 'L'
        rotation: ["PALM_OUT", "SIDEWAYS"],
        spacing: ["APART"]
    },
    // --- PROBLEM --- vv
    "M": {
        fingers: [["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]],
        thumb: ["PALM_IN"], // Thumb tucked deep inside over the pinky/ring region
        rotation: ["PALM_OUT"],
        spacing: ["TOGETHER", "APART"]
    },
    // --- PROBLEM --- vv
    "N": {
        fingers: [["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]],
        thumb: ["PALM_IN"], // Thumb tucked under index and middle
        rotation: ["PALM_OUT"],
        spacing: ["TOGETHER", "APART"]
    },
    "O": {
        fingers: [["CLAWED"], ["CLAWED"], ["CLAWED"], ["CLAWED", "CURLED"]],
        thumb: ["OUT_FRONT"], // Curved hand forming a closed loop shape
        rotation: ["SIDEWAYS"],
        spacing: ["TOGETHER"]
    },
    // --- PROBLEM (glitches as "K" or "P") --- vv
    "P": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED"], ["TUCKED", "CLAWED"]], // Downward pointed K shape
        thumb: ["OUT_FRONT"],
        rotation: ["SIDEWAYS"],
        spacing: ["APART"]
    },
    // // --- PROBLEM (glitches as "L" or "Q") --- vv
    "Q": {
        fingers: [["EXTENDED"], ["CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED"]], // Downward pointed G shape
        thumb: ["OUT_FRONT"],
        rotation: ["SIDEWAYS"],
        spacing: ["APART"]
    },
    "R": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]], // Fingers up and crossed
        thumb: ["PALM_IN", "UP"],
        rotation: ["PALM_OUT"],
        spacing: ["TOGETHER"] // Crossed counts as tightly together
    },
    // S: Strict flat punch fist. Fingers tight ("TUCKED"). Thumb locked over front ("PALM_IN").
    // --- PROBLEM (recognized as "R") --- vv
    "S": {
        fingers: [["TUCKED"], ["TUCKED", "CLAWED"], ["TUCKED"], ["TUCKED"]],
        thumb: ["UP"],
        rotation: ["PALM_IN"],
        spacing: ["TOGETHER"]
    },
    // --- PROBLEM --- vv
    "T": {
        fingers: [["TUCKED", "CLAWED"], ["TUCKED"], ["TUCKED"], ["TUCKED"]],
        thumb: ["OUT_FRONT"], // Thumb peeking out between index and middle
        rotation: ["PALM_OUT", "PALM_IN"],
        spacing: ["TOGETHER", "APART"]
    },
    "U": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]],
        thumb: ["IN", "UP"],
        rotation: ["PALM_OUT"],
        spacing: ["TOGETHER"] // Tightly guards against V!
    },
    "V": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]],
        thumb: ["IN", "UP"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"] // Tightly guards against U!
    },
    "W": {
        fingers: [["EXTENDED"], ["EXTENDED"], ["EXTENDED"], ["TUCKED", "CLAWED"]], // Three fingers extended straight up
        thumb: ["IN", "UP"],
        rotation: ["PALM_OUT"],
        spacing: ["APART"]
    },
    "X": {
        fingers: [["CURLED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"]], // Index hooked like a claw
        thumb: ["IN", "UP"],
        rotation: ["SIDEWAYS"],
        spacing: ["TOGETHER", "APART"]
    },
    "Y": {
        fingers: [["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["TUCKED", "CLAWED"], ["EXTENDED"]],
        thumb: ["OUT_SIDE"], // Strict: Thumb must span completely out sideways
        rotation: ["PALM_OUT"],
        spacing: ["TOGETHER"]
    }
};

export const detectStaticAlphabetSign = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return null;

    // ... (Keep your live state variable bindings exactly as they are here) ...
    const indexS = signPositions.getIndexState(landmarks);
    const middleS = signPositions.getMiddleState(landmarks);
    const ringS = signPositions.getRingState(landmarks);
    const pinkyS = signPositions.getPinkyState(landmarks);
    const thumbS = signPositions.getThumbState(landmarks);
    const rotationS = signPositions.getHandRotation(landmarks);
    const spacingS = signPositions.getFingerSpacing(landmarks);

    const liveFingers = [indexS, middleS, ringS, pinkyS];

    // Helper to see if all 4 fingers are down in fist state "TUCKED"
    const isFistState = liveFingers.every(fingerState => fingerState === "TUCKED");

    // LOG IN CONSOLE
    // console.log(`👉 FINGERS: [${liveFingers.join(", ")}] | Thumb: ${thumbS} | Rot: ${rotationS} | Space: ${spacingS}`);

    for (const [letter, rules] of Object.entries(ALPHABET_SIGN_MATRIX)) {
        const fingersMatch = liveFingers.every(
            (fingerState, i) => rules.fingers[i].includes(fingerState)
        );

        const thumbMatches = rules.thumb.includes(thumbS);
        const rotationMatches = rules.rotation.includes(rotationS);

        // Handle individual finger-pair spacing rules.
        const spacingRule = rules.spacing;
        let spacingMatches;

        if (
            Array.isArray(spacingRule) &&
            spacingRule.length === 3 &&
            spacingRule.every(Array.isArray)
        ) {
            const actualSpacing = [
                signPositions.isIndexAndMiddleTogether(landmarks)
                    ? "TOGETHER" : "APART",
                signPositions.isMiddleAndRingTogether(landmarks)
                    ? "TOGETHER" : "APART",
                signPositions.isRingAndPinkyTogether(landmarks)
                    ? "TOGETHER" : "APART",
            ];

            spacingMatches = actualSpacing.every(
                (actual, i) => spacingRule[i].includes(actual)
            );
        } else {
            spacingMatches = spacingRule.includes(spacingS);
        }

        if (
            fingersMatch &&
            thumbMatches &&
            rotationMatches &&
            spacingMatches
        ) {
            if (letter === "C" || letter === "OUT") {
                const isClosedCircle =
                    specialPositions.isHandClosedO(landmarks);

                return isClosedCircle ? "OUT" : "C";
            }

            if (
                isFistState &&
                ["A", "M", "N", "S", "UP"].includes(letter)
            ) {
                const thumbZone =
                    specialPositions.getFistThumbZone(landmarks);

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