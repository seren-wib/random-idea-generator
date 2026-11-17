#!/usr/bin/env node
// Draws random technologies from assets/techs.json and prints them as a Markdown table.
// Usage: node pick.mjs [-n N | --from "Category=count,..."] [--seed S] [--categories]

import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const DATA = fileURLToPath(new URL("../assets/techs.json", import.meta.url));
const DEFAULT_COUNT = 4;

export function loadTechs(path = DATA) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function categories(techs) {
  const counts = new Map();
  for (const t of techs) counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
  return [...counts].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
}

// mulberry32: small seeded PRNG so a seed always gives the same draw on any machine.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function positiveInt(value, what) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) throw new Error(`${what} must be a positive integer, got "${value}".`);
  return n;
}

function sample(list, n, random, label) {
  if (n > list.length) throw new Error(`${label} has only ${list.length} technologies, asked for ${n}.`);
  const pool = [...list];
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

// "AI/ML=1,Frontend=2" -> [["AI/ML", 1], ["Frontend", 2]], category names matched without regard to case.
export function parseFrom(spec, techs) {
  const names = categories(techs).map((c) => c.name);
  return spec.split(",").map((part) => {
    const [rawName, rawCount, extra] = part.split("=").map((s) => s.trim());
    if (!rawName || rawCount === undefined || extra !== undefined) {
      throw new Error(`Expected Category=count, got "${part.trim()}".`);
    }
    const name = names.find((c) => c.toLowerCase() === rawName.toLowerCase());
    if (!name) throw new Error(`Unknown category "${rawName}". Categories: ${names.join(", ")}.`);
    return [name, positiveInt(rawCount, `Count for ${name}`)];
  });
}

export function draw(techs, { n, from, seed } = {}) {
  const usedSeed = seed ?? Math.floor(Math.random() * 2 ** 31);
  const random = rng(usedSeed);
  let picked;
  if (from) {
    picked = from.flatMap(([cat, count]) => sample(techs.filter((t) => t.category === cat), count, random, cat));
  } else {
    picked = sample(techs, positiveInt(n ?? DEFAULT_COUNT, "Count"), random, "The list");
  }
  return { seed: usedSeed, picked };
}

const cell = (s) => String(s).replaceAll("|", "\\|");

export function toMarkdown({ seed, picked }) {
  const rows = picked.map((t) => `| ${[t.name, t.category, t.what, t.uses, t.hw ? "yes" : ""].map(cell).join(" | ")} |`);
  return [
    `Seed: ${seed} (repeat this draw with --seed ${seed})`,
    "",
    "| Name | Category | What it is | Typical uses | Hardware |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) throw new Error(`${arg} needs a value.`);
      return argv[++i];
    };
    if (arg === "-n" || arg === "--count") opts.n = next();
    else if (arg === "--from") opts.from = next();
    else if (arg === "--seed") opts.seed = next();
    else if (arg === "--categories") opts.categories = true;
    else if (arg === "-h" || arg === "--help") opts.help = true;
    else throw new Error(`Unknown option "${arg}". Run with --help.`);
  }
  return opts;
}

const HELP = `Usage: node pick.mjs [options]

  -n, --count N                 draw N technologies from the whole list (default ${DEFAULT_COUNT})
  --from "Category=count,..."   draw a count from each category, e.g. "AI/ML=1,Frontend=2"
  --seed S                      repeat an earlier draw
  --categories                  list the categories and how many technologies each has
  -h, --help                    show this help
`;

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return process.stdout.write(HELP);
  const techs = loadTechs();
  if (opts.categories) {
    const list = categories(techs);
    const width = Math.max(...list.map((c) => c.name.length));
    for (const c of list) process.stdout.write(`${c.name.padEnd(width)}  ${c.count}\n`);
    return process.stdout.write(`${"Total".padEnd(width)}  ${techs.length}\n`);
  }
  if (opts.n !== undefined && opts.from !== undefined) throw new Error("Use either -n or --from, not both.");
  const seed = opts.seed === undefined ? undefined : Number(opts.seed);
  if (seed !== undefined && !Number.isInteger(seed)) throw new Error(`Seed must be an integer, got "${opts.seed}".`);
  const from = opts.from === undefined ? undefined : parseFrom(opts.from, techs);
  process.stdout.write(toMarkdown(draw(techs, { n: opts.n, from, seed })));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  }
}
