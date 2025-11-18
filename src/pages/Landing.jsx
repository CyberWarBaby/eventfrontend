import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div className="landing">
      <div className="hero">
        <h1>Welcome to EventBook</h1>
        <p className="hero-subtitle">Discover, create, and manage amazing events</p>
        <div className="hero-actions">
          <Link to="/events" className="btn btn-primary">Browse Events</Link>
          <Link to="/signup" className="btn btn-secondary">Get Started</Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Create Events</h3>
          <p>Easily create and manage your own events with our intuitive interface</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Join Community</h3>
          <p>Register for events and connect with like-minded people</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Track Attendance</h3>
          <p>Keep track of attendees and manage registrations effortlessly</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Join thousands of event organizers and attendees today</p>
        <Link to="/signup" className="btn btn-large">Create Your Account</Link>
      </div>
    </div>
  )
}
