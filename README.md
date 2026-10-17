# React App with Tailwind CSS & Automated CI/CD Pipelines

A modern React 19 web application built with Vite, Tailwind CSS v4, Vitest, and automated GitHub Actions CI/CD workflows.

---

## 🚀 Features

- **React 19**: Modern component architecture and reactive state management.
- **Vite 6**: Fast development server with Hot Module Replacement (HMR).
- **Tailwind CSS v4**: Utility-first CSS styling powered by `@tailwindcss/vite`.
- **Vitest & React Testing Library**: Component unit & integration tests with `happy-dom`.
- **Automated CI/CD**: Complete GitHub Actions pipelines for linting, testing, building, and deployment.
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

This repository is equipped with two GitHub Actions workflows:

### 1. Continuous Integration (`.github/workflows/ci.yml`)
Triggers automatically on every `push` and `pull_request` targeting `main`:
- 🧪 **Install & Cache Dependencies**: Caches `npm` modules for accelerated execution.
- 🔍 **Static Analysis**: Runs ESLint across the codebase.
- ⚡ **Automated Tests**: Executes the Vitest test suite (`npm run test:run`).
- 📦 **Production Bundle**: Validates compilation via `npm run build`.
- 📁 **Artifact Archiving**: Stores the production build artifact for 7 days.

### 2. Continuous Deployment (`.github/workflows/deploy.yml`)
Triggers automatically on merges to `main` or manual trigger via `workflow_dispatch`:
- 🏗️ Builds production bundle.
- 🌐 Deploys the application directly to **GitHub Pages**.

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
