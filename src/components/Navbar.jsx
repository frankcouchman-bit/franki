import { motion } from 'framer-motion'
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthModal from './auth/AuthModal'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { name: 'SEO Tools', path: '/seo-tools' },
    { name: 'Pricing', path: '/pricing' }
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-2xl font-black">S</span>
              </div>
              <span className="text-2xl font-black">
                <span className="gradient-text">SEO</span>Scribe
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                (!link.requiresAuth || user) && (
                  <motion.button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="text-white/80 hover:text-white font-semibold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.name}
                  </motion.button>
                )
              ))}

              {user ? (
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => navigate('/library')}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Library
                  </motion.button>
                  <motion.button
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg font-semibold transition-colors text-red-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-900"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                (!link.requiresAuth || user) && (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path)
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 font-semibold transition-colors"
                  >
                    {link.name}
                  </button>
                )
              ))}

              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/library')
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-4 py-3 rounded-lg bg-white/10 font-semibold"
                  >
                    Library
                  </button>
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-3 rounded-lg bg-red-500/20 text-red-400 font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true)
                    setIsOpen(false)
                  }}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-center"
                >
                  Get Started Free
                </button>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
