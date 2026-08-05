import { Platform } from "react-native";

/**
 * Quizzly — "Playful Sky" Design System
 *
 * Single source of truth for every design token in the app.
 * Sky-blue gradient canvas, white cards, saturated candy accents.
 */

// ─── Color Palette ──────────────────────────────────────────
export const Colors = {
  // Sky gradient canvas (the only background — everything else is white cards)
  skyGradient: ["#BFE6FA", "#EAF7FD", "#F7FCFF"] as string[],
  background: "#EAF7FD",

  // Text
  onSurface: "#1F3A56", // primary text ("ink")
  onSurfaceVariant: "#4B6C87", // secondary text
  onBackground: "#1F3A56",
  outline: "#7C93A6", // muted/tertiary text
  outlineVariant: "#E3EEF5", // borders / dividers

  // Core brand — accent violet (XP, active states, primary CTA)
  primary: "#7B5FBE",
  primaryContainer: "#EDE7F9",
  primaryDim: "#5E48A0",
  onPrimary: "#FFFFFF",
  onPrimaryContainer: "#7B5FBE",

  // Secondary — accent blue (used for "medium" difficulty, secondary accents)
  secondary: "#4FA3D1",
  secondaryContainer: "#E4F2FA",
  secondaryDim: "#357FA8",
  onSecondary: "#FFFFFF",
  onSecondaryContainer: "#357FA8",

  // Tertiary — accent turquoise (extra category accent)
  tertiary: "#3CBFAE",
  tertiaryContainer: "#E1F5F2",
  tertiaryDim: "#2B9585",
  onTertiary: "#FFFFFF",
  onTertiaryContainer: "#2B9585",

  // Error (extension: not in the source spec's swatch list, tuned to sit
  // alongside the pastel accents for wrong-answer / destructive states)
  error: "#E4574C",
  errorContainer: "#FBE7E5",
  errorDim: "#B23A31",
  onError: "#FFFFFF",
  onErrorContainer: "#B23A31",

  // Success — accent green (correct answers, progress fill)
  success: "#8BC34A",
  successContainer: "#E8F3DC",
  successDim: "#5C8A2A",
  onSuccess: "#FFFFFF",
  onSuccessContainer: "#4C7423",

  // Surface hierarchy — flattened to "white card on sky" per the design rule:
  // max 1-2 background colors app-wide, everything else is a white surface.
  surface: "#FFFFFF",
  surfaceBright: "#FFFFFF",
  surfaceDim: "#E3EEF5",
  surfaceContainer: "#FFFFFF",
  surfaceContainerHigh: "#EEF3F7",
  surfaceContainerHighest: "#E3EEF5",
  surfaceContainerLow: "#FFFFFF",
  surfaceContainerLowest: "#FFFFFF",
  surfaceVariant: "#EEF3F7",
  surfaceTint: "#7B5FBE",

  // Inverse (dark navy "You" row on the leaderboard)
  inverseSurface: "#1F3A56",
  inverseOnSurface: "#FFFFFF",
  inversePrimary: "#C4B4E8",

  // Extra accents used for category icons / podium / timer
  accentPink: "#E27DA0",
  accentOrange: "#F0932B",
  gold: "#FFC94D",
  silver: "#D9E2E8",
  silverDim: "#8CA0AE",
  bronze: "#F6C89B",

  white: "#FFFFFF",
} as const;

// ─── Typography ─────────────────────────────────────────────
// Baloo 2 for headings/branding/big numbers, Inter for body/UI text.
const getFont = (baseFont: string) => {
  return Platform.select({
    web: `${baseFont}, sans-serif`,
    default: baseFont,
  }) as string;
};

export const FontFamily = {
  headline: getFont("Baloo2_700Bold"),
  headlineExtrabold: getFont("Baloo2_800ExtraBold"),
  headlineSemibold: getFont("Baloo2_600SemiBold"),
  headlineMedium: getFont("Baloo2_500Medium"),
  body: getFont("Inter_400Regular"),
  bodyMedium: getFont("Inter_500Medium"),
  bodySemibold: getFont("Inter_600SemiBold"),
  bodyBold: getFont("Inter_700Bold"),
  label: getFont("Inter_700Bold"),
} as const;

// ─── Font Sizes ──────────────────────────────────────────────
export const FontSize = {
  displayLg: 48, // Score reveals
  displayMd: 38,
  headlineLg: 24, // Screen titles
  headlineMd: 21, // Quiz questions
  headlineSm: 19,
  titleLg: 18,
  titleMd: 15,
  titleSm: 13.5,
  bodyLg: 15,
  bodyMd: 14,
  bodySm: 13,
  labelLg: 12,
  labelMd: 11,
  labelSm: 10.5, // Category tags, uppercase labels
} as const;

// ─── Spacing Scale ──────────────────────────────────────────
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
export const Radius = {
  sm: 10, // category icon
  md: 14, // answer cards, small buttons
  lg: 18, // primary cards (progress card, category card)
  xl: 20, // bottom nav pill, toggle pill
  "2xl": 24,
  full: 9999, // streak pill, avatars
} as const;

// ─── Shadows ────────────────────────────────────────────────
export const Shadows = {
  /** Subtle card shadow — "Soft Lift" */
  card: {
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  /** Elevated floating elements */
  elevated: {
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  /** Bottom nav / fixed elements */
  nav: {
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;
