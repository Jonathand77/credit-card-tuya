import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import Modal from '../components/Modal'
import RegisterForm from '../components/RegisterForm'

export default function Login() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const submit = async (e:any) => {
    e.preventDefault()
    setError(null)
    if(!username.trim()) { setError('Username is required'); return }
    if(!email.trim()) { setError('Email is required'); return }
    if(!password.trim()) { setError('Password is required'); return }
    
    setLoading(true)
    try{
      await auth.login(username, email, password)
      navigate(from, { replace: true })
    }catch(err:any){
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'70vh'}}>
      <div style={{width:360, padding:24, borderRadius:8, boxShadow:'0 4px 24px rgba(0,0,0,0.12)', background:'#fff'}}>
        <h2 style={{marginTop:0, marginBottom:8}}>Sign in</h2>
        <p style={{marginTop:0, marginBottom:16,color:'#555'}}>Accede con tu cuenta para continuar</p>
        <form onSubmit={submit}>
          <div className="form-row"><input required placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ddd',boxSizing:'border-box'}} /></div>
          <div className="form-row"><input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ddd',boxSizing:'border-box'}} /></div>
          <div className="form-row"><input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #ddd',boxSizing:'border-box'}}/></div>
          {error && <div style={{color:'#ef4444',marginBottom:8,fontSize:14,fontWeight:500}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:10,borderRadius:6,background:loading?'#9ca3af':'#2563eb',color:'#fff',border:'none',marginBottom:8,cursor:loading?'not-allowed':'pointer'}}>Sign in</button>
          <button type="button" onClick={()=>setShowRegister(true)} style={{width:'100%',padding:10,borderRadius:6,background:'#f3f4f6',color:'#111',border:'1px solid #d1d5db',cursor:'pointer'}}>Create account</button>
        </form>
      </div>
      {showRegister && (
        <Modal onClose={()=>setShowRegister(false)}>
          <RegisterForm onSuccess={()=>{ setShowRegister(false); setError(null); alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.') }} onClose={()=>setShowRegister(false)} />
        </Modal>
      )}
    </div>
  )
}
