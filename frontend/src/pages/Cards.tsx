import React, { useEffect, useState } from 'react'
import { getCards, deleteCard } from '../services/api'
import CardList from '../components/CardList'
import CardForm from '../components/CardForm'
import CardPreview from '../components/CardPreview'
import { showToast } from '../components/Toast'

export default function Cards() {
  const [cards, setCards] = useState<any[]>([])
  const [editing, setEditing] = useState<any | undefined>(undefined)

  const load = async () => {
    try {
      const c = await getCards()
      setCards(c || [])
    } catch {
      showToast('No se pudieron cargar las tarjetas', 'error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSaved = (item: any) => {
    setCards(prev => [item, ...prev.filter(p => p.id !== item.id)])
    setEditing(undefined)
  }

  const handleEdit = (card: any) => {
    setEditing(card)
    showToast('Editando tarjeta seleccionada', 'info')
  }


  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar tarjeta?')) return

    try {
      await deleteCard(id)
      setCards(prev => prev.filter(p => p.id !== id))
      if (editing?.id === id) setEditing(undefined)

      showToast('Tarjeta eliminada correctamente', 'success')
    } catch {
      showToast('Error al eliminar la tarjeta', 'error')
    }
  }

  return (
    <div className="container fade-in">
      <div className="history-header">
        <h2 className="history-title">Gestión de Tarjetas</h2>
        <p className="history-subtitle">
          Registra y revisa tus tarjetas de crédito/débito para realizar pagos
        </p>
      </div>

      <div className="cards-layout">
        {/* LEFT SIDE */}
        <div className="card-preview">
          <CardPreview card={editing} />

          <div style={{ marginTop: 24 }}>
            <CardList
              items={cards}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="payment-panel">
          <CardForm
            initial={editing}
            onSaved={handleSaved}
          />
        </div>
      </div>
    </div>
  )
}