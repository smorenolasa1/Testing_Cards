# Business Cards NFC Demo

Static demo for a physical NFC card that opens a personalized digital business card on a phone.

## Files

- `index.html`: page markup and Open Graph metadata.
- `styles/imp_style.css`: active style used by the page right now.
- `styles/style-1.css`: saved version of Style 1.
- `styles/style-2.css`: alternate visual direction for client review.
- `scripts/card.js`: editable profile configuration, 3D/touch movement and Web Share API.
- `assets/business-card.vcf`: downloadable contact card.
- `assets/business-cards-logo.svg`: Business Cards logo.

## Edit Contact Data

Update the profile data in `scripts/card.js`. The visible card, links and share text are controlled from this block:

```js
const profile = {
  name: "Nombre Apellido",
  role: "Tu cargo o profesión",
  company: "Business Cards",
  tagline: "Tarjeta física NFC con perfil digital personalizado",
  location: "Madrid, España",
  linkedin: "https://www.linkedin.com/",
};
```

`assets/business-card.vcf` is included as the static contact download.

## Changing The Active Style

The page now loads only one stylesheet:

- `index.html` points to `styles/imp_style.css`.
- `styles/style-1.css` and `styles/style-2.css` are kept as alternates.

To switch styles later, replace `styles/imp_style.css` with whichever version you want active, or rename files so the chosen one becomes `imp_style.css`.

After publishing, replace the Open Graph image URL in `index.html` with the final absolute GitHub Pages URL for the strongest WhatsApp and LinkedIn previews.

## Publish With GitHub Pages

1. Push these files to the repository.
2. In GitHub, open Settings > Pages.
3. Choose the branch and root folder.
4. Save and wait for GitHub Pages to publish the site.
