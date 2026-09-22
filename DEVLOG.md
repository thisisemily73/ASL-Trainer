### September 15, 2026
- Set up React
- Downloaded Google MediaPipe for later use
- Decided on what pages are needed for the MVP
- Built color palette in Coolors

### September 16, 2026
- Created basic project scene tree
- Created 'Variables.css' using Coolors color palette
- Installed react-router-dom
- Set up App.jsx, main.jsx, and each page to load blank
- Chose site font as Lexend to improve accessibility and easy readability for all users
- Created 'Global.css' for CSS addition to all pages
- Made the basic learn page with hardcoded Unit 1 learning path
- Made the basic Sandbox page

### September 17, 2026
- Started creating sign data in "signDictionary" and separate subfiles for organization.

### September 18, 2026
- Separated the CameraBox from Sandbox (turned it into a component for multi-page use)
- Made limbs show in CameraBox with turquoise dots and navy blue lines (representative of deaf awareness colors)

### September 19, 2026
- Created basic finger position recognition (is each finger up or curled, is the thumb out or in)
- Used basic finger positions to recognize the letters A and B, and tested thumb out (successful)
- Sign detection shows in Sandbox
- Fixed the render loop and ref stabilization issues to stop video flashing/stuttering
- Expanded sign recognition to include: A, B, E, I, L, S, U, and V

## September 20, 2026
- Introduced finger spacing for certain signs
- Signing the letter B wasn't working because the offset was too small for the distance between the tip of the ring finger and the tip of the pinky when they are together. Fixed by increasing the allowed offset.
- Tweaked offset in isThumbOut to allow for slightly more flexibility

### September 21, 2026
- Upgraded to a 4-stage finger tracking system (`0, 1, 2, 3`): Strict text checks were too binary. Added a distinct "clawed" state (`1`) to explicitly capture scrunched shapes like E without triggering a generic fist.
- Fixed the A vs E collision bug: Because "A" was accepting partial bends, it was incorrectly processing "E" frames before the engine could read down the line. Tightened "A" to absolute flat fist zeros so "E" does not trigger "A".
- Added 3D vector tracking for turned hands: Hand rotation inward (`IN`/`HZ`) causes fingers to stack, making them look touching in 2D. Added an option check that lowers the "Apart" spacing threshold whenever the knuckles go perpendicular.
- Added a check for if the hand is closed to differentiate "O" from "C"

### September 22, 2026
- Added differentiators for "A", "M", "N", "S", and "T". Still needs a lot of work.
- added number recognizer (not tested)