'use client'
import { useEffect } from 'react'
import type { CustomComponent } from 'payload'

const RefreshFetchWrapper = () => {

  
  useEffect(() => {
    
    // Prevent multiple installations of the wrapper
    if ((window as any).__refreshWrapperInstalled) return
    ;(window as any).__refreshWrapperInstalled = true

    // Refresh every 1 minute (in milliseconds)
    const REFRESH_INTERVAL = 1000 * 60 * 1 // 1 minute

    const refreshToken = async () => {
      console.log('🔁 Refreshing token...')
      try {
        const res = await fetch('/api/users/refresh', {
          method: 'POST',
          credentials: 'include',
        })

        if (!res.ok) throw new Error(`Refresh failed: ${res.status}`)
        console.debug('✅ Token refreshed successfully')
      } catch (err) {
        console.warn('⚠️ Token refresh failed:', err)
      }
    }

    // Optional: Run once immediately at mount
    //refreshToken()

    // Then continue refreshing at the interval
    const interval = setInterval(refreshToken, REFRESH_INTERVAL)

    // Clean up on unmount
    return () => clearInterval(interval)
  }, [])

  return null
}

export const RefreshFetchWrapper2 = RefreshFetchWrapper as unknown as CustomComponent
