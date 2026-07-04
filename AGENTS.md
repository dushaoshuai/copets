# Repository Guidelines

## Project Structure & Module Organization

This repository is a static Copets gallery. `index.html` contains the page markup, styles, and browser-side rendering logic. Pet source data lives in each pet directory as `pet.json` plus `spritesheet.webp`, for example `programming_languages/go-gopher/` or `shanhaijing/nanshanjing/xuangui-nanshanjing-shanhaijing/`. The generated `pets.json` file is the site data consumed by `index.html`. Automation scripts live in `scripts/`, currently `scripts/generate-pets.mjs`.

## Workflow

### Adding a pet

Create a pet directory with `pet.json` and `spritesheet.webp`, then regenerate the site data:

```sh
npm run generate:pets
```

The generated `pets.json` file is loaded by `index.html`. Do not manually edit the pet list inside `index.html`. Add or update per-pet `pet.json` files, then run `npm run generate:pets` so `pets.json` stays the single generated catalog.

## Coding Style & Naming Conventions

Use two-space indentation for HTML, CSS, JSON, and JavaScript. Keep JavaScript dependency-free unless a dependency clearly reduces complexity. Prefer modern Node ESM syntax in scripts (`import`, `.mjs`, `fs/promises`).

Pet directory names should be lowercase, hyphen-separated, and match the `id` in `pet.json`, such as `go-gopher` or `xuangui-nanshanjing-shanhaijing`. Keep `spritesheetPath` in `pet.json` relative to that pet directory, usually `spritesheet.webp`.
