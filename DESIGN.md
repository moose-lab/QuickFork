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

QuickFork is a working product surface, not a marketing brochure. The landing page should lead with the actual generation workflow: repository URL input, output options, and the generated launch package preview.

## Brand & Style

The interface is precise, editorial, and utilitarian. Use a white workspace, crisp borders, black product media, and small mono labels. Accent colors are reserved for product identity, output art, and state contrast.

## Colors

Use white surfaces with deep ink text. Magenta is the primary identity accent, lavender supports product artwork, and orange is reserved for sharp emphasis.

## Typography

All visible H1 and H2 headings use the same body sans stack, weight, line-height, and neutral letter spacing. Do not use drop caps, serif display type, decorative first-letter treatments, or mismatched heading families in the Hero and section headers.

Subtitle copy must be one clear sentence that states the product function. Avoid multi-claim product prose in the Hero.

## Layout

The Hero is a split two-panel layout. The left panel is copy and input. The right panel is product animation. Desktop ratio is 4:6.

The right animation area is unframed. Do not add outer cards, padding, borders, shadows, rounded frames, badges, captions, or edge chrome around the media. Let the video itself define the visual boundary.

## Elevation & Depth

Use elevation for repeated cards and forms only. Hero media is flat and borderless. Input controls can use shallow shadows when they help separate the interactive surface from the page grid.

## Shapes

Controls use 4px radius. Repeated cards can use up to 8px radius. Hero media uses 0 radius.

## Components

The Hero includes:

- one H1
- one functional subtitle sentence about cold-start, README, social media, PPT, and product outreach outputs
- the project launch input panel
- preset language buttons for English, Chinese, and Japanese
- ratio cards that map mainstream platforms to their usual launch-card ratios
- one unframed product animation panel

Hero generation quality is fixed to low by default and should not be exposed as a user-facing preset in this surface.

The Hero does not include secondary CTA links, capability cards, feature chips, decorative badges, quality selectors, or explanatory labels around the animation.

## Do's and Don'ts

Do keep the generator visible in the first viewport.

Do preserve the 4:6 Hero split on desktop.

Do keep titles typographically consistent across H1 and H2.

Don't add a decorative outer shell to the animation panel.

Don't use verbose subtitle copy or multiple Hero copy blocks.
