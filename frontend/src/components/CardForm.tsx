import React, { useState } from 'react'
import { createCard, updateCard } from '../services/api'

export default function CardForm({
  initial,
  onSaved,
}: {
  initial?: any
  onSaved?: (c: any) => void
}) {
  const [number, setNumber] = useState(initial?.cardNumber || '')
  const [holder, setHolder] = useState(initial?.holderName || '')
  const [expiry, setExpiry] = useState(initial?.expiry || '')
  const [cvv, setCvv] = useState('')
  const [limit, setLimit] = useState(initial?.limit || 1000)
  const [saving, setSaving] = useState(false)

  const submit = async (e: any) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (initial?.id) {
        const payload = { holderName: holder, expiry, limit }
        const c = await updateCard(initial.id, payload)
        onSaved?.(c)
      } else {
        const payload = {
          cardNumber: number,
          holderName: holder,
          expiry,
          cvv,
          limit,
        }
        const c = await createCard(payload)
        onSaved?.(c)
      }
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="form-title">
        {initial?.id ? 'Editar Información' : 'Datos de Tarjeta'}
      </div>

      {!initial?.id && (
        <div className="form-row">
          <label>Número Tarjeta</label>
          <input
            placeholder="1234 5678 9012 3456"
            value={number}
            onChange={e => setNumber(e.target.value)}
          />
        </div>
      )}

      <div className="form-row">
        <label>Nombre Tarjeta</label>
        <input
          placeholder="John Doe"
          value={holder}
          onChange={e => setHolder(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Fecha de expiración</label>
        <input
          placeholder="MM/YY"
          value={expiry}
          onChange={e => setExpiry(e.target.value)}
        />
      </div>

      {!initial?.id && (
        <div className="form-row">
          <label>CVV</label>
          <input
            placeholder="***"
            value={cvv}
            onChange={e => setCvv(e.target.value)}
          />
        </div>
      )}

      <div className="form-row">
        <label>Limite</label>
        <input
          type="number"
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
        />
      </div>

      <button className="btn-primary" type="submit" disabled={saving}>
        {initial?.id ? 'Guardar' : 'Registrar Tarjeta'}
      </button>
    </form>
  )
}