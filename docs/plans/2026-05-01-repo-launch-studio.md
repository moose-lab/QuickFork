# QuickFork Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a React + Node project that turns GitHub repository context into a fast overview, aligned multilingual launch copy, and infographic image prompts.

**Architecture:** Keep the core generation logic in pure TypeScript under `src/core` so it can be tested independently and reused by a future API route. The React UI calls that core locally for preview, shows model settings separately from secret management, and exposes output presets for README, PPT, and social media.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, lucide-react.

### Task 1: Core Pipeline Contract

**Files:**
- Create: `src/core/pipeline.test.ts`
- Create: `src/core/pipeline.ts`

**Steps:**
1. Write tests for GitHub URL parsing, aligned locale outputs, asset presets, and model settings validation.
2. Run `npm test` and verify missing implementation failure.
3. Implement minimal pure TypeScript functions.
4. Run `npm test` and verify all pipeline tests pass.

### Task 2: React Web App

**Files:**
- Create: `src/App.test.tsx`
- Create: `src/App.tsx`
- Create: `src/main.tsx`
- Create: `src/styles/app.css`

**Steps:**
1. Test for the workflow, model settings, and asset preset labels.
2. Run `npm test` and verify missing app failure.
3. Implement the app shell, input controls, output previews, and example gallery.
4. Run `npm test` and verify app tests pass.

### Task 3: Documentation and Examples

**Files:**
- Create: `README.md`
- Create: `.env.example`
- Add: `public/examples/*`

**Steps:**
1. Copy existing generated cover images into `public/examples`.
2. Document workflow, architecture, model settings, scripts, and deployment notes.
3. Run `npm run build` to verify production readiness.

### Task 4: Repository Packaging

**Files:**
- Create: `.gitignore`

**Steps:**
1. Initialize git repository.
2. Commit the complete project.
3. Use `gh repo create` to create a private GitHub repository when authentication is available.
