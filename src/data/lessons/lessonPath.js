export const lessonPath = {

  "prologue": {
    title: "PROLOGUE: THE FIVE PARAMETERS",
    lessons: [
      {
        id: "prologue-parameters",
        label: "THE 5 CORE PARAMETERS",
        type: "practice",
        signs: [
          {
            word: "A",
            hint: "Look at the handshape. Which letter is shown?",
            options: ["A", "B", "C", "D"],
            correctAnswer: "A",
          },
          {
            word: "B",
            hint: "Compare the handshape with the previous sign.",
            options: ["A", "B", "C", "D"],
            correctAnswer: "B",
          },
        ],
        content: [
          {
            title: "Handshape",
            description:
              "The configuration of your hand, such as a fist, an open hand, or a particular letter shape.",
          },
          {
            title: "Palm Orientation",
            description:
              "The direction your palm faces. A sign can change meaning when the palm faces a different direction.",
          },
          {
            title: "Location",
            description:
              "Where you make a sign, such as near your forehead, chest, or in the space in front of your body.",
          },
          {
            title: "Movement",
            description:
              "The path or action your hands take while signing.",
          },
          {
            title: "Non-Manual Markers",
            description:
              "Facial expressions, eye gaze, and body movements that contribute to ASL grammar and meaning.",
          },
        ],
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
    title: "UNIT 1: FUNDAMENTALS",
    lessons: [
      {
        id: "alphabet-1",
        label: "ALPHABET PART 1",
        status: "completed",
        type: "practice",
        signs: [
          {
            word: "A",
            hint: "Make a fist with thumb resting on the side of index finger.",
            options: ["A", "B", "C", "D"],
            correctAnswer: "A"
          },
        ]
      },
      {
        id: "numbers-1-10",
        label: "NUMBERS 1-10",
        status: "completed",
        type: "practice",
        signs: []
      },
      {
        id: "basic-greetings",
        label: "BASIC GREETINGS",
        status: "active",
        type: "practice",
        icon: "👋",
        signs: [
          {
            word: "Hello",
            hint: "Wave hand gently from side to side.",
            options: ["Hello", "Thank You", "Goodnight", "Please"],
            correctAnswer: "Hello"
          },
          {
            word: "Thank You",
            hint: "Move flat hand outward from chin.",
            options: ["Please", "Thank You", "Hello", "Sorry"],
            correctAnswer: "Thank You"
          }
        ]
      },
      {
        id: "avatar-sandbox",
        label: "3D HAND AVATAR TESTER",
        status: "active",
        type: "practice",
        icon: "🤖",
        signs: [
          { word: "A", hint: "Fist with thumb on side of index finger", options: ["A", "B", "C", "D"], correctAnswer: "A" },
          { word: "B", hint: "Flat hand with thumb tucked across palm", options: ["A", "B", "C", "D"], correctAnswer: "B" },
          { word: "C", hint: "Curved hand forming a C shape", options: ["B", "C", "D", "E"], correctAnswer: "C" },
          { word: "D", hint: "Index finger up, others touching thumb", options: ["A", "C", "D", "E"], correctAnswer: "D" },
          { word: "E", hint: "Fingers curled down, thumb tucked in", options: ["B", "C", "D", "E"], correctAnswer: "E" }
        ]
      },
    ]
  }
};