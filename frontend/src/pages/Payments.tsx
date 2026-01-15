import React, { useEffect, useState } from 'react'
import PaymentForm from '../components/PaymentForm'
import CardPreview from '../components/CardPreview'
import { getCards } from '../services/api'

export default function Payments() {
  const [cards, setCards] = useState<any[]>([])
  const [selected, setSelected] = useState<any | undefined>(undefined)

  useEffect(() => {
    getCards()
      .then(c => {
        setCards(c || [])
        setSelected(c?.[0])
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    if (cards.length && !selected) {
      setSelected(cards[0])
    }
  }, [cards])

  return (
    <div className="container fade-in">
      <div className="history-header">
        <h2 className="history-title">Gestión de Pagos</h2>
        <p className="history-subtitle">
          Realiza pagos utilizando tus tarjetas registradas
        </p>
      </div>

      <div className="cards-layout">
        {/* LEFT */}
        <div className="card-preview">
          <CardPreview card={selected} />

          <div className="available-cards">
            <div className="available-cards-title">Tarjetas disponibles</div>

            {cards.map(card => {
              const active = selected?.id === card.id

              return (
                <div
                  key={card.id}
                  className={`available-card-item ${active ? 'active' : ''}`}
                  onClick={() => setSelected(card)}
                >
                  <div className="available-card-info">
                    <div className="available-card-number">
                      •••• {card.cardNumber?.slice(-4)}
                    </div>
                    <div className="available-card-holder">
                      {card.holderName}
                    </div>
                  </div>

                  {active && (
                    <div className="available-card-badge">
                      Seleccionada
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="payment-panel">
          <PaymentForm cards={cards} />
        </div>
      </div>
    </div>
  )
}