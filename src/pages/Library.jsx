import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useArticles } from '../hooks/useArticles'
import { useNavigate } from 'react-router-dom'
import { FileText, Search, Trash2, ExternalLink, Calendar, Clock, TrendingUp, Filter } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Library() {
  const { articles, fetchArticles, deleteArticle, loading } = useArticles()
  const { plan } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState([])
  const [sortBy, setSortBy] = useState('date') // date, title, words

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  useEffect(() => {
    let filtered = articles

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(article => 
        article.title?.toLowerCase().includes(query) ||
        article.meta?.description?.toLowerCase().includes(query)
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at) - new Date(a.created_at)
      } else if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '')
      } else if (sortBy === 'words') {
        return (b.word_count || 0) - (a.word_count || 0)
      }
      return 0
    })

    setFilteredArticles(filtered)
  }, [searchQuery, articles, sortBy])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this article?')) {
      await deleteArticle(id)
    }
  }

  const totalWords = articles.reduce((sum, article) => sum + (article.word_count || 0), 0)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            Article <span className="gradient-text">Library</span>
          </h1>
          <p className="text-white/60 text-lg">Manage and view all your generated articles</p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-strong rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-purple-400" />
              <div className="text-3xl font-black gradient-text">{articles.length}</div>
            </div>
            <div className="text-white/60">Total Articles</div>
          </div>
          
          <div className="glass-strong rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="text-3xl font-black text-green-400">{totalWords.toLocaleString()}</div>
            </div>
            <div className="text-white/60">Total Words Written</div>
          </div>
          
          <div className="glass-strong rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-blue-400" />
              <div className="text-3xl font-black text-blue-400">
                {Math.ceil(totalWords / 200)}
              </div>
            </div>
            <div className="text-white/60">Minutes of Reading</div>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title or description..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="words">Sort by Word Count</option>
            </select>
          </div>
        </motion.div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-strong rounded-xl p-6 animate-pulse border border-white/10">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                <div className="h-4 bg-white/5 rounded w-full mb-2" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-16 h-16 text-white/20" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {searchQuery ? 'No articles found' : 'No articles yet'}
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? 'Try a different search term or clear your search'
                : 'Generate your first SEO-optimized article to get started'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold shadow-lg inline-flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Generate Your First Article
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/article/${article.id}`)}
                className="glass-strong rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all group border border-white/10 hover:border-purple-500/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/article/${article.id}`)
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="View article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(article.id, e)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {article.title || 'Untitled Article'}
                </h3>

                <p className="text-sm text-white/60 line-clamp-2 mb-4">
                  {article.meta?.description || 'No description available'}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/50 border-t border-white/10 pt-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
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
                      <span className="font-semibold text-purple-400">{article.word_count} words</span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
