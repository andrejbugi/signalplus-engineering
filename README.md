# Signal Plus Engineering — Website

Static one-page informational website for **Signal Plus Engineering**, a B2B SaaS product for elevator maintenance companies.

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
```

## Pages

### `index.html`
Main one-page landing website in Macedonian.

Includes:
- Hero section
- Product/service explanation
- Main benefits and modules
- About us section
- Contact form
- CTA buttons: **„Закажи демо“** and **„Пробај демо“**

### `demo.html`
Draft demo page.

For now, it is prepared as a **Coming Soon** page. Later it can be expanded into a real product preview or dashboard mockup.

## Design Direction

The website is designed as a modern, corporate and professional SaaS landing page for B2B clients.

Target clients:
- Elevator maintenance companies
- Companies managing a large number of elevators
- Service teams and operators

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

The current website content is in **Macedonian**.

The structure should remain extendable for future translations:
- English
- Albanian
- Serbian

Recommended future approach:
- Keep all text content separated in translation objects/files
- Add a language switcher in the header
- Load translated labels dynamically with JavaScript or later through the backend

## JavaScript

The contact form JavaScript is prepared only for frontend behavior.

Currently:
- It validates the form
- It prevents real submission
- It can later be connected to an API, email service, CRM, or backend endpoint

## Future Improvements

Possible next steps:
- Add real contact form submission
- Add multilingual support
- Add animated product screenshots or dashboard mockups
- Expand the demo page
- Add pricing/packages section
- Add testimonials or client case studies
- Connect the website to the main SaaS application
