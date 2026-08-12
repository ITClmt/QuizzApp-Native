---
name: QuizzApp — Playful Sky
description: White sticker-cards floating on a sky-blue gradient, with rounded display type and one violet that always means you.
colors:
  horizon-blue: "#BFE6FA"
  daylight-blue: "#EAF7FD"
  pale-sky: "#F7FCFF"
  cloud-white: "#FFFFFF"
  ink-navy: "#1F3A56"
  overcast-blue: "#4B6C87"
  storm-grey: "#5C7084"
  mist: "#E3EEF5"
  overcast-wash: "#EEF3F7"
  dusk-violet: "#7B5FBE"
  violet-haze: "#EDE7F9"
  violet-mist: "#C4B4E8"
  clear-sky-blue: "#4FA3D1"
  sky-tint: "#E4F2FA"
  meadow-green: "#8BC34A"
  meadow-tint: "#E8F3DC"
  meadow-ink: "#4C7423"
  sunset-coral: "#E4574C"
  coral-tint: "#FBE7E5"
  coral-ink: "#B23A31"
  ember-orange: "#F0932B"
  sunlight-gold: "#FFC94D"
  cloud-silver: "#D9E2E8"
  cloud-silver-ink: "#8CA0AE"
  sandstone-bronze: "#F6C89B"
  lagoon: "#3CBFAE"
  blossom-pink: "#E27DA0"
typography:
  display:
    fontFamily: "Baloo2_800ExtraBold, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: "56px"
    letterSpacing: "normal"
  headline:
    fontFamily: "Baloo2_800ExtraBold, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: "1.2"
    letterSpacing: "normal"
  title:
    fontFamily: "Baloo2_700Bold, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "1.3"
    letterSpacing: "normal"
  body:
    fontFamily: "Inter_400Regular, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "normal"
  label:
    fontFamily: "Inter_700Bold, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "1.2"
    letterSpacing: "1px"
rounded:
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "20px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "32px"
  3xl: "40px"
  4xl: "48px"
  5xl: "64px"
  6xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.dusk-violet}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.full}"
    padding: "16px 24px"
  button-secondary:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.full}"
    padding: "16px 24px"
  button-outlined:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.dusk-violet}"
    rounded: "{rounded.full}"
    padding: "16px 24px"
  input-field:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    padding: "16px 20px"
  input-error-message:
    textColor: "{colors.sunset-coral}"
    typography: "{typography.label}"
  card:
    backgroundColor: "{colors.cloud-white}"
    rounded: "{rounded.lg}"
    padding: "20px"
  answer-option:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    padding: "20px"
  answer-option-correct:
    backgroundColor: "{colors.meadow-tint}"
    textColor: "{colors.meadow-ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  answer-option-wrong:
    backgroundColor: "{colors.coral-tint}"
    textColor: "{colors.coral-ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  segment-active:
    backgroundColor: "{colors.dusk-violet}"
    textColor: "{colors.cloud-white}"
    rounded: "{rounded.xl}"
    height: "48px"
  segment-inactive:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.overcast-blue}"
    rounded: "{rounded.xl}"
    height: "48px"
  category-tile:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.md}"
    padding: "8px 4px"
    height: "62px"
    width: "31%"
  category-tile-locked:
    backgroundColor: "{colors.overcast-wash}"
    textColor: "{colors.storm-grey}"
    rounded: "{rounded.md}"
    padding: "8px 4px"
    height: "62px"
    width: "31%"
  level-badge:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.dusk-violet}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  leaderboard-row:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.ink-navy}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  leaderboard-row-self:
    backgroundColor: "{colors.violet-haze}"
    textColor: "{colors.dusk-violet}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  tab-icon-active:
    backgroundColor: "{colors.dusk-violet}"
    rounded: "{rounded.sm}"
    size: "40px"
---

# Design System: QuizzApp — Playful Sky

## Overview

**Creative North Star: "The Sticker Album"**

The screen is a page of sky-blue paper, and everything on it is a sticker: white, softly rounded, lifted just off the surface by a diffuse shadow. Nothing is inset, nothing is framed, nothing is a panel — every piece of content is a discrete little object laid onto the sky. The 48 monster avatars are the collectibles, and the whole progression system exists to fill the album, so the interface behaves like a page you add to rather than a dashboard you read.

The register is soft and reassuring. Corners never go below 10px, buttons are full pills, borders are a generous 2px, and press feedback is a gentle fade rather than a snap. Contrast at rest is deliberately low — sky against white against a soft navy ink — so that the moments that *do* raise their voice (a 48px score, a coral timer, a green correct answer) land without competition. The interface never scolds; even a wrong answer arrives as a soft coral wash, not an alarm.

Density is loose. Screens use a 24px margin, cards use 16–20px of internal padding, and vertical rhythm runs in 8/12/20/24px steps with real air between groups. This is a one-handed phone product, so the layout stays a single column, and every tappable thing is sized past the platform floor rather than relying on hit slop. The confirmed anti-reference is the dark neon gamer arcade: black canvases, neon glow, angular geometry and esports energy are the opposite of this world and must never creep in, however "game-like" a feature is.

**Key Characteristics:**
- One sky gradient canvas; every other surface is a white sticker-card
- Ambient soft shadow at rest, 2px borders for state
- Baloo 2 for anything that celebrates, Inter for anything that explains
- Violet means *you*; green/blue/coral mean difficulty and outcome
- Pills and rounded rectangles only — no sharp corner anywhere
- Low contrast at rest so that big numbers and state changes carry all the emphasis

## Colors

An atmospheric palette: a daylight sky canvas, deep navy ink, and a small set of saturated accents that each carry one fixed meaning.

### Primary
- **Dusk Violet** (`{colors.dusk-violet}`): The player's own colour. Primary CTA fill, active tab chip, active segment, XP bar terminus, score values, rank numbers, the avatar edit badge. One primary action per screen wears it.
- **Violet Haze** (`{colors.violet-haze}`): The "this row is you" wash — the self row on leaderboards, the level-up banner. Always paired with Dusk Violet text.
- **Violet Mist** (`{colors.violet-mist}`): Gradient partner only. Exists to give the Solo Play card its violet-to-lilac diagonal; never a fill on its own.

### Secondary
- **Clear-Sky Blue** (`{colors.clear-sky-blue}`): The "medium" difficulty colour, and the mid-band score colour (50–79% correct).
- **Sky Tint** (`{colors.sky-tint}`): The unfilled track behind the countdown ring.

### Tertiary
- **Lagoon** (`{colors.lagoon}`) and **Blossom Pink** (`{colors.blossom-pink}`): declared in the theme as reserve category accents, currently unused anywhere in the app. They are a sanctioned extension of the palette, not live tokens — introducing one is a design decision, not a bug fix.

### Neutral
- **Horizon Blue** (`{colors.horizon-blue}`): Top stop of the canvas gradient, and the flat fill behind the top bar so the bar reads as sky rather than as a header.
- **Daylight Blue** (`{colors.daylight-blue}`): Middle gradient stop and the app-wide fallback background — what shows behind a screen transition.
- **Pale Sky** (`{colors.pale-sky}`): Bottom gradient stop. Light pools at the bottom of every screen, which is where the primary action usually sits.
- **Cloud White** (`{colors.cloud-white}`): Every card, sheet, pill, input, and avatar backing. There is no second surface colour.
- **Ink Navy** (`{colors.ink-navy}`): Primary text, and the shadow colour for the whole system. Also the inverted fill for the personal rank banner.
- **Overcast Blue** (`{colors.overcast-blue}`): Secondary text — captions, XP counters, inactive segment labels, placeholder text.
- **Storm Grey** (`{colors.storm-grey}`): Tertiary text and inactive tab icons. The dimmest ink allowed on white; anything dimmer fails on this canvas.
- **Mist** (`{colors.mist}`): Default 2px border on inputs, answer options, difficulty pills, and the question progress track. The resting edge.
- **Overcast Wash** (`{colors.overcast-wash}`): Recessed fill — locked category tiles, progress-bar tracks, the compact segmented control track.

### Semantic
- **Meadow Green** (`{colors.meadow-green}`) / **Meadow Tint** (`{colors.meadow-tint}`) / **Meadow Ink** (`{colors.meadow-ink}`): Easy difficulty, correct answers, the start of the XP gradient, and the 80%+ score band.
- **Sunset Coral** (`{colors.sunset-coral}`) / **Coral Tint** (`{colors.coral-tint}`) / **Coral Ink** (`{colors.coral-ink}`): Hard difficulty, wrong answers, form errors, the offline banner, the urgent timer, and the sub-50% score band.
- **Ember Orange** (`{colors.ember-orange}`): The countdown ring at rest, and the bronze podium badge.

### Podium
- **Sunlight Gold** (`{colors.sunlight-gold}`), **Cloud Silver** (`{colors.cloud-silver}`) with **Cloud Silver Ink** (`{colors.cloud-silver-ink}`), **Sandstone Bronze** (`{colors.sandstone-bronze}`): The three medal rings. Used nowhere else; they earn their saturation by appearing once per screen at most.

### Named Rules

**The One Canvas Rule.** The sky gradient is the only background in the app. Every other surface is a white card sitting on it. Never introduce a second background colour, a tinted section, or a coloured page — if content needs separation, it becomes a card.

**The Self Rule.** Dusk Violet means *you and your progress*: your XP, your level, your rank, your score, and the one primary action you're being offered. Difficulty and outcome colours never borrow it, and it never appears as decoration.

**The Outcome Trio Rule.** Meadow Green, Clear-Sky Blue, and Sunset Coral are load-bearing: easy/medium/hard, and right/neutral/wrong. Never use any of the three for an unrelated accent, or the difficulty legend stops being learnable.

## Typography

**Display Font:** Baloo 2 (Bold 700, SemiBold 600, ExtraBold 800, Medium 500)
**Body Font:** Inter (Regular 400, Medium 500, SemiBold 600, Bold 700)

**Character:** Baloo 2 is round, heavy, and slightly cartoonish — it makes a number feel like an achievement rather than a measurement. Inter underneath keeps questions, answers, and labels neutral and fast to read under a running clock. The pairing is the whole personality in two faces: one that cheers, one that informs.

### Hierarchy
- **Display** (Baloo 2 ExtraBold 800, 48px / 56px, and a 38px step): Score reveal, total score, countdown digits. One per screen, never two.
- **Headline** (Baloo 2 ExtraBold 800, 24px; 21px and 19px steps): Screen titles, the quiz question (Baloo 2 Bold 700 at 21px / 28px line-height, centred), the profile username, score verdict.
- **Title** (Baloo 2 Bold 700 or Inter Bold 700, 18px / 15px / 13.5px): Card headings, difficulty values, leaderboard rank and score, button labels (Inter Bold at 15px).
- **Body** (Inter 400/500/600, 15px / 14px / 13px, 1.5 line-height): Answer options (SemiBold 600 at 15px), form fields, descriptive copy, error text.
- **Label** (Inter Bold 700, 12px / 11px / 10.5px, 1px letter-spacing, frequently uppercase): Section eyebrows, level badges, unlock levels, the timer's "seconds" unit, category tags.

### Named Rules

**The Two-Voice Rule.** Baloo 2 counts and celebrates; Inter explains. A number that represents an achievement is always Baloo 2. Running text, questions, answers, and form labels are always Inter. Never swap them for variety.

**The Ticking Number Rule.** Any figure that changes in place — the countdown above all — sets `fontVariant: ["tabular-nums"]` so it doesn't jitter as digits change.

**The 10.5 Floor Rule.** 10.5px is the smallest type in the system, reserved for uppercase letter-spaced labels. Never go below it, and never set a 10.5px label in sentence case — at that size the letter-spacing is what keeps it legible.

## Layout

Single column, phone-first, portrait only. Content is capped at 640px and centred (`GradientBackground`), which has no effect on a phone but stops the layout stretching on a tablet or unfolded foldable, where the app installs regardless of `supportsTablet: false`.

**Screen frame.** 24px outer padding on every screen. Vertical rhythm runs on the 4px scale, with 8px inside a group, 12–16px between siblings, and 24–32px between sections. Cards carry 16–20px of internal padding; a card is never tighter than 16px.

**Safe areas.** Screens draw edge-to-edge and pad with real insets rather than fixed values: the top bar adds `insets.top + 8px`, the offline banner adds `insets.bottom + 8px`, and screens declare the specific `SafeAreaView` edges they own. Nothing critical sits under a notch, gesture bar, or display cutout.

**Navigation frame.** A custom top bar (brand left, level badge + avatar right) sits on the gradient's top stop, and a floating bottom tab bar — 80px tall, absolutely positioned with 20px side insets — holds four icon-only destinations. Screens must leave bottom clearance for it; the home screen reserves roughly 72px.

**Grids.** The category picker is the one grid: three tiles per row at 31% width, 8px gutters, 62px minimum height, inside a 260px-max scroller so the primary action stays on screen without scrolling.

**Named Rule — The One Column Rule.** There is no multi-column layout in this system and no responsive re-flow; wider screens get a wider gradient and the same 640px column. Anything that wants a sidebar wants a different screen.

## Elevation & Depth

The system is built entirely on ambient lift. Every white card rests *above* the sky rather than sitting in it, with a wide, low-opacity navy shadow that reads as air rather than as a drop shadow. Depth is atmospheric, not hierarchical: the shadow is constant, and it does not respond to interaction.

### Shadow Vocabulary
- **Card** (`0 4px 16px rgba(31,58,86,0.06)`, Android elevation 2): The default. Every card, pill, badge, tile, input, and row.
- **Elevated** (`0 8px 24px rgba(31,58,86,0.08)`, elevation 4): Things that outrank the page — the score badge on results, the profile avatar, the "you" row on a leaderboard.
- **Nav** (`0 -4px 20px rgba(31,58,86,0.08)`, elevation 8): Upward-cast shadow for the floating tab bar only.
- **CTA glow** (`0 12px 24px rgba(123,95,190,0.20)`, elevation 8): The Solo Play card alone. The only tinted shadow in the system — violet, matching its own gradient.

### Named Rules

**The Ambient Float Rule.** Shadows are atmosphere, never feedback. A surface's shadow does not deepen on press, on selection, or on hover. If you're reaching for a shadow to communicate state, reach for the border instead.

**The Border Carries State Rule.** Selection and validity are always a 2px border colour change on an otherwise unchanged surface: Mist at rest, Dusk Violet when selected, Sunset Coral when invalid, Meadow Green when correct. The layout must not shift — the border is 2px in every state, including the resting one.

## Shapes

Rounded rectangles and pills, exclusively. The radius scale is meaning-bearing rather than decorative: 10px for small square-ish objects (the active tab chip, podium badges), 14px for tappable rectangles (answer options, inputs, category tiles), 18px for content cards (level card, leaderboard rows, the Solo Play card), 20px for the segmented control track, and full-round for anything that reads as a token — buttons, badges, avatars, XP pills, difficulty pills, progress tracks.

Component borders are 2px or nothing — 1px would read as a different, sharper system — with one exception at 3px for the results score badge and podium avatar rings, where the extra weight is the emphasis. Cards are never separated by a line; separation comes from the gap between them.

A 1px Mist rule exists, and it is a different object from a border: it runs the full width beneath a row of section headings (the profile tab switcher, the personal rank banner, settings rows) to close the group. It never wraps a component, and it never appears between cards.

Avatars are always circular, always backed by a padded white ring (2–5px), because the monster artwork is cut out and would otherwise touch the circle's edge.

**Named Rule — The No Sharp Corner Rule.** Nothing in this system has a corner below 10px, including nested elements. An inner radius is derived from its parent (track radius minus its padding), never set to zero.

## Components

Everything here is soft and reassuring: generously padded, gently rounded, and never sharp about failure.

### Buttons
- **Shape:** Full pill (`{rounded.full}`), 16px vertical / 24px horizontal padding, 2px transparent border so every variant occupies identical space.
- **Primary:** Dusk Violet fill, white Inter Bold 15px label, card shadow. One per screen.
- **Secondary:** White fill, Mist border, Ink Navy label, card shadow.
- **Outlined:** White fill, Dusk Violet border and label, no shadow — the quietest of the three.
- **Pressed:** Opacity drops to 0.8. Large surfaces (the Solo Play card) additionally scale to 0.95. No colour change, no shadow change.
- **Disabled:** Opacity 0.5 (the Solo Play card when offline).

### Chips
- **Difficulty pill:** Full-round, white fill, 2px Mist border, difficulty-coloured Inter Bold 13.5px label. Selected inverts — fill and border both take the difficulty colour and the label goes white. Tapping the selected pill clears it; selection is optional by design.
- **Level badge:** Full-round white pill, 12px/6px padding, Dusk Violet Inter Bold 10.5px label, card shadow.
- **XP pill:** Full-round white pill with Baloo 2 Bold 15px violet text — the results screen's "+N XP".

### Cards / Containers
- **Corner style:** 18px for content cards, 14px for tappable rectangles.
- **Background:** Cloud White, always. No tinted card.
- **Shadow strategy:** Card shadow at rest (see Elevation); Elevated only for the few surfaces that outrank the page.
- **Border:** None by default. A 2px border appears only to carry state.
- **Internal padding:** 16px (dense rows) or 20px (content cards).

### Inputs / Fields
- **Style:** White fill, 14px radius, 2px Mist border, 20px/16px padding, Inter Medium 15px, Overcast Blue placeholder. A 12px Inter Bold label sits 4px indented above the field.
- **Error:** Border switches to Sunset Coral and a 10.5px coral message appears below, announced politely to screen readers. The field does not shake, flash, or change fill.
- **Focus:** No focus treatment beyond the platform caret — this is a native app with no pointer focus model.

### Navigation
- **Top bar:** Brand wordmark in Baloo 2 Bold 18px on the left, level badge and avatar on the right, filled with the gradient's top stop so it reads as continuous sky. Not a card, no shadow, no border.
- **Bottom tabs:** Four icon-only destinations in a floating white bar (80px tall, 20px side insets, upward Nav shadow). The active icon sits inside a 40px Dusk Violet square with a 10px radius; inactive icons are Storm Grey. No labels — the icon chip is the entire active state.
- **Back:** A 36px circular white pressable in the screen header. The system back gesture is always honoured alongside it.

### Signature: The Countdown Ring
A 150px SVG ring, 12px stroke, rounded cap, starting at 12 o'clock and depleting clockwise over a Sky Tint track. Ember Orange at rest, Sunset Coral when urgent — and when urgent it also breathes, scaling 1.00→1.06→1.00 on a 400ms loop. The remaining seconds sit inside in 38px Baloo 2 ExtraBold with tabular figures, above a 10.5px uppercase unit label. Under Reduce Motion the pulse stops entirely while the colour shift remains, so urgency is never carried by motion alone.

### Signature: The Sticker Tile Grid
The category picker: three white 14px-radius tiles per row, centred bold 13px label that auto-shrinks to fit rather than wrapping, 2px transparent border that turns Dusk Violet when selected. Locked tiles swap to the Overcast Wash fill, drop their shadow entirely, and show a 12px lock glyph with the unlock level in Storm Grey — visibly present but unmistakably out of reach.

### Signature: The XP Bar
A 9px full-round track in Overcast Wash, filled by a left-to-right Meadow Green → Dusk Violet gradient. The gradient is the metaphor: progress starts as a correct answer and ends as you.

## Do's and Don'ts

### Do:
- **Do** put new content on a white card over the gradient. That single move keeps almost anything on-system.
- **Do** carry state on the 2px border and keep the shadow constant.
- **Do** set achievement numbers in Baloo 2 ExtraBold and running text in Inter.
- **Do** reserve Dusk Violet for the player's own progress and the one primary action per screen.
- **Do** size touch targets to a real 48dp/44pt minimum rather than relying on `hitSlop` — on Android hit slop is clipped by the parent's bounds.
- **Do** pair every motion cue with a non-motion one, and gate the motion behind `useReducedMotion`.
- **Do** pad avatar images inside a white ring; the artwork is cut out and touches its own edges.
- **Do** use gaps between cards for separation.

### Don't:
- **Don't** introduce a second background colour, a tinted section, or a coloured page. The sky is the only canvas.
- **Don't** drift toward the dark neon arcade — black canvases, neon glow, sharp angular geometry, esports energy. Confirmed anti-reference.
- **Don't** border a component at 1px — component borders are 2px. 1px is reserved for the full-width section rule, and cards are separated by space, never by a line.
- **Don't** deepen a shadow on press, selection, or hover.
- **Don't** spend Meadow Green, Clear-Sky Blue, or Sunset Coral on decoration — they are the difficulty and outcome legend.
- **Don't** let a corner go below 10px, or set an inner radius to zero.
- **Don't** put a second display-sized number on a screen that already has one.
- **Don't** treat Lagoon or Blossom Pink as live tokens; they are a declared reserve and using one is a deliberate palette decision.
- **Don't** design a hover state. This is a native phone app; press feedback is opacity 0.8, and scale 0.95 for large surfaces.
