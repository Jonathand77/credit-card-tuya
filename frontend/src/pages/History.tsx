import React, { useEffect, useState } from 'react'
import { getTransactions } from '../services/api'

export default function History(){
  const [txs, setTxs] = useState<any[]>([])

  useEffect(()=>{
    getTransactions({page:1,size:20}).then(r=>setTxs(r.items||[])).catch(()=>{})
  },[])

  return (
    <div>
      <h2>Transaction History</h2>
      {txs.map(t=> (
        <div key={t.id} className="card">
          <div>{t.type} — {t.amount}</div>
          <div>{t.description}</div>
          <div style={{fontSize:12,color:'#666'}}>{t.timestamp}</div>
        </div>
      ))}
    </div>
  )
}
