'use client'
import React, { useEffect } from 'react'
import type { CustomComponent } from 'payload'


export const RefreshFetchWrapper: CustomComponent = (() => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/users/refresh-token', {
          method: 'POST',
          credentials: 'include',
        })
           console.log('I AM REFRESHING $$$$$$$$$$$')
        if (res.ok) {
          console.log('✅ Token refreshed successfully')
        } else {
          console.warn('⚠️ Token refresh failed')
        }
      } catch (err) {
        console.error('❌ Refresh request failed', err)
      }
    }, 1 * 60 * 1000) // every 4 minutes, 1 minute

    return () => clearInterval(interval)
  }, [])

  return <></>
}) as unknown as CustomComponent
