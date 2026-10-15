// signPositions.js

const indexMCP = 5;   const indexPIP = 6;   const indexTIP = 8;
const middleMCP = 9;  const middlePIP = 10;  const middleTIP = 12;
const ringMCP = 13;   const ringPIP = 14;   const ringTIP = 16;
const pinkyMCP = 17;  const pinkyPIP = 18;  const pinkyTIP = 20;
const thumbMCP = 2;   const thumbTIP = 4;

export const getDistance = (p1, p2) => {
    if (!p1 || !p2) return 0;
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};

/**
 * Returns a continuous value from 0.0 (fully straight/extended) to 1.0 (fully tucked/curled).
 */
export const getFingerCurlFactor = (landmarks, tipIdx, pipIdx, mcpIdx) => {
    if (!landmarks || landmarks.length === 0) return 1.0;

    const mcpToPip = getDistance(landmarks[mcpIdx], landmarks[pipIdx]);
    const pipToTip = getDistance(landmarks[pipIdx], landmarks[tipIdx]);
    const idealStraightDistance = mcpToPip + pipToTip;
    const actualTipToMcp = getDistance(landmarks[tipIdx], landmarks[mcpIdx]);
    
    const straightnessRatio = actualTipToMcp / idealStraightDistance;
    
    // Clamp between 0.0 and 1.0
    const curlFactor = Math.max(0, Math.min(1, 1 - straightnessRatio));
    return curlFactor;
};

// Expose individual finger curl factors (0.0 = straight, 1.0 = curled)
export const getIndexCurl  = (landmarks) => getFingerCurlFactor(landmarks, indexTIP, indexPIP, indexMCP);
export const getMiddleCurl = (landmarks) => getFingerCurlFactor(landmarks, middleTIP, middlePIP, middleMCP);
export const getRingCurl   = (landmarks) => getFingerCurlFactor(landmarks, ringTIP, ringPIP, ringMCP);
export const getPinkyCurl  = (landmarks) => getFingerCurlFactor(landmarks, pinkyTIP, pinkyPIP, pinkyMCP);

// RESTORED FINGER STATE HELPERS (REQUIRED FOR RECOGNIZER)

export const getFingerStateFromCurl = (curl) => {
    if (curl < 0.3) return "EXTENDED";
    if (curl < 0.55) return "CURLED";
    return "TUCKED";
};

export const getIndexState  = (landmarks) => getFingerStateFromCurl(getIndexCurl(landmarks));
export const getMiddleState = (landmarks) => getFingerStateFromCurl(getMiddleCurl(landmarks));
export const getRingState   = (landmarks) => getFingerStateFromCurl(getRingCurl(landmarks));
export const getPinkyState  = (landmarks) => getFingerStateFromCurl(getPinkyCurl(landmarks));

// ORIGINAL SPATIAL & ROTATION HELPERS

export const getThumbState = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return "IN";
    const thumbTip = landmarks[thumbTIP];
    const pinkyKnuckle = landmarks[pinkyMCP];
    const indexKnuckle = landmarks[indexMCP];
    
    const thumbDistance = getDistance(thumbTip, pinkyKnuckle);
    const palmWidth = getDistance(indexKnuckle, pinkyKnuckle);
    const thumbRatio = thumbDistance / palmWidth;

    if (thumbRatio > 1.15) return "OUT"; 
    if (landmarks[thumbTIP].y < landmarks[thumbMCP].y - 0.02) return "UP"; 
    
    return "IN"; 
};

export const getHandRotation = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return "UNKNOWN";

    const indexMCPCoord = landmarks[5];
    const pinkyMCPCoord = landmarks[17];

    const handWidthX = Math.abs(indexMCPCoord.x - pinkyMCPCoord.x);
    const handDepthZ = Math.abs(indexMCPCoord.z - pinkyMCPCoord.z);
    
    if (handDepthZ > handWidthX * 0.9) {
        return "SIDEWAYS";
    }

    const diffX = indexMCPCoord.x - pinkyMCPCoord.x;
    const THRESHOLD = 0.02;

    if (diffX < -THRESHOLD) {
        return "PALM_IN";  
    } else if (diffX > THRESHOLD) {
        return "PALM_OUT"; 
    }

    return "SIDEWAYS";
};

export const isIndexAndMiddleTogether = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    const palmWidth = getDistance(landmarks[indexMCP], landmarks[pinkyMCP]);
    return getDistance(landmarks[indexTIP], landmarks[middleTIP]) < palmWidth * 0.35;
};

export const isMiddleAndRingTogether = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    const palmWidth = getDistance(landmarks[indexMCP], landmarks[pinkyMCP]);
    return getDistance(landmarks[middleTIP], landmarks[ringTIP]) < palmWidth * 0.35;
};

export const isRingAndPinkyTogether = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    const palmWidth = getDistance(landmarks[indexMCP], landmarks[pinkyMCP]);
    return getDistance(landmarks[ringTIP], landmarks[pinkyTIP]) < palmWidth * 0.35;
};

// Aggregate check for all 4 fingers being held together
export const areAllFingersTogether = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    return isIndexAndMiddleTogether(landmarks) && 
           isMiddleAndRingTogether(landmarks) && 
           isRingAndPinkyTogether(landmarks);
};

export const getHandOrientationY = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return "PARALLEL";
    
    const indexKnuckle = landmarks[indexMCP];
    const pinkyKnuckle = landmarks[pinkyMCP];
    const diffY = indexKnuckle.y - pinkyKnuckle.y; 

    if (diffY < -0.04) return "INDEX_ABOVE";
    if (diffY > 0.04) return "INDEX_BELOW";
    
    return "PARALLEL";
};

// DESCRIPTIVE POSITIONAL & CONTACT HELPERS

const TOUCH_THRESHOLD = 0.045; // Proximity limit for touch detection

export const thumbTouchingIndex = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    return getDistance(landmarks[thumbTIP], landmarks[indexTIP]) < TOUCH_THRESHOLD || 
           getDistance(landmarks[thumbTIP], landmarks[indexPIP]) < TOUCH_THRESHOLD;
};

export const thumbTouchingMiddle = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    return getDistance(landmarks[thumbTIP], landmarks[middleTIP]) < TOUCH_THRESHOLD;
};

export const thumbTouchingRing = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    return getDistance(landmarks[thumbTIP], landmarks[ringTIP]) < TOUCH_THRESHOLD;
};

export const thumbTouchingPinky = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    return getDistance(landmarks[thumbTIP], landmarks[pinkyTIP]) < TOUCH_THRESHOLD;
};

export const thumbTuckedInFront = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    const palmCenter = landmarks[middleMCP];
    return getDistance(landmarks[thumbTIP], palmCenter) < 0.09 && landmarks[thumbTIP].z < palmCenter.z;
};

export const thumbTuckedUnder = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    return landmarks[thumbTIP].y > landmarks[indexPIP].y;
};

export const isThumbBetweenIndexAndMiddle = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    const thumbX = landmarks[thumbTIP].x;
    return thumbX > Math.min(landmarks[indexMCP].x, landmarks[middleMCP].x) && 
           thumbX < Math.max(landmarks[indexMCP].x, landmarks[middleMCP].x);
};

export const isThumbBetweenMiddleAndRing = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    const thumbX = landmarks[thumbTIP].x;
    return thumbX > Math.min(landmarks[middleMCP].x, landmarks[ringMCP].x) && 
           thumbX < Math.max(landmarks[middleMCP].x, landmarks[ringMCP].x);
};

export const isThumbBetweenRingAndPinky = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    const thumbX = landmarks[thumbTIP].x;
    return thumbX > Math.min(landmarks[ringMCP].x, landmarks[pinkyMCP].x) && 
           thumbX < Math.max(landmarks[ringMCP].x, landmarks[pinkyMCP].x);
};