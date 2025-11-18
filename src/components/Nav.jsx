import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Nav(){
  const { token, userEmail, logout } = useAuth()
  const nav = useNavigate()

  function doLogout(){
    logout()
    nav('/login')
  }

  return (
    <nav className="nav">
      <div className="brand"><Link to="/">EventBook</Link></div>
      <div className="links">
        <Link to="/events">Events</Link>
        {token ? (
          <>
            <Link to="/my-events">My Events</Link>
            <Link to="/events/new">Create</Link>
            <span className="muted">{userEmail}</span>
            <button className="btn-link" onClick={doLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
