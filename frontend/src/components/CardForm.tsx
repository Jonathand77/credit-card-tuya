import React, { useState } from 'react'
import { createCard } from '../services/api'

export default function CardForm({ initial, onSaved, onClose }:{ initial?:any, onSaved?:(c:any)=>void, onClose?:()=>void }){
  const [number,setNumber]=useState(initial?.cardNumber||'')
  const [holder,setHolder]=useState(initial?.holderName||initial?.holder||'')
  const [expiry,setExpiry]=useState(initial?.expiry||'')
  const [cvv,setCvv]=useState('')
  const [limit,setLimit]=useState(initial?.limit||1000)
  const [saving,setSaving]=useState(false)

  const submit=async (e:any)=>{
    e.preventDefault()
    setSaving(true)
    try{
      if(initial?.id){
        const payload = { holderName: holder, expiry, limit }
        const c = await updateCard(initial.id, payload)
        onSaved?.(c)
      } else {
        const payload = { cardNumber: number, holderName: holder, expiry, cvv, limit }
        const c = await createCard(payload)
        onSaved?.(c)
      }
      onClose?.()
    }catch(err){
      console.error(err)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="card">
      {!initial?.id && <div className="form-row"><input placeholder="Card number" value={number} onChange={e=>setNumber(e.target.value)} /></div>}
      <div className="form-row"><input placeholder="Holder name" value={holder} onChange={e=>setHolder(e.target.value)} /></div>
      <div className="form-row"><input placeholder="Expiry (MM/YY)" value={expiry} onChange={e=>setExpiry(e.target.value)} /></div>
      {!initial?.id && <div className="form-row"><input placeholder="CVV" value={cvv} onChange={e=>setCvv(e.target.value)} /></div>}
      <div className="form-row"><input type="number" placeholder="Limit" value={limit} onChange={e=>setLimit(Number(e.target.value))} /></div>
      <div style={{display:'flex',gap:8}}>
        <button type="submit" disabled={saving}>{initial?.id? 'Save' : 'Create'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  )
}
