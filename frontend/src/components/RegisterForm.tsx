import { useState, type FormEvent } from 'react'
import { register } from '../services/api'
import { showToast } from '../lib/toastStore'

/* ---------- ICONOS ---------- */

const IconUser = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconMail = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
)

const IconLock = () => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const IconEye = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <path d="M6.61 6.61A18.5 18.5 0 0 0 1 12s4 8 11 8a9.26 9.26 0 0 0 5.39-1.61" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export default function RegisterForm({ onSuccess, onClose }: { onSuccess?: () => void, onClose?: () => void }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  /* ---------- VALIDACIONES ---------- */

  const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username.trim()) {
      showToast('El usuario es requerido', 'warning')
      return
    }

    if (username.trim().length < 5) {
      showToast('El usuario debe tener al menos 5 caracteres', 'warning')
      return
    }

    if (!email.trim()) {
      showToast('El correo electrónico es requerido', 'warning')
      return
    }

    if (!isValidEmail(email)) {
      showToast('Correo electrónico no válido', 'warning')
      return
    }

    if (!password.trim()) {
      showToast('La contraseña es requerida', 'warning')
      return
    }

    if (password.length < 5) {
      showToast('La contraseña debe tener al menos 5 caracteres', 'warning')
      return
    }

    setLoading(true)

    try {
      const result = await register(username, email, password)

      if (result?.token) {
        showToast('Cuenta creada exitosamente 🎉', 'success')

        setUsername('')
        setEmail('')
        setPassword('')

        setTimeout(() => {
          onSuccess?.()
          onClose?.()
        }, 1200)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : ''

      if (/username already exists/i.test(message)) {
        showToast('Ese nombre de usuario ya está en uso', 'warning')
      } else {
        showToast(message || 'No se pudo completar el registro', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  /* ---------- FORMULARIO DE REGISTRO ---------- */

  return (
    <form onSubmit={submit} className="register-card" noValidate>
      <h3 className="register-card-title">Crear cuenta</h3>
      <p className="register-card-subtitle">Completa tus datos para empezar a usar la app</p>

      <div className="form-row">
        <label htmlFor="register-username">Usuario</label>
        <div className="input-icon-group">
          <IconUser />
          <input
            id="register-username"
            required
            type="text"
            autoComplete="username"
            placeholder="Tu usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="register-email">Correo electrónico</label>
        <div className="input-icon-group">
          <IconMail />
          <input
            id="register-email"
            required
            type="email"
            autoComplete="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="register-password">Contraseña</label>
        <div className="input-icon-group">
          <IconLock />
          <input
            id="register-password"
            required
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Tu contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="input-icon-toggle"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </button>
        </div>
      </div>

      <div className="register-card-actions">
        <button type="submit" disabled={loading} aria-busy={loading} className="btn-primary btn-block">
          {loading && <span className="btn-spinner" aria-hidden="true" />}
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <button type="button" onClick={onClose} disabled={loading} className="btn-outline btn-block">
          Cancelar
        </button>
      </div>
    </form>
  )
}
