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
      : detection?.word ?? detection?.sign ?? detection?.detectedSign;

  const target = normalizeSign(targetSign);
  const detected = normalizeSign(detectedSign);

  if (!target || !detected) {
    return {
      status: "retry",
      detectedSign: detectedSign || null,
      message: "We couldn't identify that sign. Try again with your hand clearly in view.",
    };
  }

  if (target === detected) {
    return {
      status: "correct",
      detectedSign,
      message: `Correct! You signed "${targetSign}".`,
    };
  }

  return {
    status: "incorrect",
    detectedSign,
    message: `We detected "${detectedSign}", but this lesson is practicing "${targetSign}". Try again!`,
  };
}