'use client'

import {useRouter} from 'next/navigation'
import {useState, useEffect} from 'react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  
  useEffect(() => {
    // Check if already authenticated
    fetch('/api/check_auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          // Redirect to the original destination or default to review page
          const params = new URLSearchParams(window.location.search)
          const redirectTo = params.get('redirect') || '/admin/review'
          router.push(redirectTo)
        } else {
          setIsChecking(false)
        }
      })
      .catch(() => {
        setIsChecking(false)
      })
  }, [router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/validate_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password}),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Redirect to the original destination or default to review page
        const params = new URLSearchParams(window.location.search)
        const redirectTo = params.get('redirect') || '/admin/review'
        router.push(redirectTo)
        router.refresh()
      } else {
        setError(data.error || 'Invalid password')
      }
    } catch (err) {
      setError('Failed to validate password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isChecking) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-zinc-600">Checking authentication...</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Admin Login</h1>
          <p className="text-sm text-zinc-600 mb-6">
            Please enter the admin password to continue
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Validating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

