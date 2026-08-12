# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

The app ships to both Android and iOS phones from one Expo/React Native codebase, but the
*design language is shared and brand-led* — Quizzly's own look on both platforms, not iOS
conventions on iOS and Material on Android. What adapts per OS is native behavior, not
appearance: system back gesture and predictive back, safe areas and edge-to-edge insets,
touch-target minimums, haptics. Android currently gets the deeper testing (adaptive icons,
monochrome icon, `predictiveBackGestureEnabled`, `edgeToEdgeEnabled` are all configured);
iOS must not regress. Phone only — `supportsTablet: false`.

## Users

Primary audience is **recruiters, hiring managers, and developer peers evaluating the author's
craft**: this is a portfolio project first. They arrive with limited time, often judging from a
short demo, a screen recording, or a few minutes in the running app, and they are looking for
evidence of end-to-end product thinking — not just working code.

The in-app persona the product is designed *for* is a casual trivia player on a phone, playing
short solo sessions to chase levels and leaderboard position. Design decisions must satisfy that
player convincingly, because the portfolio audience judges the product by how real it feels to
that player.

## Product Purpose

QuizzApp is a solo trivia game. A player starts a timed run, answers multiple-choice questions,
and converts correct answers into XP, levels, unlocked content, and leaderboard rank.

Success = the app reads as a finished, shippable consumer product rather than a tutorial
exercise: coherent visual system, real content, complete states, and no rough edges in the
paths a reviewer will actually walk (auth → home → pre-quiz → quiz → results → profile →
leaderboard).

## Positioning

The differentiator is completeness of the loop for a project of this size: a real harvested and
translated question pool, server-authoritative sessions and scoring, a derived level curve that
gates *both* categories and avatars, per-difficulty leaderboards plus a global XP board, and
full EN/FR parity — all wired end to end against the author's own NestJS API rather than mocked.
Progression is not a cosmetic score counter; leveling actually opens content.

## Operating Context

- **Device:** phone, portrait only, one-handed, light environments (light mode is locked).
- **Session shape:** short and time-pressured. A run is up to 50 questions in 1 minute 30 —
  the timer, not the question count, is what usually ends a game. Reading speed is part of the
  challenge, so question and answer legibility is a gameplay concern, not only an a11y one.
- **Return loop:** play → results reveal (score, XP, level-up, unlocks) → leaderboard or profile
  history → play again. The results screen is the emotional peak of the product.
- **Network:** always online against the API; offline is surfaced with a banner, and network
  failures are an expected state rather than an edge case.
- **Two apps:** this Expo client and `QuizzApp-Back/` (NestJS + Prisma + Postgres). The server
  owns all rules — sessions, scoring, XP, unlock eligibility. The client owns presentation and
  the bundled avatar images.

## Capabilities and Constraints

**Shipped**
- Email/password auth (JWT access + rotating refresh token, tokens in SecureStore).
- Solo quiz: optional difficulty filter (easy/medium/hard), optional category filter, timed run,
  per-question validation, cancel-with-confirmation, session expiry.
- Results: total score, per-difficulty breakdown, per-answer breakdown, XP earned, level-up,
  newly unlocked categories and avatars.
- Profile: total score, scores by difficulty, game history list with per-answer detail view,
  avatar picker.
- Leaderboards: per-difficulty ranking, global XP ranking, personal rank banner, podium.
- Settings: username/email display, EN↔FR language switch, logout.
- Full EN/FR parity, enforced by `pnpm i18n:check`.

**Constraints**
- Light mode only (`userInterfaceStyle: "light"`); no dark theme exists and none is committed.
- Portrait only, phone only.
- 24 curated categories mapped from OpenTriviaDB ids; category and avatar unlocks are derived
  from level, never persisted — content gating is a pure function of XP.
- Level display caps at 50; XP itself is uncapped and has no anti-grind rules yet (deliberate).
- Password change is **not supported** by the API; settings can change username, email, and
  language only.
- Usernames pass a server-side profanity/slur filter (EN + FR) and can be rejected on register.
- Question text comes from a harvested pool — length varies and cannot be art-directed. Layouts
  must survive long questions and long answer strings, in both languages (FR runs longer).

**Committed but not built**
- **Multiplayer / friends.** The backend already defines `Friendship`, `Game`, `GamePlayer`, and
  `GameQuestion` models, and Home already labels the existing mode "Solo Play" — a second mode is
  expected. Home, navigation, and any mode-entry design must leave room for it rather than
  assuming solo is the only path.

**Open decisions — do not silently resolve**
- **Product name.** The code's design system is titled "Quizzly" while everything shippable says
  "QuizzApp" (`app.json` name and slug, `com.itclmt.QuizzApp`, logo filenames). Undecided. Do not
  introduce either name into new user-facing copy, and do not rename identifiers, until the user
  picks one.

## Brand Commitments

- Existing name in all user-facing surfaces and store identifiers: **QuizzApp** (see open
  decision above before adding new naming).
- Incumbent visual system: "Playful Sky" in [constants/theme.ts](constants/theme.ts) — sky-blue
  gradient canvas, white cards, saturated candy accents (violet primary, blue, turquoise, green,
  coral), Baloo 2 for headings and numbers, Inter for body/UI. It is the single source of truth
  for tokens; new work reads from it rather than hardcoding values.
- Voice in shipped copy is short, warm, and encouraging, never scolding — including on failure
  ("Keep learning!", "Not bad!", "Time's up!"). Copy exists in EN and FR; any new string must
  ship in both.

## Evidence on Hand

- **Real content pipeline:** question pool harvested offline from OpenTriviaDB and translated to
  FR via DeepL, stored server-side; sessions snapshot the language at creation.
- **Art assets:** 48 bundled avatar PNGs — 23 free, 24 level-unlockable, 1 hidden/hand-granted
  (`Epic_Spacey`) — under `assets/images/profile_pics/`, plus logo and Android adaptive/monochrome
  icon assets under `assets/images/`.
- **Working API:** the full route surface documented in `QuizzApp-Back/CLAUDE.md`.
- **Absent — must not be fabricated:** no users, no downloads, no ratings, no reviews or
  testimonials, no retention or engagement metrics, no press, no pricing (the app is free and has
  no monetization), no store listing yet. Never invent social proof or numbers for this product.

## Product Principles

1. **The loop is the product.** Play → reveal → progress → play again. Work that strengthens the
   reveal and the sense of progression outranks work on peripheral screens.
2. **Progression must be visibly earned.** XP, levels, and unlocks are server truth; the interface
   should make that truth legible and satisfying, never decorative or faked.
3. **The clock is always running.** In-session, anything that costs a player reading or tapping
   time is a cost to their score. Clarity beats expression inside a run.
4. **Both languages, always.** EN and FR are equal citizens; a layout that only works in English
   is broken.
5. **Judged in a two-minute demo.** Every state a reviewer can reach — empty, loading, error,
   offline, first run — is part of the deliverable, not a follow-up.

## Accessibility & Inclusion

Bar: **native platform minimums**, not a formal WCAG commitment.
- Respect iOS and Android affordances: system/predictive back, safe areas and edge-to-edge
  insets, no trapped navigation.
- Touch targets meet platform minimums (44pt iOS / 48dp Android).
- Interactive controls carry accessible labels; decorative imagery does not.
No formal contrast-ratio or dynamic-type requirement has been established. Recent work already
raised tertiary-text contrast and target sizes — don't regress those, but treat further a11y
hardening as opt-in rather than an unstated standard.
