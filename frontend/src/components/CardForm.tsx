import { useState, type FormEvent } from 'react'
import { createCard, updateCard, type CardItem } from '../services/api'
import { showToast } from '../lib/toastStore'

/* ---------- ICONOS ---------- */

const IconCard = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

const IconUser = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconCalendar = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconLock = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconDollar = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

/* ---------- FORMATEADORES ---------- */

const formatCardNumberInput = (value: string) =>
  value.replace(/\D/g, '').slice(0, 16).match(/.{1,4}/g)?.join(' ') || ''

const formatExpiryInput = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

/* ---------- VALIDACIONES ---------- */

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
  onCancel,
}: {
  initial?: CardItem
  onSaved?: (c: CardItem) => void
  onCancel?: () => void
}) {
  const [number, setNumber] = useState('')
  const [holder, setHolder] = useState(initial?.holderName || '')
  const [expiry, setExpiry] = useState(initial?.expiry || '')
  const [cvv, setCvv] = useState('')
  const [limit, setLimit] = useState(initial?.limit ?? 1000)
  const [saving, setSaving] = useState(false)

  const isEditing = Boolean(initial?.id)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
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

    const cleanNumber = number.replace(/\s/g, '')

    if (!isEditing) {
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
      let result: CardItem

      if (initial?.id) {
        // El endpoint de actualización responde 204 sin cuerpo, así que
        // reconstruimos el registro localmente con los campos editados.
        await updateCard(initial.id, { holderName: holder, expiry, limit })
        result = { ...initial, holderName: holder, expiry, limit }

        showToast('Tarjeta actualizada correctamente', 'success')
      } else {
        result = await createCard({
          cardNumber: cleanNumber,
          holderName: holder,
          expiry,
          cvv,
          limit,
        })

        showToast('Tarjeta registrada exitosamente', 'success')
        setNumber('')
        setHolder('')
        setExpiry('')
        setCvv('')
        setLimit(1000)
      }

      onSaved?.(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      showToast(message || 'No se pudo guardar la tarjeta', 'error')
    } finally {
      setSaving(false)
    }
  }

  /* ---------- FORMULARIO DE TARJETA ---------- */

  return (
    <form onSubmit={submit} className="card-form" noValidate>
      <div className="form-title">
        <span className="form-title-icon">
          <IconCard />
        </span>
        {isEditing ? 'Editar información' : 'Datos de tarjeta'}
      </div>

      {!isEditing && (
        <div className="form-row">
          <label htmlFor="card-number">Número de tarjeta</label>
          <div className="input-icon-group">
            <IconCard />
            <input
              id="card-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              value={number}
              onChange={e => setNumber(formatCardNumberInput(e.target.value))}
              disabled={saving}
            />
          </div>
        </div>
      )}

      <div className="form-row">
        <label htmlFor="card-holder">Nombre y apellido</label>
        <div className="input-icon-group">
          <IconUser />
          <input
            id="card-holder"
            autoComplete="cc-name"
            placeholder="Juan Pérez"
            value={holder}
            onChange={e => setHolder(e.target.value)}
            disabled={saving}
          />
        </div>
      </div>

      <div className="card-form-grid">
        <div className="form-row">
          <label htmlFor="card-expiry">Vencimiento</label>
          <div className="input-icon-group">
            <IconCalendar />
            <input
              id="card-expiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={expiry}
              onChange={e => setExpiry(formatExpiryInput(e.target.value))}
              disabled={saving}
            />
          </div>
        </div>

        {!isEditing && (
          <div className="form-row">
            <label htmlFor="card-cvv">CVV</label>
            <div className="input-icon-group">
              <IconLock />
              <input
                id="card-cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                disabled={saving}
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="card-limit">Límite de crédito</label>
        <div className="input-icon-group">
          <IconDollar />
          <input
            id="card-limit"
            type="number"
            min={1}
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            disabled={saving}
          />
        </div>
      </div>

      <div className="card-form-actions">
        <button className="btn-primary btn-block" type="submit" disabled={saving} aria-busy={saving}>
          {saving && <span className="btn-spinner" aria-hidden="true" />}
          {saving
            ? 'Guardando...'
            : isEditing
            ? 'Guardar cambios'
            : 'Registrar tarjeta'}
        </button>

        {isEditing && (
          <button
            type="button"
            className="btn-outline btn-block"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  )
}
