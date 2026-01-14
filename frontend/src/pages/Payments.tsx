import React, { useEffect, useState } from 'react'
import PaymentForm from '../components/PaymentForm'
import { getCards } from '../services/api'

export default function Payments(){
  const [cards, setCards] = useState<any[]>([])

  useEffect(()=>{
    getCards().then(c=>setCards(c||[])).catch(()=>{})
  },[])

  return (
    <div>
      <h2>Payments</h2>
      <PaymentForm cards={cards} />
    </div>
  )
}
