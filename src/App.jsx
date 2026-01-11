import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CreateEditEvent from './pages/CreateEditEvent'
import MyEvents from './pages/MyEvents'
import NotFound from './pages/NotFound'
import { useAuth } from './contexts/AuthContext'


function RequireAuth({ children }){
  const { token } = useAuth()
  if(!token) return <Navigate to="/login" replace />
  return children
}

function RedirectIfAuthenticated({ children }){
  const { token } = useAuth()
  if(token) return <Navigate to="/events" replace />
  return children
}

export default function App(){
  return (
    <div className="app-root">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/events" element={<Events />} />
          <Route path="/signup" element={<RedirectIfAuthenticated><Signup /></RedirectIfAuthenticated>} />
          <Route path="/login" element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/new" element={<RequireAuth><CreateEditEvent /></RequireAuth>} />
          <Route path="/events/:id/edit" element={<RequireAuth><CreateEditEvent editMode /></RequireAuth>} />
          <Route path="/my-events" element={<RequireAuth><MyEvents /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
