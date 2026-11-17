# random-idea-generator

[**Quickstart**](#quickstart) | [**How it works**](#how-it-works) | [**Options**](#options) | [**Examples**](#examples) | [**FAQ**](#faq)

**random-idea** is a Claude skill that **draws random technologies from a list of 2,763 in 17 categories** and then **proposes project ideas that use every one of them**. A seeded script does the drawing, so the pick is actually random instead of drifting toward the names a model already likes, and any draw can be repeated. Node 18 or later, no dependencies, Windows, macOS and Linux.

![GitHub Repo stars](https://img.shields.io/github/stars/seren-wib/random-idea-generator?style=social)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](#updates)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Platforms](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](#requirements)

[![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-D97757.svg)](#quickstart)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contribution)

## Updates

- [2026/11/17] **v0.1.0, first release.** 2,763 technologies in 17 categories, draw by total count or per category, seeded repeats.

## Star History

<a href="https://star-history.com/#seren-wib/random-idea-generator&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=seren-wib/random-idea-generator&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=seren-wib/random-idea-generator&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=seren-wib/random-idea-generator&type=Date" />
  </picture>
</a>

## Table of Contents

- [Why](#why)
- [Quickstart](#quickstart)
- [How it works](#how-it-works)
- [Options](#options)
- [Categories](#categories)
- [Examples](#examples)
- [FAQ](#faq)
- [Contribution](#contribution)
- [License](#license)

## Why

- Asking a model for "a random tech stack" gives the same few names again and again: React, Docker, PostgreSQL.
- Side-project ideas tend to start from what you already know, so you rarely end up touching anything new.

random-idea fixes both:

- **A real random draw.** A seeded script picks from 2,763 technologies, from compilers to microcontrollers, so the draw does not lean toward popular names.
- **Draw by category.** Ask for "one AI/ML, one hardware, two frontend" and get exactly that mix.
- **Ideas that use everything drawn.** Claude has to fit every drawn technology into each idea, however odd the combination.

## Quickstart

### Requirements

- **Claude Code**
- **Node.js 18 or later** on your `PATH`

### 1. Add the marketplace

```bash
claude plugin marketplace add seren-wib/random-idea-generator
```

### 2. Install the plugin

```bash
claude plugin install random-idea@seren-wib
```

Then start a new Claude Code session, or run `/reload-plugins` in one that is already open.

> [!IMPORTANT]
> The skill runs `node`. If `node --version` fails in your terminal, Claude cannot draw.

### 3. Ask for an idea

```
Give me a random project idea with one AI/ML and one hardware technology
```

Claude runs the draw, shows the table and the seed, then proposes three ideas.

<details>
<summary><b>Codex or other agents</b></summary>

Copy the skill folder into your agent's skills folder:

```bash
git clone https://github.com/seren-wib/random-idea-generator
mkdir -p ~/.agents/skills && cp -r random-idea-generator/skills/random-idea ~/.agents/skills/
```

</details>

## How it works

1. You ask for an idea, optionally naming a count or categories.
2. Claude turns your words into options and runs `scripts/pick.mjs`.
3. The script reads `assets/techs.json`, draws with a seeded random generator, and prints a Markdown table plus the seed.
4. Claude proposes three ideas. Each one says where every drawn technology is used, the smallest weekend version, and the part most likely to get stuck.

A few details:

- **The list is never read into the conversation.** Only the drawn rows are, so a draw costs a few hundred tokens, not the whole 500 KB list.
- **Same seed, same draw.** The generator is mulberry32, so a seed gives the same result on any machine and Node version.
- **No swapping.** Claude is told not to replace a drawn technology because it seems awkward. Supporting pieces such as a database or hosting go in a separate "also needed" line.

## Options

You can also run the script yourself from `skills/random-idea`:

```bash
node scripts/pick.mjs [options]
```

- **`-n`, `--count N`**: draw N technologies from the whole list. Default 4.
- **`--from "Category=count,..."`**: draw a count from each category, for example `"AI/ML=1,Frontend=2"`. Category names are not case sensitive.
- **`--seed S`**: repeat an earlier draw.
- **`--categories`**: list the categories and their sizes.
- **`-h`, `--help`**: show the options.

`-n` and `--from` cannot be used together.

## Categories

| Category | Count | Category | Count |
| --- | ---: | --- | ---: |
| Build/Tooling | 407 | Algorithm/Theory | 136 |
| Infra/DevOps | 345 | Language | 90 |
| Data/DB | 258 | Mobile | 74 |
| Protocol/Standard | 221 | Game | 60 |
| Backend | 218 | Blockchain | 58 |
| Testing | 188 | Design | 46 |
| Architecture/Pattern | 167 | Hardware/Embedded | 44 |
| Frontend | 166 | | |
| AI/ML | 144 | | |
| Security | 141 | **Total** | **2,763** |

203 entries also carry a hardware flag, across categories (for example I2C under Protocol/Standard).

## Examples

<details>
<summary><b>One AI/ML, one hardware, two frontend</b></summary>

```bash
node scripts/pick.mjs --from "AI/ML=1,Hardware/Embedded=1,Frontend=2" --seed 7
```

Seed: 7 (repeat this draw with --seed 7)

| Name | Category | What it is | Typical uses | Hardware |
| --- | --- | --- | --- | --- |
| Adversarial Training | AI/ML | Method that adds attack examples to training to make a model more robust | model defense, robustness improvement |  |
| ATmega328P | Hardware/Embedded | 8-bit AVR MCU used in the Arduino Uno | learning basic embedded, simple control | yes |
| WebUSB | Frontend | API for accessing USB devices from the browser | web-based firmware flashers | yes |
| Relay | Frontend | Meta's GraphQL client | large-scale GraphQL apps |  |

</details>

<details>
<summary><b>Four from anywhere</b></summary>

```bash
node scripts/pick.mjs --seed 2026
```

Seed: 2026 (repeat this draw with --seed 2026)

| Name | Category | What it is | Typical uses | Hardware |
| --- | --- | --- | --- | --- |
| Kotlin Notebook | Data/DB | Kotlin notebook environment | data analysis, prototyping |  |
| GNU Make | Build/Tooling | Makefile-based build tool | C/C++ builds, automation |  |
| Datadog Incident Management | Infra/DevOps | Datadog incident response feature | incident response, on-call |  |
| Alibaba Cloud | Infra/DevOps | Alibaba's cloud platform | China-region services |  |

</details>

## FAQ

### 1. `Unknown category "..."`

The name after `--from` does not match a category. The error lists all 17. Run `--categories` to see them with their sizes:

```bash
node scripts/pick.mjs --categories
```

### 2. `... has only N technologies, asked for M.`

You asked for more than a category holds. Hardware/Embedded has 44 and Design has 46; lower the count.

### 3. Claude picked technologies without running the script

The skill was not loaded. Check that the plugin is installed and enabled under `/plugin`, then start a new session.

## Contribution

Reports of wrong descriptions, missing technologies or entries in the wrong category are welcome as issues or pull requests to `skills/random-idea/assets/techs.json`.

If random-idea got you building something you would not have picked yourself, a ⭐ helps other people find it.

## License

[MIT](LICENSE)
