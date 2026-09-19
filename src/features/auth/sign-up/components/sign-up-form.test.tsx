import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { SignUpForm } from './sign-up-form'

const FORM_MESSAGES = {
  nameEmpty: 'Name is required',
  emailEmpty: 'Email is required',
  passwordEmpty: 'Password must be at least 8 characters',
  confirmPasswordEmpty: 'Please confirm your password',
  passwordMismatch: "Passwords don't match.",
} as const

const registerMock = vi.fn()

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (selector: (state: unknown) => unknown) => {
    if (typeof selector === 'function') {
      return selector({ register: registerMock })
    }
  },
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('SignUpForm', () => {
  let screen: RenderResult
  let nameInput: Locator
  let emailInput: Locator
  let passwordInput: Locator
  let confirmPasswordInput: Locator
  let submitButton: Locator

  beforeEach(async () => {
    vi.clearAllMocks()

    screen = await render(<SignUpForm />)
    nameInput = screen.getByRole('textbox', { name: /^Name$/i })
    emailInput = screen.getByRole('textbox', { name: /^Email$/i })
    passwordInput = screen.getByLabelText(/^Password$/i)
    confirmPasswordInput = screen.getByLabelText(/^Confirm Password$/i)
    submitButton = screen.getByRole('button', { name: /^Create Account$/i })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders all fields and submit button', async () => {
    await expect.element(nameInput).toBeInTheDocument()
    await expect.element(emailInput).toBeInTheDocument()
    await expect.element(passwordInput).toBeInTheDocument()
    await expect.element(confirmPasswordInput).toBeInTheDocument()
    await expect.element(submitButton).toBeInTheDocument()
  })

  it('shows validation messages when submitting empty form', async () => {
    await userEvent.click(submitButton)

    await expect
      .element(screen.getByText(FORM_MESSAGES.nameEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.emailEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.passwordEmpty))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText(FORM_MESSAGES.confirmPasswordEmpty))
      .toBeInTheDocument()
  })

  it('shows a mismatch error when passwords do not match', async () => {
    await userEvent.fill(nameInput, 'Test')
    await userEvent.fill(emailInput, 'a@b.com')
    await userEvent.fill(passwordInput, '12345678')
    await userEvent.fill(confirmPasswordInput, '87654321')

    await userEvent.click(submitButton)
    await expect
      .element(screen.getByText(FORM_MESSAGES.passwordMismatch))
      .toBeInTheDocument()
  })

  it('calls register on valid submission', async () => {
    registerMock.mockResolvedValueOnce(undefined)

    await userEvent.fill(nameInput, 'Test User')
    await userEvent.fill(emailInput, 'a@b.com')
    await userEvent.fill(passwordInput, '12345678')
    await userEvent.fill(confirmPasswordInput, '12345678')

    await userEvent.click(submitButton)

    await vi.waitFor(() => expect(registerMock).toHaveBeenCalledOnce())
    expect(registerMock).toHaveBeenCalledWith(
      'Test User',
      'a@b.com',
      '12345678'
    )
  })
})