import { getDistance } from './signPositions'

// SPECIAL INSTANCES FOR ALPHABET

export const isHandClosedO = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;
    
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    
    // Squeezed loop threshold: if distance is less than 35% of palm width, they are touching!
    return getDistance(indexTip, thumbTip) < (palmWidth * 0.35);
};

// Add this to the bottom of signPositions.js

/**
 * FIST THUMB ZONE LOCATOR
 * Determines exactly which finger knuckle the thumb tip is hovering near.
 * Returns: "EDGE" (A), "FRONT" (S), "INDEX_SLOT" (T), "MIDDLE_SLOT" (M), "RING_SLOT" (N)
 */
export const getFistThumbZone = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return "EDGE";
    const mult = 0.42;

    const thumbTip = landmarks[4];
    const indexMCP = landmarks[5];   // Index Knuckle Base (For A)
    const pinkyMCP = landmarks[17]; // Pinky Knuckle Base (for palm width)
    const indexPIP = landmarks[6];   // Index Middle Joint (For T)
    const middlePIP = landmarks[10]; // Middle Finger Joint (For N)
    const ringPIP = landmarks[14];   // Ring Finger Joint (For M)

    // Calculate 3D Euclidean distances
    const distToEdge = getDistance(thumbTip, indexMCP);
    const distToIndex = getDistance(thumbTip, indexPIP);
    const distToMiddle = getDistance(thumbTip, middlePIP);
    const distToRing = getDistance(thumbTip, ringPIP);

    // Dynamic scale limit based on the size of the user's palm width
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    const thumbToPinkyDist = getDistance(thumbTip, pinkyMCP);
    const thumbExtensionRatio = thumbToPinkyDist / palmWidth;

    // A
    if (thumbExtensionRatio > 1.05) {
        return "EDGE";
    }

    // 🇹 GATEWAY FOR "T": Pressed tightly up against the inner index finger slot
    if (distToIndex < distToMiddle && distToIndex < distToRing && distToIndex < palmWidth * mult) {
        return "INDEX_SLOT";
    }

    // 🇳 GATEWAY FOR "N": Tucked right underneath the middle finger joint
    if (distToMiddle < distToRing && distToMiddle < distToIndex && distToMiddle < palmWidth * mult) {
        return "RING_SLOT";
    }

    // Ⓜ️ GATEWAY FOR "M": Tucked deep underneath the ring finger joint
    if (distToRing < distToMiddle && distToRing < distToIndex && distToRing < palmWidth * mult) {
        return "MIDDLE_SLOT";
    }

    // 🆂 GATEWAY FOR "S": Default fallback. If it is scrunched tight 
    // across the center front mass of your hand knuckles.
    // DONT LET IT SHOW WHEN IT'S TUCKED UNDER OTHER FINGERS
    return "FRONT";
};