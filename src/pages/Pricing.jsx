import { motion } from 'framer-motion'
import { Check, Zap, Crown, Sparkles, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'

export default function Pricing() {
  const navigate = useNavigate()
  const { user, plan: currentPlan } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (planType) => {
    if (!user) {
      toast.error('Please sign in first')
      navigate('/')
      return
    }

    if (planType === 'free') {
      toast.info('You\'re already on the free plan!')
      return
    }

    setLoading(true)
    try {
      const { url } = await api.createCheckoutSession(
        window.location.origin + '/dashboard',
        window.location.origin + '/pricing'
      )
      window.location.href = url
    } catch (error) {
      toast.error(error.message || 'Failed to start checkout')
      setLoading(false)
    }
  }

  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out SEOScribe',
      features: [
        '1 article per day',
        '1 SEO tool use per day',
        '2 article expansions',
        'All content templates',
        'Basic support',
        'Export to markdown'
      ],
      cta: 'Get Started Free',
      popular: false,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$29',
      period: '/month',
      description: 'For serious content creators',
      features: [
        '15 articles per day',
        '10 SEO tool uses per day',
        '6 article expansions',
        'All content templates',
        'Priority support',
        'Export to all formats',
        'Advanced analytics',
        'Team collaboration',
        'API access'
      ],
      cta: 'Upgrade to Pro',
      popular: true,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: 'Custom',
      period: '',
      description: 'For agencies and large teams',
      features: [
        'Unlimited articles',
        'Unlimited SEO tools',
        'Unlimited expansions',
        'Custom templates',
        'Dedicated support',
        'White-label solution',
        'Custom integrations',
        'SLA guarantee',
        'Onboarding & training'
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Start free, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>

          {currentPlan && currentPlan !== 'free' && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full">
              <Check className="w-5 h-5 text-green-400" />
              <span className="font-semibold">You're on the {currentPlan} plan</span>
            </div>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-strong rounded-2xl p-8 border-2 transition-all ${
                plan.popular 
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/20 scale-105' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-6`}>
                <plan.icon className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p className="text-white/60 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="text-white/60">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => handleSubscribe(plan.name.toLowerCase())}
                disabled={loading || (currentPlan === plan.name.toLowerCase())}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : currentPlan === plan.name.toLowerCase() ? (
                  'Current Plan'
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-black text-center mb-12">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! You can cancel your subscription at any time. No questions asked.'
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 14-day money-back guarantee. If you\'re not satisfied, we\'ll refund you in full.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards and PayPal through Stripe.'
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes! You can change your plan at any time. Changes take effect immediately.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                <p className="text-white/70">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
