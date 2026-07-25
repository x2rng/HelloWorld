export function getIdleAnimation(elapsedSeconds: number) {
  return {
    breath: Math.sin(elapsedSeconds * 1.45) * 0.006,
    posture: Math.sin(elapsedSeconds * 0.36) * 0.008,
    head: Math.sin(elapsedSeconds * 0.23) * 0.012,
  };
}
