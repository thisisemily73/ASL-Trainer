export const lessonPath = {
  "prologue": {
    title: "PROLOGUE: THE FIVE PARAMETERS",
    lessons: [
      {
        id: "prologue-parameters",
        label: "THE 5 CORE PARAMETERS",
        status: "completed",
        type: "theory", // Marks this as a reading/theory lesson instead of webcam sandbox
        content: [
          {
            title: "Handshape",
            description: "The specific configuration or shape your hand makes (such as a fist, open hand, or specific letter)."
          },
          {
            title: "Palm Orientation",
            description: "The direction your palm faces (up, down, left, right, forward, or backward)."
          },
          {
            title: "Location",
            description: "The specific place on your body or in the neutral signing space where the sign is made."
          },
          {
            title: "Movement",
            description: "The action or path your hands take when making the sign (such as moving forward, tapping, or twisting)."
          },
          {
            title: "Non-Manual Markers (NMMs)",
            description: "Facial expressions, eye gazes, and body movements that add grammar, emotion, and tone to your signs."
          }
        ]
      },
      {
        id: "prologue-space",
        label: "DOMINANT & NON-DOMINANT HANDS",
        status: "completed",
        type: "theory",
        content: [
          {
            title: "The Dominant Hand",
            description: "If you are right-handed, your right hand does the active, moving part for most one-handed and two-handed signs. Left-handed people use their left hand."
          },
          {
            title: "The Non-Dominant Hand",
            description: "This hand acts as a stable base or supportive platform when a sign requires two hands."
          }
        ]
      }
    ]
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
      }
    ]
  }
};