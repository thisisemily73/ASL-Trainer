// numberRecognizer.js
import * as signPositions from '../signRecognizers/signPositions';
import * as specialPositions from '../signRecognizers/specialPositions'

// NUMBER SIGN MATRIX
const NUMBER_SIGN_MATRIX = {
    "1": {
        fingers: [["3"], ["0"], ["0"], ["0"]],
        thumb:   ["T"],
        rotation: ["VT"],
        spacing:  ["T"]
    },
    "2": {
        fingers: [["3"], ["3"], ["0"], ["0"]],
        thumb:   ["T"],
        rotation: ["VT"],
        spacing:  ["T"]
    },
    "3": {
        fingers: [["3"], ["3"], ["0"], ["0"]],
        thumb:   ["O"],
        rotation: ["VT"],
        spacing:  ["T"]
    },
    "4": {
        fingers: [["3"], ["3"], ["3"], ["3"]],
        thumb:   ["T"],
        rotation: ["VT"],
        spacing:  ["T"]
    },
    "5": {
        fingers: [["3"], ["3"], ["3"], ["3"]],
        thumb:   ["O"],
        rotation: ["VT"],
        spacing:  ["T"]
    },
    "6": {
        fingers: [["3"], ["3"], ["3"], ["0"]],
        thumb:   ["T"],
        rotation: ["VT"],
        spacing:  ["T"]
    },
    "7": {
        fingers: [["3"], ["3"], ["1"], ["3"]],
        thumb:   ["O"],
        rotation: ["VT"],
        spacing:  ["T"]
    },
    "8": {
        fingers: [["3"], ["1"], ["3"], ["3"]],
        thumb:   ["O"],
        rotation: ["VT"],
        spacing:  ["T"]
    },
    "9": {
        fingers: [["1"], ["3"], ["3"], ["3"]],
        thumb:   ["O"],
        rotation: ["VT"],
        spacing:  ["T"]
    }
};

export const recognizeNumberSign = (landmarks) => {
    if (!landmarks || landmarks.length === 0) return null;
};