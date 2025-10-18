import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
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
      toast.error(error.message || 'Generation failed')
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
            placeholder="e.g., best ai writing tools"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            onKeyPress={(e) => e.key === 'Enter' && generateBrief()}
          />
        </div>

        <motion.button
          onClick={generateBrief}
          disabled={loading || !keyword.trim()}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
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
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <h4 className="font-bold mb-4 text-lg">Content Brief for "{keyword}"</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-purple-400 mb-2">Recommended Word Count:</h5>
                <p className="text-white/80">{brief.word_count || '2000-2500 words'}</p>
              </div>

              <div>
                <h5 className="font-semibold text-purple-400 mb-2">Target Keywords:</h5>
                <div className="flex flex-wrap gap-2">
                  {(brief.keywords || ['ai writing', 'content generation', 'seo tools']).map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-purple-400 mb-2">Suggested Outline:</h5>
                <ul className="space-y-2 text-white/80">
                  {(brief.outline || [
                    'Introduction to AI Writing Tools',
                    'Top 10 Best AI Writing Tools',
                    'How to Choose the Right Tool',
                    'Pricing Comparison',
                    'Conclusion and Recommendations'
                  ]).map((section, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold">{i + 1}.</span>
                      <span>{section}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
