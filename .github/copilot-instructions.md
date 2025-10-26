<!--
This file is a concise, actionable guide for AI coding agents working in this repository.
It focuses only on discoverable facts and exact places to look. If the repository is empty
or missing build files, the agent should pause and ask the human for missing context.
-->

# Copilot instructions — repository-specific guidance

Summary
- Repository state: no source files were found at analysis time. If files appear later, re-run the discovery steps below.

When you open the repo
- First step: list top-level files and common manifests (`package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml`, `setup.py`, `Dockerfile`, `Makefile`).
- Second step: search for folders named `src`, `app`, `cmd`, `internal`, `services`, `web`, `frontend`, or `backend` — these typically show component boundaries.

How to discover the "big picture"
- Look for high-level docs: `README.md`, `docs/`, `.md` files in root. If present, extract architecture notes and run commands.
- If there is a `docker-compose.yml`, `Dockerfile` or `k8s/` manifests, infer service boundaries and network ports from those files.
- If there are multiple language manifests (e.g. `package.json` + `pyproject.toml`), treat this as a polyglot repo and map responsibilities by folder (example: `frontend/` with `package.json`, `api/` with `pyproject.toml`).

Build / test / run workflows (what to try, in PowerShell)
- If `package.json` exists: run `npm ci` (or `pnpm install`/`yarn install` if lockfile indicates), then `npm test` or `npm run build` as appropriate.
- If `pyproject.toml` or `requirements.txt` exist: create venv and run tests with `pytest` if `pyproject` lists it.
- If `Makefile` or `build` scripts exist, prefer those canonical commands.
- If none of the above exist, stop and ask the repository owner for the preferred build/test commands.

Patterns and conventions to prefer
- Folder-driven boundaries: code in `frontend/`, `backend/`, `services/` usually indicates separate deployables.
- Script-first dev flows: follow `scripts` or `Makefile` entries instead of guessing subcommands.
- Single source of truth: prefer instructions in `README.md` or root-level CI configs (e.g. `.github/workflows/`) when they exist.

Integration points and external dependencies
- Look for explicit references in manifests, Docker images, or CI files to identify required external services (databases, caches, message brokers). Example files to check: `docker-compose.yml`, `.github/workflows/*`, `helm/`, `k8s/`.

If you need to change code or add a new file
- Make minimal, localized edits. When adding tests, place them next to the code following the repo's layout (e.g., `__tests__`, `tests/`, or `*.spec.ts`).
- Run the project's canonical test command before opening a PR. If no test command exists, run a basic lint or typecheck if available (`npm run lint`, `mypy`, `go vet`).

What to do when repository is empty or missing build info
- STOP and ask the human for:
  - Which language(s) and the intended entry point (web app, library, CLI).
  - Preferred build & test commands.
  - Any monorepo layout details (which folders are services or packages).

Minimal checklist for a follow-up human reply
- Point me to the project root (if different from repository root).
- Provide any non-committed local steps (auth tokens, env files) required to run the app.

Contact / feedback
- I generated this file from an empty workspace snapshot. If you'd like I can re-run discovery after you add files or point me to the project's root folder—tell me where to look or upload the code and I'll merge or extend these instructions with concrete examples.
