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

## 3. Main menu (Online Store → Navigation → Main menu)
Baseball → /pages/baseball · Softball → /pages/softball · Football → /pages/football · Shop all → /collections/all (add the 4 gloves + 3 formulas as sub-items for the mega menu) · The SpinGrip Effect → /pages/the-spingrip-effect · The Kollective → /pages/kollective

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
