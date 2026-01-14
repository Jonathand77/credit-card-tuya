import React, { useState } from 'react'
import { login } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const submit = async (e:any) => {
    e.preventDefault()
    setError(null)
    try{
      await login(email, password)
      navigate('/')
    }catch(err:any){
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit} style={{maxWidth:400}}>
        <div className="form-row"><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="form-row"><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
