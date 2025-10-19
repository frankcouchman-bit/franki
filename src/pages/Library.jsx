import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { 
  Search, 
  FileText, 
  Trash2, 
  Calendar,
  Clock,
  BarChart3,
  Filter,
  Loader
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { toast } from 'react-hot-toast'

export default function Library() {
  const navigate = useNavigate()
  const { articles, fetchArticles, deleteArticle, loading } = useArticles()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('updated_at')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === 'all' || article.status === filterStatus
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === 'updated_at') {
        return new Date(b.updated_at) - new Date(a.updated_at)
      } else if (sortBy === 'created_at') {
        return new Date(b.created_at) - new Date(a.created_at)
      } else if (sortBy === 'word_count') {
        return (b.word_count || 0) - (a.word_count || 0)
      }
      return 0
    })

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await deleteArticle(id)
        toast.success('Article deleted')
      } catch (error) {
        toast.error('Failed to delete article')
      }
    }
  }

  return (
    <div className="min-h-screen pt-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2">Article Library</h1>
          <p className="text-white/60">Manage all your SEO-optimized articles</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
              />
            </div>

            {/* Sort By */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 appearance-none cursor-pointer"
              >
                <option value="updated_at">Recently Updated</option>
                <option value="created_at">Recently Created</option>
                <option value="word_count">Word Count</option>
              </select>
            </div>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 appearance-none cursor-pointer"
            >
              <option value="all">All Articles</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
            </select>
          </div>
        </motion.div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
              <p className="text-white/60">Loading articles...</p>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FileText className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              {searchTerm ? 'No articles found' : 'No articles yet'}
            </h3>
            <p className="text-white/60 mb-6">
              {searchTerm 
                ? 'Try adjusting your search or filters'
                : 'Generate your first article to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold"
              >
                Generate Article
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-strong rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(article.id, article.title)
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {article.title || 'Untitled'}
                  </h3>

                  <div className="space-y-2 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {article.updated_at 
                          ? new Date(article.updated_at).toLocaleDateString()
                          : 'Recently'
                        }
                      </span>
                    </div>

                    {article.word_count && (
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>{article.word_count} words</span>
                      </div>
                    )}

                    {article.reading_time_minutes && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{article.reading_time_minutes} min read</span>
                      </div>
                    )}
                  </div>

                  {article.seo_score && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">SEO Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${article.seo_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold">{article.seo_score}/100</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      article.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {article.status || 'draft'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
