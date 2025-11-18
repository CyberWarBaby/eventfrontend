import React, { useState, useEffect } from 'react'
import { createEvent, fetchEvent, updateEvent } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'

export default function CreateEditEvent({ editMode }){
  const { token } = useAuth()
  const nav = useNavigate()
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [err, setErr] = useState(null)

  useEffect(()=>{
    if(editMode && id){
      fetchEvent(id, token).then(d=>{
        setName(d.Name || d.name || '')
        setDescription(d.Description || d.description || '')
        setLocation(d.Location || d.location || '')
        // Convert ISO string to datetime-local format
        const dateField = d.DateTime || d.dateTime
        if(dateField){
          const date = new Date(dateField)
          if(!isNaN(date.getTime())){
            setDateTime(date.toISOString().slice(0,16))
          }
        }
      }).catch(e=> setErr(e.message))
    }
  }, [editMode, id, token])

  async function handle(e){
    e.preventDefault()
    setErr(null)
    try{
      // Convert datetime-local to ISO string for backend
      const isoDateTime = dateTime ? new Date(dateTime).toISOString() : ''
      const body = { name, description, location, dateTime: isoDateTime }
      if(editMode){
        await updateEvent(id, body, token)
      }else{
        await createEvent(body, token)
      }
      nav('/events')
    }catch(e){
      setErr(e.response?.data?.message || e.message)
    }
  }

  return (
    <div className="panel">
      <h2>{editMode ? 'Edit event' : 'Create event'}</h2>
      <form onSubmit={handle}>
        <label>
          Name
          <input 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            placeholder="Enter event name"
            required
          />
        </label>
        <label>
          Description
          <textarea 
            value={description} 
            onChange={e=>setDescription(e.target.value)} 
            placeholder="Describe your event..."
          />
        </label>
        <label>
          Location
          <input 
            value={location} 
            onChange={e=>setLocation(e.target.value)} 
            placeholder="Event location"
          />
        </label>
        <label>
          Date & time
          <input 
            type="datetime-local" 
            value={dateTime} 
            onChange={e=>setDateTime(e.target.value)} 
            required
          />
        </label>
        <div className="actions">
          <button type="submit">{editMode ? 'Update Event' : 'Create Event'}</button>
          <button type="button" className="btn-secondary" onClick={()=>nav('/events')}>Cancel</button>
        </div>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  )
}
