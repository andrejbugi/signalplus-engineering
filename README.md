# Signal Plus Solutions — Website

Static one-page informational website for **Signal Plus Solutions**, a B2B SaaS product for elevator maintenance companies.

The goal of the website is to present the product professionally and clearly: helping companies **never miss monthly elevator maintenance** and **manage 500+ elevators easily** from one place.

## Project Structure

```text
signal-plus-website/
  index.html
  demo.html
  assets/
    css/
      style.css
    js/
      main.js
    i18n/
      mk.json
      en.json
    img/
      dark logo full.png
      dark logo.png
      light logo full.png
      light logo.png
      signalplus-designs.jpg
```

## Pages

### `index.html`
Main one-page landing website with Macedonian fallback content and dynamic Macedonian/English translations.

Includes:
- Hero section
- Product/service explanation
- Main benefits and modules
- About us section
- Contact form for purchase inquiries
- CTA buttons for **„Пробај го демото“ / “Try out the demo”** and **„Купи софтвер“ / “Buy software”**

### `demo.html`
Demo handoff page.

The actual demo app is available at:

```text
https://app.signalplus.click
```

## Design Direction

The website is designed as a modern, corporate and professional SaaS landing page for B2B clients.

Target clients:
- Elevator maintenance companies
- Companies managing a large number of elevators
- Service teams and operators

## Social Preview And Metadata

The main social sharing image is:

```text
assets/img/signalplus-designs.jpg
```

It is used directly as the Open Graph/Twitter preview image and as the product mockup in the about section.

Both `index.html` and `demo.html` include:
- Canonical URL
- Theme/app metadata
- Open Graph tags
- Twitter card tags
- Favicon and Apple touch icon links
- JSON-LD structured data with logo and image references

## Typography

Font used:

```text
Montserrat
```

Montserrat is used to keep the website clean, modern, professional, and easy to read.

## Color Palette

Primary color palette:

```text
#202C39 — Dark navy / main background and strong text
#283845 — Secondary dark blue / sections, cards, header accents
#B8B08D — Muted beige / calm professional accent
#F29559 — Orange accent / CTA buttons and highlights
#F2D492 — Soft yellow / secondary accent and warm highlights
```

Suggested usage:
- `#202C39` for main dark backgrounds and serious corporate tone
- `#283845` for secondary sections and visual depth
- `#F29559` for primary buttons and important actions
- `#F2D492` for softer highlights and supporting elements
- `#B8B08D` for neutral details, borders, or muted accents

## Language Support

The website supports:
- Macedonian (`assets/i18n/mk.json`)
- English (`assets/i18n/en.json`)

The HTML keeps Macedonian text as a readable fallback. JavaScript loads the selected translation file, applies content to elements marked with `data-i18n`, and stores the selected language in `localStorage` under:

```text
signalplus-language
```

To add or edit text:
1. Update the same key in both `assets/i18n/mk.json` and `assets/i18n/en.json`.
2. Add `data-i18n="path.to.key"` to visible text in HTML.
3. Use `data-i18n-placeholder`, `data-i18n-aria-label`, or `data-i18n-alt` for attributes.

Because translations are loaded from JSON with `fetch`, test the site through a local server instead of opening the HTML file directly:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## JavaScript

The JavaScript handles the theme switcher, language switcher, mobile navigation, and contact form behavior.

Currently:
- It loads Macedonian/English JSON translations
- It persists the selected language and theme
- It validates the form
- It posts purchase inquiries to `https://enquiries.signalplus.click/contact`
- It sends the form as `FormData` with the fields `name`, `company`, `email`, `phone`, and `message`
- After a successful request, it stores `signalplus-contact-sent-at` in `localStorage` and blocks another request from the same browser for 7 days

## Future Improvements

Possible next steps:
- Add more languages such as Albanian or Serbian
- Add animated product screenshots or dashboard mockups
- Expand the demo page
- Add pricing/packages section
- Add testimonials or client case studies
- Connect the website to the main SaaS application
