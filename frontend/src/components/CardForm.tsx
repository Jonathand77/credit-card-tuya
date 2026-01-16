import React, { useState } from 'react'
import { createCard, updateCard } from '../services/api'
import { showToast } from './Toast'

const isValidFullName = (name: string) => {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2 && parts.every(p => p.length >= 2)
}

const isValidExpiry = (value: string) => {
  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)
  if (!match) return false

  const month = Number(match[1])
  const year = Number(`20${match[2]}`)

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  return (
    year > currentYear ||
    (year === currentYear && month >= currentMonth)
  )
}

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    /* -------- VALIDACIONES -------- */

    if (!holder || !expiry || limit <= 0) {
      showToast('Completa todos los campos obligatorios', 'warning')
      return
    }

    if (!isValidFullName(holder)) {
      showToast('Ingresa nombre y apellido válidos', 'error')
      return
    }

    if (!isValidExpiry(expiry)) {
      showToast('Fecha de expiración inválida o vencida', 'error')
      return
    }

    if (!initial?.id) {
      const cleanNumber = number.replace(/\s/g, '')

      if (cleanNumber.length !== 16) {
        showToast('La tarjeta debe tener 16 dígitos', 'error')
        return
      }

      if (cvv.length !== 3) {
        showToast('El CVV debe tener 3 dígitos', 'error')
        return
      }
    }

    /* -------- SUBMIT -------- */

    setSaving(true)

    try {
      let response

      if (initial?.id) {
        response = await updateCard(initial.id, {
          holderName: holder,
          expiry,
          limit,
        })

        showToast('Tarjeta actualizada correctamente', 'success')
      } else {
        response = await createCard({
          cardNumber: number.replace(/\s/g, ''),
          holderName: holder,
          expiry,
          cvv,
          limit,
        })

        showToast('Tarjeta registrada exitosamente', 'success')
      }

      onSaved?.(response)
    } catch (err) {
      console.error(err)
      showToast('No se pudo guardar la tarjeta', 'error')
    } finally {
      setSaving(false)
    }
  }

  /* ---------- FORMULARIO DE TARJETA ---------- */

  return (
    <form onSubmit={submit}>
      <div className="form-title">
        {initial?.id ? 'Editar Información' : 'Datos de Tarjeta'}
      </div>

      {!initial?.id && (
        <div className="form-row">
          <label>Número de tarjeta</label>
          <input
            placeholder="1234 5678 9012 3456"
            value={number}
            onChange={e => setNumber(e.target.value)}
          />
        </div>
      )}

      <div className="form-row">
        <label>Nombre y apellido</label>
        <input
          placeholder="Juan Pérez"
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
            placeholder="123"
            value={cvv}
            onChange={e => setCvv(e.target.value)}
          />
        </div>
      )}

      <div className="form-row">
        <label>Límite</label>
        <input
          type="number"
          min={1}
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
        />
      </div>

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving
          ? 'Guardando...'
          : initial?.id
          ? 'Guardar cambios'
          : 'Registrar tarjeta'}
      </button>
    </form>
  )
}