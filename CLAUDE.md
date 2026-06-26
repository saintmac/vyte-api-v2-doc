# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

This is the **Vyte API v2 documentation site** — a static site built with **VuePress v1**. There is no application code here; the deliverable is the documentation content under `docs/` plus a custom VuePress theme/components. Published to `developer.vyte.in`.

## Commands

```shell
npm run dev      # local dev server with hot reload (vuepress dev docs)
npm run build    # production build to docs/.vuepress/dist (vuepress build docs)
```

There is no test suite or linter wired into npm scripts. Markdown is linted by config in `.markdownlint.json` (relaxed — many rules disabled, `<html>` allowed via MD033). `deploy.sh` is a legacy manual-deploy script; do not run it (see Deployment).

Both `package-lock.json` and `yarn.lock` exist; CI uses **yarn** (`yarn && yarn build`).

## Architecture

- **Content** lives in `docs/` as Markdown. Two top-level sections, each with its own sidebar:
  - `docs/guides/` — task-oriented walkthroughs.
  - `docs/reference/` — per-resource API reference (users, teams, events, slots, webhooks, etc.).
- **Adding or reordering a page requires editing two places**: create the `.md` file, then register its slug in the matching `sidebar` array in `docs/.vuepress/config.js`. Pages not listed there won't appear in navigation. (Commented-out entries in that file are intentionally hidden pages.)
- `docs/README.md` is the homepage (VuePress `home: true` frontmatter); `docs/guides/README.md` and `docs/reference/README.md` are the section landing pages.
- The site uses a **custom theme** at `docs/.vuepress/theme/` that merely extends `@vuepress/theme-default` (`theme/index.js`), with an overridden `Home.vue` and `Layout.vue`.

## Documentation conventions (important)

Reference pages are written in Markdown but rely heavily on **custom Vue components** (globally registered from `docs/.vuepress/components/`) and **container plugins**. Match the existing pattern when editing reference docs — look at `docs/reference/users.md` as the canonical example.

- **Two-column layout** via `vuepress-plugin-container`: `::::: panel` wraps a `:::: left` (prose) and `:::: right` (endpoint list / code samples). Container types `left`, `right`, `panel` are defined in `config.js`.
- `<endpoints>` / `<endpoint method="get|post|put|delete" path="..." href="#anchor">` — renders the colored HTTP-method endpoint summary.
- `<attributes title="...">` / `<attribute name="..." type="..." required>` — documents object fields. Nested objects use `<attributes :isChild=true>` with `:parentNames="['account','organization']"` to render dotted paths like `account.organization.name`; mark the final nested attribute with `:isLast=true`.
- `<returns title="...">` — documents endpoint return values.
- Other components: `<AssetImage>`, `<Guides>` (reads `guides:` frontmatter on the section index), `<Button>`, `<IntercomButton>`.
- Reference pages set `pageClass: reference-page` in frontmatter to pick up reference-specific styles.

## Plugins & styling

- Plugins are configured in `docs/.vuepress/config.js`: code-copy, element-tabs, mermaidjs, export, reading-progress, medium-zoom, back-to-top, clean-urls, and **vuepress-intercom** (live chat, `appId: sqoiibtg`).
- Theme colors and breakpoints live in `docs/.vuepress/styles/palette.styl` (`$accentColor = #428FF0`). Per-page/global overrides in `styles/index.styl`.
- Static assets and favicons are under `docs/.vuepress/public/`.

## Deployment

Deployment is fully automated via GitHub Actions (`.github/workflows/main.yml`): any push/merge to **master** builds and force-pushes the output to the `gh-pages` branch of `saintmac/vyte-api-v2-doc`, served at the `developer.vyte.in` CNAME. There is no staging environment — merging to master publishes live.
