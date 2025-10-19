import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react'
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
      if (error.message.includes('Tool limit reached')) {
        toast.error('Daily tool limit reached. Upgrade to Pro for more!')
      } else if (error.message.includes('Sign in required')) {
        toast.error('Sign in to use SEO tools')
      } else {
        toast.error(error.message || 'Analysis failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-rose-500'
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-400'
    if (grade.startsWith('B')) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Headline Analyzer</h3>
          <p className="text-white/60 text-sm">Optimize your headlines for maximum CTR</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Your Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && analyzeHeadline()}
            placeholder="10 Ways to Boost Your SEO Rankings in 2025"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            maxLength={100}
          />
          <p className="text-xs text-white/50 mt-2">
            {headline.length}/100 characters
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
          {/* Score Card */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Overall Score</div>
              <div className="relative w-24 h-24 mx-auto">
                <svg className="transform -rotate-90" width="96" height="96">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={251}
                    strokeDashoffset={251 - (251 * analysis.score) / 100}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl font-black gradient-text">
                    {analysis.score}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Grade</div>
              <div className={`text-5xl font-black ${getGradeColor(analysis.grade)}`}>
                {analysis.grade}
              </div>
              <div className="text-sm text-white/60 mt-2">
                {analysis.estimated_ctr || 'Medium'} CTR
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Length</span>
                <span className="font-bold">{analysis.length} chars</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Words</span>
                <span className="font-bold">{analysis.word_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Numbers</span>
                <span className="font-bold">{analysis.has_numbers ? 'Yes ✓' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Power Words */}
          {analysis.power_words && analysis.power_words.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Power Words Detected
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.power_words.map((word, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Emotional Words */}
          {analysis.emotional_words && analysis.emotional_words.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Emotional Triggers
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.emotional_words.map((word, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {analysis.feedback && analysis.feedback.length > 0 && (
            <div className="space-y-3">
              <div className="text-lg font-bold mb-4">Recommendations</div>
              {analysis.feedback.map((item, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${
                    item.type === 'success'
                      ? 'bg-green-500/10 border-green-500/30'
                      : item.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />}
                    {item.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />}
                    {item.type === 'info' && <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />}
                    <span className="text-white/90">{item.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
