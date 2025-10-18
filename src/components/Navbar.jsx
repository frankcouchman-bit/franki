import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, FileText, Library, Wrench, CreditCard, LogOut, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import AuthModal from './auth/AuthModal'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, plan, signOut } = useAuth()

  const navLinks = user ? [
    { path: '/dashboard', label: 'Dashboard', icon: Sparkles },
    { path: '/library', label: 'Library', icon: Library },
    { path: '/seo-tools', label: 'SEO Tools', icon: Wrench },
  ] : [
    { path: '/seo-tools', label: 'SEO Tools', icon: Wrench },
  ]

  const handleUpgrade = async () => {
    if (!user) {
      setShowAuth(true)
      return
    }

    try {
      const response = await fetch('https://seoscribe.frank-couchman.workers.dev/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
        },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/dashboard?upgrade=success`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      }
    } catch (error) {
      console.error('Upgrade error:', error)
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xl font-black gradient-text">SEOScribe</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    location.pathname === link.path
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  {plan === 'free' && (
                    <motion.button
                      onClick={handleUpgrade}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Upgrade to Pro
                    </motion.button>
                  )}

                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                      <User className="w-4 h-4" />
                      <span className="font-semibold">{plan === 'pro' ? 'Pro' : 'Free'}</span>
                    </button>

                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <button
                        onClick={() => navigate('/pricing')}
                        className="w-full px-4 py-3 text-left hover:bg-white/10 rounded-t-lg transition-colors flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Manage Plan
                      </button>
                      <button
                        onClick={signOut}
                        className="w-full px-4 py-3 text-left hover:bg-white/10 rounded-b-lg transition-colors flex items-center gap-2 text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <motion.button
                  onClick={() => setShowAuth(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/10 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                      location.pathname === link.path
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}

                {user ? (
                  <>
                    {plan === 'free' && (
                      <button
                        onClick={() => {
                          setMobileOpen(false)
                          handleUpgrade()
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Upgrade to Pro
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        navigate('/pricing')
                      }}
                      className="w-full px-4 py-3 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Manage Plan
                    </button>
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        signOut()
                      }}
                      className="w-full px-4 py-3 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      setShowAuth(true)
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
                  >
                    Get Started Free
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </>
  )
}
