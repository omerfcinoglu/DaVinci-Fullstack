export const nextId = (arr: { id: number }[]) =>
  arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1;
