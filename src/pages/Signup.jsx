import React, { useState } from 'react'
import { signup } from '../api'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const nav = useNavigate()

  async function handle(e){
    e.preventDefault()
    setErr(null)
    try{
      await signup(email, password)
      nav('/login')
    }catch(e){
      setErr(e.response?.data?.message || e.message)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join EventBook and start organizing</p>
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
          <button type="submit" className="auth-button">Create Account</button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
