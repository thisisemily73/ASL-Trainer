// signPositions.js

const indexMCP = 5;   const indexPIP = 6;   const indexTIP = 8;
const middleMCP = 9;  const middlePIP = 10;  const middleTIP = 12;
const ringMCP = 13;   const ringPIP = 14;   const ringTIP = 16;
const pinkyMCP = 17;  const pinkyPIP = 18;  const pinkyTIP = 20;
const thumbMCP = 2;   const thumbTIP = 4;

let lastStableRotation = "VT";

const getDistance = (p1, p2) => {
    if (!p1 || !p2) return 0;
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};

// Replace ONLY the getFingerState function inside your signPositions.js file:

export const getFingerState = (landmarks, tipIdx, pipIdx, mcpIdx) => {
    if (!landmarks || landmarks.length === 0) return "0";

    const wrist = landmarks[0];
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    
    const wristToTip = getDistance(wrist, landmarks[tipIdx]);
    const wristToMcp = getDistance(wrist, landmarks[mcpIdx]);
    const extensionDiff = wristToTip - wristToMcp;

    // Measure internal knuckle straightness alignment
    const mcpToPip = getDistance(landmarks[mcpIdx], landmarks[pipIdx]);
    const pipToTip = getDistance(landmarks[pipIdx], landmarks[tipIdx]);
    const idealStraightDistance = mcpToPip + pipToTip;
    const actualTipToMcp = getDistance(landmarks[tipIdx], landmarks[mcpIdx]);
    const straightnessRatio = actualTipToMcp / idealStraightDistance;

    // 0. DEEP TUCKED FIST (0)
    if (extensionDiff < -palmWidth * 0.15) {
        return "0"; // Flat tight fist closure
    }

    // ------------------------------------------------------------------
    // 🎛️ NEW CALIBRATED NUMERIC CUTOFF BOUNDARIES:
    // ------------------------------------------------------------------
    
    // STRICTLY STRAIGHT (3): Perfectly extended (Like B, D, L, W, Y)
    if (straightnessRatio > 0.95) return "3"; 

    // HALF-STRAIGHT / GENTLE BEND (2): Relaxed slope
    if (straightnessRatio > 0.83) return "2"; 

    // CLAWED / SCRUNCHED / HOOKED (1): Fingertips hover curled high over knuckles (Like E, X)
    if (straightnessRatio > 0.4) return "1"; 

    // LOCKED CLOSED FIST (0): Default fallback for any tight finger balling
    return "0"; 
};

export const getIndexState  = (landmarks) => getFingerState(landmarks, indexTIP, indexPIP, indexMCP);
export const getMiddleState = (landmarks) => getFingerState(landmarks, middleTIP, middlePIP, middleMCP);
export const getRingState   = (landmarks) => getFingerState(landmarks, ringTIP, ringPIP, ringMCP);
export const getPinkyState  = (landmarks) => getFingerState(landmarks, pinkyTIP, pinkyPIP, pinkyMCP);

export const getThumbState = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return "I";
    const thumbTip = landmarks[thumbTIP];
    const pinkyKnuckle = landmarks[pinkyMCP];
    const indexKnuckle = landmarks[indexMCP];
    
    const thumbDistance = getDistance(thumbTip, pinkyKnuckle);
    const palmWidth = getDistance(indexKnuckle, pinkyKnuckle);
    const thumbRatio = thumbDistance / palmWidth;

    // ------------------------------------------------------------------
    // 🎛️ ADJUST YOUR THUMB CUTOFFS HERE:
    // ------------------------------------------------------------------
    
    // CUTOFF FOR THUMB OUT (O):
    // Lower this (e.g., to 1.10) if you have to stretch your thumb too far out to register.
    if (thumbRatio > 1.15) return "O"; 
    
    // CUTOFF FOR THUMB UP (T):
    // Adjust the pixel offset value if your thumb tip has trouble counting as pointing upward.
    if (landmarks[thumbTIP].y < landmarks[thumbMCP].y - 0.02) return "T"; 
    
    // DEFAULT TO THUMB IN (I)
    return "I"; 
};

export const getHandRotation = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return lastStableRotation;
    const indexKnuckle = landmarks[indexMCP];
    const pinkyKnuckle = landmarks[pinkyMCP];
    const wrist = landmarks[0];

    const zDepthDifference = indexKnuckle.z - pinkyKnuckle.z;
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    const absoluteZ = Math.abs(zDepthDifference);

    // ------------------------------------------------------------------
    // 🎛️ ADJUST YOUR PALM TILT CUTOFFS HERE:
    // ------------------------------------------------------------------
    
    // CUTOFF FOR SIDEWAYS PROFILE (HZ):
    // Lower these multipliers if you have to turn your wrist too aggressively to register a sideways hand.
    const sidewaysThreshold = lastStableRotation === "HZ" ? palmWidth * 0.28 : palmWidth * 0.38;

    let detectedRotation = "VT";
    if (absoluteZ > sidewaysThreshold) {
        detectedRotation = "HZ";
    } else if (indexKnuckle.z > wrist.z + (palmWidth * 0.05)) {
        detectedRotation = "IN"; // Inward facing
    }

    lastStableRotation = detectedRotation;
    return detectedRotation;
};

export const getFingerSpacing = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return "T";
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    const indexToMiddleDist = getDistance(landmarks[indexTIP], landmarks[middleTIP]);
        
    // CUTOFF FOR APART (A):
    if (indexToMiddleDist > palmWidth * 0.47) return "A"; 
    
    return "T"; // Together (U)
};

export const isHandClosedO = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    
    // Squeezed loop threshold: if distance is less than 35% of palm width, they are touching!
    return getDistance(indexTip, thumbTip) < (palmWidth * 0.35);
};