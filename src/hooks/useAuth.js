import { create } from 'zustand'
import { toast } from 'react-hot-toast'

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
  
  return { today: { generations: 0, tools: 0 }, thisMonth: { total: 0 } }
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
    const refreshToken = localStorage.getItem('supabase_refresh_token')
    
    if (!token) {
      set({ loading: false, user: null })
      return
    }

    try {
      // Parse JWT to get user info
      const payload = JSON.parse(atob(token.split('.')[1]))
      const user = {
        id: payload.sub,
        email: payload.email
      }

      // Fetch profile from worker
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const profile = await response.json()
        set({
          user,
          loading: false,
          plan: profile.plan || 'free',
          usage: profile.usage || getLocalUsage()
        })
      } else {
        throw new Error('Profile fetch failed')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('supabase_token')
      localStorage.removeItem('supabase_refresh_token')
      set({ loading: false, user: null })
    }
  },

  signIn: async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          redirect: window.location.origin + '/auth/callback' 
        })
      })

      if (!response.ok) throw new Error('Failed to send magic link')
      
      const data = await response.json()
      toast.success('Magic link sent! Check your email.')
      return true
    } catch (error) {
      toast.error(error.message || 'Sign in failed')
      return false
    }
  },

  signInWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?redirect=${encodeURIComponent(window.location.origin + '/auth/callback')}`
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const profile = await response.json()
        const newUsage = profile.usage || getLocalUsage()
        set({ usage: newUsage })
        saveLocalUsage(newUsage)
      }
    } catch (error) {
      console.error('Usage refresh failed:', error)
    }
  },

  initializeUsage: () => {
    const usage = getLocalUsage()
    set({ usage })
  },

  getLocalUsage,

  canGenerate: () => {
    const { user, plan, usage } = get()
    const todayGenerations = usage?.today?.generations || 0
    
    if (!user) {
      return !localStorage.getItem('demo_used') || get().getDemoTimeRemaining() < 0
    }
    
    const maxGenerations = plan === 'pro' || plan === 'enterprise' ? 15 : 1
    return todayGenerations < maxGenerations
  },

  canUseTool: () => {
    const { user, plan, usage } = get()
    const todayTools = usage?.today?.tools || 0
    
    if (!user) {
      return todayTools < 1
    }
    
    const maxTools = plan === 'pro' || plan === 'enterprise' ? 10 : 1
    return todayTools < maxTools
  },

  incrementGeneration: () => {
    const { usage } = get()
    const newUsage = {
      ...usage,
      today: {
        ...usage.today,
        generations: (usage.today?.generations || 0) + 1
      }
    }
    set({ usage: newUsage })
    saveLocalUsage(newUsage)
  },

  incrementToolUsage: () => {
    const { usage } = get()
    const newUsage = {
      ...usage,
      today: {
        ...usage.today,
        tools: (usage.today?.tools || 0) + 1
      }
    }
    set({ usage: newUsage })
    saveLocalUsage(newUsage)
  },

  getDemoTimeRemaining: () => {
    const demoDate = localStorage.getItem('demo_date')
    if (!demoDate) return 30
    
    const demo = new Date(demoDate)
    const now = new Date()
    const diffDays = Math.ceil((now - demo) / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - diffDays)
  }
}))
