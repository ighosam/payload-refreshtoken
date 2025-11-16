'use client'
import React from 'react'

const InactivityNotice: React.FC = () => {
  const params = new URLSearchParams(window.location.search)
  const reason = params.get('reason')

  if (reason !== 'inactivity') return null

  return (
    <div style={{
      background: '#fef3c7',
      border: '1px solid #facc15',
      color: '#92400e',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '16px',
      textAlign: 'center',
    }}>
      You were logged out due to inactivity.
    </div>
  )
}

export default InactivityNotice
