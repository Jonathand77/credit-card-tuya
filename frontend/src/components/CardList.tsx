import type { CardItem } from '../services/api'

/* ---------- ICONOS ---------- */

const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
)

const IconTrash = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
  </svg>
)

const IconEmpty = () => (
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
)

const usageLevel = (balance: number, limit: number) => {
  if (limit <= 0) return 'low'
  const pct = (balance / limit) * 100
  if (pct >= 85) return 'high'
  if (pct >= 60) return 'medium'
  return 'low'
}

export default function CardList({
  items,
  activeId,
  onEdit,
  onDelete,
}: {
  items: CardItem[]
  activeId?: string
  onEdit?: (c: CardItem) => void
  onDelete?: (id: string) => void
}) {
  if (!items || items.length === 0) {
    return (
      <div className="card-list-empty">
        <IconEmpty />
        <p className="card-list-empty-title">Aún no tienes tarjetas registradas</p>
        <p className="card-list-empty-desc">Usa el formulario para registrar tu primera tarjeta</p>
      </div>
    )
  }

  return (
    <div className="card-list">
      {items.map((c, i) => {
        const pct = c.limit > 0 ? Math.min(100, (c.balance / c.limit) * 100) : 0
        const level = usageLevel(c.balance, c.limit)

        return (
          <div
            key={c.id}
            className={`card-list-item${c.id === activeId ? ' active' : ''}`}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="card-list-item-main">
              <div className="card-list-item-info">
                <strong>{c.holderName}</strong>
                <span className="card-list-item-number">
                  •••• •••• •••• {c.cardNumber?.slice(-4) || '----'}
                </span>
              </div>

              <div className="card-list-item-actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => onEdit?.(c)}
                  aria-label="Editar tarjeta"
                >
                  <IconEdit />
                </button>
                <button
                  type="button"
                  className="icon-btn icon-btn-danger"
                  onClick={() => onDelete?.(c.id)}
                  aria-label="Eliminar tarjeta"
                >
                  <IconTrash />
                </button>
              </div>
            </div>

            <div className="card-list-item-usage">
              <div className="card-list-usage-bar">
                <div
                  className={`card-list-usage-fill usage-${level}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="card-list-usage-labels">
                <span>${c.balance.toLocaleString('en-US')} usado</span>
                <span>Límite ${c.limit.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
