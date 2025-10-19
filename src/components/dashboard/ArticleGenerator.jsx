import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Loader, AlertCircle } from 'lucide-react'
import { useArticles } from '../../hooks/useArticles'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'

export default function ArticleGenerator() {
  const navigate = useNavigate()
  const { generateArticle, generating } = useArticles()
  const { plan, refreshUsage } = useAuth()
  const [topic, setTopic] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    try {
      const article = await generateArticle(topic, websiteUrl)
      await refreshUsage()
      
      if (article.id) {
        navigate(`/article/${article.id}`)
      } else {
        toast.success('Article generated! Saving...')
      }
    } catch (error) {
      // Error already handled in useArticles hook
      console.error('Generation error:', error)
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Generate Article</h3>
          <p className="text-white/60 text-sm">
            Create SEO-optimized content in 60 seconds
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Topic or Keyword
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Best productivity apps for 2025"
            disabled={generating}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 disabled:opacity-50"
          />
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {showAdvanced ? '− Hide' : '+ Show'} Advanced Options
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Website URL <span className="text-white/50 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  disabled={generating}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 disabled:opacity-50"
                />
                <p className="text-xs text-white/50 mt-2">
                  We'll scan your site for internal linking opportunities
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleGenerate}
          disabled={generating || !topic.trim()}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: generating ? 1 : 1.02 }}
          whileTap={{ scale: generating ? 1 : 0.98 }}
        >
          {generating ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              Generating Article...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Generate Article
            </>
          )}
        </motion.button>

        {plan === 'free' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <strong>Free Plan:</strong> 1 article per day. Upgrade to Pro for 15 articles/day + unlimited expansions.
            </div>
          </div>
        )}
      </div>

      {/* Generation Info */}
      <div className="mt-6 pt-6 border-t border-white/10 grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-white/60 mb-1">Word Count</div>
          <div className="font-bold">3,000+ words</div>
        </div>
        <div>
          <div className="text-white/60 mb-1">Generation Time</div>
          <div className="font-bold">~60 seconds</div>
        </div>
        <div>
          <div className="text-white/60 mb-1">Includes</div>
          <div className="font-bold">Image + Social</div>
        </div>
      </div>
    </div>
  )
}
