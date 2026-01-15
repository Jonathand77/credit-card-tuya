import React, { useState, useEffect } from 'react'
import { createPayment } from '../services/api'
import { showToast } from './Toast'

export default function PaymentForm({ cards }: { cards?: any[] }) {
  const [cardId, setCardId] = useState('')
  const [amount, setAmount] = useState<number | ''>('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedCard = cards?.find(c => c.id === cardId)

  useEffect(() => {
    if (cards && cards.length > 0 && !cardId) {
      setCardId(cards[0].id)
    }
  }, [cards])

  const submit = async (e: React.FormEvent) => {
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

    if (selectedCard && amount > selectedCard.limit) {
      showToast(
        `El monto excede el límite disponible ($${selectedCard.limit})`,
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
      console.error(err)
      showToast('El pago fue rechazado. Intenta nuevamente', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-title">Realiza un Pago</div>

      <div className="form-row">
        <label>Seleccione Tarjeta</label>

        <div className="select-wrapper">
          <select
            value={cardId}
            onChange={e => setCardId(e.target.value)}
          >
            {cards?.map(card => (
              <option key={card.id} value={card.id}>
                •••• {card.cardNumber?.slice(-4)} — {card.holderName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <label>¿Cuánto desea transferir?</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
        />
      </div>

      <div className="form-row">
        <label>Descripción</label>
        <input
          placeholder="Descripción de la transacción"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
      </div>

      {selectedCard && (
        <div className="payment-summary">
          <div>
            <strong>Límite disponible:</strong> ${selectedCard.limit}
          </div>
        </div>
      )}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Procesando...' : 'Confirmar Pago'}
      </button>
    </form>
  )
}