# React App with Tailwind CSS & Automated CI/CD Pipelines

A modern React 19 web application built with Vite, Tailwind CSS v4, Vitest, and automated GitHub Actions CI/CD workflows.

---

## 🚀 Features

- **React 19**: Modern component architecture and reactive state management.
- **Vite 6**: Fast development server with Hot Module Replacement (HMR).
- **Tailwind CSS v4**: Utility-first CSS styling powered by `@tailwindcss/vite`.
- **Vitest & React Testing Library**: Component unit & integration tests with `happy-dom`.
- **Automated CI/CD**: Complete GitHub Actions pipelines for linting, testing, building, and deployment.
- **Netlify Deployment**: Jenkins publishes the production build to Netlify on `main`/`master` via the Netlify CLI.
- **Docker Ready**: Multi-stage production Docker build served via lightweight NGINX Alpine.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm (v10+)

### Development Server

Start the local development server:

```bash
npm run dev
```

Visit the app in your browser at `http://localhost:5173/`.

### Running Tests

Run unit tests via Vitest:

```bash
# Run tests in watch mode
npm test

# Single test run (ideal for CI)
npm run test:run
```

### Linting

Run ESLint to check for code quality and syntax issues:

```bash
npm run lint
```

### Production Build

Compile and bundle the production assets into the `dist/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔄 CI/CD Pipelines

This repository uses one GitHub Actions workflow for CI and Netlify deployment, plus the Jenkins pipeline:

### 1. Continuous Integration & Netlify Deployment (`.github/workflows/ci.yml`)
Triggers automatically on every `push` and `pull_request` targeting `main`, and manually via `workflow_dispatch`:
- 🧪 **Install & Cache Dependencies**: Caches `npm` modules for accelerated execution.
- 🔍 **Static Analysis**: Runs ESLint across the codebase.
- ⚡ **Automated Tests**: Executes the Vitest test suite (`npm run test:run`).
- 📦 **Production Bundle**: Validates compilation via `npm run build`.
- 📁 **Artifact Archiving**: Stores the production build artifact for 7 days.
- 🌐 **Netlify Deploy**: On `push`/`workflow_dispatch` to `main`/`master`, deploys `dist/` to Netlify (`NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID` repository secrets). Pull requests never deploy.

### 2. Jenkins → Netlify (`Jenkinsfile`)
`Jenkinsfile` runs install → lint → test → build → archive, then deploys the `dist/` directory to **Netlify** on `main`/`master`. Docker images are still built afterwards on those branches. See [`JENKINS.md`](./JENKINS.md#netlify-deployment) for credentials and setup.

Netlify is also deployed from the GitHub Actions CI workflow after the production build. That path uses the `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` **repository secrets** (`Settings > Secrets and variables > Actions`). Both paths are pinned to `netlify-cli@23.15.1`.

> **Troubleshooting: `Timed out waiting for authorization`**
>
> This means the CLI did not see an auth token and fell back to interactive `netlify login`. In CI that can only time out. Fix it by adding both **repository** secrets (not environment secrets) with these exact names:
>
> - `NETLIFY_AUTH_TOKEN` — a Netlify personal access token from `User settings > Applications > Personal access tokens`.
> - `NETLIFY_SITE_ID` — the site's **Project ID** from `Site configuration > General > Site details`.
>
> Paste the raw token with no `Bearer ` prefix or quotes. The workflow now validates both secrets before deploying and fails immediately with an explicit error if either is empty.

---

## 🌐 Netlify Configuration

- `netlify.toml` — build command (`npm run build`), publish directory (`dist`), Node `20.19.0`, and SPA redirects.
- `public/_redirects` — SPA fallback (`/* /index.html 200`) copied into `dist/`.
- `public/_headers` — immutable caching for hashed assets and revalidation for `index.html`.

Jenkins deploys with the pinned `netlify-cli@23.15.1` and the `netlify-auth-token` / `netlify-site-id` credentials.

---

## 🐳 Docker Deployment

Build and run the production container with NGINX:

```bash
# Build the Docker image
docker build -t agy-demo:latest .

# Run the container on port 8080
docker run -d -p 8080:80 agy-demo:latest
```

The containerized app will be available at `http://localhost:8080/`.
