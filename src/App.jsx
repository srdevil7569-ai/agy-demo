import { useState } from 'react'
import {
  CheckCircle2,
  GitBranch,
  Terminal,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Layers,
  Rocket,
  Code2,
  Cpu,
  Workflow
} from 'lucide-react'

export default function App() {
  const [count, setCount] = useState(0)
  const [activeTab, setActiveTab] = useState('pipeline')

  const pipelineStages = [
    {
      id: 1,
      name: 'Lint & Static Analysis',
      tool: 'ESLint 9',
      status: 'Passing',
      description: 'Checks JavaScript syntax, React rules, and code consistency.',
      command: 'npm run lint'
    },
    {
      id: 2,
      name: 'Automated Testing',
      tool: 'Vitest + Testing Library',
      status: 'Passing',
      description: 'Executes unit and integration component tests in jsdom.',
      command: 'npm run test:run'
    },
    {
      id: 3,
      name: 'Production Build',
      tool: 'Vite 6',
      status: 'Passing',
      description: 'Bundles optimized ES modules, minifies CSS, and generates chunks.',
      command: 'npm run build'
    },
    {
      id: 4,
      name: 'Deployment & Artifacts',
      tool: 'GitHub Actions & Pages',
      status: 'Automated',
      description: 'Deploys production build to GitHub Pages and packages Docker image.',
      command: 'git push origin main'
    }
  ]

  const stackDetails = [
    { name: 'React 19', role: 'UI Framework with latest compiler features', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { name: 'Vite 6', role: 'Lightning-fast dev server and bundler', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    { name: 'Tailwind CSS 4', role: 'Next-generation utility-first styling engine', color: 'bg-teal-500/10 text-teal-500 border-teal-500/20' },
    { name: 'Vitest', role: 'Native Vite test runner with jsdom support', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    { name: 'GitHub Actions', role: 'Automated CI/CD validation and deployment pipeline', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { name: 'Docker + NGINX', role: 'Production multi-stage containerization ready', color: 'bg-sky-500/10 text-sky-500 border-sky-500/20' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">React App + CI/CD</h1>
              <p className="text-xs text-slate-400">Vite · Tailwind CSS · GitHub Actions</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              CI/CD Pipeline Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Modern React 19 Project Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Continuous Integration & Delivery
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg">
            A production-ready React application configured with Vite, Tailwind CSS, automated Vitest suites, ESLint, and GitHub Actions CI/CD workflows.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center border-b border-slate-800">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pipeline'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Workflow className="w-4 h-4" />
              CI/CD Pipeline
            </button>
            <button
              onClick={() => setActiveTab('counter')}
              className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'counter'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Interactive Demo
            </button>
            <button
              onClick={() => setActiveTab('stack')}
              className={`flex items-center gap-2 pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'stack'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              Technology Stack
            </button>
          </nav>
        </div>

        {/* Tab 1: CI/CD Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pipelineStages.map((stage) => (
                <div
                  key={stage.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                        {stage.id}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-200">{stage.name}</h3>
                        <p className="text-xs text-slate-400">{stage.tool}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {stage.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400">{stage.description}</p>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 flex items-center justify-between">
                    <span>{stage.command}</span>
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Workflow File Summary */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                Configured Workflows & Automation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">CI Workflow</div>
                  <div className="text-sm font-medium text-slate-200 font-mono">.github/workflows/ci.yml</div>
                  <div className="text-xs text-slate-400 mt-1">Triggers on push & PRs to main. Runs lint, vitest tests, and build.</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">CD Deployment</div>
                  <div className="text-sm font-medium text-slate-200 font-mono">.github/workflows/deploy.yml</div>
                  <div className="text-xs text-slate-400 mt-1">Automated zero-config deployment to GitHub Pages.</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">Containerization</div>
                  <div className="text-sm font-medium text-slate-200 font-mono">Dockerfile + NGINX</div>
                  <div className="text-xs text-slate-400 mt-1">Multi-stage Alpine build for Kubernetes or Cloud Run.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Counter */}
        {activeTab === 'counter' && (
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-6 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-200">Interactive Component State</h3>
              <p className="text-sm text-slate-400">Tested via React Testing Library & Vitest</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800/80">
              <span className="text-xs uppercase tracking-wider text-slate-400">Current Count</span>
              <div data-testid="count-value" className="text-6xl font-black text-indigo-400 mt-2 font-mono">
                {count}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <button
                aria-label="Decrement count"
                onClick={() => setCount((prev) => prev - 1)}
                className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-95 border border-slate-700"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button
                aria-label="Reset count"
                onClick={() => setCount(0)}
                className="px-4 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-2 text-sm font-medium transition active:scale-95 border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                aria-label="Increment count"
                onClick={() => setCount((prev) => prev + 1)}
                className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition active:scale-95 shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Tech Stack */}
        {activeTab === 'stack' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stackDetails.map((tech) => (
              <div
                key={tech.name}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${tech.color}`}>
                    {tech.name}
                  </span>
                  <Code2 className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-sm text-slate-300">{tech.role}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 mt-auto">
        <p>Built with React 19, Vite, Tailwind CSS v4, and automated GitHub Actions CI/CD.</p>
      </footer>
    </div>
  )
}
