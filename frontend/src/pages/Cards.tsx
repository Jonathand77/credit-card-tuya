import React, { useEffect, useState } from 'react'
import { getCards, deleteCard } from '../services/api'
import CardList from '../components/CardList'
import CardForm from '../components/CardForm'
import CardPreview from '../components/CardPreview'

export default function Cards() {
  const [cards, setCards] = useState<any[]>([])
  const [editing, setEditing] = useState<any | undefined>(undefined)

  const load = async () => {
    try {
      const c = await getCards()
      setCards(c || [])
    } catch (err) {
      console.error(err)
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
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete card?')) return
    try {
      await deleteCard(id)
      setCards(prev => prev.filter(p => p.id !== id))
      if (editing?.id === id) setEditing(undefined)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container fade-in">
      <h2 style={{ marginBottom: 24 }}>Registro de Tarjetas</h2>

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