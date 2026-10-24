# Decision Labs Roadmap

Living plan for site improvements. Items are ordered by dependency and impact.

---

## German i18n (`de`)

A bilingual English/German site that feels native in both languages — not a bolt-on translation layer. English stays at the root URLs; German lives under `/de/` with localized slugs where it helps SEO and readability.

### Why now

- Operator is **SpacialDB UG**, Berlin — German prospects expect professional Deutsch on a consultancy site.
- **Impressum** and **Terms** are already German; the rest of the site is English-only, which creates an uneven experience.
- Core marketing pages are a manageable scope (~12 pages, 2 internal blog posts, 3 JSON data files).

### Design principles

| Principle | Approach |
|-----------|----------|
| **Preserve English URLs** | Keep `/`, `/about`, `/work`, etc. unchanged for existing links and SEO. |
| **Clean German URLs** | Prefix `/de/` and use readable German slugs (`/de/ueber-uns`, `/de/kontakt`, `/de/kunden`, `/de/projekte`). |
| **Native tone** | Formal **Sie** for B2B consulting copy; avoid Denglish except for established product names (Geobase, EarthGPT, Hugging Face). |
| **Minimal chrome** | Discrete **EN · DE** toggle in the header; no intrusive modal or geo-IP wall. |
| **Legal clarity** | Impressum and AGB remain authoritative German pages; English footer links to the same documents with clear labels. |
| **Static-first** | All locales pre-rendered at build time — no runtime CMS, consistent with current Gatsby architecture. |

### URL map

| English (default) | German | Notes |
|-------------------|--------|-------|
| `/` | `/de/` | Home |
| `/about` | `/de/ueber-uns` | Mission, process steps |
| `/work` | `/de/projekte` | Product portfolio |
| `/customers` | `/de/kunden` | Customer logos |
| `/contact` | `/de/kontakt` | Booking + social |
| `/blog` | `/de/blog` | Index UI in German; posts see blog strategy below |
| `/blog/{slug}` | `/de/blog/{slug}` | Only for posts with a `de` translation |
| `/newsletter` | `/de/newsletter` | Signup copy |
| `/feed` | `/de/feed` | Feed page chrome |
| `/impressum` | `/impressum` | Single canonical German legal page |
| `/terms` | `/terms` | Single canonical German legal page |

Blog posts without a German version stay English-only at `/blog/{slug}`; the German blog index can still list them with an “English” badge or omit them — decide in Phase 4.

---

### Phase 0 — Foundation (prerequisite)

**Goal:** One shared layout and i18n plumbing before translating copy.

- [x] **Extract `SiteLayout`** — Move duplicated header, nav, background-color logic, and `Footer` from every page into `src/components/SiteLayout.jsx`. Pages become content-only.
- [x] **Add i18n stack** — Locale pages are created in `gatsby-node.js` from `src/i18n/routes.js`. Copy lives in `src/i18n/locales/{en,de}`. No i18n plugin: slugs such as `/de/ueber-uns` do not match a same-slug prefix.
- [x] **Translation file structure**
  ```
  src/i18n/
    locales/
      en/
        common.json      # nav, footer, buttons, meta fallbacks
        home.json
        about.json
        ...
      de/
        common.json
        home.json
        about.json
        ...
  ```
- [x] **Locale context** — `useI18n()` plus `localeHref()` and `switchTarget()`. `/about` stays English; the German page is `/de/ueber-uns`.
- [x] **Language switcher** — Small `EN · DE` control in the header. It highlights the active locale and links to the matching page, or home when the page has no counterpart.
- [x] **Persist preference** — `localStorage` key `dl-locale`. `?lang=de` opens the German URL and stores the choice. English URLs stay English. A German `Accept-Language` on the first visit shows a one-line hint and does not redirect.
- [x] **HTML `lang` attribute** — `lang="en"` on English pages, `lang="de"` on `/de/` pages, set in `gatsby-ssr.js` and updated on route changes.

**Exit criteria:** Empty German pages render at `/de/*` with translated nav/footer; English site unchanged.

---

### Phase 1 — Core marketing pages

**Goal:** Full German experience on the pages that matter for conversion.

| Page | Key strings | Data sources |
|------|-------------|--------------|
| Home | Mission statement, “Featured”, category labels | `posts.json` titles/descriptions (see Phase 4) |
| About | Mission, 4-step process | Hardcoded JSX today → move to `about.json` |
| Work | Project cards | `projects.json` → add optional `titleDe`, `descriptionDe` fields |
| Customers | Intro copy, category labels | `customers.json` → add optional `categoryDe` |
| Contact | Headings, CTA labels | Hardcoded JSX |
| Newsletter | Signup copy | Hardcoded JSX |
| 404 | Message + link home | Hardcoded JSX |

- [x] Migrate hardcoded page copy from JSX into locale JSON files (keep JSX for structure only).
- [x] Translate all Phase 1 copy to German (professional, not machine-translated — human review required).
- [x] Update `Head` exports: localized `<title>`, `<meta name="description">`, Open Graph tags per page.
- [x] German footer labels: **Rechtliches**, **Kontakt**, **Folgen**, **AGB & Datenschutz**, **Termin buchen**.

**Exit criteria:** A German-speaking prospect can browse home → about → work → customers → contact without hitting English UI chrome.

---

### Phase 2 — SEO & discovery

**Goal:** Search engines and aggregators understand the bilingual structure.

- [x] **`hreflang` tags** on every localized page pair (`en`, `de`, `x-default` → English).
- [x] **Sitemap** — `scripts/generate-llm-files.js` lists each locale URL and its alternates.
- [x] **`robots.txt`** — No change needed; sitemap reference stays valid.
- [x] **Canonical URLs** — Each locale page canonicalizes to itself, not cross-locale.
- [x] **Structured data** — `Organization` JSON-LD with `availableLanguage: ["en", "de"]`.
- [ ] **RSS** — Keep primary feed English (`/rss.xml`); optionally add `/de/rss.xml` when German blog posts exist (Phase 4).

**Exit criteria:** Google Search Console shows hreflang without errors; sitemap lists all `/de/*` routes.

---

### Phase 3 — Legal & compliance alignment

**Goal:** Legal pages integrate cleanly with both locales without duplication.

- [x] **Impressum** — Remains at `/impressum` (German only). English nav label: “Legal notice (DE)”; German nav: “Impressum”.
- [x] **Terms** — Remains at `/terms` (German only). English nav: “Terms & Privacy (DE)”; German nav: “AGB & Datenschutz”.
- [ ] **Cookie / consent** — If a banner is added later, translate it; not blocking for launch.
- [x] **Formspree contact** — There is no contact form. The newsletter form uses German labels and validation text on `/de/newsletter`.

**Exit criteria:** Footer legal links are clear in both languages; no fake “English terms” page that duplicates German legal text.

---

### Phase 4 — Blog & dynamic content

**Goal:** Sensible bilingual content strategy without translating every external syndicated post.

**Tier A — Translate (high value, we own the copy)**

- Internal markdown posts in `src/blog/` — add optional frontmatter:
  ```yaml
  locale: en          # default
  translationOf: rethinking-roofs   # slug of EN counterpart
  titleDe: "..."
  ```
  Or separate files: `src/blog/de/rethinking-roofs.md`.

**Tier B — UI only (keep English content)**

- External posts in `posts.json` (WordPress, YouTube, partner blogs) — show original title/description; translate only category chips and “Read more” / “External link” chrome.

**Tier C — Do not translate**

- Third-party article titles, tweet embeds, podcast episodes — link out as-is.

- [ ] Decide Tier A scope (start with 0–2 flagship posts, not the full archive).
- [ ] German blog index at `/de/blog` with translated filter labels (Blog, Vortrag, Podcast, …).
- [ ] Blog post template: locale-aware date formatting (`de-DE`), “Zurück zum Blog” back link.

**Exit criteria:** Documented content policy; at least the blog index works in German even if most posts remain English.

---

### Phase 5 — Build pipeline & LLM files

**Goal:** Generated artifacts stay in sync with locales.

- [ ] **`scripts/generate-llm-files.js`** — Emit `/llm/de/*.md` mirrors for localized pages; update `llms.txt` index with language annotations.
- [ ] **`gatsby-config.js` `siteMetadata`** — Locale-aware defaults or per-page overrides.
- [ ] **CI check** — Script that fails build if a `de` JSON key is missing where `en` has one (optional, lightweight key parity test).

**Exit criteria:** `npm run generate:llm` produces German LLM markdown for all Phase 1 pages.

---

### Phase 6 — Polish & launch

**Goal:** Ship with confidence.

- [ ] **Visual QA** — German copy often runs longer; check nav wrap, card titles, footer columns on mobile.
- [ ] **Typography** — Verify hyphenation (`hyphens: auto; lang: de`) for long compound words in headings.
- [ ] **Accessibility** — `lang` on `<html>`, translated `aria-label`s (e.g. featured-post tab indicators).
- [ ] **Manual review** — Native German speaker review of all customer-facing copy (internal or external).
- [ ] **Analytics** — Track locale in page views (Plausible/GA custom dimension) to measure `/de/` adoption.
- [ ] **Announce** — LinkedIn post targeting DACH market; optional `/de/newsletter` signup mention.

**Exit criteria:** Production deploy with `/de/` live; no broken locale switcher links; Search Console hreflang validated.

---

### Technical notes (Gatsby 5)

Locale pages are created in `gatsby-node.js` from `src/i18n/routes.js`. `gatsby-plugin-react-i18next` was not used, because it keeps the English slug under `/de/` and this site uses German slugs.

**Out of scope for v1**

- Locales other than English, German, and French
- Runtime machine translation
- Localized external product sites (geobase.app, etc.)
- `design-system` page (internal/dev-only — English is fine)

---

### Effort estimate

| Phase | Effort | Can ship independently? |
|-------|--------|-------------------------|
| 0 Foundation | 2–3 days | No — blocks everything |
| 1 Core pages | 3–5 days + translation time | Yes — **minimum viable DE site** |
| 2 SEO | 1 day | Yes |
| 3 Legal | 0.5 day | Yes |
| 4 Blog | 1–3 days | Yes — defer Tier A translations |
| 5 LLM pipeline | 1 day | Yes |
| 6 Polish | 1–2 days | Yes |

**Suggested first release:** Phase 0 + 1 + 2 + 3 (~1–2 weeks engineering + translation review).

---

### Open decisions

Record choices here as they are made:

| # | Question | Options | Decision |
|---|----------|---------|----------|
| 1 | German URL slugs vs English slugs under `/de/` | Localized (`/de/ueber-uns`) vs `/de/about` | **Localized slugs** |
| 2 | Blog post file strategy | Frontmatter fields vs `src/blog/de/` folder | **TBD** |
| 3 | i18n library | `gatsby-plugin-react-i18next` vs custom `gatsby-node` | **Custom `gatsby-node` + JSON catalogs** |
| 4 | Default locale for unknown visitors | Always English vs `Accept-Language` hint | **English URLs. One-line hint on first visit, no redirect.** |
| 5 | Translate `posts.json` featured content on home? | Yes / No / Top 3 only | **Featured posts only.** Optional `titleDe` / `descriptionDe`. Other posts stay in the original language. |

---

## French (`fr`)

French is a language to add on the same system as German.

- [ ] French pages under `/fr/`, with readable French slugs where that helps.
- [ ] Language switcher reads **EN · DE · FR** and links to the matching page.
- [ ] Formal **vous** on the consulting pages. Keep product names as they are (Geobase, EarthGPT, Hugging Face).
- [ ] A person reviews the French copy before it goes live.
- [ ] Add `fr` to the locale list, `hreflang`, and the sitemap once the German plumbing from Phase 0 exists.

## Future (backlog)

Items not yet scoped in detail:

- [ ] Shared header component tests (locale switcher, active nav state)
- [ ] Performance budget check after i18n bundle additions
