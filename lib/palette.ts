// Smooth hue ramp (brand violet → teal) that color-codes the module and guide
// cards. One ramp at constant saturation/lightness reads as a single calm
// palette rather than a rainbow. Tailwind's JIT can't see dynamically built
// class names, so callers apply these as inline styles.

export const rampHue = (i: number, step = 12) => 245 - i * step;

/** Whole-card tint: soft wash background + matching border. */
export const rampCard = (i: number, step = 12) => ({
  backgroundColor: `hsl(${rampHue(i, step)} 55% 96%)`,
  borderColor: `hsl(${rampHue(i, step)} 45% 85%)`,
});

/** Stronger left edge that gives the washed card definition. */
export const rampBar = (i: number, step = 12) => ({
  borderLeftColor: `hsl(${rampHue(i, step)} 50% 60%)`,
});

/** Number badge: a deeper tint that stands out on the card wash. */
export const rampBadge = (i: number, step = 12) => ({
  backgroundColor: `hsl(${rampHue(i, step)} 55% 88%)`,
  color: `hsl(${rampHue(i, step)} 50% 35%)`,
});

/** Accent text (links/labels) in the card's hue. */
export const rampText = (i: number, step = 12) => ({
  color: `hsl(${rampHue(i, step)} 45% 42%)`,
});
