const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

function getToken(){
  return localStorage.getItem('token')
}

async function request(path:string, opts:RequestInit={}){
  const headers: any = opts.headers ? {...opts.headers} : {}
  const token = getToken()
  if(token) headers['Authorization'] = 'Bearer '+token
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const res = await fetch(BASE+path, {...opts, headers, credentials: 'include'})
  if(!res.ok) throw new Error(await res.text())
  return res.status===204? null : await res.json()
}

export const login = async (email:string,password:string)=>{
  const r = await request('/api/auth/login', {method:'POST', body: JSON.stringify({email,password})})
  if(r?.token) {
    localStorage.setItem('token', r.token)
  }
  return r
}

export const register = async (email:string,password:string)=>{
  const r = await request('/api/auth/register', {method:'POST', body: JSON.stringify({email,password})})
  if(r?.token) {
    localStorage.setItem('token', r.token)
  }
  return r
}

export const getCards = ()=> request('/api/cards')
export const createCard = (payload:any)=> request('/api/cards', {method:'POST', body: JSON.stringify(payload)})
export const updateCard = (id:string,payload:any)=> request(`/api/cards/${id}`, {method:'PUT', body: JSON.stringify(payload)})
export const deleteCard = (id:string)=> request(`/api/cards/${id}`, {method:'DELETE'})

export const createPayment = (payload:any)=> request('/api/payments', {method:'POST', body: JSON.stringify(payload)})

export const getTransactions = (query:{cardId?:string,page?:number,size?:number}={})=>{
  const params = new URLSearchParams()
  if(query.cardId) params.set('cardId', query.cardId)
  params.set('page', String(query.page||1))
  params.set('size', String(query.size||20))
  return request('/api/transactions?'+params.toString())
}

export default { login, register, getCards, createCard, createPayment, getTransactions }

export function setToken(token: string | null) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}
