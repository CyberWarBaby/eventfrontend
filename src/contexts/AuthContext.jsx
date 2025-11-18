import React, { createContext, useContext, useState, useEffect } from 'react'

// Helper function to decode JWT
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error('Error parsing JWT:', e)
    return null
  }
}

const AuthContext = createContext()

export function AuthProvider({ children }){
  const [token, setToken] = useState(()=> localStorage.getItem('token'))
  const [userEmail, setUserEmail] = useState(()=> localStorage.getItem('userEmail'))
  const [userId, setUserId] = useState(()=> {
    const id = localStorage.getItem('userId')
    return id ? parseInt(id) : null
  })

  // Extract userId from token when token changes
  useEffect(()=>{
    if(token){
      const decoded = parseJwt(token)
      console.log('Decoded JWT:', decoded) // Debug: see JWT contents
      if(decoded){
        // Check various possible field names in JWT - including userID (capital I and D)
        const id = decoded.userID || decoded.userId || decoded.user_id || decoded.id || decoded.ID || decoded.sub
        if(id){
          const numericId = typeof id === 'string' ? parseInt(id) : id
          setUserId(numericId)
          console.log('Extracted user ID from JWT:', numericId)
        }
      }
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(()=>{
    if(userEmail) localStorage.setItem('userEmail', userEmail)
    else localStorage.removeItem('userEmail')
  }, [userEmail])

  useEffect(()=>{
    if(userId) localStorage.setItem('userId', userId.toString())
    else localStorage.removeItem('userId')
  }, [userId])

  function login(tokenValue, email){
    setToken(tokenValue)
    setUserEmail(email)
    // userId will be extracted from token in useEffect
  }
  
  function logout(){
    setToken(null)
    setUserEmail(null)
    setUserId(null)
    // Explicitly clear from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
  }

  return (
    <AuthContext.Provider value={{ token, userEmail, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
