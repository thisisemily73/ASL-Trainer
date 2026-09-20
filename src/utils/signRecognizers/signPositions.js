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

// Helper to check if a finger is extended
export const isIndexUp = (landmarks) => {
    return landmarks[7].y < landmarks[6].y;
};

export const isMiddleUp = (landmarks) => {
    return landmarks[11].y < landmarks[10].y;
};

export const isRingUp = (landmarks) => {
    return landmarks[15].y < landmarks[14].y;
};

export const isPinkyUp = (landmarks) => {
    return landmarks[19].y < landmarks[18].y;
};

// Helper to check if a finger is curled

export const isIndexCurled = (landmarks) => {
    return landmarks[8].y > landmarks[6].y;
};

export const isMiddleCurled = (landmarks) => {
    return landmarks[12].y > landmarks[10].y;
};

export const isRingCurled = (landmarks) => {
    return landmarks[16].y > landmarks[14].y;
};

export const isPinkyCurled = (landmarks) => {
    return landmarks[20].y > landmarks[18].y;
};

// Thumb Helpers
// Thumb curl detection is more complex due to its range of motion

export const isThumbUp = (landmarks) => {
    return landmarks[4].y < landmarks[3].y;
};

// Helper to calculate distance
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};

export const isThumbOut = (landmarks) => {
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const indexMCP = landmarks[5];     // Base of index finger
    const pinkyKnuckle = landmarks[17]; // Base of pinky

    // Check that the thumb isn't just pointing straight up
    // If the thumb tip is significantly higher than its IP joint, it's pointing up.
    const isPointingUp = thumbTip.y < thumbIP.y - 0.05; // tweak threshold if needed
    if (isPointingUp) {
        return false; // It's up, not "out" to the side!
    }

    // Measure horizontal extension (sideways pull)
    const thumbDistance = getDistance(thumbTip, pinkyKnuckle);
    const palmWidth = getDistance(indexMCP, pinkyKnuckle);
    const thumbRatio = thumbDistance / palmWidth;

    return thumbRatio > 1.2; // Adjust threshold based on testing
};

export const isThumbIn = (landmarks) => {
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const indexMCP = landmarks[5];     // Base of index finger
    const pinkyKnuckle = landmarks[17]; // Base of pinky

    // Check that the thumb isn't just pointing straight up
    const isPointingUp = thumbTip.y < thumbIP.y - 0.05; // tweak threshold if needed
    if (isPointingUp) {
        return false; // It's up, not "in" towards the palm!
    }

    // Measure horizontal extension (sideways pull)
    const thumbDistance = getDistance(thumbTip, pinkyKnuckle);
    const palmWidth = getDistance(indexMCP, pinkyKnuckle);
    const thumbRatio = thumbDistance / palmWidth;

    return thumbRatio < 0.8; // Adjust threshold based on testing
};