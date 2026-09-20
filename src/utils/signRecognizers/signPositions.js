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

const acceptedOffset = 0.025; // Adjust this value based on testing

// EXTENDED
export const isIndexUp = (landmarks) => {
    return landmarks[7].y < landmarks[6].y - acceptedOffset;
};

export const isMiddleUp = (landmarks) => {
    return landmarks[11].y < landmarks[10].y - acceptedOffset;
};

export const isRingUp = (landmarks) => {
    return landmarks[15].y < landmarks[14].y - acceptedOffset;
};

export const isPinkyUp = (landmarks) => {
    return landmarks[19].y < landmarks[18].y - acceptedOffset;
};

// CURLED

export const isIndexCurled = (landmarks) => {
    return landmarks[7].y > landmarks[6].y + acceptedOffset;
};

export const isMiddleCurled = (landmarks) => {
    return landmarks[11].y > landmarks[10].y + acceptedOffset;
};

export const isRingCurled = (landmarks) => {
    return landmarks[15].y > landmarks[14].y + acceptedOffset;
};

export const isPinkyCurled = (landmarks) => {
    return landmarks[19].y > landmarks[18].y + acceptedOffset;
};

// CLAWED

export const isIndexClawed = (landmarks) => {
    return landmarks[7].y === landmarks[8].y && landmarks[7].y > landmarks[6].y + acceptedOffset
        || landmarks[7].y < landmarks[5].y - acceptedOffset;
}

export const isMiddleClawed = (landmarks) => {
    return landmarks[11].y === landmarks[12].y && landmarks[11].y > landmarks[10].y + acceptedOffset
        || landmarks[11].y < landmarks[9].y - acceptedOffset;
}

export const isRingClawed = (landmarks) => {
    return landmarks[15].y === landmarks[16].y && landmarks[15].y > landmarks[14].y + acceptedOffset
        || landmarks[15].y < landmarks[13].y - acceptedOffset;
}

export const isPinkyClawed = (landmarks) => {
    return landmarks[19].y === landmarks[20].y && landmarks[19].y > landmarks[18].y + acceptedOffset
        || landmarks[19].y < landmarks[17].y - acceptedOffset;
}

// Helper to calculate distance
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};

//  FINGER SPACING
export const indexMiddleTogether = (landmarks) => {
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const distance = getDistance(indexTip, middleTip);
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    return distance < palmWidth * 0.5; // Adjust threshold based on testing
};

export const middleRingTogether = (landmarks) => {
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const distance = getDistance(middleTip, ringTip);
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    return distance < palmWidth * 0.5; // Adjust threshold based on testing
};

export const ringPinkyTogether = (landmarks) => {
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const distance = getDistance(ringTip, pinkyTip);
    const palmWidth = getDistance(landmarks[5], landmarks[17]);
    return distance < palmWidth * 0.5; // Adjust threshold based on testing
};

// THUMB POSITIONS

export const isThumbUp = (landmarks) => {
    return landmarks[4].y < landmarks[3].y - acceptedOffset;
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

    return thumbRatio < 1; // Adjust threshold based on testing
};