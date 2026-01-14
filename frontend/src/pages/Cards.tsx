import React, { useEffect, useState } from 'react'
import { getCards } from '../services/api'
import CardList from '../components/CardList'
import CardForm from '../components/CardForm'

export default function Cards(){
  const [cards, setCards] = useState<any[]>([])

  useEffect(()=>{
    getCards().then(c=>setCards(c||[])).catch(()=>{})
  },[])

  return (
    <div>
      <h2>Cards</h2>
      <CardForm onCreated={(c:any)=>setCards(prev=>[c,...prev])} />
      <CardList items={cards} />
    </div>
  )
}
