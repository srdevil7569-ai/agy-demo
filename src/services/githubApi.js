export const DEFAULT_REPO = 'srdevil7569-ai/agy-demo'

export const DEFAULT_PIPELINE_STAGES = [
  {
    id: 1,
    name: 'Lint & Static Analysis',
    tool: 'ESLint 9',
    status: 'Passing',
    conclusion: 'success',
    description: 'Checks JavaScript syntax, React rules, and code consistency.',
    command: 'npm run lint',
    workflowFile: '.github/workflows/ci.yml',
    stepName: 'Run ESLint'
  },
  {
    id: 2,
    name: 'Automated Testing',
    tool: 'Vitest + Testing Library',
    status: 'Passing',
    conclusion: 'success',
    description: 'Executes unit and integration component tests in jsdom.',
    command: 'npm run test:run',
    workflowFile: '.github/workflows/ci.yml',
    stepName: 'Run Vitest Unit Tests'
  },
  {
    id: 3,
    name: 'Production Build',
    tool: 'Vite 6',
    status: 'Passing',
    conclusion: 'success',
    description: 'Bundles optimized ES modules, minifies CSS, and generates chunks.',
    command: 'npm run build',
    workflowFile: '.github/workflows/ci.yml',
    stepName: 'Build production bundle'
  },
  {
    id: 4,
    name: 'Deployment & Artifacts',
    tool: 'GitHub Actions & Pages',
    status: 'Automated',
    conclusion: null,
    description: 'Deploys production build to GitHub Pages and packages Docker image.',
    command: 'git push origin main',
    workflowFile: '.github/workflows/deploy.yml',
    stepName: 'Deploy to GitHub Pages'
  }
]

export function getStatusBadge(status, conclusion) {
  if (status === 'in_progress') {
    return {
      label: 'Running',
      color: 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/40',
      type: 'running',
      cardBg: 'from-cyan-950/80 via-slate-900/90 to-blue-950/60',
      cardBorder: 'border-cyan-500/50 hover:border-cyan-400 shadow-cyan-950/40',
      accentGradient: 'from-cyan-400 via-sky-400 to-blue-500',
      dotColor: 'bg-cyan-300 animate-pulse',
      iconColor: 'text-cyan-400',
      nodeColor: 'border-cyan-400 text-cyan-300 bg-cyan-900/80 ring-2 ring-cyan-500/30',
      terminalBg: 'border-cyan-500/30 bg-slate-950/90',
      numberBg: 'from-cyan-500 to-blue-600 text-slate-950'
    }
  }
  if (status === 'queued') {
    return {
      label: 'Queued',
      color: 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/40',
      type: 'queued',
      cardBg: 'from-amber-950/80 via-slate-900/90 to-orange-950/60',
      cardBorder: 'border-amber-500/50 hover:border-amber-400 shadow-amber-950/40',
      accentGradient: 'from-amber-400 via-yellow-400 to-orange-500',
      dotColor: 'bg-amber-300',
      iconColor: 'text-amber-400',
      nodeColor: 'border-amber-400 text-amber-300 bg-amber-900/80 ring-2 ring-amber-500/30',
      terminalBg: 'border-amber-500/30 bg-slate-950/90',
      numberBg: 'from-amber-400 to-orange-500 text-slate-950'
    }
  }
  if (conclusion === 'success') {
    return {
      label: 'Passing',
      color: 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/40',
      type: 'success',
      cardBg: 'from-emerald-950/70 via-slate-900/90 to-teal-950/50',
      cardBorder: 'border-emerald-500/50 hover:border-emerald-400 shadow-emerald-950/40',
      accentGradient: 'from-emerald-400 via-teal-400 to-cyan-400',
      dotColor: 'bg-emerald-300',
      iconColor: 'text-emerald-400',
      nodeColor: 'border-emerald-400 text-emerald-300 bg-emerald-900/80 ring-2 ring-emerald-500/30',
      terminalBg: 'border-emerald-500/30 bg-slate-950/90',
      numberBg: 'from-emerald-400 to-teal-500 text-slate-950'
    }
  }
  if (conclusion === 'failure') {
    return {
      label: 'Failed',
      color: 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/40',
      type: 'failure',
      cardBg: 'from-rose-950/80 via-slate-900/90 to-red-950/60',
      cardBorder: 'border-rose-500/60 hover:border-rose-400 shadow-rose-950/50',
      accentGradient: 'from-rose-500 via-red-500 to-pink-500',
      dotColor: 'bg-rose-300',
      iconColor: 'text-rose-400',
      nodeColor: 'border-rose-400 text-rose-300 bg-rose-900/80 ring-2 ring-rose-500/30',
      terminalBg: 'border-rose-500/30 bg-slate-950/90',
      numberBg: 'from-rose-500 to-red-600 text-white'
    }
  }
  if (conclusion === 'cancelled' || conclusion === 'skipped') {
    return {
      label: conclusion === 'cancelled' ? 'Cancelled' : 'Skipped',
      color: 'bg-slate-700 text-slate-200 font-bold shadow-sm',
      type: 'cancelled',
      cardBg: 'from-slate-900 via-slate-900/90 to-slate-950',
      cardBorder: 'border-slate-700 hover:border-slate-600',
      accentGradient: 'from-slate-600 to-slate-500',
      dotColor: 'bg-slate-400',
      iconColor: 'text-slate-400',
      nodeColor: 'border-slate-600 text-slate-400 bg-slate-900 ring-2 ring-slate-700/30',
      terminalBg: 'border-slate-800 bg-slate-950/90',
      numberBg: 'from-slate-700 to-slate-800 text-slate-300'
    }
  }
  return {
    label: status || 'Configured',
    color: 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/30',
    type: 'default',
    cardBg: 'from-indigo-950/70 via-slate-900/90 to-purple-950/50',
    cardBorder: 'border-indigo-500/50 hover:border-indigo-400 shadow-indigo-950/40',
    accentGradient: 'from-indigo-400 via-purple-400 to-pink-400',
    dotColor: 'bg-indigo-300',
    iconColor: 'text-indigo-400',
    nodeColor: 'border-indigo-400 text-indigo-300 bg-indigo-900/80 ring-2 ring-indigo-500/30',
    terminalBg: 'border-indigo-500/30 bg-slate-950/90',
    numberBg: 'from-indigo-500 to-purple-600 text-white'
  }
}

export async function fetchGitHubPipelineStatus(repo = DEFAULT_REPO, { signal } = {}) {
  try {
    const runsRes = await fetch(`https://api.github.com/repos/${repo}/actions/runs?branch=main&per_page=10`, {
      signal,
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (!runsRes.ok) {
      throw new Error(`GitHub API returned status ${runsRes.status}`)
    }

    const runsData = await runsRes.json()
    const runs = runsData.workflow_runs || []

    const ciRun = runs.find(r => r.path?.includes('ci.yml') || r.name?.includes('CI'))
    const cdRun = runs.find(r => r.path?.includes('deploy.yml') || r.name?.includes('CD') || r.name?.includes('Deploy'))

    let ciSteps = []
    if (ciRun) {
      try {
        const jobsRes = await fetch(`https://api.github.com/repos/${repo}/actions/runs/${ciRun.id}/jobs`, {
          signal,
          headers: { Accept: 'application/vnd.github.v3+json' }
        })
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json()
          const primaryJob = jobsData.jobs?.[0]
          ciSteps = primaryJob?.steps || []
        }
      } catch (err) {
        if (err.name === 'AbortError') throw err
        // Fall back to overall ciRun conclusion
      }
    }

    let cdSteps = []
    if (cdRun) {
      try {
        const jobsRes = await fetch(`https://api.github.com/repos/${repo}/actions/runs/${cdRun.id}/jobs`, {
          signal,
          headers: { Accept: 'application/vnd.github.v3+json' }
        })
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json()
          const primaryJob = jobsData.jobs?.[0]
          cdSteps = primaryJob?.steps || []
        }
      } catch (err) {
        if (err.name === 'AbortError') throw err
        // Fall back to overall cdRun conclusion
      }
    }

    const stages = DEFAULT_PIPELINE_STAGES.map((stage) => {
      if (stage.id === 1) {
        const step = ciSteps.find(s => s.name?.toLowerCase().includes('eslint') || s.name?.toLowerCase().includes('lint'))
        const conclusion = step ? step.conclusion : (ciRun?.conclusion || 'success')
        const status = step ? step.status : (ciRun?.status || 'completed')
        return {
          ...stage,
          conclusion,
          status: conclusion === 'success' ? 'Passing' : (conclusion === 'failure' ? 'Failed' : status),
          runNumber: ciRun?.run_number,
          runUrl: ciRun?.html_url,
          headSha: ciRun?.head_sha?.slice(0, 7),
          updatedAt: ciRun?.updated_at
        }
      }
      if (stage.id === 2) {
        const step = ciSteps.find(s => s.name?.toLowerCase().includes('test') || s.name?.toLowerCase().includes('vitest'))
        const conclusion = step ? step.conclusion : (ciRun?.conclusion || 'success')
        const status = step ? step.status : (ciRun?.status || 'completed')
        return {
          ...stage,
          conclusion,
          status: conclusion === 'success' ? 'Passing' : (conclusion === 'failure' ? 'Failed' : status),
          runNumber: ciRun?.run_number,
          runUrl: ciRun?.html_url,
          headSha: ciRun?.head_sha?.slice(0, 7),
          updatedAt: ciRun?.updated_at
        }
      }
      if (stage.id === 3) {
        const step = ciSteps.find(s => s.name?.toLowerCase().includes('build'))
        const conclusion = step ? step.conclusion : (ciRun?.conclusion || 'success')
        const status = step ? step.status : (ciRun?.status || 'completed')
        return {
          ...stage,
          conclusion,
          status: conclusion === 'success' ? 'Passing' : (conclusion === 'failure' ? 'Failed' : status),
          runNumber: ciRun?.run_number,
          runUrl: ciRun?.html_url,
          headSha: ciRun?.head_sha?.slice(0, 7),
          updatedAt: ciRun?.updated_at
        }
      }
      if (stage.id === 4) {
        const step = cdSteps.find(s => s.name?.toLowerCase().includes('deploy') || s.name?.toLowerCase().includes('pages'))
        const conclusion = cdRun ? cdRun.conclusion : null
        const status = cdRun ? cdRun.status : 'Automated'
        return {
          ...stage,
          conclusion,
          status: conclusion === 'success' ? 'Passing' : (conclusion === 'failure' ? 'Failed' : (status === 'completed' ? 'Automated' : status)),
          runNumber: cdRun?.run_number,
          runUrl: cdRun?.html_url,
          headSha: cdRun?.head_sha?.slice(0, 7),
          updatedAt: cdRun?.updated_at,
          stepFailure: step?.name
        }
      }
      return stage
    })

    const latestRun = ciRun || cdRun || runs[0]

    return {
      success: true,
      stages,
      ciRun,
      cdRun,
      latestCommit: latestRun ? {
        message: latestRun.head_commit?.message || '',
        sha: latestRun.head_sha?.slice(0, 7) || '',
        author: latestRun.head_commit?.author?.name || latestRun.actor?.login || '',
        url: latestRun.html_url
      } : null,
      lastSyncedAt: new Date().toISOString(),
      repo
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        aborted: true,
        stages: DEFAULT_PIPELINE_STAGES,
        repo
      }
    }
    return {
      success: false,
      error: err.message,
      stages: DEFAULT_PIPELINE_STAGES,
      lastSyncedAt: new Date().toISOString(),
      repo
    }
  }
}
