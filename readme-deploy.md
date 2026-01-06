Netlify deployment — Quick instructions (PowerShell)

This file contains step-by-step instructions to deploy the static portfolio to Netlify from your local machine using PowerShell.

1) Prerequisites
- You need a GitHub/GitLab/Bitbucket repo for the project.
- Node.js + npm (only needed if you use the Netlify CLI).

2) Create the site from the Netlify web UI (easiest)
- Push your repo to GitHub (e.g., `main` branch).
- Open https://app.netlify.com/ -> Sites -> "New site from Git" -> select your repo.
- Build command: leave blank (static site)
- Publish directory: .

3) Deploy with Netlify CLI (PowerShell)
```powershell
# Install Netlify CLI (requires npm)
npm install -g netlify-cli

# Login to Netlify (opens browser)
netlify login

# From the project root, do a production deploy (will prompt to link or create a site)
netlify deploy --dir=. --prod

# Alternatively, initialize interactive settings and link a repo/site
netlify init
```

4) Notes
- If you later add a build step (Vite / React), update `netlify.toml` with the build command and published directory (for example, `npm run build` and `dist/`).
- For single-page-app (SPA) routing you may need a `_redirects` file. Add `/* /index.html 200` to that file.

5) Troubleshooting
- If files are not showing, verify the publish directory in the Netlify dashboard is set to `.`.
- If images are missing, ensure the paths in HTML reference the correct folder (this repo uses `images/` by default).

---

If you want, I can prepare a one-line PowerShell script to move images into `assets/img/` and update all HTML references for you to run locally (I cannot move binary files on your machine). Say "move images" and I'll generate the script.