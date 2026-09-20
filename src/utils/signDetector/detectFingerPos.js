import * as signPositions from '../signRecognizers/signPositions.js';

export const detectFingerPositions = (landmarks) => {
    // if (signPositions.isIndexUp(landmarks)) {
    //     return "Index finger is up";
    // } else 
    //     if (signPositions.isMiddleUp(landmarks)) {
    //     return "Middle finger is up";
    // } else 
    //     if (signPositions.isRingUp(landmarks)) {
    //     return "Ring finger is up";
    // } else 
        if (signPositions.isPinkyUp(landmarks)) {
        return "Pinky finger is up";
    } else 
    //     if (signPositions.isIndexCurled(landmarks)) {
    //     return "Index finger is curled";
    // } else 
    //     if (signPositions.isMiddleCurled(landmarks)) {
    //     return "Middle finger is curled";
    // } else 
    //     if (signPositions.isRingCurled(landmarks)) {
    //     return "Ring finger is curled";
    // } else
     
        if (signPositions.isPinkyCurled(landmarks)) {
        return "Pinky finger is curled";
    } else 
        // if (signPositions.isIndexClawed(landmarks)) {
        // return "Index finger is clawed";
    // } else 
        // if (signPositions.isMiddleClawed(landmarks)) {
        // return "Middle finger is clawed";
    // } else 
        // if (signPositions.isRingClawed(landmarks)) {
        // return "Ring finger is clawed";
    // } else 
        if (signPositions.isPinkyClawed(landmarks)) {
        return "Pinky finger is clawed";
    } else {
        return "error: No finger position detected";
    }
};