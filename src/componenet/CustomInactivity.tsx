'use client'
import React, { useEffect } from 'react'
let logoutExecuted = false

export const CustomInactivity = () =>{
  useEffect(() => {
    if (logoutExecuted) return
    logoutExecuted = true
    fetch('/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      window.location.href = '/admin/login?reason=inactivity'
    })
  }, [])

  return (
    <div>
      <h1>Logging you out due to inactivity...</h1>
    </div>
  )
}
