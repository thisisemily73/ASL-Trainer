// UNIT 1 HELPERS
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const LETTER_HINTS = {
  A: 'Close your fingers into a fist. Rest your thumb alongside the index finger.',
  B: 'Extend your four fingers together and fold your thumb across your palm.',
  C: 'Curve your fingers and thumb to form a C-shaped hand.',
  D: 'Raise your index finger. Bring your thumb and remaining fingers together.',
  E: 'Curl your fingers toward your palm and bring your thumb across them.',
  F: 'Touch your index finger and thumb to form a circle. Extend the other three fingers.',
  G: 'Extend your thumb and index finger sideways, keeping them apart.',
  H: 'Extend your index and middle fingers together sideways, with your thumb folded.',
  I: 'Extend your pinky while curling your other fingers.',
  J: 'Start with the I handshape and trace a J-shaped movement with your pinky.',
  K: 'Raise your index and middle fingers in a V-like arrangement, with your thumb positioned between them.',
  L: 'Extend your thumb and index finger at right angles, with the other fingers curled.',
  M: 'Fold your thumb beneath three fingers.',
  N: 'Fold your thumb beneath two fingers.',
  O: 'Curve your fingers and thumb together to form an O.',
  P: 'Use the K handshape, oriented downward.',
  Q: 'Use the G handshape, oriented downward.',
  R: 'Cross your index and middle fingers.',
  S: 'Make a fist with your thumb crossing in front of your fingers.',
  T: 'Make a fist with your thumb tucked between your index and middle fingers.',
  U: 'Extend your index and middle fingers together.',
  V: 'Extend your index and middle fingers apart.',
  W: 'Extend your index, middle, and ring fingers.',
  X: 'Curl your index finger into a hook while keeping the other fingers curled.',
  Y: 'Extend your thumb and pinky while curling the other fingers.',
  Z: 'Trace a Z-shaped movement in the air with your index finger.'
};

const NUMBER_HINTS = {
  '1': 'Raise your index finger.',
  '2': 'Raise your index and middle fingers.',
  '3': 'In a common ASL counting form, raise your thumb, index, and middle fingers.',
  '4': 'Raise four fingers with your thumb folded inward.',
  '5': 'Open your hand with all five fingers extended.',
  '6': 'Touch your thumb to your pinky in the common ASL number handshape.',
  '7': 'Touch your thumb to your ring finger in the common ASL number handshape.',
  '8': 'Touch your thumb to your middle finger in the common ASL number handshape.',
  '9': 'Touch your thumb to your index finger in the common ASL number handshape.',
  '10': 'Make a thumbs-up handshape and rotate your wrist as demonstrated.'
};

function makeSigns(words, pool) {
  return words.map((word, index) => {
    const distractors = pool.filter((item) => item !== word);

    // Rotate the choices so the correct answer isn't always first.
    const choices = [
      ...distractors.slice(index % distractors.length),
      ...distractors.slice(0, index % distractors.length)
    ].slice(0, 3);

    choices.splice(index % 4, 0, word);

    return {
      word,
      hint: LETTER_HINTS[word] || NUMBER_HINTS[word],
      options: choices,
      correctAnswer: word,
      ...(word === 'J' || word === 'Z'
        ? {
          movementRequired: true,
          movementDescription:
            word === 'J'
              ? 'Trace the J-shaped path with your pinky.'
              : 'Trace a Z-shaped path with your index finger.'
        }
        : {})
    };
  });
}

function makeLesson({
  id,
  label,
  description,
  objectives,
  words,
  pool = ALPHABET,
  type = 'fingerspelling',
  comparisons = []
}) {
  const signs = makeSigns(words, pool);

  return {
    id,
    label,
    type,
    introduction: {
      title: label,
      description,
      objectives
    },
    teaching: signs.map((sign) => ({
      title: `Letter or number ${sign.word}`,
      word: sign.word,
      description: sign.hint,
      movementRequired: sign.movementRequired || false,
      movementDescription: sign.movementDescription || null
    })),
    comparisons,
    signs,
    guidedPractice: {
      required: true,
      description: 'Identify each handshape in a mixed order.'
    },
    cameraPractice: {
      required: false,
      description: 'Optionally practice forming each handshape on camera.'
    },
    review: {
      required: true,
      description: 'Complete a recognition review before finishing this lesson.',
      signs: makeSigns(words, pool)
    }
  };
}

// LESSON PATH
export const lessonPath = {

  "prologue": {
    title: "PROLOGUE: THE FIVE PARAMETERS",
    lessons: [
      {
        id: "prologue-parameters",
        label: "THE 5 CORE PARAMETERS",
        type: "theory",
        content: [
          {
            title: "1. Handshape",
            description:
              "Handshape is the configuration of the hand and fingers during a sign. Your hand might form a fist, an open hand, or a specific shape. Small differences in finger position can distinguish signs."
          },
          {
            title: "2. Palm Orientation",
            description:
              "Palm orientation describes the direction your palm faces while signing. Your palm might face toward you, away from you, upward, or to the side. Orientation can affect a sign's meaning."
          },
          {
            title: "3. Location",
            description:
              "Location is where a sign is produced. A sign may be made near the forehead, near the chest, or in the space in front of the body. The location is part of the sign, not just where your hand happens to be."
          },
          {
            title: "4. Movement",
            description:
              "Movement describes how the hands move during a sign. This can include the direction, path, repetition, or type of movement. Some signs are stationary, while others involve one or more movements."
          },
          {
            title: "5. Non-Manual Markers",
            description:
              "Non-manual markers include facial expressions, eye gaze, and head or body movements. They can contribute to ASL grammar and meaning, including how questions and other sentence types are expressed. ASL is not simply English expressed with your hands."
          }
        ]
      },
      {
        id: "prologue-space",
        label: "DOMINANT & NON-DOMINANT HANDS",
        type: "theory",
        content: [
          {
            title: "Your dominant hand",
            description:
              "Your dominant hand is generally the hand you use for the active movement in many one-handed signs. Right-handed signers commonly use their right hand; left-handed signers commonly use their left.",
          },
          {
            title: "Your non-dominant hand",
            description:
              "In many two-handed signs, one hand moves while the other provides a base or support. The roles depend on the particular sign.",
          },
          {
            title: "Try a quick check",
            description:
              "Think about which hand you naturally use for precise movements. You can use either hand when learning ASL, and your signing should follow the conventions of each sign.",
          },
        ],
      },
    ],
  },

  "unit-1": {
    title: "UNIT 1: INTRODUCTION TO FINGERSPELLING",
    lessons: [
      makeLesson({
        id: "alphabet-1",
        label: "ALPHABET 1",
        description:
          "Begin learning the ASL manual alphabet with seven foundational handshapes.",
        objectives: [
          "Recognize A, E, I, M, N, S, and T.",
          "Follow instructions for forming each handshape.",
          "Begin distinguishing relevant handshape differences."
        ],
        words: ['A', 'E', 'I', 'M', 'N', 'S', 'T'],
        comparisons: [
          {
            title: "M, N, and T",
            description:
              "Compare the placement of the thumb and the number of fingers folded over it."
          },
          {
            title: "A and S",
            description:
              "Compare the position of the thumb relative to the curled fingers."
          }
        ]
      }),

      makeLesson({
        id: "alphabet-2",
        label: "ALPHABET 2",
        description:
          "Learn seven more letters and compare their finger arrangements.",
        objectives: [
          "Recognize B, L, R, U, V, W, and Y.",
          "Distinguish similar handshapes.",
          "Recall letters in mixed practice."
        ],
        words: ['B', 'L', 'R', 'U', 'V', 'W', 'Y'],
        comparisons: [
          {
            title: "U and V",
            description:
              "Compare the spacing between the extended index and middle fingers."
          },
          {
            title: "L and Y",
            description:
              "Compare which fingers are extended and how the thumb is positioned."
          }
        ]
      }),

      makeLesson({
        id: "alphabet-3",
        label: "ALPHABET 3",
        description:
          "Learn five additional letters and recognize them outside their original presentation order.",
        objectives: [
          "Recognize C, D, F, O, and X.",
          "Distinguish their handshape differences.",
          "Identify letters in mixed practice."
        ],
        words: ['C', 'D', 'F', 'O', 'X'],
        comparisons: [
          {
            title: "C and O",
            description:
              "Compare the overall handshape and the size of the opening between the fingers and thumb."
          },
          {
            title: "D and F",
            description:
              "Compare the raised index finger with the thumb-and-index contact in F."
          }
        ]
      }),

      makeLesson({
        id: "alphabet-4",
        label: "ALPHABET 4",
        description:
          "Learn the remaining five letters in this group and pay attention to finger positions and orientation.",
        objectives: [
          "Recognize G, H, K, P, and Q.",
          "Attend to finger position and orientation.",
          "Distinguish visually similar handshapes."
        ],
        words: ['G', 'H', 'K', 'P', 'Q'],
        comparisons: [
          {
            title: "G and Q",
            description:
              "Compare the orientation of the G handshape with its downward-oriented counterpart."
          },
          {
            title: "K and P",
            description:
              "Compare the orientation of the hand while preserving the relevant finger arrangement."
          }
        ]
      }),

      makeLesson({
        id: "dynamic-letters",
        label: "DYNAMIC LETTERS",
        description:
          "Learn J and Z, which require movement rather than a single stationary handshape.",
        objectives: [
          "Recognize J and Z.",
          "Understand the movement used to form each letter.",
          "Recognize the letters from their movement paths."
        ],
        words: ['J', 'Z'],
        comparisons: [
          {
            title: "J and Z",
            description:
              "Compare the distinct movement paths and the fingers used to trace them."
          }
        ]
      }),

      makeLesson({
        id: "alphabet-review",
        label: "FULL ALPHABET REVIEW",
        description:
          "Reinforce all 26 letters before continuing to numbers.",
        objectives: [
          "Recognize all 26 letters.",
          "Identify letters in varied orders.",
          "Practice difficult handshapes again."
        ],
        words: ALPHABET,
        type: 'review'
      }),

      makeLesson({
        id: "numbers-1-5",
        label: "NUMBERS 1–5",
        description:
          "Begin recognizing numbers one through five using their demonstrated handshapes.",
        objectives: [
          "Recognize numbers 1–5.",
          "Follow demonstrations of their handshapes.",
          "Distinguish the number handshapes."
        ],
        words: NUMBERS.slice(0, 5),
        pool: NUMBERS
      }),

      makeLesson({
        id: "numbers-6-10",
        label: "NUMBERS 6–10",
        description:
          "Learn numbers six through ten and observe the relevant finger positions and movements.",
        objectives: [
          "Recognize numbers 6–10.",
          "Understand the demonstrated handshapes.",
          "Recognize number forms during mixed practice."
        ],
        words: NUMBERS.slice(5),
        pool: NUMBERS
      })
    ]
  }
};