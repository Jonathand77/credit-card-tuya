import React, { useState } from 'react'
import { register } from '../services/api'
import { showToast } from './Toast'

export default function RegisterForm({ onSuccess, onClose }:{ onSuccess?:()=>void, onClose?:()=>void }){
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)

  const submit = async (e:any)=>{
    e.preventDefault()
    
    if(!username.trim()) { 
      showToast('El usuario es requerido', 'warning')
      return 
    }
    if(!email.trim()) { 
      showToast('El email es requerido', 'warning')
      return 
    }
    if(!password.trim()) { 
      showToast('La contraseña es requerida', 'warning')
      return 
    }
    
    setLoading(true)
    try{
      const result = await register(username, email, password)
      if(result && result.token) {
        showToast('✓ Cuenta creada exitosamente', 'success')
        setUsername('')
        setEmail('')
        setPassword('')
        setTimeout(() => {
          onSuccess?.()
          onClose?.()
        }, 1500)
      }
    }catch(err:any){
      console.error('Register error:', err)
      showToast(err.message || 'Error al registrar', 'error')
    }finally{
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{
      background: 'var(--color-white)',
      padding: '32px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      animation: 'fadeIn 0.4s ease'
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: 24,
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--color-primary)',
        fontFamily: 'var(--font-family-heading)'
      }}>Crear Cuenta</h3>
      
      <div className="form-row">
        <input 
          required 
          type="text"
          placeholder="Usuario" 
          value={username} 
          onChange={e=>setUsername(e.target.value)} 
          disabled={loading}
        />
      </div>
      
      <div className="form-row">
        <input 
          required 
          type="email" 
          placeholder="Correo Electrónico" 
          value={email} 
          onChange={e=>setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="form-row">
        <input 
          required 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={e=>setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div style={{display:'flex', gap:12, marginTop: 28}}>
        <button 
          type="submit" 
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: loading ? '#999' : 'var(--color-primary)',
            color: 'var(--color-white)',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'var(--color-primary-dark)')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--color-primary)')}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        
        <button 
          type="button" 
          onClick={onClose}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px 24px',
            background: 'var(--color-gray-medium)',
            color: 'var(--color-dark)',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#e5e7eb')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--color-gray-medium)')}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
