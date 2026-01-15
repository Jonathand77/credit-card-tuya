import React, { useEffect, useState } from 'react'
import { getCards, getTransactions } from '../services/api'

// Pequeño componente para las gráficas tipo "Sparkline"
const Sparkline = ({ color }: { color: string }) => (
  <svg viewBox="0 0 100 30" className="sparkline">
    <path
      d="M0 25C20 25 30 5 50 15S80 0 100 10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M0 25C20 25 30 5 50 15S80 0 100 10L100 30L0 30Z"
      fill={`url(#gradient-${color})`}
      opacity="0.2"
    />
    <defs>
      <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={color} />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
  </svg>
);

export default function Dashboard() {
  const [cards, setCards] = useState<any[]>([])
  const [txs, setTxs] = useState<any[]>([])

  useEffect(() => {
    getCards().then(c => setCards(c || []))
    getTransactions({ page: 1, size: 50 })
      .then(r => setTxs(r.items || []))
      .catch(() => { })
  }, [])

  const totalAmount = txs.reduce((a, b) => a + b.amount, 0)
  const avgAmount = txs.length ? totalAmount / txs.length : 0
  const payments = txs.filter(t => {
    const type = t.type?.toLowerCase();
    return type === 'payment' || type === 'pago' || type === 'charge';
  }).length;

  return (
    <div className="container fade-in">
      {/* HEADER ESTILO DASHBOARD */}
      <header className="dashboard-header-new">
        <div className="history-header">
          <h2 className="history-title">DASHBOARD</h2>
          <p className="history-subtitle">Aquí puedes encontrar tu gestión financiera.</p>
        </div>
      </header>

      {/* SECCIÓN DE MÉTRICAS */}
      <div className="dashboard-section">
        <h3 className="section-title">Datos principales</h3>

        <div className="dashboard-grid-modern">

          {/* Tarjeta 1: Balance */}
          <div className="metric-card-modern">
            <span className="time-tag">Total acumulado</span>
            <div className="card-body">
              <p className="metric-label">Balance Total</p>
              <h2 className="metric-value">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              <Sparkline color="#10b981" />
            </div>
            <div className="card-footer">
              <span className="trend positive">↑ 6.1%</span>
              <span className="source">Finanzas</span>
            </div>
          </div>

          {/* Tarjeta 2: Transacciones */}
          <div className="metric-card-modern">
            <span className="time-tag">Histórico</span>
            <div className="card-body">
              <p className="metric-label">Transacciones</p>
              <h2 className="metric-value">{txs.length}</h2>
              <Sparkline color="#ef4444" />
            </div>
            <div className="card-footer">
              <span className="trend negative">↓ 2%</span>
              <span className="source">Actividad</span>
            </div>
          </div>

          {/* Tarjeta 3: Tarjetas */}
          <div className="metric-card-modern">
            <span className="time-tag">Métodos</span>
            <div className="card-body">
              <p className="metric-label">Tarjetas Registradas</p>
              <h2 className="metric-value">{cards.length}</h2>
              <Sparkline color="#3b82f6" />
            </div>
            <div className="card-footer">
              <span className="trend positive">↑ 12%</span>
              <span className="source">Wallet</span>
            </div>
          </div>

          {/* Tarjeta 4: Promedio */}
          <div className="metric-card-modern">
            <span className="time-tag">Mes actual</span>
            <div className="card-body">
              <p className="metric-label">Promedio de Gastos</p>
              <h2 className="metric-value">${avgAmount.toFixed(2)}</h2>
              <Sparkline color="#f59e0b" />
            </div>
            <div className="card-footer">
              <span className="trend neutral">0.5%</span>
              <span className="source">Análisis</span>
            </div>
          </div>

          {/* Tarjeta 5: Pagos Realizados */}
          <div className="metric-card-modern full-width-tablet">
            <span className="time-tag">Efectividad</span>
            <div className="card-body">
              <p className="metric-label">Pagos Realizados</p>
              <h2 className="metric-value">{payments}</h2>
              <div className="progress-container-modern">
                <div
                  className="progress-bar-modern"
                  style={{
                    width: `${txs.length > 0 ? (payments / txs.length) * 100 : 0}%`,
                    transition: 'width 1s ease'
                  }}
                />
              </div>
            </div>
            <div className="card-footer">
              <span className="source">{payments} de {txs.length} transacciones</span>
              <span className="source">Estado: Completados</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}