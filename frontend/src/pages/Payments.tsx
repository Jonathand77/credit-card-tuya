import { useEffect, useState } from 'react'
import PaymentForm from '../components/PaymentForm'
import CardPreview from '../components/CardPreview'
import { getCards, type CardItem } from '../services/api'

const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function Payments() {
  const [cards, setCards] = useState<CardItem[]>([])
  const [selected, setSelected] = useState<CardItem | undefined>(undefined)

  useEffect(() => {
    let ignore = false

    getCards()
      .then(c => {
        if (ignore) return
        setCards(c || [])
        setSelected(c?.[0])
      })
      .catch(() => { })

    return () => { ignore = true }
  }, [])

  useEffect(() => {
    if (cards.length && !selected) {
      setSelected(cards[0])
    }
  }, [cards, selected])

  return (
    <div className="container fade-in">
      <div className="page-header">
        <h2 className="page-title">Gestión de Pagos</h2>
        <p className="page-subtitle">
          Realiza pagos utilizando tus tarjetas registradas
        </p>
      </div>

      <div className="cards-layout">
        {/* Izquierda */}
        <div className="card-preview">
          <CardPreview card={selected} />

          <div className="available-cards">
            <div className="available-cards-title">Tarjetas disponibles</div>

            {cards.map((card, i) => {
              const active = selected?.id === card.id
              const pct = card.limit > 0 ? Math.min(100, (card.balance / card.limit) * 100) : 0

              return (
                <div
                  key={card.id}
                  className={`available-card-item ${active ? 'active' : ''}`}
                  onClick={() => setSelected(card)}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="available-card-main">
                    <div className="available-card-info">
                      <div className="available-card-number">
                        •••• {card.cardNumber?.slice(-4)}
                      </div>
                      <div className="available-card-holder">
                        {card.holderName}
                      </div>
                    </div>

                    <div className={`available-card-check ${active ? 'checked' : ''}`}>
                      {active && <IconCheck />}
                    </div>
                  </div>

                  <div className="available-card-usage-bar">
                    <div
                      className="available-card-usage-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Derecha */}
        <div className="payment-panel">
          <PaymentForm cards={cards} />
        </div>
      </div>
    </div>
  )
}
