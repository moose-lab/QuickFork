---
name: QuickFork
version: 2026.05.14
description: Launch-generation workspace for turning GitHub repositories into traceable multilingual marketing assets.

colors:
  primary: "#ef2cc1"
  on-primary: "#ffffff"
  background: "#ffffff"
  surface: "#ffffff"
  foreground: "#02020f"
  dark: "#010120"
  lavender: "#bdbbff"
  orange: "#fc4c02"

typography:
  heading:
    fontFamily: "\"The Future\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif"
    fontWeight: 760
    lineHeight: 0.96
    letterSpacing: 0
  body:
    fontFamily: "\"The Future\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Arial, sans-serif"
    fontWeight: 500
    lineHeight: 1.48
    letterSpacing: 0
  label:
    fontFamily: "\"PP Neue Montreal Mono\", \"SFMono-Regular\", \"IBM Plex Mono\", ui-monospace, Menlo, monospace"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: 0

spacing:
  base: 8px
  container: 1200px
  sectionY: 92px
  heroGap: 32px

rounded:
  control: 4px
  card: 8px
  media: 0px

components:
  hero:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.heading}"
  hero-copy:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
  control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
  media:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.media}"
  accent-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.dark}"
  accent-lavender:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.dark}"
  accent-orange:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.dark}"
---

## Overview

QuickFork is a working repo-to-infographic launch product surface, not a marketing brochure. The landing page should lead with the actual generation workflow: repository URL input, output options, and the generated infographic preview.

## Brand & Style

The interface is precise, editorial, and utilitarian. Use a white workspace, crisp borders, black product media, and small mono labels. Accent colors are reserved for product identity, output art, and state contrast.

## Colors

Use white surfaces with deep ink text. Magenta is the primary identity accent, lavender supports product artwork, and orange is reserved for sharp emphasis.

## Typography

All visible H1 and H2 headings use the same body sans stack, weight, line-height, and neutral letter spacing. Do not use drop caps, serif display type, decorative first-letter treatments, or mismatched heading families in the Hero and section headers.

Subtitle copy must be one clear sentence that states the product function. Avoid multi-claim product prose in the Hero.

## Layout

The Hero is a split two-panel layout. The left panel is product brand, concise copy, quick generation, and landing-page CTAs. The right panel is generated-result display only. Desktop ratio keeps the repo input compact and gives the infographic preview more room.

Hero right side is generated-result display only; product motion belongs in the demo section below the Hero.

The right visual stage combines generated infographic preview, compact format stack, and a simple repo-to-share pipeline. The visual stage uses a grid workbench instead of overlapping output panels on top of the generated result. Do not add decorative hero cards, badges, or explanatory chrome that competes with the actual product preview.

The Header brand descriptor is "Repo-to-social tools". Header navigation may include a compact Features dropdown because QuickFork will expand into more repo-to-SaaS tools. Header should not carry product or function CTAs; account CTAs are allowed. Product CTAs belong inside the landing sections where intent is clearer.

The compact SaaS direction uses Product Green (#178f74) only for active pipeline state. Keep the dominant workspace white, ink, and dark navy so the page reads as a precise developer tool instead of a one-note AI interface.

## Elevation & Depth

Use elevation for repeated cards and forms only. Hero media is flat and borderless. Input controls can use shallow shadows when they help separate the interactive surface from the page grid.

## Shapes

Controls use 4px radius. Repeated cards can use up to 8px radius. Hero media uses 0 radius.

## Components

The Hero includes:

- one H1
- one functional subtitle sentence about repo-to-infographic launch asset generation
- one compact output rail naming infographic, README, X/LinkedIn, and square card
- the project launch input panel
- one short placeholder line above the Generate package button: paste a repo and generate launch visuals
- a compact GitHub URL input paired with a short Generate package button
- preset language buttons where English is selected by default and Chinese/Japanese are optional
- a ratio dropdown aligned on the same row as language controls, offering 16:9, 1:1, 4:3, 3:4, and 9:16 with 4:3 selected by default
- one right-side generated result panel
- one compact CTA row inside the Hero, not in the Header
- one product animation demo section below the Hero

Hero generation quality is fixed to low by default and should not be exposed as a user-facing preset in this surface.

The Hero does not include product animation, decorative badges, quality selectors, or long explanatory labels. It may include one compact output rail when the labels clarify the repo-to-social value unit.

## Pricing

Pricing is a SaaS decision surface, not a decorative final CTA. The section presents three concrete repo-to-social options: a free single-repo scan, a repeat launch package, and a team review path for source-backed approval. Each plan must show the launch boundary, included review artifacts, and a direct next action.

The pricing layout uses the same crisp grid, mono labels, 4px controls, and restrained accent system as the rest of the landing page. The recommended plan may use the dark surface; the other plans remain white workspace cards.

## Do's and Don'ts

Do keep the generator visible in the first viewport.

Do preserve the 4:6 Hero split on desktop.

Do keep titles typographically consistent across H1 and H2.

Don't add a decorative outer shell to the animation panel.

Don't use verbose subtitle copy or multiple Hero copy blocks.
