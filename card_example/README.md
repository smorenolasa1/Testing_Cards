# Pablo Moreno Lasa Business Card

Static digital business card for Pablo Moreno Lasa at Evercore, ready to publish with GitHub Pages.

## Files

- `index.html`: page markup and Open Graph metadata.
- `styles/imp_style.css`: active style used by the page right now.
- `styles/style-1.css`: saved version of Style 1.
- `styles/style-2.css`: alternate visual direction for client review.
- `scripts/card.js`: editable profile configuration, 3D/touch movement and Web Share API.
- `assets/pablo-moreno.vcf`: downloadable contact card.
- `assets/evercore-seeklogo-2.svg`: Evercore logo. Add this file before publishing.

## Edit Contact Data

Update the profile data in `scripts/card.js`. The visible card, links and share text are controlled from this block:

```js
const profile = {
  name: "Pablo Moreno Lasa",
  role: "Investment Banking Analyst",
  company: "Evercore",
  tagline: "Utilities, Infrastructure & Transport M&A",
  location: "London, United Kingdom",
  linkedin: "https://www.linkedin.com/in/pablo-moreno-lasa-924890254/",
};
```

`assets/pablo-moreno.vcf` is included as the static contact download.

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
