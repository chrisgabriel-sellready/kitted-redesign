# KITTED redesign: existing-store setup

This repository is the unpublished `kitted-redesign/main` Ride theme. Continue using KITTED's existing resources. Do not create new pages or publish the theme as part of setup.

## Navigation and URLs (matches live kittedgear.com)

Shopify themes can only serve `/pages/…`, `/products/…` and `/collections/…`, so the live root URLs (`/baseball`, `/softball`, `/football`) become Shopify pages plus URL redirects.

| Navigation | Shopify URL | Theme template |
|---|---|---|
| Baseball | `/pages/baseball` | `page.baseball` (sport landing) |
| Softball | `/pages/softball` | `page.softball-page` (or `page.softball`, identical) |
| Football | `/pages/football` | `page.football` (sport landing) |
| Shop SpinGrip (all) | `/collections/all` | `collection` |
| Sport "Shop SpinGrip" buttons | `/collections/baseball`, `/collections/spingrip-softball`, `/collections/football` | `collection` |
| The SpinGrip Effect / How to use | `/pages/how-to-use-spingrip` | `page.about` |
| The Kollective | `/?view=kollective` | `index.kollective` |
| Bulk orders | `/pages/team-orders` | `page.team-orders` |
| Contact / Returns | `/pages/contact`, `/pages/returns` | `page.new-contact`, `page.contact` |

Clicking a product opens its product page (buy box, sizing and how-it-works accordions, reviews, athlete videos, FAQ, Kollective), as on live. Sport landing pages are separate pages; their Shop buttons open the sport collection. Collection pages use the live layout: back link, two cards per row, the SpinGrip Bundle card and the "Team up and save" banner.

Product links are plain `/products/<handle>`. Until a product is assigned its template in admin, the theme loads the right layout with `?view=` and then removes it from the address bar.

## Shopify admin steps (do by hand)

1. **Collections** (Products → Collections):
   - Create **SpinGrip Football**, manual, URL handle `football`, products: SpinGrip Football + SpinGrip Football's D-1 Throwing Formula. Online Store channel on.
   - Add **SpinGrip Softball's D-1 Throwing Formula** to the existing **SpinGrip Softball** collection (`spingrip-softball`).
2. **Pages** (Online Store → Pages):
   - Create **Baseball**, handle `baseball`, template `page.baseball`.
   - Create **Football**, handle `football`, template `page.football`.
   - Open the existing softball page, change its URL handle from `spingrip-softball-is-here` to `softball` and keep "Create a URL redirect" ticked. Template stays `page.softball-page`.
3. **Product templates** (each product → Theme template):

| Product | Template |
|---|---|
| SpinGrip Baseball (`spingrip`) | Default product |
| SpinGrip Softball | `softball` |
| SpinGrip Softball for Pitchers | `softball-pitcher` |
| SpinGrip Football | `football` |
| Baseball Pro-Level Throwing Formula | `formula-baseball` |
| Softball D-1 Throwing Formula | `formula-softball` |
| Football D-1 Throwing Formula | `formula-football` |

4. **URL redirects for the domain swap** (Online Store → Navigation → URL Redirects). Shopify only uses these when the path does not exist, so they are safe to add before the swap:

| Redirect from | Redirect to |
|---|---|
| `/baseball` | `/pages/baseball` |
| `/softball` | `/pages/softball` |
| `/football` | `/pages/football` |
| `/roster` | `/?view=kollective` |
| `/collections/spingrip` | `/collections/all` |
| `/collections/softball` | `/collections/spingrip-softball` |
| `/product/spingrip` and `/product/spin-grip-baseball` | `/products/spingrip` |
| `/product/spin-grip-softball` | `/products/spingrip-softball` |
| `/product/spin-grip-softball-pitcher` | `/products/spingrip-softball-pitcher` |
| `/product/spin-grip-football` | `/products/spin-grip-football` |
| `/product/spingrips-exclusive-throwing-blueprint` | `/products/spingrips-exclusive-throwing-blueprint` |
| `/product/spingrip-softball-throwing-formula` | `/products/spingrip-softballs-d-1-throwing-formula-150-value-instant-digital-access` |
| `/product/spingrip-football-throwing-formula` | `/products/spingrip-footballs-d-1-throwing-formula-150-value-instant-digital-access` |
| `/guides/how-to-increase-pitching-velocity` | `/pages/how-to-use-spingrip` |
| `/contact`, `/returns` | `/pages/contact`, `/pages/returns` |
| `/packs` | `/pages/team-orders` (until a pack page is approved) |
| `/privacy`, `/terms` | `/policies/privacy-policy`, `/policies/terms-of-service` |

## Launch blockers and review notes

- **Product assignments and visual QA:** Store pages were inspected in Shopify admin. Product assignments, final GitHub sync, mobile/desktop preview, cart behavior and the restored baseball training clip still require confirmation in the connected store. The browser disconnected during review.
- **Guarantee:** The existing `/pages/spingrip-1-2-3-guarantee` page is assigned `spingrip-1-2-3-guarantee`, which is absent from the original exported theme and this repo. Its page body is empty. Recover the approved content/template before linking or launching it; do not invent a policy.
- **Kollective:** The draft uses a Shopify customer/newsletter form. SMS consent copy and a phone field do not establish an SMS integration. The promised 10% code also needs an existing verified delivery flow. Review the consent and integration before launch; no new flows, discounts or subscriptions have been configured.
- **Pack discounts on collection pages:** The SpinGrip Bundle card and "Team up and save" banner copy live's "Save up to 20%" (2/5/10-pack). Both link to `/pages/team-orders` by default (editable in the collection grid section). Confirm the pack discounts exist in Shopify → Discounts before launch, or turn both off in the theme editor.
- **Pack builder:** The unlinked `page.packs` draft assumes automatic 10%/15%/20% discounts at 2/5/10 gloves. Those discounts have not been verified. Current navigation and promo links use the existing Bulk Orders inquiry page and preserve that workflow. Do not activate the builder or create discounts without approval.
- **Returns/guarantee claims:** Several retained draft sections say “30-day guarantee”, while the existing Returns page describes a 14-day return window. Confirm the approved distinction/copy before launch.
- **Media:** Sport heroes reuse the original clips currently served by `kittedgear.com`; editable video pickers can replace them with Shopify Files. Some testimonial tiles contain a still image rather than a playable video. Confirm missing clips in preview; do not substitute unrelated media.
- **Editor behavior:** Hero video playback initializes after editor section reloads, pauses offscreen and supports manual play/pause. Reduced-motion visitors see the poster until they choose Play video. Other interactions may need a preview refresh after a section is replaced.

## Completed code checks

- Theme Check: zero errors; 16 inherited warnings remain.
- Changed theme files pass the theme validator using its bundled schemas (the remote documentation refresh was unavailable).
- Thirty JSON templates checked for section references, section limits and block order; custom block names checked for uniqueness.
- Seven behavior checks passed: required selection, variant/quantity submission, digital labels, unavailable combinations, failed cart response, successful pack add and network failure.
- These are local checks. They do not replace Shopify sync or storefront visual/cart verification.

## Publishing is separate

KITTED's existing redirect to `kittedgear.com` is retained for `shop.kittedgear.com`. It is skipped in design mode, on unpublished themes, and when the store is already on `kittedgear.com`, so the theme cannot redirect to itself after the domain swap. A launch needs an approved domain/redirect plan and completed checks above.

Products, pricing, inventory, discounts, apps, consent settings and live theme publication have not been changed by this repo repair.

The standalone Kollective uses an alternate homepage template so the menu works without creating a new Shopify page record. Its white layout matches the live roster; embedded signup bands retain their existing layout. No product records, forms in marketing apps, consent settings or flows were created.
