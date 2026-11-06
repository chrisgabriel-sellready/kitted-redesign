# KITTED redesign: existing-store setup

This repository is the unpublished `kitted-redesign/main` Ride theme. Continue using KITTED's existing resources. Do not create new pages or publish the theme as part of setup.

## Existing navigation destinations

| Navigation | Existing URL | Theme template |
|---|---|---|
| Baseball | `/products/spingrip` | Default product |
| Softball | `/pages/spingrip-softball-is-here` | `page.softball-page` |
| Football | `/products/spin-grip-football` | `product.football` |
| The SpinGrip Effect / How to use | `/pages/how-to-use-spingrip` | `page.about` |
| The Kollective | `/#kollective` | Home-page sign-up section |
| Bulk orders | `/pages/team-orders` | Existing `page.team-orders` |
| Contact | `/pages/contact` | `page.new-contact` |
| Returns | `/pages/returns` | Shared `page.contact` |

The header remains editable through its blocks. The footer can use a selected Shopify menu or the corrected fallback links.

Baseball and Football retain their full sport landing designs on their existing product URLs. The buy boxes use the current product. The existing softball landing template receives the redesign. How To Use keeps its original founder tutorial/video alongside the SpinGrip Effect explanation. The training and returns template displays the page's own title/body; its training video is limited to the baseball training page. Default-page testimonial sections are limited to Testimonials, so Privacy Choices and other pages retain their own content.

## Existing product assignments to verify in Shopify

Changing a template file does not assign it to a product. Verify these existing products and their template suffixes before launch:

| Product | Template |
|---|---|
| SpinGrip Baseball | Default product |
| SpinGrip Softball | `product.softball` |
| SpinGrip Softball for Pitchers | `product.softball-pitcher` |
| SpinGrip Football | `product.football` |
| Baseball Pro-Level Throwing Formula | `product.formula-baseball` |
| Softball D-1 Throwing Formula | `product.formula-softball` |
| Football D-1 Throwing Formula | `product.formula-football` |

The extra standalone sport/pack page templates remain available for editing, but navigation does not depend on creating those pages.

## Launch blockers and review notes

- **Product assignments and visual QA:** Store pages were inspected in Shopify admin. Product assignments, final GitHub sync, mobile/desktop preview, cart behavior and the restored baseball training clip still require confirmation in the connected store. The browser disconnected during review.
- **Guarantee:** The existing `/pages/spingrip-1-2-3-guarantee` page is assigned `spingrip-1-2-3-guarantee`, which is absent from the original exported theme and this repo. Its page body is empty. Recover the approved content/template before linking or launching it; do not invent a policy.
- **Kollective:** The draft uses a Shopify customer/newsletter form. SMS consent copy and a phone field do not establish an SMS integration. The promised 10% code also needs an existing verified delivery flow. Review the consent and integration before launch; no new flows, discounts or subscriptions have been configured.
- **Pack builder:** The unlinked `page.packs` draft assumes automatic 10%/15%/20% discounts at 2/5/10 gloves. Those discounts have not been verified. Current navigation and promo links use the existing Bulk Orders inquiry page and preserve that workflow. Do not activate the builder or create discounts without approval.
- **Returns/guarantee claims:** Several retained draft sections say “30-day guarantee”, while the existing Returns page describes a 14-day return window. Confirm the approved distinction/copy before launch.
- **Media:** Videos reference KITTED's Shopify Files. Some testimonial tiles contain a still image rather than a playable video. Confirm missing clips in preview; do not substitute unrelated media.
- **Editor behavior:** Sections expose editable settings/blocks. Interactive behavior is initialized on a page load; after adding or replacing sections in the editor, refresh the preview before testing interactions.

## Completed code checks

- Theme Check: zero errors; 16 inherited warnings remain.
- Changed theme files pass the theme validator using its bundled schemas (the remote documentation refresh was unavailable).
- Thirty JSON templates checked for section references, section limits and block order; custom block names checked for uniqueness.
- Seven behavior checks passed: required selection, variant/quantity submission, digital labels, unavailable combinations, failed cart response, successful pack add and network failure.
- These are local checks. They do not replace Shopify sync or storefront visual/cart verification.

## Publishing is separate

KITTED's existing redirect to `kittedgear.com` is retained. It is skipped in design mode and on unpublished themes for preview. Publishing this theme alone will still redirect regular storefront visitors. A launch needs an approved domain/redirect plan and completed checks above.

Products, pricing, inventory, discounts, apps, consent settings and live theme publication have not been changed by this repo repair.
