import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function HeadlineAnalyzer() {
  const [headline, setHeadline] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeHeadline = async () => {
    if (!headline.trim()) {
      toast.error('Please enter a headline')
      return
    }

    setLoading(true)
    try {
      const result = await api.analyzeHeadline(headline)
      setAnalysis(result)
      toast.success('Headline analyzed!')
    } catch (error) {
      toast.error(error.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Enter Your Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g., 10 Best AI Writing Tools to Boost Your Productivity"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            onKeyPress={(e) => e.key === 'Enter' && analyzeHeadline()}
          />
          <p className="text-xs text-white/50 mt-2">
            Character count: {headline.length} / 60 (optimal)
          </p>
        </div>

        <motion.button
          onClick={analyzeHeadline}
          disabled={loading || !headline.trim()}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
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
              <Sparkles className="w-5 h-5" />
              Analyze Headline
            </>
          )}
        </motion.button>
      </div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Overall Score */}
          <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
            <div className={`text-6xl font-black mb-2 ${getScoreColor(analysis.score || 75)}`}>
              {analysis.score || 75}
            </div>
            <div className="text-white/60">Overall Score</div>
            <div className="mt-4">
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${
                    (analysis.score || 75) >= 80 
                      ? 'from-green-400 to-emerald-400'
                      : (analysis.score || 75) >= 60
                      ? 'from-yellow-400 to-orange-400'
                      : 'from-red-400 to-pink-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.score || 75}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {analysis.word_count || headline.split(' ').length}
              </div>
              <div className="text-sm text-white/60">Words</div>
              <div className="text-xs text-white/50 mt-1">Optimal: 6-10</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {analysis.emotional_score || 'Medium'}
              </div>
              <div className="text-sm text-white/60">Emotional Impact</div>
              <div className="text-xs text-white/50 mt-1">Engagement level</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {analysis.power_words || 2}
              </div>
              <div className="text-sm text-white/60">Power Words</div>
              <div className="text-xs text-white/50 mt-1">Clickability boost</div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-3">
            <h4 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Improvement Suggestions
            </h4>
            {(analysis.suggestions || [
              'Add numbers for better engagement (e.g., "10 Best...")',
              'Include power words like "Ultimate", "Essential", "Proven"',
              'Keep it under 60 characters for SEO'
            ]).map((suggestion, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/80">{suggestion}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
