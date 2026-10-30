# Figma UI Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reuse the Figma Design System in the Expo demo and implement only screens with an existing colored UI design.

**Architecture:** Local design tokens and a per-route theme preserve unfinished wireframe routes. Shared React Native components implement the Figma variants; image assets are local files, not screenshots of interactive controls.

**Tech Stack:** Expo SDK 58, Expo Router, React Native, expo-font, Playwright.

**Spec:** User request in this chat; read-only Figma file `7JWZGZEXkw23jfrd0NvgTS`, UI page `80:3397`, Design System `8:2`.

## Global Constraints

- Do not modify Figma, any page, or any tab.
- No invented UI for unfinished designs; preserve existing wireframes there.
- Demo credentials and registration accepting arbitrary fields remain unchanged. Only OTP `123456` succeeds; mask the registered phone prefix.
- Use Expo Router, local assets, and existing dependencies. No backend or deployment in this task.
- Run lint, typecheck, all E2E tests, web/native export and visual review.

## Review Focus

- A route transition must not recolor an unfinished wireframe through a global theme.
- OTP paste, digit replacement, deletion, errors and masking must work at 320px width.
- A font load error must allow the application to render with a fallback.
- Shared cards containing controls must avoid nested button semantics.
- New search must filter existing static content, handle empty results, and navigate to the selected skill.

## Task 1: Shared components and local assets

**Files:** Create `src/design-system/{tokens,theme,coverage}.ts(x)`, `src/components/brand.tsx`, `assets/fonts/*`, asset provenance documentation. Modify `src/components/ui.tsx` and route wrappers.

**Interfaces:** `DesignProvider({screen,children})`, `useDesign()`, `usePalette()`, `uiSources: Partial<Record<ScreenId,string>>`, `BrandLogo`, `StepProgress`, `OtpField`.

- [ ] Add meaningful OTP paste/delete/mobile regression before implementation and observe failure for missing six-box UI.
- [ ] Add exact observed neutral/primary colors, Capriola typography and button sizes 48/40/32. Load local font with fallback.
- [ ] Make shared button/input/card/header/progress/badge/avatar/tabs consume the route theme; retain existing wireframe defaults.
- [ ] Import real LifeLab wordmarks. Mark checkerboard artwork as unfinished source imagery.

## Task 2: Screens with supplied UI

**Files:** Modify `src/screens/{auth,home,skills,classes,profile}.tsx`, shared `content.tsx`, screen route inventory, tests.

**Interfaces:** Consume Task 1 components; add `skill-search` route to the existing dynamic router.

- [ ] Add failing search test: search by text/category, no results, then select a skill and return.
- [ ] Match auth layout: step bars, real logo, registration field order, six OTP boxes and inline confirmation. Preserve all auth behavior.
- [ ] Match Home/library cards, blue placeholders and labeled navigation. Add the search screen shown in UI node `511:8263`.
- [ ] Apply shared UI to supplied profile and class screens; retain gray notifications, class joining/tasks/settings/member-view/progress/leave routes.
- [ ] Visually compare representative screens at 390x844 and verify controls at 320x568.

## Task 3: Verification and inventory

**Files:** `docs/figma/ui-coverage.md`, `docs/verification.md`, `docs/preview/*`, tests.

- [ ] Run full E2E suite, lint, typecheck, web and native exports.
- [ ] Request independent read-only code review and resolve material findings.
- [ ] Record exact implemented source nodes and unfinished screens; leave all work locally reviewable.

## Execution notes

- Ruling: execute in the user-specified existing workspace; no new checkout, commit, push or publish is needed for this reversible local task.
- Figma MCP export quota exhausted after downloading the wordmarks and source placeholder. Remaining designs were inspected through the read-only guest browser; interactive components are implemented in code.
