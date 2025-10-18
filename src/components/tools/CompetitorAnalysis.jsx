import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ExternalLink } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function CompetitorAnalysis() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeCompetitors = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter a keyword')
      return
    }

    setLoading(true)
    try {
      const result = await api.analyzeCompetitors(keyword)
      setResults(result)
      toast.success('Competitor analysis complete!')
    } catch (error) {
      toast.error(error.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Enter Target Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., best seo tools"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            onKeyPress={(e) => e.key === 'Enter' && analyzeCompetitors()}
          />
        </div>

        <motion.button
          onClick={analyzeCompetitors}
          disabled={loading || !keyword.trim()}
          className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              Analyze Competitors
            </>
          )}
        </motion.button>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h4 className="font-bold mb-4">Top 10 Competitors for "{keyword}"</h4>
            <div className="space-y-3">
              {(results.competitors || [
                { rank: 1, title: 'Example Competitor 1', url: 'example.com', score: 95 },
                { rank: 2, title: 'Example Competitor 2', url: 'example2.com', score: 92 },
                { rank: 3, title: 'Example Competitor 3', url: 'example3.com', score: 88 }
              ]).map((competitor, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-purple-400">#{competitor.rank}</span>
                        <a 
                          href={`https://${competitor.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-purple-400 font-semibold hover:underline flex items-center gap-2"
                        >
                          {competitor.title}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="text-sm text-green-400 mb-2">{competitor.url}</div>
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>SEO Score: {competitor.score}</span>
                        {competitor.word_count && <span>• {competitor.word_count} words</span>}
                        {competitor.backlinks && <span>• {competitor.backlinks} backlinks</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
