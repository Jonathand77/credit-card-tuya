import React, { useState } from 'react'
import { register } from '../services/api'

export default function RegisterForm({ onSuccess, onClose }:{ onSuccess?:()=>void, onClose?:()=>void }){
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState<string|null>(null)
  const [loading,setLoading]=useState(false)

  const submit = async (e:any)=>{
    e.preventDefault()
    setError(null)
    if(!username.trim()) { setError('Username is required'); return }
    if(!email.trim()) { setError('Email is required'); return }
    if(!password.trim()) { setError('Password is required'); return }
    
    setLoading(true)
    try{
      const result = await register(username, email, password)
      if(result && result.token) {
        onSuccess?.()
        onClose?.()
      }
    }catch(err:any){
      console.error('Register error:', err)
      setError(err.message || 'Registration failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <h3 style={{marginTop:0, marginBottom:12}}>Create account</h3>
      <div className="form-row"><input required placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ddd',boxSizing:'border-box'}} /></div>
      <div className="form-row"><input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ddd',boxSizing:'border-box'}} /></div>
      <div className="form-row"><input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ddd',boxSizing:'border-box'}} /></div>
      {error && <div style={{color:'#ef4444',marginBottom:8,fontSize:14,fontWeight:500}}>{error}</div>}
      <div style={{display:'flex',gap:8}}>
        <button type="submit" disabled={loading} style={{flex:1,padding:10,borderRadius:6,background:loading?'#9ca3af':'#16a34a',color:'#fff',border:'none',cursor:loading?'not-allowed':'pointer'}}>Register</button>
        <button type="button" onClick={onClose} style={{flex:1,padding:10,borderRadius:6,background:'#e5e7eb',color:'#111',border:'none',cursor:'pointer'}}>Cancel</button>
      </div>
    </form>
  )
}
