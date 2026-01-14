import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Payments from './pages/Payments'
import History from './pages/History'
import { AuthProvider, useAuth } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'

function Nav(){
  const auth = useAuth()
  return (
    <nav style={{ marginBottom: 16, display:'flex', gap:12, alignItems:'center' }}>
      <Link to="/">Dashboard</Link>
      <Link to="/cards">Cards</Link>
      <Link to="/payments">Payments</Link>
      <Link to="/history">History</Link>
      <div style={{marginLeft:'auto'}}>
        {auth.isAuthenticated ? <button onClick={auth.logout}>Logout</button> : <Link to="/login">Login</Link>}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container">
          <Nav />
          <Routes>
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/cards" element={<RequireAuth><Cards /></RequireAuth>} />
            <Route path="/payments" element={<RequireAuth><Payments /></RequireAuth>} />
            <Route path="/history" element={<RequireAuth><History /></RequireAuth>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
