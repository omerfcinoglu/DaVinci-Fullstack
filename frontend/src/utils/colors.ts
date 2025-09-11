export function colorForUserId(
  userId: number,
  opts?: { s?: number; l?: number; alphaBg?: number }
) {
  const hue = Math.floor((userId * 137.508) % 360);
  const s = opts?.s ?? 70;
  const l = opts?.l ?? 50;
  const alphaBg = opts?.alphaBg ?? 0.18;
  const bg = `hsla(${hue} ${s}% ${l}% / ${alphaBg})`;
  const solid = `hsl(${hue} ${s}% ${l}%)`;
  return { bg, solid, hue };
}
