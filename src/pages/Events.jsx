import React, { useEffect, useState } from 'react'
import { fetchEvents } from '../api'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Events(){
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const { token, userEmail, userId } = useAuth()

  useEffect(()=>{
    setLoading(true)
    fetchEvents(token).then(data=>{
      setEvents(data)
      setLoading(false)
    }).catch(e=>{
      setErr(e.message)
      setLoading(false)
    })
  }, [token])

  if(loading) return <div className="panel">Loading...</div>

  return (
    <div className="panel">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'16px'}}>
        <h2>All Events</h2>
        {token && (
          <Link to="/events/new" className="btn btn-primary">+ Create Event</Link>
        )}
      </div>
      {err && <div className="error">{err}</div>}
      {events.length === 0 ? (
        <div style={{textAlign:'center', padding:'40px 20px'}}>
          <p className="muted" style={{fontSize:'1.2rem', marginBottom:'24px'}}>
            No events available yet.
          </p>
          {token && (
            <Link to="/events/new" className="btn btn-primary">Create the First Event</Link>
          )}
        </div>
      ) : (
        <ul className="list">
          {events.map(ev=> {
            // Check if current user owns this event - checking both email and numeric ID
            const isMyEvent = token && (
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
            return (
              <li key={ev.ID || ev.id} className="event-item">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', gap:'16px'}}>
                  <div style={{flex:1}}>
                    <Link to={`/events/${ev.ID || ev.id}`}>
                      <strong>{ev.Name || ev.name}</strong>
                    </Link>
                    {isMyEvent && (
                      <span style={{
                        marginLeft:'12px',
                        padding:'4px 10px',
                        background:'rgba(6, 182, 212, 0.15)',
                        border:'1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius:'12px',
                        fontSize:'0.8rem',
                        color:'var(--accent)',
                        fontWeight:'500'
                      }}>
                        Your Event
                      </span>
                    )}
                    <div className="muted">
                      📍 {ev.Location || ev.location} — 📅 {ev.DateTime || ev.dateTime ? new Date(ev.DateTime || ev.dateTime).toLocaleString() : 'No date set'}
                    </div>
                    {ev.attendees && ev.attendees.length > 0 && (
                      <div className="muted" style={{marginTop:'8px'}}>
                        👥 {ev.attendees.length} {ev.attendees.length === 1 ? 'attendee' : 'attendees'}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
