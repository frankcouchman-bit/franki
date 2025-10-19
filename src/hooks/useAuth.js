import { create } from 'zustand'
import { toast } from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL

const getLocalUsage = () => {
  const today = new Date().toISOString().split('T')[0]
  const stored = localStorage.getItem('usage_data')
  
  if (stored) {
    try {
      const data = JSON.parse(stored)
      if (data.date === today) {
        return data.usage
      }
    } catch {}
  }
  
  return { 
    today: { generations: 0, tools: 0 }, 
    month: { generations: 0 } 
  }
}

const saveLocalUsage = (usage) => {
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem('usage_data', JSON.stringify({ date: today, usage }))
}

export const useAuth = create((set, get) => ({
  user: null,
  loading: true,
  plan: 'free',
  usage: getLocalUsage(),

  checkAuth: async () => {
    const token = localStorage.getItem('supabase_token')
    
    if (!token) {
      set({ loading: false, user: null, plan: 'free' })
      return
    }

    try {
      // Parse JWT to get user info
      const payload = JSON.parse(atob(token.split('.')[1]))
      const user = {
        id: payload.sub,
        email: payload.email
      }

      // Fetch profile from worker /api/profile
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const profile = await response.json()
        const usage = profile.usage || getLocalUsage()
        
        set({
          user,
          loading: false,
          plan: profile.plan || 'free',
          usage
        })
        
        saveLocalUsage(usage)
      } else {
        throw new Error('Profile fetch failed')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('supabase_token')
      localStorage.removeItem('supabase_refresh_token')
      set({ loading: false, user: null, plan: 'free' })
    }
  },

  signIn: async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          redirect: window.location.origin + '/auth/callback'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send magic link')
      }
      
      const data = await response.json()
      toast.success(data.message || 'Magic link sent! Check your email.')
      return true
    } catch (error) {
      toast.error(error.message || 'Sign in failed')
      return false
    }
  },

  signInWithGoogle: () => {
    const redirect = encodeURIComponent(window.location.origin + '/auth/callback')
    window.location.href = `${API_URL}/auth/google?redirect=${redirect}`
  },

  handleCallback: async (accessToken, refreshToken) => {
    if (!accessToken) {
      toast.error('Authentication failed')
      return false
    }

    localStorage.setItem('supabase_token', accessToken)
    if (refreshToken) {
      localStorage.setItem('supabase_refresh_token', refreshToken)
    }

    await get().checkAuth()
    toast.success('Signed in successfully!')
    return true
  },

  signOut: () => {
    localStorage.removeItem('supabase_token')
    localStorage.removeItem('supabase_refresh_token')
    localStorage.removeItem('usage_data')
    set({ user: null, plan: 'free', usage: getLocalUsage() })
    toast.success('Signed out successfully')
    window.location.href = '/'
  },

  refreshUsage: async () => {
    const token = localStorage.getItem('supabase_token')
    if (!token) return

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const profile = await response.json()
        const newUsage = profile.usage || getLocalUsage()
        set({ 
          usage: newUsage,
          plan: profile.plan || 'free'
        })
        saveLocalUsage(newUsage)
      }
    } catch (error) {
      console.error('Usage refresh failed:', error)
    }
  }
}))
