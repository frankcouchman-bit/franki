import { motion } from 'framer-motion'
import { FileText, Zap, TrendingUp, Crown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Stats() {
  const { plan, usage } = useAuth()
  const navigate = useNavigate()

  const quotas = {
    free: { generations: 1, tools: 1 },
    pro: { generations: 15, tools: 10 }
  }

  const currentQuota = quotas[plan] || quotas.free
  const generationsUsed = usage?.today?.generations || 0
  const toolsUsed = usage?.today?.tools || 0

  const stats = [
    {
      label: 'Articles Today',
      value: `${generationsUsed}/${currentQuota.generations}`,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      percentage: (generationsUsed / currentQuota.generations) * 100
    },
    {
      label: 'Tool Uses Today',
      value: `${toolsUsed}/${currentQuota.tools}`,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      percentage: (toolsUsed / currentQuota.tools) * 100
    },
    {
      label: 'This Month',
      value: usage?.month?.generations || 0,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Current Plan',
      value: plan === 'pro' ? 'Pro' : 'Free',
      icon: Crown,
      color: plan === 'pro' ? 'from-yellow-500 to-orange-500' : 'from-gray-500 to-slate-500',
      action: plan === 'free' ? () => navigate('/pricing') : null
    }
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={stat.action}
          className={`glass-strong rounded-2xl p-6 border border-white/10 ${
            stat.action ? 'cursor-pointer hover:border-white/20' : ''
          } transition-all`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            {stat.action && (
              <span className="text-xs text-purple-400 font-semibold">Upgrade</span>
            )}
          </div>

          <div className="text-3xl font-black mb-1">{stat.value}</div>
          <div className="text-sm text-white/60">{stat.label}</div>

          {stat.percentage !== undefined && (
            <div className="mt-4">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stat.percentage, 100)}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={`h-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
