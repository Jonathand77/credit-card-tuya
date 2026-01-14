import React, { useState } from 'react'
import { createCard } from '../services/api'

export default function CardForm({ onCreated }:{onCreated?:(c:any)=>void}){
  const [number,setNumber]=useState('')
  const [holder,setHolder]=useState('')
  const [expiry,setExpiry]=useState('')
  const [cvv,setCvv]=useState('')
  const [limit,setLimit]=useState(1000)

  const submit=async (e:any)=>{
    e.preventDefault()
    try{
      const c=await createCard({cardNumber:number,holderName:holder,expiry,cvv,limit})
      onCreated?.(c)
      setNumber(''); setHolder(''); setExpiry(''); setCvv(''); setLimit(1000)
    }catch(err){console.error(err)}
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="form-row"><input placeholder="Card number" value={number} onChange={e=>setNumber(e.target.value)} /></div>
      <div className="form-row"><input placeholder="Holder name" value={holder} onChange={e=>setHolder(e.target.value)} /></div>
      <div className="form-row"><input placeholder="Expiry (MM/YY)" value={expiry} onChange={e=>setExpiry(e.target.value)} /></div>
      <div className="form-row"><input placeholder="CVV" value={cvv} onChange={e=>setCvv(e.target.value)} /></div>
      <div className="form-row"><input type="number" placeholder="Limit" value={limit} onChange={e=>setLimit(Number(e.target.value))} /></div>
      <button type="submit">Create card</button>
    </form>
  )
}
