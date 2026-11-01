# Figma Design System assets

Source: https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS/?node-id=8-2

Button specification: component set `131:7079`, default/primary `131:6889`, pressed `131:6867`, disabled `131:6869`, secondary `131:6879`; corresponding 40/32 px variants in the same set. Implemented as native HTML buttons in `design-buttons.css`, reusing existing behavior and classes.

- Primary: `#70baf0`, lower inset edge `#0f63a9`; pressed `#0f63a9` with edge `#03355f`.
- Secondary: `#f8fcff` with outline/inset edge `#0f63a9`.
- Disabled: `#e2e2e2`, text/edge `#82878c`.
- 48 px: radius 10 px, 18/26 px text; 40 px: radius 8 px, 16/24 px; 32 px: radius 8 px, 12/18 px.
- Font: Capriola, downloaded from Google Fonts, license in `OFL.txt`. Figma's semibold/bold weights are synthesized from Capriola's regular face.

Original SVG icons downloaded from Figma without modification, each 24 × 24:

| File | Figma node | Usage |
| --- | --- | --- |
| pause.svg | 78:2461 | Game pause; lesson pause |
| volume.svg | 78:2513 | Sound enabled |
| mute.svg | 78:2504 | Sound disabled |
| book.svg | 78:2524 | Notebook |
| hint.svg | 78:2510 | Hint |
| back.svg | 78:2494 | Back to skills |
| retry.svg | 78:2507 | Replay lesson |
| play.svg | 78:2488 | Resume lesson |

No temporary Figma download URLs are used by the app. Reference screenshots in `tests/` are for visual verification only and are not runtime assets.

`flame.svg` is a separate native SVG redrawn from the user's flame reference for the hazard counter; it is not an exported Figma icon. The compact pause button is circular and reuses the blue button colors.

`pause-bold.svg` has the two thicker white bars requested in the updated reference. `notebook-blue.webp` is the user's book recolored with built-in imagegen and exported as a small transparent WebP; the exact prompt and provenance are in `notebook-blue.md`. These two assets are not Figma exports.
