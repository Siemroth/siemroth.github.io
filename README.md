# Website Modern

More substantially redesigned layout variant with cleaner academic typography and a research page that reads more like a compact publication list than a stack of large cards.

Static replacement for the Google Sites profile, prepared for GitHub Pages.

## Contents

- `index.html`: home page
- `research.html`: interactive publication archive with tag filters
- `policy.html`: policy-facing writing
- `media.html`: media coverage grouped by paper
- `teaching.html`: teaching and student guidance
- `assets/data.js`: site content and publication tags
- `assets/app.js`: rendering and filtering logic
- `assets/styles.css`: shared styling

## Local preview

From the `website` folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

1. Push the contents of `website/` into a GitHub repository.
2. In the repository settings, enable GitHub Pages.
3. Set the deployment source to the repository root or the branch that contains these files.

## Maintenance

Most content changes only require editing `assets/data.js`.
