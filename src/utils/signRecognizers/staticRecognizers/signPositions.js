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

    const indexMCP = landmarks[5];
    const pinkyMCP = landmarks[17];

    const handWidthX = Math.abs(indexMCP.x - pinkyMCP.x);
    const handDepthZ = Math.abs(indexMCP.z - pinkyMCP.z);
    
    if (handDepthZ > handWidthX * 0.9) {
        return "SIDEWAYS";
    }

    const diffX = indexMCP.x - pinkyMCP.x;
    const THRESHOLD = 0.02;

    if (diffX < -THRESHOLD) {
        return "PALM_IN";  
    } else if (diffX > THRESHOLD) {
        return "PALM_OUT"; 
    }

    return "SIDEWAYS";
};

export const getFingerSpacing = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return "TOGETHER";
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    const indexToMiddleDist = getDistance(landmarks[indexTIP], landmarks[middleTIP]);
        
    if (indexToMiddleDist > palmWidth * 0.47) return "APART"; 
    
    return "TOGETHER"; 
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