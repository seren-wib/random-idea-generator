---
name: random-idea
description: Draws random technologies from a list of 2,763 (17 categories) and proposes project ideas that use every one of them. Use when the user asks for a random project idea, random tech stack, "pick some techs", or a draw by category such as "one AI/ML and one hardware".
---

# Random idea

Draw technologies with the script, then build project ideas around exactly what was drawn.

## 1. Draw with the script

Never pick technologies yourself. A model picking "at random" drifts toward familiar names; the script does not.

Run `scripts/pick.mjs` with Node 18 or later. Paths are relative to this skill's folder; it needs no install. The list it draws from is `assets/techs.json`; do not read that file into the conversation.

```
node scripts/pick.mjs [options]
```

| Option | Effect |
| --- | --- |
| (none) | 4 technologies from the whole list |
| `-n 6` | 6 technologies from the whole list |
| `--from "AI/ML=1,Hardware/Embedded=1,Frontend=2"` | a count per category |
| `--seed 1234` | repeat an earlier draw exactly |
| `--categories` | list the 17 categories with their sizes |

Map the user's words to options. "One AI and one hardware" becomes `--from "AI/ML=1,Hardware/Embedded=1"`. If a category name is unclear, run `--categories` and choose the closest one. If no count is given, use the default.

## 2. Show the draw

Paste the script's Markdown table (name, category, what it is, typical uses, hardware flag) and the seed it printed, unchanged, so the user can repeat the draw.

## 3. Propose three ideas

For each idea:

- a one-line name
- what it is, in two or three sentences
- where each drawn technology is used, with none left out
- the smallest version that can be built in a weekend
- the one part most likely to get stuck

## Rules

- Do not swap out a drawn technology because the combination is awkward. Make it fit; the awkward combinations are where unusual ideas come from.
- Draw again only when the user asks, with a new seed.
- Do not add technologies from outside the draw as core parts. Supporting pieces the build needs (a database, hosting) go in a separate "also needed" line.
- Answer in the language the user wrote in.
