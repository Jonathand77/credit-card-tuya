import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/auth-context'
import { useNavigate, useLocation } from 'react-router-dom'
import Modal from '../components/Modal'
import RegisterForm from '../components/RegisterForm'
import { showToast } from '../lib/toastStore'
import logo from '../assets/img/TuyaLogo.png'

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

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
)

const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
  </svg>
)

const IconHeadset = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
    <path d="M21 14v3a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3ZM3 14v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3Z" />
  </svg>
)

const IconLockSmall = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const BENEFITS = [
  { icon: <IconShield />, title: 'Seguro y confiable', desc: 'Encriptación de nivel banco para tus datos' },
  { icon: <IconBolt />, title: 'Gestión fácil', desc: 'Interfaz intuitiva y sencilla de usar' },
  { icon: <IconHeadset />, title: 'Soporte 24/7', desc: 'Ayuda disponible en todo momento' },
]

type LoginLocationState = { from?: { pathname?: string } }

export default function Login() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LoginLocationState | null)?.from?.pathname || '/'

  /* ---------- VALIDACIONES ---------- */

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username.trim()) {
      showToast('El usuario es requerido', 'warning')
      return
    }

    if (username.length < 5) {
      showToast('Usuario inválido', 'warning')
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
      showToast('Contraseña inválida', 'warning')
      return
    }

    setLoading(true)

    try {
      await auth.login(username, email, password)

      showToast('Bienvenido 👋', 'success')

      setTimeout(() => {
        navigate(from, { replace: true })
      }, 1200)

    } catch (err) {
      const message = err instanceof Error ? err.message : ''

      if (/invalid credentials/i.test(message)) {
        showToast('Usuario o contraseña incorrectos', 'error')
      } else {
        showToast(message || 'Error al iniciar sesión', 'error')
      }

      setLoading(false)
    }
  }

  /* ---------- LOGIN ---------- */

  return (
    <div className="login-page">

      {/* Panel de marca */}
      <section className="login-brand">
        <div className="login-brand-blob blob-a" aria-hidden="true" />
        <div className="login-brand-blob blob-b" aria-hidden="true" />

        <div className="login-brand-content">
          <div className="login-brand-logo">
            <img src={logo} alt="Tuya" />
          </div>

          <h1 className="login-brand-title">
            Gestiona tus tarjetas con total confianza
          </h1>
          <p className="login-brand-subtitle">
            Controla tus pagos, revisa tu historial y mantén tus finanzas
            siempre a la vista, todo en un solo lugar.
          </p>

          <div className="login-benefits">
            {BENEFITS.map((b, i) => (
              <div
                className="login-benefit"
                key={b.title}
                style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              >
                <div className="login-benefit-icon">{b.icon}</div>
                <div>
                  <h4 className="login-benefit-title">{b.title}</h4>
                  <p className="login-benefit-desc">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Panel del formulario */}
      <section className="login-form-panel">
        <div className="login-card">
          <div className="login-card-header">
            <h2 className="login-card-title">Inicia sesión</h2>
            <p className="login-card-subtitle">Ingresa tus datos para acceder a tu cuenta</p>
          </div>

          <form onSubmit={submit} noValidate>
            <div className="login-field" style={{ animationDelay: '0.05s' }}>
              <label htmlFor="login-username">Usuario</label>
              <div className="input-icon-group">
                <IconUser />
                <input
                  id="login-username"
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

            <div className="login-field" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="login-email">Correo electrónico</label>
              <div className="input-icon-group">
                <IconMail />
                <input
                  id="login-email"
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

            <div className="login-field" style={{ animationDelay: '0.15s' }}>
              <label htmlFor="login-password">Contraseña</label>
              <div className="input-icon-group">
                <IconLock />
                <input
                  id="login-password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
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

            <div className="login-actions">
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="btn-primary btn-block"
              >
                {loading && <span className="btn-spinner" aria-hidden="true" />}
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>

              <p className="login-secondary-text">
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setShowRegister(true)}
                  disabled={loading}
                >
                  Regístrate
                </button>
              </p>
            </div>
          </form>

          <p className="login-security-note">
            <IconLockSmall />
            Tus datos están protegidos con cifrado de nivel bancario
          </p>
        </div>
      </section>

      {/* Modal de registro */}
      {showRegister && (
        <Modal onClose={() => setShowRegister(false)}>
          <RegisterForm
            onSuccess={() => { setShowRegister(false); setUsername(''); setEmail(''); setPassword(''); }}
            onClose={() => setShowRegister(false)}
          />
        </Modal>
      )}
    </div>
  )
}
