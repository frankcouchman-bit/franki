import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader } from 'lucide-react'
import { useArticles } from '../hooks/useArticles'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import Navbar from '../components/Navbar'
import EnhancedArticleView from '../components/article/EnhancedArticleView'
import { toast } from 'react-hot-toast'

export default function Article() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { loadArticle, saveArticle, currentArticle, setCurrentArticle } = useArticles()
  const { user, plan, refreshUsage } = useAuth()
  const [loading, setLoading] = useState(true)
  const [expanding, setExpanding] = useState(false)
  const [expansionCount, setExpansionCount] = useState(0)

  const maxExpansions = plan === 'pro' ? 6 : 2

  useEffect(() => {
    if (id) {
      loadArticle(id)
        .then(article => {
          setExpansionCount(article.expansion_count || 0)
          setLoading(false)
        })
        .catch(() => {
          toast.error('Article not found')
          navigate('/library')
        })
    }
  }, [id, loadArticle, navigate])

  const handleSave = async (article) => {
    try {
      await saveArticle({ ...article, id, expansion_count: expansionCount })
      toast.success('Article saved!')
    } catch (error) {
      toast.error('Failed to save article')
    }
  }

  const handleExpand = async () => {
    if (!user) {
      toast.error('Sign in to expand articles')
      return
    }

    if (expansionCount >= maxExpansions) {
      toast.error(`Maximum expansions reached (${maxExpansions})`)
      return
    }

    setExpanding(true)
    try {
      const expanded = await api.expandArticle({
        article_json: currentArticle.data || currentArticle,
        article_id: id,
        keyword: currentArticle.title,
        website_url: ''
      })

      const newCount = expansionCount + 1
      setExpansionCount(newCount)
      
      const updatedArticle = {
        ...currentArticle,
        data: expanded,
        expansion_count: newCount,
        word_count: expanded.word_count,
        reading_time_minutes: expanded.reading_time_minutes
      }

      setCurrentArticle(updatedArticle)
      await saveArticle(updatedArticle)
      await refreshUsage()
      
      toast.success(`Article expanded! (${newCount}/${maxExpansions})`)
    } catch (error) {
      if (error.message.includes('Tool limit reached')) {
        toast.error(`Daily expansion limit reached. ${plan === 'free' ? 'Upgrade to Pro for more!' : 'Try again tomorrow.'}`)
      } else {
        toast.error(error.message || 'Expansion failed')
      }
    } finally {
      setExpanding(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-white/60">Loading article...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen pt-16">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-white/60 mb-4">Article not found</p>
            <button
              onClick={() => navigate('/library')}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-semibold transition-colors"
            >
              Back to Library
            </button>
          </div>
        </div>
      </div>
    )
  }

  const article = currentArticle.data || currentArticle

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/library')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Library
        </motion.button>

        {/* Article View */}
        <AnimatePresence mode="wait">
          {expanding ? (
            <motion.div
              key="expanding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-strong rounded-2xl p-12 border border-white/10 text-center"
            >
              <Loader className="w-16 h-16 animate-spin text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Expanding Your Article...</h3>
              <p className="text-white/60">
                Adding new sections and enriching content. This may take 30-60 seconds.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="article"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EnhancedArticleView
                article={article}
                onSave={handleSave}
                onExpand={expansionCount < maxExpansions ? handleExpand : null}
                expansionInfo={{
                  count: expansionCount,
                  max: maxExpansions,
                  canExpand: expansionCount < maxExpansions
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
