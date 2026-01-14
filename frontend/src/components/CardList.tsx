import React from 'react'

export default function CardList({ items }:{items:any[] }){
  if(!items || items.length===0) return <div>No cards</div>
  return (
    <div>
      {items.map(c=> (
        <div key={c.id} className="card">
          <div><strong>{c.holderName || c.holder}</strong></div>
          <div>{c.cardNumber}</div>
          <div>Limit: {c.limit} — Balance: {c.balance}</div>
        </div>
      ))}
    </div>
  )
}
