import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Loader } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function ContentBrief() {
  const [keyword, setKeyword] = useState('')
  const [brief, setBrief] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateBrief = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter a keyword')
      return
    }

    setLoading(true)
    try {
      const result = await api.generateBrief(keyword)
      setBrief(result)
      toast.success('Content brief generated!')
    } catch (error) {
      if (error.message.includes('Tool limit reached')) {
        toast.error('Daily tool limit reached. Upgrade to Pro for more!')
      } else if (error.message.includes('Sign in required')) {
        toast.error('Sign in to use SEO tools')
      } else {
        toast.error(error.message || 'Generation failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Content Brief Generator</h3>
          <p className="text-white/60 text-sm">Create detailed content briefs from SERP analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Target Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateBrief()}
            placeholder="how to improve website speed"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/50"
            maxLength={200}
          />
        </div>

        <motion.button
          onClick={generateBrief}
          disabled={loading || !keyword.trim()}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
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
              <FileText className="w-5 h-5" />
              Generate Content Brief
            </>
          )}
        </motion.button>
      </div>

      {brief && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Overview */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Search Intent</div>
              <div className="text-2xl font-bold text-indigo-400 capitalize">
                {brief.search_intent || 'Informational'}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Target Word Count</div>
              <div className="text-2xl font-bold text-purple-400">
                {brief.target_word_count || 3000} words
              </div>
            </div>
          </div>

          {/* Recommended Structure */}
          {brief.recommended_structure && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4">Recommended Structure</div>
              <div className="space-y-4">
                {brief.recommended_structure.intro && (
                  <div>
                    <div className="text-sm font-semibold text-indigo-400 mb-1">Introduction</div>
                    <p className="text-white/80">{brief.recommended_structure.intro}</p>
                  </div>
                )}

                {brief.recommended_structure.main_sections && (
                  <div>
                    <div className="text-sm font-semibold text-indigo-400 mb-2">Main Sections</div>
                    <div className="space-y-2">
                      {brief.recommended_structure.main_sections.map((section, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="w-6 h-6 bg-indigo-500/20 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-indigo-400">{i + 1}</span>
                          </div>
                          <span className="text-white/80">{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {brief.recommended_structure.conclusion && (
                  <div>
                    <div className="text-sm font-semibold text-indigo-400 mb-1">Conclusion</div>
                    <p className="text-white/80">{brief.recommended_structure.conclusion}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Keyword Opportunities */}
          {brief.keyword_opportunities && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4">Keyword Opportunities</div>
              <div className="space-y-4">
                {brief.keyword_opportunities.primary && brief.keyword_opportunities.primary.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-purple-400 mb-2">Primary Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {brief.keyword_opportunities.primary.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {brief.keyword_opportunities.secondary && brief.keyword_opportunities.secondary.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-blue-400 mb-2">Secondary Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {brief.keyword_opportunities.secondary.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {brief.keyword_opportunities.long_tail && brief.keyword_opportunities.long_tail.length > 0 && (
                  <div>
                    <div className="text-sm font-semibold text-green-400 mb-2">Long-tail Keywords</div>
                    <div className="space-y-2">
                      {brief.keyword_opportunities.long_tail.map((kw, i) => (
                        <div key={i} className="p-2 bg-green-500/10 border border-green-500/30 rounded text-green-300 text-sm">
                          {kw}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Content Angles */}
          {brief.content_angles && brief.content_angles.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4">Content Angles</div>
              <div className="space-y-2">
                {brief.content_angles.map((angle, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
                    <span className="text-indigo-400">•</span>
                    <span className="text-white/80">{angle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitor Insights */}
          {brief.competitor_insights && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4">Competitor Insights</div>
              <p className="text-white/80">{brief.competitor_insights}</p>
            </div>
          )}

          {/* Unique Value Props */}
          {brief.unique_value_props && brief.unique_value_props.length > 0 && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6">
              <div className="text-lg font-bold mb-4 text-indigo-400">How to Differentiate</div>
              <ul className="space-y-2">
                {brief.unique_value_props.map((prop, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80">
                    <span className="text-indigo-400">✓</span>
                    <span>{prop}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
