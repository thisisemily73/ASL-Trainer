function normalizeSign(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function evaluatePractice(targetSign, detection) {
  const detectedSign =
    typeof detection === "string"
      ? detection
      : detection?.word;

  if (!detectedSign) {
    return {
      status: "retry",
      detectedSign: null,
      message: "We couldn't identify that sign. Try again with your hand clearly in view.",
    };
  }

  const matches =
    normalizeSign(targetSign) === normalizeSign(detectedSign);

  if (matches) {
    return {
      status: "correct",
      detectedSign,
      message: "Nice work! The detected sign matches your target.",
    };
  }

  return {
    status: "incorrect",
    detectedSign,
    message: `We detected "${detectedSign}". That's not a match for this lesson's target yet. Try again!`,
  };
}