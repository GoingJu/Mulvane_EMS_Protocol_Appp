# Changelog

All notable changes to **Mulvane EMS Protocols** are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and the project aims to follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- App icon, Android adaptive icon, and splash screen generated from the
  high-resolution Mulvane EMS logo.
- Store identity in `app.json`: iOS `bundleIdentifier` and Android `package`
  (`com.mulvaneems.protocols`), plus version/build numbers.
- EAS Build configuration (`eas.json`) with an internal-distribution `preview`
  profile, and `docs/DEPLOYMENT.md` — an internal distribution guide.

### Changed
- Home-screen logo replaced with the high-resolution badge.

### Fixed
- Metro bundling failure `Cannot find module 'babel-preset-expo'` — added
  `babel-preset-expo` as a dependency.
- Runtime TurboModule crash in Expo Go — pinned `react-native-worklets` to 0.5.1
  to match the version bundled in Expo Go SDK 54.

_Planned: in-protocol full-text search, favorites & recently-viewed, night/dark
mode, an "open already zoomed" option._

## [0.1.0] - 2026-06-11

First working version: a navigable, offline, pinch-zoomable reference for all
106 protocols, runnable on Android and iOS via Expo Go.

### Added
- Expo (React Native) app skeleton with state-based navigation:
  Home → Category → Protocol.
- Data model in `data/protocols.ts`: 5 categories (Practices, Triage/Transport,
  Procedures, Adult, Pediatric) and all **106 protocols** from the official table
  of contents, with category-prefixed unique IDs.
- Global search across every protocol, plus per-category filtering.
- **Official page images (Option A):** all 106 protocols mapped to their exact
  PDF page(s); 121 pages rendered to bundled JPEGs (150 DPI). Page numbering
  verified 1:1 against the PDF; section-divider pages excluded automatically.
- Full-screen page viewer with **pinch-to-zoom, drag-to-pan, and double-tap reset**
  (`react-native-gesture-handler` + `react-native-reanimated` v4), with Prev/Next
  for multi-page protocols.
- Official Mulvane EMS logo on the Home screen (extracted from the PDF cover).
- "Effective May 1, 2022 — verify current" safety disclaimer on every protocol.
- Reproducible content pipeline: `scripts/render_pages.py` +
  `scripts/protocol_start_pages.json` regenerate the page images, `data/pageMap.ts`,
  and `assets/pages/index.ts` from the source PDF.
- Project documentation: README and `docs/ARCHITECTURE.md` (Mermaid diagrams).

### Changed
- Downgraded Expo SDK 56 → 54 so the app runs in the public Expo Go app without a
  custom native build (aligned React 19.1.0 / React Native 0.81.5 via
  `expo install --fix`).
- Home-screen logo resized to a compact 90×58.
- Moved the source PDF into `source/`.

### Fixed
- Logo rendering at its full intrinsic size — switched from `width`+`aspectRatio`
  to explicit `width`/`height`, which lays out reliably in this React Native version.
- Recurring `git pull` aborts caused by a per-machine `package-lock.json` —
  the lockfile is no longer tracked (regenerated locally by `npm install`).

[Unreleased]: https://github.com/GoingJu/Mulvane_EMS_Protocol_Appp/compare/main...HEAD
