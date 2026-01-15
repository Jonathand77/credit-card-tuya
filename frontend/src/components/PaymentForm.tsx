import React, { useState, useEffect } from 'react'
import { createPayment } from '../services/api'

export default function PaymentForm({ cards }: { cards?: any[] }) {
  const [cardId, setCardId] = useState(cards && cards[0]?.id || '')
  const [amount, setAmount] = useState(0)
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cards && cards.length > 0 && !cardId) {
      setCardId(cards[0].id)
    }
  }, [cards])

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createPayment({
        cardId,
        amount,
        description: desc,
      })
      alert('Pago realizado correctamente!')
      setAmount(0)
      setDesc('')
    } catch (err) {
      console.error(err)
      alert('Pago denegado')
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
          <select value={cardId} onChange={e => setCardId(e.target.value)}>
            {cards?.map(card => (
              <option key={card.id} value={card.id}>
                •••• {card.cardNumber?.slice(-4)} — {card.holderName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <label>¿Cuanto desea transferir?</label>
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

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Confirmar Pago'}
      </button>
    </form>
  )
}