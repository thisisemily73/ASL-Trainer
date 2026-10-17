// signPositions.js

const indexMCP = 5; const indexPIP = 6; const indexTIP = 8;
const middleMCP = 9; const middlePIP = 10; const middleTIP = 12;
const ringMCP = 13; const ringPIP = 14; const ringTIP = 16;
const pinkyMCP = 17; const pinkyPIP = 18; const pinkyTIP = 20;
const thumbCMC = 1; const thumbMCP = 2; const thumbIP = 3; const thumbTIP = 4;

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
export const getIndexCurl = (landmarks) => getFingerCurlFactor(landmarks, indexTIP, indexPIP, indexMCP);
export const getMiddleCurl = (landmarks) => getFingerCurlFactor(landmarks, middleTIP, middlePIP, middleMCP);
export const getRingCurl = (landmarks) => getFingerCurlFactor(landmarks, ringTIP, ringPIP, ringMCP);
export const getPinkyCurl = (landmarks) => getFingerCurlFactor(landmarks, pinkyTIP, pinkyPIP, pinkyMCP);

// RESTORED FINGER STATE HELPERS (REQUIRED FOR RECOGNIZER)

export const getFingerStateFromCurl = (curl) => {
    if (curl < 0.3) return "EXTENDED";
    if (curl < 0.55) return "CURLED";
    return "TUCKED";
};

export const getIndexState = (landmarks) => getFingerStateFromCurl(getIndexCurl(landmarks));
export const getMiddleState = (landmarks) => getFingerStateFromCurl(getMiddleCurl(landmarks));
export const getRingState = (landmarks) => getFingerStateFromCurl(getRingCurl(landmarks));
export const getPinkyState = (landmarks) => getFingerStateFromCurl(getPinkyCurl(landmarks));

// ORIGINAL SPATIAL & ROTATION HELPERS


export const getThumbState = (landmarks) => {
    if (!landmarks || landmarks.length <= thumbTIP) {
        return "IN";
    }

    const thumbTip = landmarks[thumbTIP];
    const thumbBase = landmarks[thumbMCP];
    const thumbIPJoint = landmarks[thumbIP];
    const indexKnuckle = landmarks[indexMCP];
    const pinkyKnuckle = landmarks[pinkyMCP];

    if (
        !thumbTip ||
        !thumbBase ||
        !thumbIPJoint ||
        !indexKnuckle ||
        !pinkyKnuckle
    ) {
        return "IN";
    }

    const palmWidth = getDistance(indexKnuckle, pinkyKnuckle);

    if (palmWidth === 0) return "IN";

    // Normalize measurements against the size of the hand.
    const verticalRise = (thumbBase.y - thumbTip.y) / palmWidth;
    const horizontalExtension =
        getDistance(thumbTip, thumbBase) / palmWidth;

    // Check UP first: MediaPipe image coordinates increase downward.
    if (
        verticalRise > 0.25 &&
        horizontalExtension > 0.2
    ) {
        return "UP";
    }

    // Thumb extends outward from the palm.
    const thumbDistance =
        getDistance(thumbTip, pinkyKnuckle) / palmWidth;

    if (thumbDistance > 1.15) {
        const depthDifference = thumbTip.z - landmarks[middleMCP].z;

        if (Math.abs(depthDifference) > 0.15) {
            return "OUT_FRONT";
        }

        return "OUT_SIDE";
    }

    return "IN";
};


/**
 * Calculates the angle ABC in degrees.
 * 180 degrees = straight; smaller angles = more bent.
 */
const getJointAngle = (a, b, c) => {
    if (!a || !b || !c) return null;

    const ba = {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z,
    };

    const bc = {
        x: c.x - b.x,
        y: c.y - b.y,
        z: c.z - b.z,
    };

    const magnitudeBA = Math.sqrt(
        ba.x ** 2 + ba.y ** 2 + ba.z ** 2
    );

    const magnitudeBC = Math.sqrt(
        bc.x ** 2 + bc.y ** 2 + bc.z ** 2
    );

    if (magnitudeBA === 0 || magnitudeBC === 0) {
        return null;
    }

    const dotProduct =
        ba.x * bc.x +
        ba.y * bc.y +
        ba.z * bc.z;

    const cosine = Math.max(
        -1,
        Math.min(1, dotProduct / (magnitudeBA * magnitudeBC))
    );

    return Math.acos(cosine) * (180 / Math.PI);
};

/**
 * Returns STRAIGHT or BENT based on thumb joint angles.
 */

export const getThumbShape = (landmarks) => {
    if (
        !landmarks ||
        landmarks.length <= thumbTIP ||
        !landmarks[thumbCMC] ||
        !landmarks[thumbMCP] ||
        !landmarks[thumbIP] ||
        !landmarks[thumbTIP]
    ) {
        return "UNKNOWN";
    }

    const mcpAngle = getJointAngle(
        landmarks[thumbCMC],
        landmarks[thumbMCP],
        landmarks[thumbIP]
    );

    const ipAngle = getJointAngle(
        landmarks[thumbMCP],
        landmarks[thumbIP],
        landmarks[thumbTIP]
    );

    if (mcpAngle === null || ipAngle === null) {
        return "UNKNOWN";
    }

    if (mcpAngle < 150 || ipAngle < 155) {
        return "BENT";
    }

    return "STRAIGHT";
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

    return getDistance(landmarks[indexTIP], landmarks[middleTIP])
        < palmWidth * 0.48;
};

export const isMiddleAndRingTogether = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;

    const palmWidth = getDistance(landmarks[indexMCP], landmarks[pinkyMCP]);

    return getDistance(landmarks[middleTIP], landmarks[ringTIP])
        < palmWidth * 0.48;
};

export const isRingAndPinkyTogether = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;

    const palmWidth = getDistance(landmarks[indexMCP], landmarks[pinkyMCP]);

    return getDistance(landmarks[ringTIP], landmarks[pinkyTIP])
        < palmWidth * 0.78;
};


// Check if all 4 fingers are together

export const areAllFingersTogether = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return false;

    const palmWidth = getDistance(
        landmarks[indexMCP],
        landmarks[pinkyMCP]
    );

    const pairs = {
        indexMiddle:
            getDistance(landmarks[indexTIP], landmarks[middleTIP]) / palmWidth,

        middleRing:
            getDistance(landmarks[middleTIP], landmarks[ringTIP]) / palmWidth,

        ringPinky:
            getDistance(landmarks[ringTIP], landmarks[pinkyTIP]) / palmWidth,
    };

    const together =
        pairs.indexMiddle < 0.48 &&
        pairs.middleRing < 0.48 &&
        pairs.ringPinky < 0.78;

    return together;
};




export const getFingerSpacing = (landmarks) => {
    if (!landmarks || landmarks.length === 0) {
        return "UNKNOWN";
    }

    const together = areAllFingersTogether(landmarks);

    return together ? "TOGETHER" : "APART";
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