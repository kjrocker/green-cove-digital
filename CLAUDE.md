# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` - Development server at localhost:4321
- `pnpm build` - Build to ./dist/
- `pnpm preview` - Preview build locally

## Page Structure

Pages compose components rather than hand-rolling markup — see
[docs/components.md](docs/components.md) for the full reference and a
new-page template.

`BaseLayout` owns `<html>`/`<head>`/`<body>`/`<main>`/`<Footer>` and the CSS
imports. Inside it: `<Hero slot="header">` (the header and hero share one
`<Cove>` background, so Hero goes in the `header` slot, not the default one),
then `Section`, `SpotBand`, `Grid` and `Card` for the body.

Components emit only classes that already exist in `index.css` — prefer
composing existing utilities over adding new CSS.

## CSS Architecture

Three-layer system: reset.css → global.css → index.css

- **global.css** - Design tokens (custom properties), typography, element defaults
- **index.css** - Utility classes and component styles

All spacing, colors, and typography use CSS custom properties. Fluid typography and spacing with clamp() (e.g., `--size-step-0` through `--size-step-6`, `--space-s-m`).

**Utility classes:** `.flow` (vertical rhythm), `.grid` (responsive grid), `.wrapper` (max-width container), `.region` (section padding), `.card`, `.cluster` (horizontal layout)

**Spot colors:** `.spot-color-primary` or `.spot-color-secondary` override `--spot-color` for section backgrounds.

When styling: use existing custom properties, maintain fluid clamp() approach, scope page-specific styles to component `<style>` blocks.

## Documentation

Project notes, decisions, and known issues live in `docs/` in this repo. Kevin prefers in-repo documentation over Claude's memory directory — when something is worth remembering across sessions, write it to `docs/` (or here if it's an instruction for working in the repo) instead of saving a memory.
