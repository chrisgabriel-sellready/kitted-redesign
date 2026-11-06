# KITTED redesign: Shopify setup

This is KITTED's Ride theme with the redesign built in. Upload it as a new theme (Online Store → Themes → Add theme → Upload zip). It installs unpublished, so the live store doesn't change until you click Publish.

## 1. Create these pages (Online Store → Pages) and pick the template
| Page title | URL handle | Template |
|---|---|---|
| Baseball | baseball | page.baseball |
| Softball | softball | page.softball |
| Football | football | page.football |
| Build your pack | packs | page.packs |
| The KITTED Kollective | kollective | page.kollective |
| The SpinGrip Effect | the-spingrip-effect | page.the-spingrip-effect |
| Contact (already exists) | contact | page.contact (already assigned) |

## 2. Assign product templates (Products → product → Theme template)
| Product | Template |
|---|---|
| SpinGrip Baseball | Default product |
| SpinGrip Softball | product.softball |
| SpinGrip Softball for Pitchers | product.softball-pitcher |
| SpinGrip Football | product.football |
| Baseball Pro-Level Throwing Formula | product.formula-baseball |
| Softball D-1 Throwing Formula | product.formula-softball |
| Football D-1 Throwing Formula | product.formula-football |

## 3. Menu
The top menu is the mockup's menu, built into the **KITTED header** section (Theme editor → Header). It doesn't use Shopify's Navigation menus, so "Bulk orders / How to use" from the old menu won't show. Add, remove, rename or reorder links there. "Shop all" is a dropdown block: pick its products and up to 3 extra links.

## Editing in Shopify (like Kemp Beauty)
Every section is editable in the theme editor (Online Store → Themes → Customize):
- Text: headings, paragraphs, quotes, names and button labels are fields.
- Images: each has an image picker. Until you pick one, the built-in image from the redesign shows.
- Videos: each has a Shopify video picker (pre-set to KITTED's original file where one exists) plus a URL fallback.
- Repeating items (video cards, FAQs, reviews, logos, steps, stats, tiles) are blocks: add, remove, reorder.
- Every KITTED section is also available under "Add section", so you can reuse it on any page.

## 4. Pack discount
The pack builder and product pages promise 10% off 2+ gloves, 15% off 5+, 20% off 10+. Shopify applies only what you set up under Discounts, so create that volume discount (or an app/Function for tiers) so checkout matches.

## 5. Media
Everything comes from KITTED's own Shopify or is packed inside this theme. Nothing loads from GitHub.
- Videos play KITTED's original Shopify videos (the same files the current theme uses): Wow Factor, Eric De La Rosa, Cody Freeman, Chips, Micah Kendrick, 11U coach, Alabama commit, D1 bullpen, What is SpinGrip, softball founder, Gold Glover, How to put on SpinGrip Softball, and the baseball and softball hero videos.
- Clips that aren't in Shopify show their photo frame with the quote. To make one play, upload the clip to Content → Files and swap it in.
- Product photos, prices and variants come live from Shopify. Section photos (logos, athletes, Chips) are in the theme's assets as kg-*.

## 6. The kittedgear.com redirect (decide before publishing)
KITTED's current theme sends every store page (except cart, checkout, account and apps) to kittedgear.com. This theme keeps that script, but skips it in the theme editor and on unpublished themes so you can preview the redesign. If you publish this theme and want shoppers to see it, remove the script at the top of layout/theme.liquid.

## Notes
- Product photos, prices, variants and stock all come live from Shopify.
- Kollective sign-ups create Shopify customers subscribed to email, tagged `kollective` and `jersey-NN`. Connect the mobile/SMS part to your SMS app (e.g. Klaviyo or Postscript) if you use one.
- Fonts: Barlow Condensed + Inter (KITTED brand) load from Google Fonts across the whole theme.
