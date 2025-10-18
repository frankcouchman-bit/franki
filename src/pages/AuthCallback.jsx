import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { handleCallback } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const error = params.get('error')

    if (error) {
      console.error('Auth error:', error)
      navigate('/?error=' + error)
      return
    }

    if (accessToken) {
      handleCallback(accessToken, refreshToken).then(success => {
        if (success) {
          navigate('/dashboard')
        } else {
          navigate('/?error=callback_failed')
        }
      })
    } else {
      navigate('/?error=no_token')
    }
  }, [handleCallback, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">Completing sign in...</p>
      </div>
    </div>
  )
}
