'use client'

export const CustomLogoutButton = () => {
  const handleLogout = async () => {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/admin/login'
  }

  return <button onClick={handleLogout}>Logout</button>
}
