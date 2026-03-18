export function clampStepIndex(index: number, stepsLength: number): number {
  if (stepsLength <= 0) return 0;
  return Math.min(Math.max(0, index), stepsLength - 1);
}

export function canGoBack(stepIndex: number): boolean {
  return stepIndex > 0;
}

export function canGoNext(stepIndex: number, stepsLength: number): boolean {
  if (stepsLength <= 0) return false;
  return stepIndex < stepsLength - 1;
}

