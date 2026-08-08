import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CardPreview from './CardPreview'

describe('CardPreview', () => {
  it('muestra los placeholders cuando no hay tarjeta seleccionada', () => {
    render(<CardPreview />)

    expect(screen.getByText('•••• •••• •••• 1234')).toBeInTheDocument()
    expect(screen.getByText('CARD HOLDER')).toBeInTheDocument()
    expect(screen.getByText('MM/YY')).toBeInTheDocument()
  })

  it('muestra los datos enmascarados de la tarjeta seleccionada', () => {
    render(
      <CardPreview
        card={{
          id: 'card-1',
          cardNumber: '4111111111111234',
          holderName: 'Valeria AF',
          expiry: '08/30',
          limit: 1000,
          balance: 250,
        }}
      />
    )

    expect(screen.getByText('•••• •••• •••• 1234')).toBeInTheDocument()
    expect(screen.getByText('Valeria AF')).toBeInTheDocument()
    expect(screen.getByText('08/30')).toBeInTheDocument()
    expect(screen.getByText('$750')).toBeInTheDocument()
    expect(screen.getByText('$1,000')).toBeInTheDocument()
  })
})
