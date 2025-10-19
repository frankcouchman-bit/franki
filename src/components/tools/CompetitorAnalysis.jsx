import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, Loader } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function CompetitorAnalysis() {
  const [keyword, setKeyword] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeCompetitors = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter a keyword')
      return
    }

    setLoading(true)
    try {
      const result = await api.analyzeCompetitors(keyword)
      setAnalysis(result)
      toast.success('Competitor analysis complete!')
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

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
      default: return 'text-white'
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Competitor Analysis</h3>
          <p className="text-white/60 text-sm">Analyze top-ranking content for your keywords</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Target Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && analyzeCompetitors()}
            placeholder="best productivity apps 2025"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50"
            maxLength={200}
          />
        </div>

        <motion.button
          onClick={analyzeCompetitors}
          disabled={loading || !keyword.trim()}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing Top 10 Results...
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              Analyze Competitors
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
          {/* Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Difficulty</div>
              <div className={`text-3xl font-black ${getDifficultyColor(analysis.difficulty)}`}>
                {analysis.difficulty || 'Medium'}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Avg Word Count</div>
              <div className="text-3xl font-black text-blue-400">
                {analysis.top_content_insights?.avg_word_count || 3000}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Opportunity Score</div>
              <div className="text-3xl font-black text-green-400">
                {analysis.opportunity_score || 75}/100
              </div>
            </div>
          </div>

          {/* Common Headings */}
          {analysis.top_content_insights?.common_headings && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4">Common Headings in Top Content</div>
              <div className="space-y-2">
                {analysis.top_content_insights.common_headings.map((heading, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-orange-400">{i + 1}</span>
                    </div>
                    <span className="text-white/80">{heading}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Gaps */}
          {analysis.top_content_insights?.content_gaps && analysis.top_content_insights.content_gaps.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <div className="text-lg font-bold mb-4 text-green-400 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Content Gaps (Opportunities)
              </div>
              <ul className="space-y-2">
                {analysis.top_content_insights.content_gaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80">
                    <span className="text-green-400">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4">Recommendations</div>
              <div className="space-y-4">
                {analysis.recommendations.target_word_count && (
                  <div>
                    <div className="text-sm text-white/60 mb-1">Target Word Count</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {analysis.recommendations.target_word_count} words
                    </div>
                  </div>
                )}

                {analysis.recommendations.must_include_sections && (
                  <div>
                    <div className="text-sm text-white/60 mb-2">Must Include Sections</div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.recommendations.must_include_sections.map((section, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.recommendations.differentiation_strategy && (
                  <div>
                    <div className="text-sm text-white/60 mb-1">Differentiation Strategy</div>
                    <p className="text-white/80">{analysis.recommendations.differentiation_strategy}</p>
                  </div>
                )}

                {analysis.recommendations.content_depth && (
                  <div>
                    <div className="text-sm text-white/60 mb-1">Content Depth</div>
                    <p className="text-white/80">{analysis.recommendations.content_depth}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Media Usage */}
          {analysis.top_content_insights?.media_usage && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="text-sm font-semibold text-blue-400 mb-2">📊 Media Usage Insights</div>
              <p className="text-white/80">{analysis.top_content_insights.media_usage}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
