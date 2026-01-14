import React, { useEffect, useState } from 'react'
import { getCards, deleteCard } from '../services/api'
import CardList from '../components/CardList'
import CardForm from '../components/CardForm'
import Modal from '../components/Modal'

export default function Cards(){
  const [cards, setCards] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any|undefined>(undefined)

  const load = async ()=>{
    try{
      const c = await getCards()
      setCards(c||[])
    }catch(err){console.error(err)}
  }

  useEffect(()=>{ load() },[])

  const handleCreated = (item:any)=> setCards(prev=>[item,...prev])
  const handleSaved = (item:any)=> {
    setCards(prev=> [item, ...prev.filter((p:any)=>p.id!==item.id)])
  }

  const handleEdit = (c:any)=>{ setEditing(c); setShowModal(true) }
  const handleDelete = async (id:string)=>{
    if(!confirm('Delete card?')) return
    try{ await deleteCard(id); setCards(prev=>prev.filter(p=>p.id!==id)) }catch(err){console.error(err)}
  }

  return (
    <div>
      <h2>Cards</h2>
      <button onClick={()=>{ setEditing(undefined); setShowModal(true) }}>Create card</button>
      <div style={{marginTop:12}}>
        <CardList items={cards} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {showModal && (
        <Modal onClose={()=>setShowModal(false)}>
          <CardForm initial={editing} onSaved={(c:any)=>{ handleSaved(c); setShowModal(false) }} onClose={()=>setShowModal(false)} />
        </Modal>
      )}
    </div>
  )
}
