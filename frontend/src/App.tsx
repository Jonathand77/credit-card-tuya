import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Payments from './pages/Payments'
import History from './pages/History'
import { AuthProvider, useAuth } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'
import Toast from './components/Toast'

function Nav(){
  const auth = useAuth()
  const location = useLocation()
  
  // No mostrar navbar en login
  if (location.pathname === '/login') {
    return null
  }

  return (
    <nav style={{ 
      padding: '16px 24px',
      background: 'var(--color-white)',
      borderBottom: '1px solid var(--color-primary-light)',
      display:'flex', 
      gap:24, 
      alignItems:'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <Link to="/" style={{textDecoration: 'none', color: 'var(--color-primary)', fontWeight: '600', fontSize: '16px'}}>💳 Credit Card</Link>
      <Link to="/" style={{textDecoration: 'none', color: 'var(--color-dark)', transition: 'color 0.2s'}}>Dashboard</Link>
      <Link to="/cards" style={{textDecoration: 'none', color: 'var(--color-dark)', transition: 'color 0.2s'}}>Tarjetas</Link>
      <Link to="/payments" style={{textDecoration: 'none', color: 'var(--color-dark)', transition: 'color 0.2s'}}>Pagos</Link>
      <Link to="/history" style={{textDecoration: 'none', color: 'var(--color-dark)', transition: 'color 0.2s'}}>Historial</Link>
      <div style={{marginLeft:'auto'}}>
        {auth.isAuthenticated ? (
          <button 
            onClick={auth.logout}
            style={{
              padding: '10px 20px',
              background: 'var(--color-primary)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-primary-dark)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-primary)')}
          >
            Cerrar Sesión
          </button>
        ) : (
          <Link to="/login" style={{textDecoration: 'none', color: 'var(--color-primary)', fontWeight: '600'}}>Login</Link>
        )}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
          <Nav />
          <div className="container">
            <Routes>
              <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/login" element={<Login />} />
              <Route path="/cards" element={<RequireAuth><Cards /></RequireAuth>} />
              <Route path="/payments" element={<RequireAuth><Payments /></RequireAuth>} />
              <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
