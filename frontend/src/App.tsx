import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cards from './pages/Cards'
import Payments from './pages/Payments'
import History from './pages/History'

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav style={{ marginBottom: 16 }}>
          <Link to="/">Dashboard</Link> | <Link to="/cards">Cards</Link> | <Link to="/payments">Payments</Link> | <Link to="/history">History</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
