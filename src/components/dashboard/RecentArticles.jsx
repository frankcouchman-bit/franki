import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../../hooks/useArticles'
import { FileText, Clock, Trash2 } from 'lucide-react'

export default function RecentArticles() {
  const { articles, fetchArticles, deleteArticle, loading } = useArticles()
  const navigate = useNavigate()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const recentArticles = articles.slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-strong rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Recent Articles</h2>
        <button
          onClick={() => navigate('/library')}
          className="text-sm text-purple-400 hover:text-purple-300 font-semibold"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-white/5 rounded-xl animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : recentArticles.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/60">No articles yet</p>
          <p className="text-sm text-white/40 mt-1">Generate your first article above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer group transition-all"
              onClick={() => navigate(`/article/${article.id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {article.title || 'Untitled'}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {article.created_at 
                          ? new Date(article.created_at).toLocaleDateString()
                          : 'Recently'
                        }
                      </span>
                    </div>
                    {article.word_count && (
                      <>
                        <span>•</span>
                        <span>{article.word_count} words</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Delete this article?')) {
                      deleteArticle(article.id)
                    }
                  }}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
