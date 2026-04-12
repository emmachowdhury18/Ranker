# claude.md — Ranker Instructions

> **Purpose**: This file tells Claude Code how to work within the Ranker repo.  
> It summarizes the architecture, file/package structure, patterns, and best practices for a modern Next.js (App Router) TypeScript app.

---

## Quick facts (must not change unless explicitly requested)

- **Framework**: Next.js (App Router) + **TypeScript**  
- **Node**: v20.x, **npm** for package management
- **UI**: TailwindCSS, lucide-react icons.

---

## Repository layout

```
data/
  db.json     # hard coded DB of solutions
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    modals/Archive.tsx
    modals/EndOfGame.tsx
    modals/GameInstructions.tsx
    modals/Source.tsx
    ui/Button.tsx
    ui/DragPreview.tsx
    ui/Modal.tsx
    RankedItem.tsx
    Ranker.tsx
    ScrambledItem.tsx
  constants.ts        # fonts and drag type
  types.ts            # interfaces
.eslintrc.config.mjs
next.config.ts
postcss.config.mjs
README.md
tsconfig.json
```