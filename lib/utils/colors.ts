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
