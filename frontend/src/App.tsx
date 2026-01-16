import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Payments from './pages/Payments'
import History from './pages/History'

import { AuthProvider, useAuth } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'
import Toast, { showToast } from './components/Toast'
import Footer from './components/Footer'

import logo from './assets/img/TuyaLogo.png'

function Nav() {
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // No mostrar navbar en login
  if (location.pathname === '/login') return null

  const isActive = (path: string) =>
    location.pathname === path ? 'nav-link active' : 'nav-link'

  const handleLogout = () => {
    auth.logout()
    showToast('Sesión cerrada correctamente', 'info')
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <img
            src={logo}
            alt="Tuya Bank"
            className="navbar-logo-img"
          />
        </Link>

        {/* LINKS */}
        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>Dashboard</Link>
          <Link to="/cards" className={isActive('/cards')}>Tarjetas</Link>
          <Link to="/payments" className={isActive('/payments')}>Pagos</Link>
          <Link to="/history" className={isActive('/history')}>Historial</Link>
        </div>

        {/* ACTIONS */}
        <div className="navbar-actions">
          {auth.isAuthenticated && (
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* TOAST GLOBAL */}
        <Toast />

        {/* LAYOUT ROOT */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          {/* NAVBAR */}
          <Nav />

          {/* CONTENIDO PRINCIPAL */}
          <main style={{ flex: 1 }}>
            <div className="container">
              <Routes>
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />

                <Route path="/login" element={<Login />} />

                <Route
                  path="/cards"
                  element={
                    <RequireAuth>
                      <Cards />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/payments"
                  element={
                    <RequireAuth>
                      <Payments />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/history"
                  element={
                    <RequireAuth>
                      <History />
                    </RequireAuth>
                  }
                />
              </Routes>
            </div>
          </main>

          {/* FOOTER GLOBAL */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}