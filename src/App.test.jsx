import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('React App Component', () => {
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

  it('allows switching to interactive counter tab and updating count', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Switch to Interactive Demo tab
    const counterTab = screen.getByRole('button', { name: /Interactive Demo/i })
    await user.click(counterTab)

    expect(screen.getByText(/Interactive Component State/i)).toBeInTheDocument()
    expect(screen.getByTestId('count-value')).toHaveTextContent('0')

    // Increment
    const incrementBtn = screen.getByRole('button', { name: /Increment count/i })
    await user.click(incrementBtn)
    expect(screen.getByTestId('count-value')).toHaveTextContent('1')

    // Decrement
    const decrementBtn = screen.getByRole('button', { name: /Decrement count/i })
    await user.click(decrementBtn)
    expect(screen.getByTestId('count-value')).toHaveTextContent('0')

    // Reset
    await user.click(incrementBtn)
    await user.click(incrementBtn)
    expect(screen.getByTestId('count-value')).toHaveTextContent('2')

    const resetBtn = screen.getByRole('button', { name: /Reset count/i })
    await user.click(resetBtn)
    expect(screen.getByTestId('count-value')).toHaveTextContent('0')
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
