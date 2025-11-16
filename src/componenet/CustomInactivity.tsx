'use client'

import React, { useEffect } from 'react'

export default function CustomInactivity() {
  useEffect(() => {
    // call logout API
    fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include', // include cookies
    })
      .finally(() => {
        // redirect to admin login
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
