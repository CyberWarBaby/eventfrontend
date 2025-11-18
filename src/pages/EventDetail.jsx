import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchEvent, deleteEvent, registerEvent, cancelRegistration } from '../api'
import { useAuth } from '../contexts/AuthContext'

export default function EventDetail(){
  const { id } = useParams()
  const [ev, setEv] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const { token, userEmail, userId } = useAuth()
  const nav = useNavigate()

  useEffect(()=>{
    setLoading(true)
    fetchEvent(id, token).then(d=>{ 
      console.log('Event detail:', d) // Debug: see event structure
      setEv(d)
      setLoading(false) 
    }).catch(e=>{ 
      setErr(e.message)
      setLoading(false) 
    })
  }, [id, token])

  async function doDelete(){
    if(!confirm('Delete this event?')) return
    try{
      await deleteEvent(id, token)
      nav('/events')
    }catch(e){
      setErr(e.response?.data?.message || e.message)
    }
  }

  async function doRegister(){
    try{
      setErr(null)
      await registerEvent(id, token)
      // refresh
      const d = await fetchEvent(id, token)
      setEv(d)
    }catch(e){ 
      setErr(e.response?.data?.message || e.message) 
    }
  }

  async function doCancel(){
    try{
      setErr(null)
      await cancelRegistration(id, token)
      const d = await fetchEvent(id, token)
      setEv(d)
    }catch(e){ 
      setErr(e.response?.data?.message || e.message) 
    }
  }

  if(loading) return <div className="panel">Loading...</div>
  if(!ev) return <div className="panel">Not found</div>

  // Check ownership - checking both email and numeric ID
  const amOwner = token && (
    (userEmail && (
      ev.ownerEmail === userEmail || 
      ev.userEmail === userEmail ||
      ev.user_email === userEmail
    )) ||
    (userId && (
      ev.UserID === userId ||
      ev.userId === userId ||
      ev.user_id === userId
    ))
  )
  const isRegistered = ev.attendees && ev.attendees.includes(userEmail)

  console.log('Am I owner?', amOwner, 'User ID:', userId, 'Event UserID:', ev.UserID, 'Event:', ev) // Debug

  return (
    <div className="panel">
      <h2>{ev.Name || ev.name}</h2>
      <div className="muted" style={{marginBottom:'16px'}}>
        📍 {ev.Location || ev.location} — 📅 {ev.DateTime || ev.dateTime ? new Date(ev.DateTime || ev.dateTime).toLocaleString() : 'No date set'}
      </div>
      
      {amOwner && (
        <div style={{
          background:'rgba(6, 182, 212, 0.1)',
          border:'1px solid rgba(6, 182, 212, 0.3)',
          borderRadius:'8px',
          padding:'12px 16px',
          marginBottom:'16px',
          color:'var(--accent)',
          fontSize:'0.9rem'
        }}>
          ✨ You own this event
        </div>
      )}

      {isRegistered && !amOwner && (
        <div style={{
          background:'rgba(16, 185, 129, 0.1)',
          border:'1px solid rgba(16, 185, 129, 0.3)',
          borderRadius:'8px',
          padding:'12px 16px',
          marginBottom:'16px',
          color:'var(--success)',
          fontSize:'0.9rem'
        }}>
          ✅ You are registered for this event
        </div>
      )}

      <p style={{marginBottom:'24px', lineHeight:'1.7', fontSize:'1.05rem'}}>
        {ev.Description || ev.description || 'No description provided'}
      </p>

      {err && <div className="error">{err}</div>}

      <div className="actions">
        {token && !isRegistered && !amOwner && (
          <button onClick={doRegister}>Register for Event</button>
        )}
        {token && isRegistered && !amOwner && (
          <button className="btn-secondary" onClick={doCancel}>Cancel Registration</button>
        )}
        {amOwner && (
          <>
            <Link to={`/events/${ev.ID || ev.id}/edit`} className="btn btn-primary">
              ✏️ Edit Event
            </Link>
            <button className="danger" onClick={doDelete}>🗑️ Delete Event</button>
          </>
        )}
        {!token && (
          <Link to="/login" className="btn btn-primary">Login to Register</Link>
        )}
      </div>

      <h3>Attendees ({ev.attendees?.length || 0})</h3>
      <ul style={{listStyle:'none', padding:0}}>
        {ev.attendees && ev.attendees.length ? (
          ev.attendees.map((a, idx)=> (
            <li 
              key={a} 
              style={{
                padding:'12px 16px',
                background:'rgba(255, 255, 255, 0.02)',
                borderRadius:'8px',
                marginBottom:'8px',
                border:'1px solid var(--glass-border)'
              }}
            >
              👤 {a} {a === userEmail && <span style={{color:'var(--accent)', marginLeft:'8px'}}>(You)</span>}
            </li>
          ))
        ) : (
          <li style={{color:'var(--muted)', padding:'12px 0'}}>No attendees yet. Be the first to register!</li>
        )}
      </ul>
    </div>
  )
}
