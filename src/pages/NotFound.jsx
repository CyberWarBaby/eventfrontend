import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/events" className="btn btn-secondary">Browse Events</Link>
        </div>
      </div>
    </div>
  )
}
