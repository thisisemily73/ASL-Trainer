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

const isThumbOut = signPositions.isThumbOut;
const isThumbIn = signPositions.isThumbIn;

// Main function to check signs
export const detectSignA = (landmarks) => {
    return (
        isIndexCurled(landmarks) && 
        isMiddleCurled(landmarks) && 
        isRingCurled(landmarks) 
        && isPinkyCurled(landmarks)
        && isThumbUp(landmarks)
        && !isThumbOut(landmarks)
    );
};

export const detectSignB = (landmarks) => {
    return (
        isIndexUp(landmarks) &&
        isMiddleUp(landmarks) && 
        isRingUp(landmarks) &&
        isPinkyUp(landmarks) &&
        isThumbIn(landmarks)
    );
};