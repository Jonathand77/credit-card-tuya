import { useState, useEffect, type FormEvent } from 'react'
import { createPayment, type CardItem } from '../services/api'
import { showToast } from '../lib/toastStore'

/* ---------- ICONOS ---------- */

const IconWallet = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5Z" />
    <path d="M18 12a2 2 0 0 0 0 4h3v-4Z" />
  </svg>
)

const IconDollar = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const IconNote = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
)

const QUICK_PERCENTAGES = [25, 50, 100]

export default function PaymentForm({ cards }: { cards?: CardItem[] }) {
  const [cardId, setCardId] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedCard = cards?.find(c => c.id === cardId)
  const available = selectedCard ? Math.max(0, selectedCard.limit - selectedCard.balance) : 0
  const remaining = available - (Number(amount) || 0)

  useEffect(() => {
    if (cards && cards.length > 0 && !cardId) {
      setCardId(cards[0].id)
    }
  }, [cards, cardId])

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    /* ---------- VALIDACIONES ---------- */

    if (!cards || cards.length === 0) {
      showToast('No tienes tarjetas registradas', 'warning')
      return
    }

    if (!cardId) {
      showToast('Selecciona una tarjeta válida', 'warning')
      return
    }

    if (!amount || amount <= 0) {
      showToast('Ingresa un monto válido', 'warning')
      return
    }

    if (selectedCard && amount > available) {
      showToast(
        `El monto excede el disponible ($${available.toLocaleString('en-US')})`,
        'error'
      )
      return
    }

    /* ---------- PAGO ---------- */

    setLoading(true)

    try {
      await createPayment({
        cardId,
        amount,
        description: desc,
      })

      showToast('Pago realizado exitosamente', 'success')
      setAmount('')
      setDesc('')
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      showToast(message || 'El pago fue rechazado. Intenta nuevamente', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="form-title">
        <span className="form-title-icon">
          <IconWallet />
        </span>
        Realiza un pago
      </div>

      <div className="form-row">
        <label htmlFor="payment-card">Selecciona tarjeta</label>
        <div className="input-icon-group">
          <IconWallet />
          <div className="select-wrapper">
            <select
              id="payment-card"
              value={cardId}
              onChange={e => setCardId(e.target.value)}
              disabled={loading}
            >
              {cards?.map(card => (
                <option key={card.id} value={card.id}>
                  •••• {card.cardNumber?.slice(-4)} — {card.holderName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="payment-amount">¿Cuánto deseas transferir?</label>
        <div className="input-icon-group">
          <IconDollar />
          <input
            id="payment-amount"
            type="number"
            min={0}
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={loading}
          />
        </div>

        {selectedCard && (
          <div className="quick-amounts">
            {QUICK_PERCENTAGES.map(pct => (
              <button
                key={pct}
                type="button"
                className="quick-amount-btn"
                onClick={() => setAmount(Math.floor(available * (pct / 100)))}
                disabled={loading || available <= 0}
              >
                {pct === 100 ? 'Todo' : `${pct}%`}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="payment-desc">Descripción</label>
        <div className="input-icon-group">
          <IconNote />
          <input
            id="payment-desc"
            placeholder="Descripción de la transacción"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {selectedCard && (
        <div className="payment-summary">
          <div className="payment-summary-row">
            <span>Disponible actual</span>
            <strong>${available.toLocaleString('en-US')}</strong>
          </div>
          <div className="payment-summary-row">
            <span>Después de este pago</span>
            <strong className={remaining < 0 ? 'negative' : ''}>
              ${remaining.toLocaleString('en-US')}
            </strong>
          </div>
        </div>
      )}

      <button className="btn-primary btn-block" type="submit" disabled={loading} aria-busy={loading}>
        {loading && <span className="btn-spinner" aria-hidden="true" />}
        {loading ? 'Procesando...' : 'Confirmar pago'}
      </button>
    </form>
  )
}
