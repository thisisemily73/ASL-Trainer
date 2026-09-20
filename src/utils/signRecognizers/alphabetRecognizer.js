import * as signPositions from './signPositions';

const isIndexUp = signPositions.isIndexUp;
const isMiddleUp = signPositions.isMiddleUp;
const isRingUp = signPositions.isRingUp;
const isPinkyUp = signPositions.isPinkyUp;
const isThumbUp = signPositions.isThumbUp;

const isIndexCurled = signPositions.isIndexCurled;
const isMiddleCurled = signPositions.isMiddleCurled;
const isRingCurled = signPositions.isRingCurled;
const isPinkyCurled = signPositions.isPinkyCurled;

const isIndexClawed = signPositions.isIndexClawed;
const isMiddleClawed = signPositions.isMiddleClawed;
const isRingClawed = signPositions.isRingClawed;
const isPinkyClawed = signPositions.isPinkyClawed;

const isThumbOut = signPositions.isThumbOut;
const isThumbIn = signPositions.isThumbIn;

const indexMiddleTogether = signPositions.indexMiddleTogether;
const middleRingTogether = signPositions.middleRingTogether;
const ringPinkyTogether = signPositions.ringPinkyTogether;

// Main function to check signs
export const detectSignA = (landmarks) => {
    return (
        isIndexCurled(landmarks) &&
        isMiddleCurled(landmarks) &&
        isRingCurled(landmarks)
        && isPinkyCurled(landmarks)
        && isThumbUp(landmarks)
        && !isThumbOut(landmarks)
        && !isThumbIn(landmarks)
    );
};

export const detectSignB = (landmarks) => {
    return (
        isIndexUp(landmarks) &&
        isMiddleUp(landmarks) &&
        isRingUp(landmarks) &&
        isPinkyUp(landmarks) &&
        isThumbIn(landmarks) &&
        indexMiddleTogether(landmarks) &&
        middleRingTogether(landmarks) &&
        ringPinkyTogether(landmarks)
    );
};

export const detectSignE = (landmarks) => {
    return (
        isIndexClawed(landmarks) &&
        isMiddleClawed(landmarks) &&
        isRingClawed(landmarks) &&
        isPinkyClawed(landmarks) &&
        isThumbIn(landmarks)
    );
};

export const detectSignI = (landmarks) => {
    return (
        isIndexCurled(landmarks) &&
        isMiddleCurled(landmarks) &&
        isRingCurled(landmarks) &&
        isPinkyUp(landmarks) &&
        isThumbIn(landmarks)
    );
}

export const detectSignL = (landmarks) => {
    return (
        isIndexUp(landmarks) &&
        isMiddleCurled(landmarks) &&
        isRingCurled(landmarks) &&
        isPinkyCurled(landmarks) &&
        isThumbOut(landmarks)
    );
};

export const detectSignS = (landmarks) => {
    return (
        isIndexCurled(landmarks) &&
        isMiddleCurled(landmarks) &&
        isRingCurled(landmarks) &&
        isPinkyCurled(landmarks) &&
        isThumbIn(landmarks) &&
        !isThumbUp(landmarks)
    );
}

export const detectSignU = (landmarks) => {
    return (
        isIndexUp(landmarks) &&
        isMiddleUp(landmarks) &&
        isRingCurled(landmarks) &&
        isPinkyCurled(landmarks) &&
        isThumbIn(landmarks) &&
        indexMiddleTogether(landmarks)
    );
}

export const detectSignV = (landmarks) => {
    return (
        isIndexUp(landmarks) &&
        isMiddleUp(landmarks) &&
        isRingCurled(landmarks) &&
        isPinkyCurled(landmarks) &&
        isThumbIn(landmarks) &&
        !indexMiddleTogether(landmarks)
    );
}

export const detectSignY = (landmarks) => {
    return (
        isIndexCurled(landmarks) &&
        isMiddleCurled(landmarks) &&
        isRingCurled(landmarks) &&
        isPinkyUp(landmarks) &&
        isThumbOut(landmarks)
    );
}