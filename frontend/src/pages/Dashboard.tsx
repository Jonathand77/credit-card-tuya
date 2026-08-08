import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCards, getTransactions, type CardItem, type TransactionItem } from '../services/api'

/* ---------- ICONOS ---------- */

const IconWallet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5Z" />
    <path d="M18 12a2 2 0 0 0 0 4h3v-4Z" />
  </svg>
)

const IconShieldCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 2 9 4.5-9 4.5-9-4.5Z" />
    <path d="m3 11.5 9 4.5 9-4.5" />
    <path d="m3 16.5 9 4.5 9-4.5" />
  </svg>
)

const IconReceipt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
)

const IconCreditCard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const IconHistory = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5" />
    <path d="M3.05 13a9 9 0 1 0 .5-4.5L3 8" />
    <path d="M12 7v5l4 2" />
  </svg>
)

/* ---------- GRÁFICA DE ACTIVIDAD (datos reales) ---------- */

function buildSparkline(values: number[]) {
  if (values.length < 2) {
    return { line: 'M0 24 L100 24', area: 'M0 24 L100 24 L100 30 L0 30 Z' }
  }

  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const stepX = 100 / (values.length - 1)

  const points = values.map((v, i) => {
    const x = i * stepX
    const y = 28 - ((v - min) / range) * 24
    return { x, y }
  })

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L100 30 L0 30 Z`

  return { line, area }
}

export default function Dashboard() {
  const [cards, setCards] = useState<CardItem[]>([])
  const [txs, setTxs] = useState<TransactionItem[]>([])
  const [txTotal, setTxTotal] = useState(0)

  useEffect(() => {
    let ignore = false

    getCards().then(c => { if (!ignore) setCards(c || []) })
    getTransactions({ page: 1, size: 50 })
      .then(r => {
        if (ignore) return
        setTxs(r.items || [])
        setTxTotal(r.total || 0)
      })
      .catch(() => { })

    return () => { ignore = true }
  }, [])

  const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0)
  const totalLimit = cards.reduce((sum, c) => sum + c.limit, 0)
  const totalAvailable = Math.max(0, totalLimit - totalBalance)

  const recentTxs = txs.slice(0, 5)
  const chartValues = txs.slice(0, 10).map(t => t.amount).reverse()
  const { line, area } = buildSparkline(chartValues)

  return (
    <div className="container fade-in">
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-subtitle">Un vistazo general a tus finanzas</p>
      </div>

      <div className="summary-stats">
        <div className="summary-stat" style={{ animationDelay: '0s' }}>
          <div className="summary-stat-icon"><IconWallet /></div>
          <div>
            <p className="summary-stat-label">Saldo total</p>
            <p className="summary-stat-value">${totalBalance.toLocaleString('en-US')}</p>
          </div>
        </div>

        <div className="summary-stat" style={{ animationDelay: '0.06s' }}>
          <div className="summary-stat-icon"><IconShieldCheck /></div>
          <div>
            <p className="summary-stat-label">Disponible total</p>
            <p className="summary-stat-value">${totalAvailable.toLocaleString('en-US')}</p>
          </div>
        </div>

        <div className="summary-stat" style={{ animationDelay: '0.12s' }}>
          <div className="summary-stat-icon"><IconLayers /></div>
          <div>
            <p className="summary-stat-label">Tarjetas</p>
            <p className="summary-stat-value">{cards.length}</p>
          </div>
        </div>

        <div className="summary-stat" style={{ animationDelay: '0.18s' }}>
          <div className="summary-stat-icon"><IconReceipt /></div>
          <div>
            <p className="summary-stat-label">Transacciones</p>
            <p className="summary-stat-value">{txTotal}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-activity-grid">
        {/* Gráfica de actividad reciente */}
        <div className="activity-chart-card">
          <div className="activity-chart-header">
            <div>
              <p className="activity-chart-label">Actividad reciente</p>
              <p className="activity-chart-value">
                ${chartValues.reduce((a, b) => a + b, 0).toLocaleString('en-US')}
              </p>
            </div>
            <span className="activity-chart-hint">Últimas {chartValues.length} transacciones</span>
          </div>

          {chartValues.length > 0 ? (
            <svg viewBox="0 0 100 30" className="activity-chart-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="activityGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#activityGradient)" />
              <path d={line} fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <p className="activity-chart-empty">Aún no hay suficientes datos para graficar</p>
          )}
        </div>

        {/* Lista de actividad reciente */}
        <div className="activity-list-card">
          <p className="activity-chart-label">Últimos movimientos</p>

          {recentTxs.length === 0 ? (
            <p className="activity-chart-empty">No hay transacciones recientes</p>
          ) : (
            <div className="activity-list">
              {recentTxs.map((tx, i) => (
                <div key={tx.id} className="activity-item" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="activity-item-icon"><IconReceipt /></div>
                  <div className="activity-item-info">
                    <span className="activity-item-desc">{tx.description || 'Pago con tarjeta'}</span>
                    <span className="activity-item-date">{new Date(tx.timestamp).toLocaleDateString()}</span>
                  </div>
                  <span className="activity-item-amount">${tx.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <Link to="/history" className="activity-list-link">Ver historial completo →</Link>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="quick-actions">
        <Link to="/cards" className="quick-action-card">
          <div className="quick-action-icon"><IconCreditCard /></div>
          <div>
            <p className="quick-action-title">Registrar tarjeta</p>
            <p className="quick-action-desc">Agrega una nueva tarjeta a tu cuenta</p>
          </div>
        </Link>

        <Link to="/payments" className="quick-action-card">
          <div className="quick-action-icon"><IconSend /></div>
          <div>
            <p className="quick-action-title">Realizar pago</p>
            <p className="quick-action-desc">Paga usando cualquiera de tus tarjetas</p>
          </div>
        </Link>

        <Link to="/history" className="quick-action-card">
          <div className="quick-action-icon"><IconHistory /></div>
          <div>
            <p className="quick-action-title">Ver historial</p>
            <p className="quick-action-desc">Revisa y descarga tus facturas</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
