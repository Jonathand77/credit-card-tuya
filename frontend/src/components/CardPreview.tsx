import { useEffect } from 'react'
import { showToast, dismissToast } from '../lib/toastStore'
import type { CardItem } from '../services/api'

export default function CardPreview({ card }: { card?: CardItem }) {
  useEffect(() => {
    if (!card) {
      const id = showToast('Selecciona una tarjeta para ver el detalle', 'info', 2500)
      return () => dismissToast(id)
    }
  }, [card])

  const available = card ? Math.max(0, card.limit - card.balance) : 0

  return (
    <div>
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

      {card && (
        <div className="credit-card-stats">
          <div className="credit-card-stat">
            <span className="credit-card-stat-label">Disponible</span>
            <span className="credit-card-stat-value">${available.toLocaleString('en-US')}</span>
          </div>
          <div className="credit-card-stat">
            <span className="credit-card-stat-label">Límite</span>
            <span className="credit-card-stat-value">${card.limit.toLocaleString('en-US')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
