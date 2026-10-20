import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from './App'
import * as githubService from './services/githubApi'

describe('React App Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders application header and title', () => {
    render(<App />)
    expect(screen.getByText(/React App \+ CI\/CD/i)).toBeInTheDocument()
    expect(screen.getByText(/Continuous Integration & Delivery/i)).toBeInTheDocument()
  })

  it('renders pipeline stages by default', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Lint & Static Analysis/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Automated Testing/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Production Build/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Deployment & Artifacts/i })).toBeInTheDocument()
  })

  it('renders GitHub Actions pipeline control bar', () => {
    render(<App />)
    expect(screen.getByText(/srdevil7569-ai\/agy-demo/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Refresh pipeline status/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Actions Console/i })).toBeInTheDocument()
  })

  it('updates pipeline stages with live GitHub Actions data', async () => {
    vi.spyOn(githubService, 'fetchGitHubPipelineStatus').mockResolvedValueOnce({
      success: true,
      stages: [
        {
          id: 1,
          name: 'Lint & Static Analysis',
          tool: 'ESLint 9',
          status: 'Passing',
          conclusion: 'success',
          description: 'Checks JavaScript syntax, React rules, and code consistency.',
          command: 'npm run lint',
          runNumber: 12,
          runUrl: 'https://github.com/srdevil7569-ai/agy-demo/actions/runs/12345',
          headSha: 'abc1234'
        },
        {
          id: 2,
          name: 'Automated Testing',
          tool: 'Vitest + Testing Library',
          status: 'Passing',
          conclusion: 'success',
          description: 'Executes unit and integration component tests in jsdom.',
          command: 'npm run test:run',
          runNumber: 12,
          runUrl: 'https://github.com/srdevil7569-ai/agy-demo/actions/runs/12345',
          headSha: 'abc1234'
        },
        {
          id: 3,
          name: 'Production Build',
          tool: 'Vite 6',
          status: 'Passing',
          conclusion: 'success',
          description: 'Bundles optimized ES modules, minifies CSS, and generates chunks.',
          command: 'npm run build',
          runNumber: 12,
          runUrl: 'https://github.com/srdevil7569-ai/agy-demo/actions/runs/12345',
          headSha: 'abc1234'
        },
        {
          id: 4,
          name: 'Deployment & Artifacts',
          tool: 'GitHub Actions & Pages',
          status: 'Failed',
          conclusion: 'failure',
          description: 'Deploys production build to GitHub Pages and packages Docker image.',
          command: 'git push origin main',
          runNumber: 8,
          runUrl: 'https://github.com/srdevil7569-ai/agy-demo/actions/runs/12346',
          headSha: 'abc1234'
        }
      ],
      latestCommit: {
        message: 'fix: testing live pipeline',
        sha: 'abc1234',
        author: 'srdevil7569-ai',
        url: 'https://github.com/srdevil7569-ai/agy-demo/actions/runs/12345'
      },
      lastSyncedAt: new Date().toISOString(),
      repo: 'srdevil7569-ai/agy-demo'
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Live GitHub Actions Status')).toBeInTheDocument()
      expect(screen.getByText('abc1234')).toBeInTheDocument()
      expect(screen.getByText(/Run #12/i)).toBeInTheDocument()
    })
  })

  it('allows clicking the refresh pipeline status button', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(githubService, 'fetchGitHubPipelineStatus').mockResolvedValue({
      success: true,
      stages: githubService.DEFAULT_PIPELINE_STAGES,
      repo: 'srdevil7569-ai/agy-demo'
    })

    render(<App />)
    const refreshBtn = screen.getByRole('button', { name: /Refresh pipeline status/i })
    await user.click(refreshBtn)

    expect(fetchSpy).toHaveBeenCalled()
  })

  it('allows toggling between light and dark theme mode', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggleBtn = screen.getByRole('button', { name: /Toggle theme mode/i })
    expect(toggleBtn).toBeInTheDocument()

    // Toggle theme
    await user.click(toggleBtn)
    expect(toggleBtn).toBeInTheDocument()
  })

  it('allows switching to technology stack tab', async () => {
    const user = userEvent.setup()
    render(<App />)

    const stackTab = screen.getByRole('button', { name: /Technology Stack/i })
    await user.click(stackTab)

    expect(screen.getByText('Tailwind CSS 4')).toBeInTheDocument()
    expect(screen.getByText('GitHub Actions')).toBeInTheDocument()
  })
})
