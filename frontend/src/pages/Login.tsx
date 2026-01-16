import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import Modal from '../components/Modal'
import RegisterForm from '../components/RegisterForm'
import { showToast } from '../components/Toast'

export default function Login() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  /* ---------- VALIDACIONES ---------- */

  const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const submit = async (e: any) => {
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

    } catch (err: any) {
      switch (err.message) {
        case 'USER_NOT_FOUND':
          showToast('Usuario no registrado', 'warning')
          break

        case 'INVALID_CREDENTIALS':
          showToast('Usuario o contraseña incorrectos', 'error')
          break

        default:
          showToast('Error al iniciar sesión', 'error')
      }

      setLoading(false)
    }
  }

  /* ---------- LOGIN ---------- */

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5' }}>

      {/* Hero Gradient Section */}
      <section style={{
        width: '100%',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #b91c1c 50%, #7f1d1d 100%)',
        padding: '60px 24px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
      }}>
        {/* Formas decorativas */}
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          top: '-100px',
          right: '-100px'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '50%',
          bottom: '-50px',
          left: '-50px'
        }} />

        <div style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
          color: 'var(--color-white)'
        }}>
          {/*{/* Logo Tuya S.A. 
          <img
            src="/TuyaLogo.png"
            alt="Tuya S.A."
            style={{ height: '60px', marginBottom: '16px' }}
          />*/}

          {/* Contenido de texto */}
          <div style={{ textAlign: 'left', maxWidth: '800px' }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '700',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-family-heading)',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              CREDIT CARD
            </h1>
            <p style={{
              fontSize: '16px',
              margin: 0,
              opacity: 0.95,
              lineHeight: 1.6
            }}>
              Gestiona tus tarjetas de crédito, realiza pagos y consulta tu historial de transacciones
            </p>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        padding: '60px 24px',
        background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center',
            marginBottom: '80px'
          }}>

            {/* Left Column - Welcome & Benefits */}
            <div style={{ animation: 'slideIn 0.6s ease' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'var(--color-primary)',
                margin: '0 0 16px 0',
                fontFamily: 'var(--font-family-heading)',
                textTransform: 'uppercase'
              }}>
                Inicia Sesión
              </h2>
              <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.8', margin: '0 0 32px 0' }}>
                Accede a tu cuenta de Credit Card para gestionar tus tarjetas, realizar pagos seguros y monitorear tu historial de transacciones en tiempo real.
              </p>

              {/* Lista de beneficios */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: 'Seguro y Confiable', desc: 'Encriptación de nivel banco para tus datos' },
                  { title: 'Gestión Fácil', desc: 'Interfaz intuitiva y sencilla de usar' },
                  { title: 'Soporte 24/7', desc: 'Ayuda disponible en todo momento' }
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px', height: '24px', background: 'var(--color-primary)',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: 'white', fontSize: '14px',
                      fontWeight: 'bold', flexShrink: 0, marginTop: '2px'
                    }}>✓</div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600' }}>{b.title}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha - Login Form */}
            <div style={{
              background: 'var(--color-white)',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(220, 38, 38, 0.12)',
              padding: '48px 40px',
              animation: 'slideInRight 0.6s ease'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #fecaca 100%)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '32px',
                textAlign: 'center'
              }}>
                <h3 style={{
                  margin: 0, fontSize: '20px', fontWeight: '700',
                  color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px'
                }}>ACCESO RÁPIDO</h3>
              </div>

              <form onSubmit={submit}>
                {[
                  { label: 'Usuario', type: 'text', value: username, onChange: setUsername },
                  { label: 'Correo Electrónico', type: 'email', value: email, onChange: setEmail },
                  { label: 'Contraseña', type: 'password', value: password, onChange: setPassword }
                ].map((f, i) => (
                  <div className="form-row" key={i} style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block', fontSize: '12px', fontWeight: '600',
                      color: 'var(--color-primary)', marginBottom: '6px',
                      textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>{f.label}</label>
                    <input
                      required
                      type={f.type}
                      placeholder={`Tu ${f.label.toLowerCase()}`}
                      value={f.value}
                      onChange={e => f.onChange(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px 24px',
                    background: loading ? '#999' : 'var(--color-primary)',
                    color: 'var(--color-white)', fontSize: '15px', fontWeight: '600',
                    marginBottom: '12px', transition: 'all 0.3s ease',
                    textTransform: 'uppercase', letterSpacing: '1px'
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'var(--color-primary-dark)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--color-primary)')}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '14px 24px',
                    background: 'transparent', color: 'var(--color-primary)',
                    fontSize: '15px', fontWeight: '600',
                    border: '2px solid var(--color-primary)',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase', letterSpacing: '1px'
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'var(--color-primary-light)')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'transparent')}
                >
                  Crear Cuenta
                </button>
              </form>
            </div>
          </div>

          {/* Seccion de Features */}
          <div style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            padding: '60px 24px',
            background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)'
          }}>
            {['🛡️', '⚡', '✨'].map((icon, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '20px', animation: `fadeIn 0.6s ease ${0.2 + i * 0.1}s backwards` }}>
                <div style={{
                  width: '64px', height: '64px',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, #991b1b 100%)',
                  borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px', color: 'white'
                }}>{icon}</div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '600', color: 'var(--color-primary)' }}>
                  {['SEGURIDAD', 'VELOCIDAD', 'SIMPLICIDAD'][i]}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>
                  {['Protección SSL de nivel banco', 'Procesamiento instantáneo', 'Interfaz clara e intuitiva', 'Acceso desde cualquier dispositivo'][i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <Modal onClose={() => setShowRegister(false)}>
          <RegisterForm
            onSuccess={() => { setShowRegister(false); setUsername(''); setEmail(''); setPassword(''); }}
            onClose={() => setShowRegister(false)}
          />
        </Modal>
      )}

      {/* Animaciones */}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}