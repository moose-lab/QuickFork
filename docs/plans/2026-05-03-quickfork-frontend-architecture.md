# QuickFork Frontend Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merge the supplied landing-page UI/UX into QuickFork's React project as a componentized frontend architecture.

**Architecture:** Keep QuickFork as a Vite React app. Move page content into typed data, split the landing surface into reusable components, and preserve the existing launch-package generator as the product studio section inside the new landing flow.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, lucide-react, CSS modules by convention through `src/styles/app.css`.

### Task 1: Architecture Smoke Tests

**Files:**
- Modify: `/Users/moose/Documents/Codex/2026-04-30/files-mentioned-by-the-user-flashqla/QuickFork/src/App.test.tsx`

**Step 1: Write failing tests**

Add tests for:
- Sticky navigation with `QuickFork`, `Features`, `How to`, `Proof`, and `FAQ`.
- Hero headline `Turn a reference page into a launch-ready story.`
- Reference URL input seeded from the supplied HTML.
- Product studio still rendering `Localized launch package`, `Infographic prompt`, and model controls.
- FAQ keeps native disclosure behavior with at least one default-open item.

**Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because the current app does not yet include the landing navigation, hero copy, reference input, or FAQ architecture.

### Task 2: Component And Data Structure

**Files:**
- Create: `/Users/moose/Documents/Codex/2026-04-30/files-mentioned-by-the-user-flashqla/QuickFork/src/content/landing.ts`
- Create: `/Users/moose/Documents/Codex/2026-04-30/files-mentioned-by-the-user-flashqla/QuickFork/src/components/LandingPage.tsx`
- Modify: `/Users/moose/Documents/Codex/2026-04-30/files-mentioned-by-the-user-flashqla/QuickFork/src/App.tsx`

**Step 1: Implement minimal code**

Create typed arrays for nav links, feature cards, workflow steps, showcases, proof quotes, proof list items, FAQ items, and output chips. Build components for the landing page sections and keep generator state in the product studio.

**Step 2: Run tests**

Run: `npm test -- src/App.test.tsx`

Expected: PASS for the new architecture assertions.

### Task 3: Visual System Migration

**Files:**
- Modify: `/Users/moose/Documents/Codex/2026-04-30/files-mentioned-by-the-user-flashqla/QuickFork/src/styles/app.css`

**Step 1: Replace legacy dashboard CSS**

Move the supplied UI/UX into project CSS with stable design tokens:
- White editorial base, dark midnight panels, lavender/magenta/orange accents.
- 1200px container, 12-column sections, 4px radius, fine borders, light shadow.
- Responsive breakpoints at 960px and 640px.

**Step 2: Run build**

Run: `npm run build`

Expected: PASS with TypeScript and Vite build output.

### Task 4: Verification

**Files:**
- Inspect: `/Users/moose/Documents/Codex/2026-04-30/files-mentioned-by-the-user-flashqla/QuickFork/dist`

**Step 1: Run automated checks**

Run:
- `npm test`
- `npm run build`

**Step 2: Run browser check**

Start the dev server with `npm run dev -- --port 5173` and verify the page renders the landing flow, product studio, FAQ, and responsive layout without console errors.
