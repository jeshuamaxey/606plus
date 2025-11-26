'use client'

import {useRouter} from 'next/navigation'
import {useState} from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await fetch('/api/logout', {
        method: 'POST',
      })
      
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoggingOut(false)
    }
  }
  
  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="rounded-md bg-zinc-600 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  )
}

