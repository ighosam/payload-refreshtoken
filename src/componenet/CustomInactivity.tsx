'use client'

import React, { useEffect, useRef,useState } from 'react'

export default function CustomInactivity() {
  const hasRun = useRef(false)


  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true
    
    fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      window.location.href = '/admin/login?reason=inactivity'
    })

  }, [])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Logging you out due to inactivity...</h1>
      <p>Please wait a moment.</p>
    </div>
  )
}
