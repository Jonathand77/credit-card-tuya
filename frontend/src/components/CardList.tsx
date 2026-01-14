import React from 'react'

export default function CardList({ items, onEdit, onDelete }:{items:any[], onEdit?:(c:any)=>void, onDelete?:(id:string)=>void }){
  if(!items || items.length===0) return <div>No cards</div>
  return (
    <div>
      {items.map(c=> (
        <div key={c.id} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div><strong>{c.holderName || c.holder}</strong></div>
            <div>{c.cardNumber}</div>
            <div>Limit: {c.limit} — Balance: {c.balance}</div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>onEdit?.(c)}>Edit</button>
            <button onClick={()=>onDelete?.(c.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
