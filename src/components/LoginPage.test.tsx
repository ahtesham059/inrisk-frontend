import '@testing-library/jest-dom/vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '../lib/api'
import { LoginPage } from './LoginPage'

afterEach(() => vi.restoreAllMocks())

describe('LoginPage', () => {
  it('submits credentials and returns the access token', async () => {
    vi.spyOn(api, 'login').mockResolvedValue({
      access_token: 'signed-token',
      token_type: 'bearer',
      expires_in: 7200,
    })
    const onLogin = vi.fn()
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <LoginPage onLogin={onLogin} />
      </QueryClientProvider>,
    )

    await user.type(screen.getByLabelText('Username'), 'reviewer')
    await user.type(screen.getByLabelText('Password'), 'a strong password')
    await user.click(screen.getByRole('button', { name: 'Sign in securely' }))

    await waitFor(() => expect(onLogin).toHaveBeenCalledWith('signed-token'))
    expect(api.login).toHaveBeenCalledWith('reviewer', 'a strong password')
  })
})
