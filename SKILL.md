---
name: pack-house-design
description: Use this skill to generate well-branded interfaces and assets for The Pack House, a Hanoi-based heritage bag / backpack / luggage maker — either for production code or throwaway prototypes, mocks, decks, social, and packaging concepts. Contains essential design guidelines, colors, type, fonts, logo assets, and a marketing-site UI kit.
user-invocable: true
---

# The Pack House — Design Skill

Read **`README.md`** first. It contains:
- Brand context and source materials
- Content fundamentals (voice, casing, copy samples)
- Visual foundations (palette, type, motion, cards, layout)
- Iconography rules
- The index of every file in this skill

Then explore:
- **`colors_and_type.css`** — all design tokens. Import this at the top of any new HTML you author.
- **`assets/logo/`** — primary mark, wordmark, monogram, seal, favicon (SVG, all use `currentColor`).
- **`preview/`** — small card-shaped reference renderings of every token group (colors, type, spacing, components, brand). Useful to lift styles from.
- **`ui_kits/marketing/`** — full hi-fi marketing-site recreation. `index.html` is the composed page; component files (`Nav.jsx`, `Hero.jsx`, `Featured.jsx`, etc.) are reusable building blocks.

## When the user invokes this skill

If they give you a clear brief (e.g. "make me a product page", "design the packaging insert"), proceed:
1. Copy `colors_and_type.css` (and any needed UI-kit components) into your working directory.
2. Build the artifact in static HTML or React, using the tokens.
3. Match the brand voice — quiet, declarative, physical. Sentence-case headlines. Letterspaced caps for eyebrows. No emoji.
4. Use real assets from `assets/logo/`; never hand-draw the wordmark.

If they invoke the skill without a brief, ask:
- What surface? (web page, social post, deck, packaging, in-store sign, app screen, …)
- What's the goal of the piece?
- Do they have product photos or should you use placeholder tonal gradients?
- English, Vietnamese, or both?

Then proceed as an expert designer for this brand. Output HTML artifacts for prototypes/mocks, or production-ready code if the user is shipping it.

## Things to never do

- Never use emoji
- Never use bluish-purple gradients
- Never use pure white (`#FFFFFF`) or pure black (`#000000`)
- Never use rounded corners > 12 px
- Never use animated entrances (fade-up-on-scroll, etc.)
- Never use letterspaced caps for body or headline copy — only for eyebrows / labels / taglines
- Never use title case for headlines — sentence case only
