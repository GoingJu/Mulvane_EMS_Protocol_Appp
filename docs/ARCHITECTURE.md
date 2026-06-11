# Mulvane EMS Protocols — App Architecture

A visual overview of how the app is put together. Diagrams use [Mermaid](https://mermaid.js.org/),
which GitHub renders automatically.

---

## 1. What the user sees (navigation flow)

```mermaid
flowchart TD
    Home["🏠 Home<br/>logo • search bar • 5 category cards"]

    Home -->|tap a category| Cat["📂 Category list<br/>protocols, grouped by section<br/>+ in-category filter"]
    Home -->|type in search| Results["🔎 Search results<br/>matches across all 106 protocols"]
    Results -->|tap a result| Prot
    Cat -->|tap a protocol| Prot["📄 Protocol<br/>official page(s) + safety disclaimer"]
    Prot -->|tap a page| Viewer["🔍 Page Viewer (full screen)<br/>pinch-zoom • drag-pan • double-tap reset<br/>Prev / Next for multi-page"]

    Viewer -->|close| Prot
    Prot -->|back| Cat
    Cat -->|back| Home

    subgraph Categories
      direction LR
      P[Practices] ~~~ T[Triage / Transport] ~~~ R[Procedures] ~~~ A[Adult] ~~~ Pe[Pediatric]
    end
```

---

## 2. How the code is organized (component architecture)

```mermaid
flowchart TB
    idx["index.ts<br/>(entry point)"] --> App["App.tsx<br/>state-based navigation<br/>GestureHandlerRootView"]

    App --> Home["screens/HomeScreen"]
    App --> Cat["screens/CategoryScreen"]
    App --> Prot["screens/ProtocolScreen"]

    Home --> SB["components/SearchBar"]
    Cat --> SB
    Prot --> PV["components/PageViewer<br/>(full-screen modal)"]
    PV --> ZI["components/ZoomableImage<br/>gesture-handler + reanimated"]

    subgraph Data["Data layer (no backend — all bundled)"]
      direction TB
      Protocols["data/protocols.ts<br/>5 categories • 106 protocols"]
      PageMap["data/pageMap.ts<br/>protocol id → PDF page #s"]
      Images["assets/pages/*.jpg<br/>121 rendered pages"]
    end

    Home --> Protocols
    Cat --> Protocols
    Prot --> Protocols
    Prot --> PageMap
    PV --> Images
```

---

## 3. How protocol content is built (offline content pipeline)

The app ships **fully offline** — every protocol is a faithful image of the official
PDF page, so it works with no signal in the field.

```mermaid
flowchart LR
    PDF[("source/<br/>Mulvane-EMS-Protocols.pdf<br/>136 pages")]
    Starts["scripts/<br/>protocol_start_pages.json<br/>(from the table of contents)"]
    Script["scripts/render_pages.py<br/>(PyMuPDF)"]

    PDF --> Script
    Starts --> Script
    Script -->|renders 150 DPI JPEGs| Imgs["assets/pages/*.jpg"]
    Script -->|generates| Map["data/pageMap.ts"]
    Script -->|generates| Idx["assets/pages/index.ts"]

    Imgs --> App["App reads images at runtime"]
    Map --> App
```

**To update content when the PDF changes:** drop the new PDF in `source/`, adjust
`scripts/protocol_start_pages.json` if the page numbers moved, then run
`python scripts/render_pages.py`. Section-divider pages are detected and excluded
automatically.

---

## Key design decisions

| Decision | Why |
|---|---|
| **Offline-first, content bundled in the app** | Crews are often in areas with no signal; nothing should depend on a network. |
| **Official page images, not re-typed text** | Zero transcription risk on doses/algorithms; some pages are image-only and can't be transcribed anyway. |
| **Expo (React Native)** | One codebase ships to both iOS and Android. |
| **State-based navigation (no router yet)** | Keeps the first version dependency-light; can move to Expo Router later. |
| **Expo SDK 54** | Matches the public Expo Go app so it runs without a custom native build. |

> ⚠️ **Clinical note:** the page images faithfully reproduce the protocols document
> (effective May 1, 2022). The app is a reference convenience, not a live-updated
> source of truth, and should be reviewed by medical direction before field use.
