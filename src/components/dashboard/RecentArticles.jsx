import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../../hooks/useArticles'
import { FileText, ArrowRight, Loader } from 'lucide-react'

export default function RecentArticles() {
  const navigate = useNavigate()
  const { articles, fetchArticles, loading } = useArticles()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const recentArticles = articles.slice(0, 5)

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Recent Articles</h3>
        <button
          onClick={() => navigate('/library')}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : recentArticles.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 mb-4">No articles yet</p>
          <p className="text-sm text-white/50">
            Generate your first article to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/article/${article.id}`)}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white/90 group-hover:text-white mb-1 line-clamp-1">
                    {article.title || 'Untitled'}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span>
                      {article.updated_at
                        ? new Date(article.updated_at).toLocaleDateString()
                        : 'Recently'
                      }
                    </span>
                    {article.word_count && (
                      <>
                        <span>•</span>
                        <span>{article.word_count} words</span>
                      </>
                    )}
                  </div>
                </div>
                {article.seo_score && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-white/50 mb-1">SEO</div>
                    <div className="text-sm font-bold text-purple-400">
                      {article.seo_score}/100
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
