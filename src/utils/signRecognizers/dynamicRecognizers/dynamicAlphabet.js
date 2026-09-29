let landmarkHistory = [];
const MAX_HISTORY_FRAMES = 20;

export const updateLandmarkHistory = (landmarks) => {
    landmarkHistory.push(landmarks);
    if (landmarkHistory.length > MAX_HISTORY_FRAMES) {
        landmarkHistory.shift();
    }
};

// 1. Individual helper check for J
const checkJ = (currentLandmarks) => {
    if (landmarkHistory.length < MAX_HISTORY_FRAMES) return false;
    const startPinky = landmarkHistory[0][20];
    const currentPinky = currentLandmarks[20];
    
    const movedDown = currentPinky.y - startPinky.y > 0.08;
    const movedSideways = Math.abs(currentPinky.x - startPinky.x) > 0.05;
    return movedDown && movedSideways;
};

// 2. Individual helper check for Z
const checkZ = (currentLandmarks) => {
    if (landmarkHistory.length < MAX_HISTORY_FRAMES) return false;
    const startIndex = landmarkHistory[0][8];
    const currentIndex = currentLandmarks[8];
    
    const totalHorizontalTravel = Math.abs(currentIndex.x - startIndex.x);
    return totalHorizontalTravel > 0.15;
};

// 3. Registry array containing all dynamic alphabet signs
const dynamicDetectors = [
    { name: 'J', check: checkJ },
    { name: 'Z', check: checkZ }
    // You can easily add more moving letters here later!
];

/**
 * ONE single function that checks everything and returns the letter name (or null)
 */
export const detectDynamicAlphabet = (currentLandmarks) => {
    // If we don't have enough history frames yet, exit early
    if (landmarkHistory.length < MAX_HISTORY_FRAMES) return null;

    // Loop through the registry
    for (const detector of dynamicDetectors) {
        if (detector.check(currentLandmarks)) {
            return detector.name; // Returns "J" or "Z" automatically!
        }
    }

    return null; // Nothing matched
};