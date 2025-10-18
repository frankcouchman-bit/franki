import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Loader } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function AuthModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    const success = await signIn(email)
    setLoading(false)

    if (success) {
      setSent(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-strong rounded-2xl p-8 max-w-md w-full border border-white/20 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black mb-2">
            {sent ? 'Check Your Email!' : 'Welcome to SEOScribe'}
          </h2>
          <p className="text-white/60">
            {sent ? 'We sent you a magic link' : 'Sign in to unlock all features'}
          </p>
        </div>

        {!sent ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                disabled={loading}
              />

              <motion.button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Magic Link
                  </>
                )}
              </motion.button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-white/60">or continue with</span>
              </div>
            </div>

            <motion.button
              onClick={signInWithGoogle}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold border border-white/20 flex items-center justify-center gap-3 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-10 h-10 text-green-400" />
            </div>
            <p className="text-white/80">
              Click the magic link in your email to sign in instantly. No password needed!
            </p>
            <p className="text-sm text-white/50">
              Didn't receive it? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Use a different email
            </button>
          </div>
        )}

        <p className="text-xs text-white/40 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </motion.div>
  )
}
