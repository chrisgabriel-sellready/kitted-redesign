# KITTED redesign mockup

A static, responsive redesign of kittedgear.com. It uses the Kemp Beauty storefront layout with KITTED's own branding, fonts (Barlow Condensed and Inter), copy and media.

## Open it

Double-click `index.html`. Everything uses relative paths, so it also works from any static host or a local server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Pages (25)

| Page | File |
|---|---|
| Home | `index.html` |
| Sport landing pages | `baseball.html`, `softball.html`, `football.html` |
| Collections | `collections-spingrip.html`, `collections-baseball.html`, `collections-softball.html`, `collections-football.html` |
| Glove product pages | `product-spin-grip-baseball.html`, `product-spin-grip-softball.html`, `product-spin-grip-softball-pitcher.html`, `product-spin-grip-football.html` |
| Throwing formula product pages | `product-spingrips-exclusive-throwing-blueprint.html`, `product-spingrip-softball-throwing-formula.html`, `product-spingrip-football-throwing-formula.html` |
| Build your pack | `packs.html`, `packs-baseball.html`, `packs-softball.html`, `packs-football.html` |
| Guide | `guides-how-to-increase-pitching-velocity.html` |
| The Kollective | `roster.html` |
| Contact | `contact.html` |
| Policies | `returns.html`, `privacy.html`, `terms.html` |

## What works in the mockup

- Cart drawer with quantities, subtotal and a free-shipping meter ($100 threshold). Checkout is not connected.
- Product options (size, hand, softball position or pitcher) with validation and a sticky add-to-cart bar.
- Pack builder with 2/5/10-pack pricing at 10/15/20% off.
- Kollective sign-up with a jersey that prints the name and number as you type.
- Hero slideshow, carousels, tap-to-play videos, FAQ accordions, mobile menu.
- Forms show a confirmation message but do not send data anywhere.

## Notes

- Every image, logo and video comes from the live kittedgear.com site. Videos were re-encoded for the web (about 124 MB total, down from about 1 GB).
- Copy, prices, reviews and FAQs are taken from the live site.
- Images for an unreleased "Kommand" product (wrist weights and colourways) were found in the site's code but are not on any public page, so they were left out.
- Shared styles are in `assets/css/site.css` and behaviour is in `assets/js/site.js`.
