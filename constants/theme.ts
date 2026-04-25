import { Platform } from "react-native";

/**
 * Lumina Design System — "The Lucid Play Ethos"
 *
 * Single source of truth for every design token in the app.
 * All colors come from the Stitch design system export.
 *
 * Docs: https://m3.material.io/styles/color/system/overview
 *       (We follow M3 naming conventions for color roles)
 */

// ─── Color Palette ──────────────────────────────────────────
export const Colors = {
  // Core brand
  primary: "#6366F1",
  primaryContainer: "#9396ff",
  primaryDim: "#3939c7",
  onPrimary: "#f4f1ff",
  onPrimaryContainer: "#0a0081",

  // Secondary
  secondary: "#A855F7",
  secondaryContainer: "#e5c6ff",
  secondaryDim: "#740ec2",
  onSecondary: "#fbefff",
  onSecondaryContainer: "#6900b4",

  // Tertiary
  tertiary: "#38BDF8",
  tertiaryContainer: "#37bcf7",
  tertiaryDim: "#005675",
  onTertiary: "#e7f5ff",
  onTertiaryContainer: "#00354a",

  // Error
  error: "#b41340",
  errorContainer: "#f74b6d",
  errorDim: "#a70138",
  onError: "#ffefef",
  onErrorContainer: "#510017",

  // Surface hierarchy (used instead of borders per the "No-Line" rule)
  surface: "#faf4ff",
  surfaceBright: "#faf4ff",
  surfaceDim: "#d8ceff",
  surfaceContainer: "#ece4ff",
  surfaceContainerHigh: "#e6deff",
  surfaceContainerHighest: "#e1d8ff",
  surfaceContainerLow: "#f4eeff",
  surfaceContainerLowest: "#ffffff",
  surfaceVariant: "#e1d8ff",
  surfaceTint: "#4647d3",

  // On-surface / text
  onSurface: "#302950",
  onSurfaceVariant: "#5e5680",
  onBackground: "#302950",
  background: "#faf4ff",

  // Outline
  outline: "#79719d",
  outlineVariant: "#b0a7d6",

  // Inverse
  inverseSurface: "#0f072e",
  inverseOnSurface: "#a097c5",
  inversePrimary: "#8083ff",
} as const;

// ─── Typography ─────────────────────────────────────────────
// Inter font with fallback to sans-serif on the Web
const getFont = (baseFont: string) => {
  return Platform.select({
    web: `${baseFont}, sans-serif`,
    default: baseFont,
  }) as string;
};

export const FontFamily = {
  headline: getFont("Inter_700Bold"),
  headlineExtrabold: getFont("Inter_800ExtraBold"),
  headlineSemibold: getFont("Inter_600SemiBold"),
  headlineMedium: getFont("Inter_500Medium"),
  body: getFont("Inter_400Regular"),
  bodyMedium: getFont("Inter_500Medium"),
  bodySemibold: getFont("Inter_600SemiBold"),
  bodyBold: getFont("Inter_700Bold"),
  label: getFont("Inter_700Bold"),
} as const;

// ─── Font Sizes (following M3 type scale) ───────────────────
export const FontSize = {
  displayLg: 56, // Score reveals
  displayMd: 45,
  headlineLg: 32,
  headlineMd: 28, // Quiz questions
  headlineSm: 24,
  titleLg: 22,
  titleMd: 16,
  titleSm: 14,
  bodyLg: 16, // Answer choices
  bodyMd: 14,
  bodySm: 12,
  labelLg: 14,
  labelMd: 12,
  labelSm: 10, // Category tags, uppercase labels
} as const;

// ─── Spacing Scale ──────────────────────────────────────────
// The design system uses spacingScale: 3 → generous whitespace
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
  "6xl": 80,
} as const;

// ─── Border Radius ──────────────────────────────────────────
// Per design system: DEFAULT=1rem, lg=2rem, xl=3rem, full=9999
export const Radius = {
  sm: 8,
  md: 16, // 1rem
  lg: 24, // ~1.5rem (input fields)
  xl: 32, // 2rem (quiz cards)
  "2xl": 48, // 3rem (large image containers)
  full: 9999,
} as const;

// ─── Shadows ────────────────────────────────────────────────
// Per the design doc: no pure black shadows, use tinted on-surface
// "Ambient Shadows: 32px blur with 6% opacity"
export const Shadows = {
  /** Subtle card shadow — "Soft Lift" */
  card: {
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  /** Elevated floating elements */
  elevated: {
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 4,
  },
  /** Bottom nav / fixed elements */
  nav: {
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;
