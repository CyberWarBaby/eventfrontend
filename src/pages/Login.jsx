import React, { useState } from 'react'
import { login as apiLogin } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const { login } = useAuth()
  const nav = useNavigate()

  async function handle(e){
    e.preventDefault()
    setErr(null)
    try{
      const data = await apiLogin(email, password)
      login(data.token, email)
      nav('/events')
    }catch(e){
      setErr(e.response?.data?.message || e.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue to EventBook</p>
        </div>
        <form onSubmit={handle}>
          <label>
            Email
            <input 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="••••••••"
              required
            />
          </label>
          {err && <div className="error">{err}</div>}
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
