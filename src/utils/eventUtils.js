// Utility functions for event operations

/**
 * Check if the current user owns the event
 * Checks multiple possible field names for user identification
 */
export function isEventOwner(event, userEmail) {
  if (!event || !userEmail) return false
  
  // Check all possible field names for user identification
  const userId = userEmail.toLowerCase()
  
  return (
    // Email-based fields
    event.ownerEmail?.toLowerCase() === userId ||
    event.userEmail?.toLowerCase() === userId ||
    event.creatorEmail?.toLowerCase() === userId ||
    event.email?.toLowerCase() === userId ||
    
    // ID-based fields (comparing with email as ID)
    event.UserID === userEmail ||
    event.userId === userEmail ||
    event.user_id === userEmail ||
    event.ownerId === userEmail ||
    event.owner_id === userEmail ||
    event.createdBy === userEmail ||
    event.created_by === userEmail
  )
}

/**
 * Check if the current user is registered for the event
 */
export function isUserRegistered(event, userEmail) {
  if (!event || !userEmail) return false
  
  const attendees = event.attendees || event.Attendees || []
  return attendees.some(attendee => 
    attendee?.toLowerCase() === userEmail.toLowerCase()
  )
}

/**
 * Get event field value with fallback to multiple possible field names
 */
export function getEventField(event, fieldName) {
  if (!event) return null
  
  // Try capitalized and lowercase versions
  const capitalized = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
  const lowercase = fieldName.toLowerCase()
  
  return event[capitalized] || event[lowercase] || event[fieldName] || null
}
