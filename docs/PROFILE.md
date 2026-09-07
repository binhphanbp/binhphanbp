# Profile maintenance

The public profile is `README.md`. Commit it together with `assets/`, `scripts/`, and `.github/`. Every displayed image is served from this repository. Rendering needs no external badge service, third-party stats image host, font download, or API key.

## Edit artwork and content

- Biography, project descriptions, links, and text alternatives: `README.md`.
- SVG design: `scripts/generate-assets.mjs` and shared primitives in `scripts/svg.mjs`.
- Regenerate design assets: `node scripts/generate-assets.mjs` (Node.js 20+; no npm dependencies).
- Hero, engineering mindset, technology grid, projects, and activity have mobile compositions selected by `<picture>` at 600px.
- The neon navy/cyan/violet artwork keeps its own dark background in both GitHub themes. The surrounding Markdown follows GitHub's theme.
- Decorative motion includes floating technology tiles, animated border traces, signal pulses, project illustrations, connection rings, and cycling typewriter copy. Every animated SVG respects `prefers-reduced-motion: reduce`; static content remains complete.
- The project UI drawings are conceptual illustrations, not screenshots or evidence of shipped features. Project descriptions state the verified scope.

## Technology logos

Twenty logos are vendored from [Devicon v2.17.0](https://github.com/devicons/devicon/tree/v2.17.0), pinned to commit `54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08`. Their MIT license is included at `assets/icons/LICENSE`.

Run `node scripts/vendor-icons.mjs` only to restore the original logo files. The SVG generator embeds them into each panel, so SVG images do not load nested remote resources. Express, Prisma, MySQL, and Jest receive contrast adjustments in the generated artwork; the original vendored files remain intact. Technology logos belong to their respective owners.

## GitHub activity

`node scripts/update-activity.mjs` fetches the [public contribution calendar](https://github.com/users/binhphanbp/contributions) and [public profile API](https://api.github.com/users/binhphanbp). It writes `assets/activity.json`, `assets/activity.svg`, and `assets/activity-mobile.svg` only after source validation and rendering succeed. Fetch/validation failures preserve the previous snapshot.

- Contribution totals and active days are calculated from the dated calendar cells.
- Best streak means consecutive active calendar days within the explicitly displayed period, not an all-time record.
- GitHub's headline summary may include the preceding partial week omitted from the visible calendar. This profile sums the visible cells and prints their exact date range, so its total can differ slightly from that headline.
- Desktop shows the available year; mobile shows its last 27 calendar weeks. The summary metrics cover the full printed period in both layouts.
- Public repository count comes from GitHub's user API; no private repository details are requested.
- Every card prints its snapshot update date. A native link opens GitHub's live activity.

`.github/workflows/profile-activity.yml` refreshes these three files daily at 01:17 UTC and on manual dispatch. It uses the repository's built-in `GITHUB_TOKEN` and requires Actions to have permission to write to the default branch. No personal token is needed. The workflow takes effect after publication to the default branch; it has not been run on GitHub from this local checkout. GitHub scheduling delays or inactivity policies can delay updates; the date on the card remains visible. Protected-branch policies may require adapting the commit step to your normal PR workflow.

## Content sources

Project information was checked against public repositories on September 6, 2026:

- [DevReady metadata](https://github.com/binhphanbp/devready/blob/main/src/app/layout.tsx), [features](https://github.com/binhphanbp/devready/blob/main/src/components/landing/FeaturesGrid.tsx), and [dependencies](https://github.com/binhphanbp/devready/blob/main/package.json).
- [StaffUp backend documentation](https://github.com/staffup-ai/staffup-lms-backend#readme) and [frontend dependencies](https://github.com/staffup-ai/staffup-lms-frontend/blob/main/package.json).
- [UpNext backend](https://github.com/upnext-works/upnext-be#readme), [frontend](https://github.com/upnext-works/upnext-frontend#readme), and [organization repositories](https://github.com/upnext-works).

UpNext is described as in development because its backend documents an architecture rebuild. No unverified seniority, team ownership, user counts, or impact metrics are claimed. Email and LinkedIn are preserved from the original profile. DevReady's previous homepage returned HTTP 404 and its metadata domain did not resolve, so only its source repository is linked.

## Art direction and illustration

The layered panels, neon dividers, and image-rich composition take inspiration from [HiradEmami's profile](https://github.com/HiradEmami/HiradEmami). Its artwork and code were not copied. The custom SVG panels are original to this profile.

The original 3D workstation illustration was generated using the built-in image generation tool and saved as `assets/developer-workspace.png`. The exact generation prompt is preserved in [ILLUSTRATION-PROMPT.md](./ILLUSTRATION-PROMPT.md).

## Publish and preview

The remote is `binhphanbp/binhphanbp`, the profile repository. Local changes do not update the live profile until committed and pushed.

Run `node scripts/preview.mjs` to open a preview server at `http://127.0.0.1:4178/`. The `/light` route previews the artwork on GitHub's light theme. Stop with Ctrl+C; restart after editing the README. SVG edits appear after refreshing the browser. Node.js 20+ is required; no npm install is needed.

The first run, or a README edit, requires network access to GitHub's Markdown API and the GitHub Markdown stylesheet. Later starts reuse cached HTML only when the README hash matches. `.preview/` is ignored by Git; all durable preview tooling is in `scripts/preview.mjs`.
