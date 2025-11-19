import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders correctly', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /Vite \+ React/i })
    expect(heading).toBeInTheDocument()
  })
})