import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Crown, Sparkles } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { toast } from "react-hot-toast"

export default function Pricing() {
  const { user, plan } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    if (!user) {
      navigate("/")
      return
    }
    if (plan === "pro") {
      handleManageBilling()
      return
    }
    setLoading(true)
    try {
      const response = await fetch(
        "https://seoscribe.frank-couchman.workers.dev/api/stripe/create-checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("supabase_token")}`,
          },
          body: JSON.stringify({
            successUrl: `${window.location.origin}/dashboard?upgrade=success`,
            cancelUrl: `${window.location.origin}/pricing`,
          }),
        }
      )
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Upgrade error:", error)
      toast.error("Failed to start upgrade process")
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await fetch(
        "https://seoscribe.frank-couchman.workers.dev/api/stripe/portal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("supabase_token")}`,
          },
          body: JSON.stringify({
            returnUrl: `${window.location.origin}/pricing`,
          }),
        }
      )
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error("Failed to access billing portal")
      }
    } catch (error) {
      console.error("Portal error:", error)
      toast.error("Failed to open billing portal")
      setLoading(false)
    }
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out SEOScribe",
      features: [
        "1 article per day",
        "1 SEO tool use per day",
        "2 article expansions",
        "All content templates",
        "Basic analytics",
        "Community support",
      ],
      cta: "Current Plan",
      current: plan === "free",
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For serious content creators and agencies",
      features: [
        "15 articles per day",
        "10 SEO tool uses per day",
        "6 article expansions",
        "All premium templates",
        "Advanced analytics",
        "Priority support",
        "API access",
        "White-label options",
      ],
      cta: plan === "pro" ? "Manage Billing" : "Upgrade to Pro",
      popular: true,
      current: plan === "pro",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-6">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Start free, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((planItem, index) => (
            <motion.div
              key={planItem.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-strong rounded-2xl p-8 border ${
                planItem.popular
                  ? "border-purple-500/50 shadow-2xl shadow-purple-500/20"
                  : "border-white/10"
              } relative`}
            >
              {planItem.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${planItem.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                >
                  <planItem.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{planItem.name}</h3>
                <p className="text-white/60 text-sm mb-4">{planItem.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-black gradient-text">{planItem.price}</span>
                  <span className="text-white/60">{planItem.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {planItem.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                type="button"
                onClick={planItem.name === "Pro" ? handleUpgrade : undefined}
                disabled={loading || (planItem.current && planItem.name === "Free")}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  planItem.popular
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50"
                    : planItem.current
                    ? "bg-white/10 cursor-not-allowed"
                    : "bg-white/10 hover:bg-white/20"
                } disabled:opacity-50`}
                whileHover={
                  planItem.current && planItem.name === "Free" ? {} : { scale: 1.02 }
                }
                whileTap={
                  planItem.current && planItem.name === "Free" ? {} : { scale: 0.98 }
                }
              >
                {loading ? "Loading..." : planItem.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="glass-strong rounded-2xl p-8 border border-white/10 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need a custom plan?</h3>
            <p className="text-white/70 mb-6">
              For enterprises and agencies requiring custom limits, white-label solutions, or
              dedicated support, contact us for a tailored plan.
            </p>

            {/* FIXED: proper anchor tag */}
            <a
              href="mailto:support@seoscribe.pro"
              className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
