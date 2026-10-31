# Jenkins Integration for agy-demo

This repository includes a `Jenkinsfile` (Declarative Pipeline) that builds, lints, tests, and packages the React + Vite app.

## Prerequisites

1. **Jenkins** with required plugins:
   - Pipeline
   - NodeJS Plugin
   - Docker Pipeline (if using the Docker build stage)
   - Git

2. **Node.js tool configured in Jenkins**:
   - Go to `Manage Jenkins > Tools > NodeJS installations`
   - Add installation named `NodeJS-20` (matching the `tools` block in the Jenkinsfile)
   - Install Node.js 20.x

3. **Docker access (optional)**:
   - If you want the "Build Docker Image" stage to run, the Jenkins agent must have Docker installed and the Jenkins user must be in the `docker` group (or use Docker socket permissions).
   - The stage only runs on `main`/`master` branches.

## Setting up a Pipeline

### Option 1: Multibranch Pipeline (recommended)
1. Create a new item → Multibranch Pipeline
2. Add a Git source pointing to this repository
3. Jenkins will automatically discover branches with a `Jenkinsfile`
4. Builds will run on pushes/PRs depending on your SCM configuration

### Option 2: Pipeline from SCM
1. Create a new item → Pipeline
2. Under "Pipeline", set Definition to "Pipeline script from SCM"
3. SCM: Git, repo URL, credentials if private
4. Script Path: `Jenkinsfile`

## What the Pipeline does

- **Checkout**: Checks out the source code
- **Install Dependencies**: Uses `npm ci` with fallback to `npm install`, adding `--legacy-peer-deps` for compatibility
- **Lint**: Runs `npm run lint`
- **Test**: Runs `npm run test:run` (Vitest)
- **Build**: Runs `npm run build` to produce `dist/`
- **Archive Artifacts**: Archives the `dist/` directory
- **Deploy to Netlify** (main/master only): Deploys `dist/` to Netlify using the Netlify CLI
- **Build Docker Image** (main/master only): Builds `agy-demo:<build-number>` and `agy-demo:latest` using the existing `Dockerfile`

## Netlify Deployment

The pipeline publishes the production `dist/` directory to Netlify with `netlify deploy --prod`. No Netlify plugin is needed; the CLI is fetched with `npx` and pinned to `netlify-cli@23.15.1`, which runs on the Node 20 tool configured for this pipeline.

### 1. Create the Netlify site

Create a site in Netlify (either import the repo or use `netlify sites:create`). Then grab the **Site ID** from `Site configuration > General > Site details > Site ID`.

### 2. Add Jenkins credentials

In `Manage Jenkins > Credentials > System > Global credentials`, add two **Secret text** credentials:

| Credential ID | Value |
| --- | --- |
| `netlify-auth-token` | A Netlify personal access token (`User settings > Applications > Personal access tokens`) |
| `netlify-site-id` | The Netlify Site ID from step 1 |

The stage fails if either credential is missing, so add them before the first `main` build. To skip deployment for a single build, untick the `DEPLOY_TO_NETLIFY` build parameter.

### 3. Deploy configuration

- `netlify.toml` contains the build command, publish directory, Node version, and SPA redirects for Netlify's own builds.
- `public/_redirects` and `public/_headers` are copied into `dist/` by Vite so SPA fallback, asset caching, and HTML revalidation also apply to CLI deploys.


## Customization

- **Change Node version**: Update the tool name/version in `Jenkinsfile` and in Jenkins tools configuration
- **Change Netlify CLI version**: Update the pinned `netlify-cli@23.15.1` in the `Deploy to Netlify` stage (check its Node requirement first)
- **Add deployment**: Add stages to deploy `dist/` to S3, Nginx, etc.
- **Skip Docker**: Remove or modify the "Build Docker Image" stage if not needed
- **Use different agent**: Replace `agent any` with a specific label (e.g., `agent { label 'docker-node' }`)
- **Environment variables**: Add secrets via Jenkins credentials and inject with `credentials()` or `withCredentials`
