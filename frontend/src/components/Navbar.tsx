import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { showToast } from '../lib/toastStore'
import logo from '../assets/img/TuyaLogo.png'

/* ---------- ICONOS ---------- */

const IconHome = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const IconCreditCard = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

const IconSend = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const IconHistory = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5" />
    <path d="M3.05 13a9 9 0 1 0 .5-4.5L3 8" />
    <path d="M12 7v5l4 2" />
  </svg>
)

const IconMenu = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const IconClose = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: <IconHome /> },
  { to: '/cards', label: 'Tarjetas', icon: <IconCreditCard /> },
  { to: '/payments', label: 'Pagos', icon: <IconSend /> },
  { to: '/history', label: 'Historial', icon: <IconHistory /> },
]

export default function Navbar() {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // No mostrar navbar en login
  if (location.pathname === '/login') return null

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    auth.logout()
    showToast('Sesión cerrada correctamente', 'info')
    navigate('/login', { replace: true })
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Tuya Bank" className="navbar-logo-img" />
        </Link>

        {/* LINKS */}
        <div className="navbar-links">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="navbar-actions">
          {auth.isAuthenticated && (
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}

          <button
            type="button"
            className="navbar-menu-toggle"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link-mobile ${isActive(link.to) ? 'active' : ''}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span className="nav-link-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
