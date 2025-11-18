import React, { useEffect, useState } from 'react'
import { fetchEvents, deleteEvent } from '../api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function MyEvents(){
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const { token, userEmail, userId } = useAuth()
  const nav = useNavigate()

  useEffect(()=>{
    loadEvents()
  }, [token, userEmail, userId])

  function loadEvents(){
    setLoading(true)
    fetchEvents(token).then(data=>{
      console.log('All events:', data) // Debug: see all events
      console.log('User email:', userEmail) // Debug: see user email
      console.log('User ID:', userId) // Debug: see user ID
      
      // Filter events created by the current user
      const myEvents = data.filter(ev => {
        const isOwner = (
          ev.ownerEmail === userEmail || 
          ev.UserID === userId ||
          ev.userEmail === userEmail ||
          ev.userId === userId ||
          ev.user_email === userEmail ||
          ev.user_id === userId
        )
        if (isOwner) {
          console.log('My event:', ev) // Debug: see matched events
        }
        return isOwner
      })
      
      console.log('Filtered my events:', myEvents) // Debug: see final result
      setEvents(myEvents)
      setLoading(false)
    }).catch(e=>{
      setErr(e.message)
      setLoading(false)
    })
  }

  async function handleDelete(eventId, eventName){
    if(!confirm(`Are you sure you want to delete "${eventName}"?`)) return
    
    try{
      setErr(null)
      await deleteEvent(eventId, token)
      // Reload events after deletion
      loadEvents()
    }catch(e){
      console.error('Delete error:', e) // Debug: see full error
      const errorMsg = e.response?.data?.error || e.response?.data?.message || e.message
      setErr(`Failed to delete event: ${errorMsg}`)
    }
  }

  if(loading) return <div className="panel">Loading...</div>

  return (
    <div className="panel">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <h2>My Events</h2>
        <Link to="/events/new" className="btn btn-primary">Create New Event</Link>
      </div>
      {err && <div className="error">{err}</div>}
      {events.length === 0 ? (
        <div style={{textAlign:'center', padding:'40px 20px'}}>
          <p className="muted" style={{fontSize:'1.2rem', marginBottom:'24px'}}>
            You haven't created any events yet.
          </p>
          <Link to="/events/new" className="btn btn-primary">Create Your First Event</Link>
        </div>
      ) : (
        <ul className="list">
          {events.map(ev=> (
            <li key={ev.ID || ev.id} className="event-item">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', gap:'16px'}}>
                <div style={{flex:1}}>
                  <Link to={`/events/${ev.ID || ev.id}`}>
                    <strong>{ev.Name || ev.name}</strong>
                  </Link>
                  <div className="muted">
                    📍 {ev.Location || ev.location} — 📅 {ev.DateTime || ev.dateTime ? new Date(ev.DateTime || ev.dateTime).toLocaleString() : 'No date set'}
                  </div>
                  {ev.attendees && ev.attendees.length > 0 && (
                    <div className="muted" style={{marginTop:'8px'}}>
                      👥 {ev.attendees.length} {ev.attendees.length === 1 ? 'attendee' : 'attendees'}
                    </div>
                  )}
                </div>
                <div style={{display:'flex', gap:'8px', flexShrink:0, alignItems:'center'}}>
                  <Link 
                    to={`/events/${ev.ID || ev.id}/edit`} 
                    className="btn-link"
                    style={{padding:'8px 16px', fontSize:'0.9rem', whiteSpace:'nowrap'}}
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    className="danger"
                    onClick={() => handleDelete(ev.ID || ev.id, ev.Name || ev.name)}
                    style={{padding:'8px 16px', fontSize:'0.9rem', whiteSpace:'nowrap'}}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
