import { colors } from "@/constants";

export function getRandomColor(): Color {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Returns the first palette color not already in `used`, or a random color
// when the palette is exhausted. Useful when assigning a default color to a
// course that doesn't already have one, while avoiding collisions with the
// user's existing colors.
export function pickNextColor(used: Set<Color>): Color {
  for (const color of colors) {
    if (!used.has(color)) return color;
  }
  return getRandomColor();
}

// Maps an id onto the palette so a user keeps the same color everywhere
// without us having to store one. FNV-1a is cheap and spreads ids whose
// characters mostly overlap, like the UUIDs auth hands us, across the palette.
export function getColorFromId(id: string): Color {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return colors[(hash >>> 0) % colors.length];
}
