import { useEffect } from 'react'
import { showToast } from '../components/Toast'

export default function CardPreview({ card }: { card?: any }) {
  useEffect(() => {
    if (!card) {
      showToast('Selecciona una tarjeta para ver el detalle', 'info', 2500)
    }
  }, [card])

  return (
    <div className="credit-card">
      <div className="card-chip" />

      <div className="card-number">
        {card?.cardNumber
          ? `•••• •••• •••• ${card.cardNumber.slice(-4)}`
          : '•••• •••• •••• 1234'}
      </div>

      <div className="card-meta">
        <div>{card?.holderName || 'CARD HOLDER'}</div>
        <div>{card?.expiry || 'MM/YY'}</div>
      </div>
    </div>
  )
}