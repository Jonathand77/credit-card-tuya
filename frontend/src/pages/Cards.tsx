import { useEffect, useMemo, useState } from 'react'
import { getCards, deleteCard, type CardItem } from '../services/api'
import CardList from '../components/CardList'
import CardForm from '../components/CardForm'
import CardPreview from '../components/CardPreview'
import ConfirmDialog from '../components/ConfirmDialog'
import { showToast } from '../lib/toastStore'

/* ---------- ICONOS ---------- */

const IconLayers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 2 9 4.5-9 4.5-9-4.5Z" />
    <path d="m3 11.5 9 4.5 9-4.5" />
    <path d="m3 16.5 9 4.5 9-4.5" />
  </svg>
)

const IconTrendingUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const IconWallet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5Z" />
    <path d="M18 12a2 2 0 0 0 0 4h3v-4Z" />
  </svg>
)

export default function Cards() {
  const [cards, setCards] = useState<CardItem[]>([])
  const [editing, setEditing] = useState<CardItem | undefined>(undefined)
  const [pendingDelete, setPendingDelete] = useState<CardItem | undefined>(undefined)

  useEffect(() => {
    let ignore = false

    const load = async () => {
      try {
        const c = await getCards()
        if (!ignore) setCards(c || [])
      } catch {
        if (!ignore) showToast('No se pudieron cargar las tarjetas', 'error')
      }
    }

    load()
    return () => { ignore = true }
  }, [])

  const totals = useMemo(() => ({
    count: cards.length,
    limit: cards.reduce((sum, c) => sum + c.limit, 0),
    available: cards.reduce((sum, c) => sum + Math.max(0, c.limit - c.balance), 0),
  }), [cards])

  const handleSaved = (item: CardItem) => {
    setCards(prev => [item, ...prev.filter(p => p.id !== item.id)])
    setEditing(undefined)
  }

  const handleEdit = (card: CardItem) => {
    setEditing(card)
    showToast('Editando tarjeta seleccionada', 'info')
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    const id = pendingDelete.id

    try {
      await deleteCard(id)
      setCards(prev => prev.filter(p => p.id !== id))
      if (editing?.id === id) setEditing(undefined)

      showToast('Tarjeta eliminada correctamente', 'success')
    } catch {
      showToast('Error al eliminar la tarjeta', 'error')
    } finally {
      setPendingDelete(undefined)
    }
  }

  return (
    <div className="container fade-in">
      <div className="page-header">
        <h2 className="page-title">Gestión de Tarjetas</h2>
        <p className="page-subtitle">
          Registra y revisa tus tarjetas de crédito/débito para realizar pagos
        </p>
      </div>

      <div className="summary-stats">
        <div className="summary-stat" style={{ animationDelay: '0s' }}>
          <div className="summary-stat-icon"><IconLayers /></div>
          <div>
            <p className="summary-stat-label">Tarjetas</p>
            <p className="summary-stat-value">{totals.count}</p>
          </div>
        </div>

        <div className="summary-stat" style={{ animationDelay: '0.08s' }}>
          <div className="summary-stat-icon"><IconTrendingUp /></div>
          <div>
            <p className="summary-stat-label">Límite total</p>
            <p className="summary-stat-value">${totals.limit.toLocaleString('en-US')}</p>
          </div>
        </div>

        <div className="summary-stat" style={{ animationDelay: '0.16s' }}>
          <div className="summary-stat-icon"><IconWallet /></div>
          <div>
            <p className="summary-stat-label">Disponible total</p>
            <p className="summary-stat-value">${totals.available.toLocaleString('en-US')}</p>
          </div>
        </div>
      </div>

      <div className="cards-layout">
        {/* LADO IZQUIERDO */}
        <div className="card-preview">
          <CardPreview card={editing} />

          <div style={{ marginTop: 24 }}>
            <CardList
              items={cards}
              activeId={editing?.id}
              onEdit={handleEdit}
              onDelete={id => setPendingDelete(cards.find(c => c.id === id))}
            />
          </div>
        </div>

        {/* LADO DERECHO */}
        <div className="payment-panel">
          <CardForm
            initial={editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(undefined)}
          />
        </div>
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title="Eliminar tarjeta"
          message={`¿Seguro que quieres eliminar la tarjeta terminada en ${pendingDelete.cardNumber?.slice(-4) || '----'}? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar tarjeta"
          cancelLabel="Cancelar"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(undefined)}
        />
      )}
    </div>
  )
}
