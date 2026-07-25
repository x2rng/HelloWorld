export function getBlinkAmount(elapsedSeconds: number) {
  const cycle = elapsedSeconds % 5.7;
  if (cycle < 0.08) return cycle / 0.08;
  if (cycle < 0.17) return 1 - (cycle - 0.08) / 0.09;
  if (cycle > 3.12 && cycle < 3.18) {
    return ((cycle - 3.12) / 0.06) * 0.55;
  }
  if (cycle >= 3.18 && cycle < 3.25) {
    return (1 - (cycle - 3.18) / 0.07) * 0.55;
  }
  return 0;
}
