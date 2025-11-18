import axios from 'axios'
const BASE = '/api'  // Use Vite proxy to avoid CORS

export function createClient(token){
  // Add "Bearer " prefix if token doesn't already have it
  const authToken = token && !token.startsWith('Bearer ') ? `Bearer ${token}` : token
  const headers = authToken ? { Authorization: authToken } : {}
  return axios.create({ baseURL: BASE, headers })
}

export async function signup(email, password){
  const c = createClient()
  const res = await c.post('/signup', { email, password })
  return res.data
}
export async function login(email, password){
  const c = createClient()
  const res = await c.post('/login', { email, password })
  return res.data
}

export async function fetchEvents(token){
  const c = createClient(token)
  const res = await c.get('/events')
  return res.data
}
export async function fetchEvent(id, token){
  const c = createClient(token)
  const res = await c.get(`/events/${id}`)
  return res.data
}
export async function createEvent(body, token){
  const c = createClient(token)
  const res = await c.post('/events', body)
  return res.data
}
export async function updateEvent(id, body, token){
  const c = createClient(token)
  const res = await c.put(`/events/${id}`, body)
  return res.data
}
export async function deleteEvent(id, token){
  const c = createClient(token)
  const res = await c.delete(`/events/${id}`)
  return res.data
}
export async function registerEvent(id, token){
  const c = createClient(token)
  const res = await c.post(`/events/${id}/register`)
  return res.data
}
export async function cancelRegistration(id, token){
  const c = createClient(token)
  const res = await c.delete(`/events/${id}/register`)
  return res.data
}
