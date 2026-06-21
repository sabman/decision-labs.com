# Agent instructions: decision-labs.com

## Git remotes (keep in sync)

This repository is published to **two GitHub URLs** that must stay on the same commit:

| Remote | URL | Role |
|--------|-----|------|
| `origin` | `git@github.com:sabman/decision-labs.com.git` | Primary remote (fetch + push) |
| `decision-labs` | `git@github.com:decision-labs/decision-labs.com.git` | Mirror remote (push only) |

Both remotes point at the same `master` branch and deploy target (`gh-pages` via GitHub Actions).

### When pushing or deploying

After commits that should go live, push **`master` to both remotes**:

```bash
git push origin master
git push decision-labs master
```

Or in one step:

```bash
git push origin master && git push decision-labs master
```

### Verify remotes match

```bash
git ls-remote origin master
git ls-remote decision-labs master
```

The commit SHAs must be identical. If they diverge, push the latest `master` to whichever remote is behind.

### Do not

- Force-push `master` unless the user explicitly requests it
- Push to only one remote when the user asks to deploy or publish changes
- Change git user config or rewrite history without explicit approval

## Deploy

Production deploys via `.github/workflows/build.yml` on push to `master` on `origin` (build → `gh-pages` → https://decision-labs.com).

## Build

- Dev: `npm run dev`
- Production build: `npm run build` (also generates RSS, LLM files, optimized customer logos)
- LLM index: `npm run generate:llm` → `/llms.txt`, `/llm.txt`, `/llm/*.md`

## Writing style

When writing or editing copy for this site (blog posts, page text, descriptions, meta tags):

- **No em dashes.** Do not use `—` or `--` as punctuation. Use commas, colons, periods, parentheses, or restructure the sentence instead.
- **Plain English.** Write clearly and directly. Prefer short sentences and common words over jargon or ornate phrasing.
- **No superlatives.** Avoid words like "best", "leading", "world-class", "cutting-edge", "revolutionary", and similar.
- **No marketing tone.** Do not write like a landing page or press release. State what something is and what it does; skip hype, filler, and inflated claims.
- **No sleazy overclaims.** Do not promise outcomes you cannot support, exaggerate impact, or use urgency tricks ("don't miss out", "game-changing", etc.).

Match the tone of existing posts in `src/blog/` unless the user asks for something different.
