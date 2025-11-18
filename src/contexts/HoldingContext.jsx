import React, { createContext, useContext, useState } from 'react'

const HoldingContext = createContext()

export function HoldingProvider({ children }){
  // This holds arbitrary JSON the user wants to manage across pages.
  const [payload, setPayload] = useState(null)

  function setJSON(json){
    try{
      const obj = typeof json === 'string' ? JSON.parse(json) : json
      setPayload(obj)
      return { ok: true }
    }catch(e){
      return { ok: false, error: e.message }
    }
  }

  function clear(){ setPayload(null) }

  return (
    <HoldingContext.Provider value={{ payload, setJSON, clear }}>
      {children}
    </HoldingContext.Provider>
  )
}

export function useHolding(){
  return useContext(HoldingContext)
}
