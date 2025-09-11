const AVATAR_BASE = "https://avatar.iran.liara.run/public";

const hashString = (s: string) =>
  Array.from(s).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);

export function getDeterministicAvatarUrl(seed: string | number, modulo = 100) {
  const h = typeof seed === "number" ? seed : Math.abs(hashString(seed));
  const idx = (Math.abs(h) % modulo) + 1;
  return `${AVATAR_BASE}/${idx}`;
}

export function getRandomAvatarUrl(modulo = 100) {
  const idx = Math.floor(Math.random() * modulo) + 1;
  return `${AVATAR_BASE}/${idx}?v=${Date.now()}`;
}
