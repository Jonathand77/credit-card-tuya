import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Toast from './Toast'
import { showToast } from '../lib/toastStore'

describe('Toast', () => {
  it('muestra un mensaje disparado con showToast', async () => {
    render(<Toast />)

    showToast('Tarjeta guardada correctamente', 'success', 0)

    expect(await screen.findByText('Tarjeta guardada correctamente')).toBeInTheDocument()
  })

  it('cierra el mensaje al hacer clic en la X', async () => {
    const user = userEvent.setup()
    render(<Toast />)

    showToast('Error al procesar el pago', 'error', 0)
    const messageEl = await screen.findByText('Error al procesar el pago')
    const toastItem = messageEl.closest('div') as HTMLElement

    await user.click(within(toastItem).getByRole('button'))

    await waitFor(() =>
      expect(screen.queryByText('Error al procesar el pago')).not.toBeInTheDocument()
    )
  })
})
