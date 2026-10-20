import { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  GitCommitHorizontal,
  GitBranch,
  Terminal,
  ShieldCheck,
  Layers,
  Rocket,
  Code2,
  Workflow,
  ArrowRight,
  Activity,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react'
import {
  fetchGitHubPipelineStatus,
  DEFAULT_PIPELINE_STAGES,
  DEFAULT_REPO,
  getStatusBadge
} from './services/githubApi'

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function getCardBackground(type, isDark) {
  if (type === 'success') {
    return isDark
      ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900/95 to-teal-950/70 border-emerald-500/70'
      : 'bg-white/95 border-2 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
  }
  if (type === 'failure') {
    return isDark
      ? 'bg-gradient-to-br from-rose-950/85 via-slate-900/95 to-red-950/75 border-rose-500/80'
      : 'bg-white/95 border-2 border-rose-500/80 shadow-lg shadow-rose-500/10'
  }
  if (type === 'running') {
    return isDark
      ? 'bg-gradient-to-br from-cyan-950/85 via-slate-900/95 to-blue-950/75 border-cyan-500/80'
      : 'bg-white/95 border-2 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
  }
  if (type === 'queued') {
    return isDark
      ? 'bg-gradient-to-br from-amber-950/85 via-slate-900/95 to-yellow-950/75 border-amber-500/80'
      : 'bg-white/95 border-2 border-amber-500/80 shadow-lg shadow-amber-500/10'
  }
  return isDark
    ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900/95 to-purple-950/70 border-indigo-500/70'
    : 'bg-white/95 border-2 border-indigo-400/80 shadow-lg shadow-indigo-500/10'
}

function getBadgeStyle(type) {
  if (type === 'success') return 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/40'
  if (type === 'failure') return 'bg-rose-600 text-white font-black shadow-md shadow-rose-600/40'
  if (type === 'running') return 'bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-400/40 animate-pulse'
  if (type === 'queued') return 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/40'
  return 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/40'
}

function getNumberBadge(type) {
  if (type === 'success') return 'bg-emerald-500 text-slate-950'
  if (type === 'failure') return 'bg-rose-600 text-white'
  if (type === 'running') return 'bg-cyan-400 text-slate-950'
  if (type === 'queued') return 'bg-amber-400 text-slate-950'
  return 'bg-indigo-500 text-white'
}

function getStripeGradient(type) {
  if (type === 'success') return 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
  if (type === 'failure') return 'bg-gradient-to-r from-rose-500 via-red-500 to-pink-500'
  if (type === 'running') return 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500'
  if (type === 'queued') return 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400'
  return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
}

export default function App() {
  const [activeTab, setActiveTab] = useState('pipeline')
  const [isDark, setIsDark] = useState(false)
  const [pipelineData, setPipelineData] = useState({
    stages: DEFAULT_PIPELINE_STAGES,
    latestCommit: null,
    ciRun: null,
    cdRun: null,
    lastSyncedAt: null,
    isLive: false,
    error: null,
    repo: DEFAULT_REPO
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadPipelineStatus = useCallback(async (signal) => {
    setIsRefreshing(true)
    try {
      const data = await fetchGitHubPipelineStatus(DEFAULT_REPO, { signal })
      if (data?.aborted) return
      if (data && data.success) {
        setPipelineData({
          stages: data.stages,
          latestCommit: data.latestCommit,
          ciRun: data.ciRun,
          cdRun: data.cdRun,
          lastSyncedAt: data.lastSyncedAt,
          isLive: true,
          error: null,
          repo: data.repo || DEFAULT_REPO
        })
      } else {
        setPipelineData((prev) => ({
          ...prev,
          stages: prev.stages?.length ? prev.stages : DEFAULT_PIPELINE_STAGES,
          error: data?.error || 'Unable to sync with GitHub API',
          isLive: false
        }))
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      setPipelineData((prev) => ({
        ...prev,
        error: err.message,
        isLive: false
      }))
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadPipelineStatus(controller.signal)
    return () => {
      controller.abort()
    }
  }, [loadPipelineStatus])

  const pipelineStages = pipelineData.stages || DEFAULT_PIPELINE_STAGES

  const passingCount = pipelineStages.filter((s) => s.status === 'Passing').length
  const failedCount = pipelineStages.filter((s) => s.status === 'Failed').length

  const stackDetails = [
    {
      name: 'React 19',
      category: 'UI Framework',
      role: 'Next-gen React compiler & Actions',
      darkCard: 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/60 border-blue-500/50',
      lightCard: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-500',
      badgeClass: 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/30',
      textColor: isDark ? 'text-blue-300' : 'text-blue-700'
    },
    {
      name: 'Vite 6',
      category: 'Build Tool',
      role: 'Lightning-fast ES modules & dev server',
      darkCard: 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-pink-950/60 border-purple-500/50',
      lightCard: 'bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-500',
      badgeClass: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-md shadow-purple-500/30',
      textColor: isDark ? 'text-purple-300' : 'text-purple-700'
    },
    {
      name: 'Tailwind CSS 4',
      category: 'Styling Engine',
      role: 'Modern high-performance CSS framework',
      darkCard: 'bg-gradient-to-br from-teal-950/80 via-slate-900 to-cyan-950/60 border-teal-500/50',
      lightCard: 'bg-gradient-to-br from-teal-50 via-white to-cyan-50 border-teal-500',
      badgeClass: 'bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-400/30',
      textColor: isDark ? 'text-teal-300' : 'text-teal-700'
    },
    {
      name: 'Vitest',
      category: 'Testing Suite',
      role: 'Native Vite test runner with jsdom support',
      darkCard: 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-yellow-950/60 border-amber-500/50',
      lightCard: 'bg-gradient-to-br from-amber-50 via-white to-yellow-50 border-amber-500',
      badgeClass: 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30',
      textColor: isDark ? 'text-amber-300' : 'text-amber-800'
    },
    {
      name: 'GitHub Actions',
      category: 'CI/CD Pipeline',
      role: 'Automated validation & deployment workflows',
      darkCard: 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-green-950/60 border-emerald-500/50',
      lightCard: 'bg-gradient-to-br from-emerald-50 via-white to-green-50 border-emerald-500',
      badgeClass: 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30',
      textColor: isDark ? 'text-emerald-300' : 'text-emerald-700'
    },
    {
      name: 'Docker + NGINX',
      category: 'Deployment Container',
      role: 'Production multi-stage Alpine containerization',
      darkCard: 'bg-gradient-to-br from-sky-950/80 via-slate-900 to-blue-950/60 border-sky-500/50',
      lightCard: 'bg-gradient-to-br from-sky-50 via-white to-blue-50 border-sky-500',
      badgeClass: 'bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-400/30',
      textColor: isDark ? 'text-sky-300' : 'text-sky-700'
    }
  ]

  return (
    <div
      className={`relative min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#070b14] text-slate-100'
          : 'bg-gradient-to-br from-[#f8faff] via-[#eef2ff]/50 to-[#f1f5f9] text-slate-900'
      }`}
    >
      {/* Radiant Multicolored Ambient Glows & Dot Texture */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {!isDark && (
          <div className="absolute inset-0 bg-[radial-gradient(#c7d2fe_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        )}
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] blur-3xl opacity-80 ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500/25 via-indigo-600/30 to-pink-500/25'
              : 'bg-gradient-to-r from-cyan-300/40 via-indigo-300/50 to-pink-300/40'
          }`}
        />
        <div
          className={`absolute top-1/4 -right-32 w-[550px] h-[550px] rounded-full blur-3xl ${
            isDark
              ? 'bg-gradient-to-b from-purple-600/20 to-pink-600/15'
              : 'bg-gradient-to-b from-purple-300/35 to-pink-300/30'
          }`}
        />
        <div
          className={`absolute top-1/2 -left-40 w-[550px] h-[550px] rounded-full blur-3xl ${
            isDark
              ? 'bg-gradient-to-b from-cyan-600/20 to-teal-500/15'
              : 'bg-gradient-to-b from-cyan-300/35 to-teal-200/30'
          }`}
        />
        <div
          className={`absolute bottom-10 right-1/4 w-[600px] h-[350px] rounded-full blur-3xl ${
            isDark
              ? 'bg-gradient-to-r from-blue-600/15 to-emerald-600/15'
              : 'bg-gradient-to-r from-blue-200/40 to-emerald-200/35'
          }`}
        />
      </div>

      {/* Top Navigation Bar with Vibrant Accents */}
      <header
        className={`relative z-50 border-b sticky top-0 shadow-xl backdrop-blur-xl transition-colors duration-300 ${
          isDark
            ? 'border-indigo-500/30 bg-slate-900/85 shadow-indigo-950/40'
            : 'border-indigo-200 bg-white/85 shadow-slate-200/60'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-400/40">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1
                className={`font-bold text-lg leading-tight tracking-tight flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                React App + CI/CD
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm">
                  v2.0
                </span>
              </h1>
              <p className={`text-xs font-semibold ${isDark ? 'text-indigo-200' : 'text-indigo-600'}`}>
                Vite · Tailwind CSS · GitHub Actions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Dark / Light Theme Toggle Button */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              aria-label="Toggle theme mode"
              className={`p-2 rounded-xl border-2 transition-all cursor-pointer shadow-md ${
                isDark
                  ? 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-700'
                  : 'bg-white text-indigo-600 border-indigo-200 hover:bg-slate-50'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Pipeline Status Indicator Pill */}
            <a
              href={`https://github.com/${pipelineData.repo}/actions`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all shadow-md cursor-pointer ${
                isDark
                  ? 'bg-slate-800/90 hover:bg-slate-800 border-indigo-500/40 hover:border-indigo-400 shadow-indigo-950/50 text-slate-100'
                  : 'bg-white hover:bg-slate-50 border-indigo-300 shadow-slate-200 text-slate-800'
              }`}
              title="View GitHub Actions Pipeline"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    failedCount > 0 ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    failedCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span>{failedCount > 0 ? `${passingCount}/4 Passing · ${failedCount} Failed` : 'CI/CD Pipeline Ready'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500 transition-colors" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Colorful Hero Section */}
        <div className="text-center space-y-4 py-4">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border-2 shadow-lg backdrop-blur-md ${
              isDark
                ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/20'
                : 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-indigo-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Modern React 19 Architecture</span>
            <span className="text-indigo-400">•</span>
            <span className={isDark ? 'text-pink-300' : 'text-pink-600'}>Live GitHub Actions Sync</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
            Continuous Integration & Delivery
          </h2>

          <p
            className={`max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium ${
              isDark ? 'text-slate-200' : 'text-slate-600'
            }`}
          >
            A production-ready React application configured with Vite, Tailwind CSS, automated Vitest suites, ESLint,
            and GitHub Actions CI/CD workflows.
          </p>
        </div>

        {/* Vibrant Tab Selector */}
        <div className="flex justify-center">
          <nav
            className={`inline-flex p-1.5 rounded-2xl border-2 shadow-2xl backdrop-blur-xl space-x-1.5 ${
              isDark ? 'bg-slate-900/90 border-indigo-500/35 shadow-indigo-950/50' : 'bg-white border-indigo-200 shadow-slate-200'
            }`}
          >
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg shadow-indigo-600/40 ring-1 ring-white/20'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Workflow className="w-4 h-4" />
              CI/CD Pipeline
            </button>
            <button
              onClick={() => setActiveTab('stack')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'stack'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-600/40 ring-1 ring-white/20'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
            {/* Live Repository & GitHub Control Banner */}
            <div
              className={`p-5 rounded-3xl border-2 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-purple-950/60 border-indigo-500/40 shadow-indigo-950/40'
                  : 'bg-white border-indigo-300 shadow-indigo-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400/40">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`https://github.com/${pipelineData.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-bold text-base hover:text-indigo-400 transition-colors flex items-center gap-1.5 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {pipelineData.repo}
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                    </a>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500/40">
                      <GitBranch className="w-3 h-3" />
                      main
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border-2 ${
                        pipelineData.isLive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/30'
                          : isDark
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          pipelineData.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                        }`}
                      />
                      {pipelineData.isLive
                        ? 'Live GitHub Actions Status'
                        : pipelineData.error
                        ? 'Offline / Static Mode'
                        : 'Syncing with GitHub...'}
                    </span>
                  </div>

                  <div className="text-xs flex flex-wrap items-center gap-2 mt-2">
                    {pipelineData.latestCommit?.sha && (
                      <span
                        className={`font-mono flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shadow-sm ${
                          isDark
                            ? 'bg-slate-950/80 border-indigo-500/30 text-slate-200'
                            : 'bg-slate-50 border-indigo-200 text-slate-800'
                        }`}
                        title={pipelineData.latestCommit.message}
                      >
                        <GitCommitHorizontal className="w-4 h-4 text-pink-500" />
                        <span className="font-bold text-indigo-400">{pipelineData.latestCommit.sha}</span>
                        {pipelineData.latestCommit.message && (
                          <span
                            className={`max-w-[200px] sm:max-w-[340px] truncate ml-1 font-sans font-medium ${
                              isDark ? 'text-slate-300' : 'text-slate-600'
                            }`}
                          >
                            {pipelineData.latestCommit.message}
                          </span>
                        )}
                      </span>
                    )}
                    {pipelineData.lastSyncedAt && (
                      <span className={`text-[11px] font-semibold ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                        Synced: {new Date(pipelineData.lastSyncedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-center">
                <button
                  onClick={() => loadPipelineStatus()}
                  disabled={isRefreshing}
                  aria-label="Refresh pipeline status"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer active:scale-95 ring-1 ring-indigo-400/40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-white' : ''}`} />
                  Refresh Status
                </button>
                <a
                  href={`https://github.com/${pipelineData.repo}/actions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 active:scale-95 ring-1 ring-pink-400/40"
                >
                  Actions Console
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Pipeline Visual Stepper Ribbon with Vivid Color Indicators */}
            <div
              className={`p-5 rounded-3xl border-2 backdrop-blur-xl shadow-xl ${
                isDark
                  ? 'bg-slate-900/80 border-indigo-500/30 shadow-indigo-950/30'
                  : 'bg-white border-indigo-200 shadow-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-500`}>
                  <Activity className="w-4 h-4 text-pink-500" />
                  Pipeline Execution Flow
                </div>
                <div className="text-xs font-bold">
                  <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    {passingCount} Passing
                  </span>
                  {failedCount > 0 && (
                    <span className="text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 ml-2">
                      {failedCount} Failed
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {pipelineStages.map((stage, idx) => {
                  const badge = getStatusBadge(stage.status, stage.conclusion)
                  const cardBgClass = getCardBackground(badge.type, isDark)
                  const badgeStyle = getBadgeStyle(badge.type)
                  const numberStyle = getNumberBadge(badge.type)

                  return (
                    <div
                      key={stage.id}
                      className={`relative p-4 rounded-2xl border-2 ${cardBgClass} transition-all duration-200 flex items-center justify-between shadow-lg group`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${numberStyle} shadow-md`}
                        >
                          {badge.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                          {badge.type === 'failure' && <XCircle className="w-4 h-4" />}
                          {badge.type === 'running' && <RefreshCw className="w-4 h-4 animate-spin" />}
                          {badge.type === 'queued' && <Clock className="w-4 h-4" />}
                          {badge.type === 'default' && <span>{stage.id}</span>}
                          {badge.type === 'cancelled' && <AlertCircle className="w-4 h-4" />}
                          {badge.type === 'skipped' && <AlertCircle className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stage.name}
                          </p>
                          <p className={`text-[11px] font-semibold truncate ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                            {stage.tool}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pl-2">
                        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${badgeStyle}`}>
                          {badge.label}
                        </span>
                        {idx < pipelineStages.length - 1 && (
                          <ArrowRight className="hidden lg:block w-4 h-4 text-indigo-400 shrink-0 -mr-1" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Stages Detail Cards Grid with Rich Color Indication */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pipelineStages.map((stage) => {
                const badge = getStatusBadge(stage.status, stage.conclusion)
                const cardBgClass = getCardBackground(badge.type, isDark)
                const badgeStyle = getBadgeStyle(badge.type)
                const numberStyle = getNumberBadge(badge.type)
                const stripeGradient = getStripeGradient(badge.type)

                return (
                  <div
                    key={stage.id}
                    className={`relative overflow-hidden rounded-3xl border-2 ${cardBgClass} backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 p-6 space-y-4 group`}
                  >
                    {/* Top Status Color Indicator Stripe */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${stripeGradient}`} />

                    {/* Stage Header */}
                    <div className="flex items-start justify-between gap-3 pt-1">
                      <div className="flex items-center space-x-3.5">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm ${numberStyle} shadow-md ring-2 ring-white/30`}
                        >
                          {stage.id}
                        </div>
                        <div>
                          <h3
                            className={`font-bold text-base group-hover:text-indigo-400 transition-colors ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {stage.name}
                          </h3>
                          <p className={`text-xs font-bold ${isDark ? 'text-cyan-300' : 'text-indigo-700'}`}>
                            {stage.tool}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge with Solid Color Glow */}
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs ${badgeStyle}`}>
                        {badge.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {badge.type === 'failure' && <XCircle className="w-3.5 h-3.5" />}
                        {badge.type === 'running' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                        {badge.type === 'queued' && <Clock className="w-3.5 h-3.5" />}
                        {badge.type === 'default' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {badge.type === 'cancelled' && <AlertCircle className="w-3.5 h-3.5" />}
                        {badge.type === 'skipped' && <AlertCircle className="w-3.5 h-3.5" />}
                        {stage.status}
                      </span>
                    </div>

                    {/* Stage Description */}
                    <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      {stage.description}
                    </p>

                    {/* GitHub Run Meta Row (if run metadata exists) */}
                    {stage.runUrl && (
                      <div
                        className={`flex items-center justify-between text-xs px-3.5 py-2 rounded-xl border shadow-inner ${
                          isDark ? 'bg-slate-950/90 border-indigo-500/30' : 'bg-slate-100 border-indigo-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-mono">
                          <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
                          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stage.runNumber ? `Run #${stage.runNumber}` : 'Workflow Run'}
                          </span>
                          {stage.headSha && <span className="text-slate-500 font-normal">({stage.headSha})</span>}
                        </div>
                        <a
                          href={stage.runUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-500 hover:text-indigo-400 font-bold transition-colors"
                        >
                          View Details
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {/* Terminal Command Box */}
                    <div
                      className={`p-3 rounded-xl border font-mono text-xs flex items-center justify-between shadow-inner ${
                        isDark ? 'bg-slate-950/90 border-slate-700/80' : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-cyan-400 font-bold select-none">$</span>
                        <span className="truncate text-emerald-400 font-bold">{stage.command}</span>
                      </div>
                      <Terminal className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Configured Workflows & Automation Summary */}
            <div
              className={`p-6 rounded-3xl border-2 space-y-4 backdrop-blur-xl shadow-xl ${
                isDark
                  ? 'bg-slate-900/80 border-indigo-500/30 shadow-indigo-950/30'
                  : 'bg-white border-indigo-200 shadow-slate-200'
              }`}
            >
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <GitBranch className="w-5 h-5 text-indigo-500" />
                Configured Workflows & Automation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`p-4 rounded-2xl border-2 transition-colors shadow-md ${
                    isDark
                      ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-blue-950/60 border-indigo-500/40 hover:border-indigo-400'
                      : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-indigo-400 hover:border-indigo-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-indigo-500 uppercase tracking-wider">CI Workflow</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  </div>
                  <div className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    .github/workflows/ci.yml
                  </div>
                  <div className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Triggers on push & PRs to main. Runs lint, vitest tests, and build.
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border-2 transition-colors shadow-md ${
                    isDark
                      ? 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-pink-950/60 border-purple-500/40 hover:border-purple-400'
                      : 'bg-gradient-to-br from-purple-50 via-white to-pink-50 border-purple-400 hover:border-purple-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-pink-500 uppercase tracking-wider">CD Deployment</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  </div>
                  <div className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    .github/workflows/deploy.yml
                  </div>
                  <div className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Automated zero-config deployment to GitHub Pages.
                  </div>
                </div>

                <div
                  className={`p-4 rounded-2xl border-2 transition-colors shadow-md ${
                    isDark
                      ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-teal-950/60 border-cyan-500/40 hover:border-cyan-400'
                      : 'bg-gradient-to-br from-cyan-50 via-white to-teal-50 border-cyan-400 hover:border-cyan-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-cyan-500 uppercase tracking-wider">Containerization</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
                  </div>
                  <div className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Dockerfile + NGINX
                  </div>
                  <div className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Multi-stage Alpine build for Kubernetes or Cloud Run.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tech Stack with Rich Colors */}
        {activeTab === 'stack' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stackDetails.map((tech) => (
              <div
                key={tech.name}
                className={`p-6 rounded-3xl border-2 backdrop-blur-xl flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1 shadow-xl group ${
                  isDark ? tech.darkCard : tech.lightCard
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-3.5 py-1.5 rounded-xl text-xs ${tech.badgeClass}`}>
                    {tech.name}
                  </span>
                  <Code2 className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500">{tech.category}</div>
                  <p className={`text-sm font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {tech.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`relative z-10 border-t py-8 text-center text-xs mt-auto backdrop-blur-md transition-colors duration-300 ${
          isDark
            ? 'border-indigo-500/30 bg-slate-900/60 text-slate-300'
            : 'border-indigo-200 bg-white/80 text-slate-600'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold">Built with React 19, Vite, Tailwind CSS v4, and automated GitHub Actions CI/CD.</p>
          <div className="flex items-center space-x-4 text-indigo-500 font-bold">
            <a
              href={`https://github.com/${pipelineData.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <a
              href={`https://github.com/${pipelineData.repo}/actions`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors"
            >
              Workflows
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
