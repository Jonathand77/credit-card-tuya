import React, { useState, useEffect } from 'react'
import { createPayment } from '../services/api'

export default function PaymentForm({ cards }:{ cards?: any[] }){
  const [cardId,setCardId]=useState(cards && cards[0]?.id || '')
  const [amount,setAmount]=useState(0)
  const [desc,setDesc]=useState('')

  useEffect(()=>{
    if(cards && cards.length>0 && !cardId) setCardId(cards[0].id)
  },[cards])

  const submit=async (e:any)=>{
    e.preventDefault()
    try{
      await createPayment({cardId,amount,description:desc})
      alert('Payment created')
      setAmount(0); setDesc('')
    }catch(err){console.error(err); alert('Failed')}
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="form-row"><input placeholder="Card ID" value={cardId} onChange={e=>setCardId(e.target.value)} /></div>
      <div className="form-row"><input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(Number(e.target.value))} /></div>
      <div className="form-row"><input placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} /></div>
      <button type="submit">Charge</button>
    </form>
  )
}
