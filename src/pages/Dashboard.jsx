import { motion } from 'framer-motion'
import { useEffect } from 'react'
import ArticleGenerator from '../components/dashboard/ArticleGenerator'
import Stats from '../components/dashboard/Stats'
import RecentArticles from '../components/dashboard/RecentArticles'
import { useAuth } from '../hooks/useAuth'
import { Sparkles, TrendingUp, Target } from 'lucide-react'

export default function Dashboard() {
  const { initializeUsage, refreshUsage, user, plan } = useAuth()

  useEffect(() => {
    console.log('[DASHBOARD] Mounted, user:', user?.email)
    initializeUsage()
    refreshUsage()

    const interval = setInterval(() => {
      refreshUsage()
    }, 3000)

    return () => clearInterval(interval)
  }, [refreshUsage, initializeUsage, user])

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2">
                Welcome back, <span className="gradient-text">{user?.email?.split('@')[0] || 'User'}</span>!
              </h1>
              <p className="text-white/60 text-lg">Ready to create amazing SEO content?</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 glass-strong rounded-xl border border-purple-500/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="font-semibold">
                {plan === 'pro' ? '⭐ Pro Plan' : plan === 'enterprise' ? '💎 Enterprise' : '🆓 Free Plan'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <div className="text-2xl font-black gradient-text">AI Ready</div>
            </div>
            <p className="text-white/60">Advanced GPT-4 model active and ready to generate</p>
          </div>
          
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="text-2xl font-black text-green-400">+93%</div>
            </div>
            <p className="text-white/60">Average ranking improvement for our users</p>
          </div>
          
          <div className="glass-strong rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-blue-400" />
              <div className="text-2xl font-black text-blue-400">Perfect</div>
            </div>
            <p className="text-white/60">SEO optimization on every article</p>
          </div>
        </motion.div>

        <Stats />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ArticleGenerator />
          </div>
          
          <div className="lg:col-span-1">
            <RecentArticles />
          </div>
        </div>
      </div>
    </div>
  )
}
