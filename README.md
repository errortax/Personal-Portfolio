# Portfolio Website — Quick Starter

This repository contains a static, single-page portfolio/resume scaffold you can customize.

Files added
- `index.html` — main single-page portfolio.
- `assets/css/styles.css` — styles with light/dark theme variables and responsive layout.
- `assets/js/main.js` — small scripts: theme toggle + smooth scroll.

How to use
1. Open `index.html` in your browser (double-click or use a small static server).

PowerShell quick preview (serves current folder on port 8000):
```powershell
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

What to edit
- Replace the placeholder text in `index.html` (name, experience entries, projects, contact).
-- Replace the avatar by placing an image at `assets/img/profile.jpg` or use the "Upload photo" control in the left panel while previewing the site. (Note: this repo currently stores images under `images/` and the profile image `tasmiia.jpg` is at the repo root.)
- Update color tokens in `assets/css/styles.css` if you want different brand colors.

Photo & LinkedIn
- Upload your profile photo using the left-panel "Upload photo" button while previewing the site. Alternatively, place the image at `assets/img/profile.jpg`.

Organizing images
-----------------
This repository currently keeps visual assets inside the top-level `images/` folder (and the profile image `tasmiia.jpg` is at the repo root). If you prefer to put all site images under `assets/img/` (recommended for tidy structure), you can move them locally and update references.

PowerShell example to move image files locally from the repo root into `assets/img/` (run from project root):
```powershell
mkdir -Force assets\img
Move-Item images\* assets\img\
Move-Item tasmiia.jpg assets\img\
```

Quick path-replace across HTML files (PowerShell):
```powershell
Get-ChildItem -Path . -Filter *.html -Recurse | ForEach-Object {
	(Get-Content $_.FullName) -replace '/images/', '/assets/img/' | Set-Content $_.FullName
}
# If profile image is referenced as "tasmiia.jpg" (root), replace with new path:
Get-ChildItem -Path . -Filter *.html -Recurse | ForEach-Object {
	(Get-Content $_.FullName) -replace 'tasmiia.jpg', 'assets/img/tasmiia.jpg' | Set-Content $_.FullName
}
```

Note: I cannot move binary image files for you from this environment — run the above commands locally to reorganize files and update references. After you run them, open the site locally (`python -m http.server 8000`) to verify images load correctly.
- Your LinkedIn profile link is already wired into the left panel (visible link). The site no longer attempts to fetch LinkedIn pages automatically (import button removed) because that approach is unreliable in browsers due to CORS restrictions.

Other Activities (cards)
- An "Other Activities" section was added. It uses cards you can replace with images (placeholders use CSS gradients). Each card has a title and a short story; click a card to open a modal with the activity story. To add images, replace the `.card-media` element's background with `background-image:url('assets/img/your-image.jpg')` or swap the inline style.

Next steps I can help with
- Add content from your resume (I can parse a PDF or text and populate sections).
- Improve accessibility or add printable resume view.
- Convert to a React/Next.js site or add a build step.

Please tell me your preferred copy, a profile photo, or a PDF resume and I'll populate the site for you.
