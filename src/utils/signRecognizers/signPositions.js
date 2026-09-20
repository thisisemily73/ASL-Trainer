// HAND LANDMARKS
// 0: Wrist
// 1: Thumb CMC
// 2: Thumb MCP
// 3: Thumb IP
// 4: Thumb TIP
// 5: Index finger MCP
// 6: Index finger PIP
// 7: Index finger DIP
// 8: Index finger TIP
// 9: Middle finger MCP
// 10: Middle finger PIP
// 11: Middle finger DIP
// 12: Middle finger TIP
// 13: Ring finger MCP
// 14: Ring finger PIP
// 15: Ring finger DIP
// 16: Ring finger TIP
// 17: Pinky MCP
// 18: Pinky PIP
// 19: Pinky DIP
// 20: Pinky TIP

// CMC AND MCP: connects to palm
// PIP: connects to previous joint (CMC/MCP)
// DIP: connects to previous joint (PIP)
// TIP: tip of finger (farthest from palm)


// MCP: Metacarpophalangeal joint (base of finger)
const indexMCP = 5;
const middleMCP = 9;
const ringMCP = 13;
const pinkyMCP = 17;

// PIP: Proximal interphalangeal joint (middle joint of finger)
const indexPIP = 6;
const middlePIP = 10;
const ringPIP = 14;
const pinkyPIP = 18;

// DIP: Distal interphalangeal joint (joint closest to fingertip)
const indexDIP = 7;
const middleDIP = 11;
const ringDIP = 15;
const pinkyDIP = 19;

// TIP: Fingertip
const indexTIP = 8;
const middleTIP = 12;
const ringTIP = 16;
const pinkyTIP = 20;

// THUMB JOINTS
const thumbCMC = 1; // Carpometacarpal joint (base of thumb)
const thumbMCP = 2; // Metacarpophalangeal joint (middle joint of thumb)
const thumbPIP = 3; // Proximal interphalangeal joint (joint closest to fingertip)
const thumbTIP = 4; // Fingertip

const acceptedOffset = 0.025; // Adjust this value based on testing

// EXTENDED
export const isIndexUp = (landmarks) => {
    return landmarks[indexDIP].y < landmarks[indexPIP].y - acceptedOffset;
};

export const isMiddleUp = (landmarks) => {
    return landmarks[middleDIP].y < landmarks[middlePIP].y - acceptedOffset;
};

export const isRingUp = (landmarks) => {
    return landmarks[ringDIP].y < landmarks[ringPIP].y - acceptedOffset;
};

export const isPinkyUp = (landmarks) => {
    return landmarks[pinkyDIP].y < landmarks[pinkyPIP].y - acceptedOffset;
};

// CURLED

export const isIndexCurled = (landmarks) => {
    return landmarks[indexDIP].y > landmarks[indexPIP].y + acceptedOffset;
};

export const isMiddleCurled = (landmarks) => {
    return landmarks[middleDIP].y > landmarks[middlePIP].y + acceptedOffset;
};

export const isRingCurled = (landmarks) => {
    return landmarks[ringDIP].y > landmarks[ringPIP].y + acceptedOffset;
};

export const isPinkyCurled = (landmarks) => {
    return landmarks[pinkyDIP].y > landmarks[pinkyPIP].y + acceptedOffset;
};

// CLAWED

export const isIndexClawed = (landmarks) => {
    return (landmarks[indexTIP].y > landmarks[indexDIP].y - acceptedOffset);
};

export const isMiddleClawed = (landmarks) => {
    return (landmarks[middleTIP].y > landmarks[middleDIP].y - acceptedOffset);
};

export const isRingClawed = (landmarks) => {
    return (landmarks[ringTIP].y > landmarks[ringDIP].y - acceptedOffset);
};

export const isPinkyClawed = (landmarks) => {
    return (landmarks[pinkyTIP].y > landmarks[pinkyDIP].y - acceptedOffset);
}

// Helper to calculate distance
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};

//  FINGER SPACING
export const indexMiddleTogether = (landmarks) => {
    const indexTip = landmarks[indexTIP];
    const middleTip = landmarks[middleTIP];
    const distance = getDistance(indexTip, middleTip);
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    return distance < palmWidth * 0.5; // Adjust threshold based on testing
};

export const middleRingTogether = (landmarks) => {
    const middleTip = landmarks[middleTIP];
    const ringTip = landmarks[ringTIP];
    const distance = getDistance(middleTip, ringTip);
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    return distance < palmWidth * 0.5; // Adjust threshold based on testing
};

export const ringPinkyTogether = (landmarks) => {
    const ringTip = landmarks[ringTIP];
    const pinkyTip = landmarks[pinkyTIP];
    const distance = getDistance(ringTip, pinkyTip);
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    return distance < palmWidth * 0.8; // Adjust threshold based on testing
};

// THUMB POSITIONS

export const isThumbUp = (landmarks) => {
    return landmarks[thumbTIP].y < landmarks[thumbMCP].y - acceptedOffset;
};

export const isThumbOut = (landmarks) => {
    const thumbTip = landmarks[thumbTIP];
    const thumbIP = landmarks[thumbPIP];
    const indexMJoint = landmarks[indexMCP];     // Base of index finger
    const pinkyKnuckle = landmarks[pinkyMCP]; // Base of pinky

    // Check that the thumb isn't just pointing straight up
    // If the thumb tip is significantly higher than its IP joint, it's pointing up.
    const isPointingUp = thumbTip.y < thumbIP.y - 0.025; // tweak threshold if needed
    if (isPointingUp) {
        return false; // It's up, not "out" to the side!
    }

    // Measure horizontal extension (sideways pull)
    const thumbDistance = getDistance(thumbTip, pinkyKnuckle);
    const palmWidth = getDistance(indexMJoint, pinkyKnuckle);
    const thumbRatio = thumbDistance / palmWidth;

    return thumbRatio > 1.2; // Adjust threshold based on testing
};

export const isThumbIn = (landmarks) => {
    const thumbTip = landmarks[thumbTIP];
    const thumbIP = landmarks[thumbPIP];
    const indexMJoint = landmarks[indexMCP];     // Base of index finger
    const pinkyKnuckle = landmarks[pinkyMCP]; // Base of pinky

    // Check that the thumb isn't just pointing straight up
    const isPointingUp = thumbTip.y < thumbIP.y - 0.05; 
    if (isPointingUp) {
        return false; // It's up, not "in" towards the palm!
    }

    // Measure horizontal extension (sideways pull)
    const thumbDistance = getDistance(thumbTip, pinkyKnuckle);
    const palmWidth = getDistance(indexMJoint, pinkyKnuckle);
    const thumbRatio = thumbDistance / palmWidth;

    return thumbRatio < 1.25; // Adjust threshold based on testing
};