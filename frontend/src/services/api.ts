//URL base de la API - Esta cambia dependiendo del entorno (desarrollo/producción)
const BASE = import.meta.env.VITE_API_URL || 'https://musical-space-guide-r4g4gqqgx49rhxpx4-5000.app.github.dev'

//Obtención del token JWT
function getToken(){
  return localStorage.getItem('token')
}

async function request(path:string, opts:RequestInit={}){
  //Manejo de headers
  const headers: Record<string, string> = opts.headers ? {...opts.headers as Record<string, string>} : {}
  const token = getToken()
  if(token) headers['Authorization'] = 'Bearer '+token
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  //Manejo de errores
  try {
    const res = await fetch(BASE+path, {...opts, headers})
    if(!res.ok) {
      // Una petición autenticada que responde 401 significa que la sesión expiró o el
      // token ya no es válido: cerramos sesión localmente y avisamos al resto de la app
      // (AuthContext se encarga de mostrar el aviso y redirigir al login).
      if (res.status === 401 && token) {
        localStorage.removeItem('token')
        window.dispatchEvent(new Event('auth:unauthorized'))
        throw new Error()
      }

      const text = await res.text()
      throw new Error(extractErrorMessage(text) || `HTTP ${res.status}`)
    }
    return res.status===204? null : await res.json()
  } catch(err) {
    console.error('Request failed:', err)
    throw err
  }
}

//Extrae un mensaje legible del cuerpo de error de la API: JSON tipo { message }/{ error },
//errores de validación de ASP.NET ({ errors: { Campo: ["motivo"] } }), o texto plano.
function extractErrorMessage(body: string): string {
  if (!body) return ''
  try {
    const parsed = JSON.parse(body)

    if (parsed?.errors && typeof parsed.errors === 'object') {
      const messages = Object.values(parsed.errors).flat()
      if (messages.length) return messages.join('. ')
    }

    return parsed?.message || parsed?.error || parsed?.title || body
  } catch {
    return body
  }
}

export interface AuthResponse {
  token: string
  username: string
}

//Login
export const login = async (username:string, email:string, password:string): Promise<AuthResponse> => {
  const r = await request('/api/auth/login', {method:'POST', body: JSON.stringify({username, email, password})})
  if(r?.token) {
    localStorage.setItem('token', r.token)
  }
  return r
}

//Registro
export const register = async (username:string, email:string, password:string): Promise<AuthResponse> => {
  const r = await request('/api/auth/register', {method:'POST', body: JSON.stringify({username, email, password})})
  if(r?.token) {
    localStorage.setItem('token', r.token)
  }
  return r
}

//Tarjetas
export interface CardItem {
  id: string
  cardNumber: string
  holderName: string
  expiry: string
  limit: number
  balance: number
  createdAt?: string
}

export interface CardCreatePayload {
  cardNumber: string
  holderName: string
  expiry: string
  cvv: string
  limit: number
}

export interface CardUpdatePayload {
  holderName: string
  expiry: string
  limit: number
}

export const getCards = (): Promise<CardItem[]> => request('/api/cards')
export const createCard = (payload: CardCreatePayload): Promise<CardItem> =>
  request('/api/cards', {method:'POST', body: JSON.stringify(payload)})
export const updateCard = (id:string, payload: CardUpdatePayload): Promise<CardItem> =>
  request(`/api/cards/${id}`, {method:'PUT', body: JSON.stringify(payload)})
export const deleteCard = (id:string)=> request(`/api/cards/${id}`, {method:'DELETE'})

//Pagos
export interface PaymentPayload {
  cardId: string
  amount: number
  description?: string
}

export const createPayment = (payload: PaymentPayload) =>
  request('/api/payments', {method:'POST', body: JSON.stringify(payload)})

//Transacciones
export interface TransactionItem {
  id: string
  cardId: string
  userId: string
  amount: number
  type: string
  description?: string | null
  timestamp: string
}

export interface TransactionsResponse {
  total: number
  page: number
  size: number
  items: TransactionItem[]
}

export const getTransactions = (query:{cardId?:string,page?:number,size?:number}={}): Promise<TransactionsResponse> => {
  const params = new URLSearchParams()
  if(query.cardId) params.set('cardId', query.cardId)
  params.set('page', String(query.page||1))
  params.set('size', String(query.size||20))
  return request('/api/transactions?'+params.toString())
}

export default { login, register, getCards, createCard, createPayment, getTransactions }

//Manejo manual del token
export function setToken(token: string | null) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}
