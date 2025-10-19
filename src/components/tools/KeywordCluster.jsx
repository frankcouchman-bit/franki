import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tag, Loader } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function KeywordCluster() {
  const [topic, setTopic] = useState('')
  const [text, setText] = useState('')
  const [clusters, setClusters] = useState(null)
  const [loading, setLoading] = useState(false)

  const clusterKeywords = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setLoading(true)
    try {
      const result = await api.clusterKeywords(topic, text)
      setClusters(result)
      toast.success('Keywords clustered!')
    } catch (error) {
      if (error.message.includes('Tool limit reached')) {
        toast.error('Daily tool limit reached. Upgrade to Pro for more!')
      } else if (error.message.includes('Sign in required')) {
        toast.error('Sign in to use SEO tools')
      } else {
        toast.error(error.message || 'Clustering failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Keyword Clustering</h3>
          <p className="text-white/60 text-sm">Extract and organize SEO keywords from SERP</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !text && clusterKeywords()}
            placeholder="content marketing strategies"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Your Content <span className="text-white/50 font-normal">(optional)</span>
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here for better keyword extraction..."
            rows={6}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/50 resize-none"
            maxLength={20000}
          />
          <p className="text-xs text-white/50 mt-2">
            {text.length}/20,000 characters
          </p>
        </div>

        <motion.button
          onClick={clusterKeywords}
          disabled={loading || !topic.trim()}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Analyzing SERP...
            </>
          ) : (
            <>
              <Tag className="w-5 h-5" />
              Cluster Keywords
            </>
          )}
        </motion.button>
      </div>

      {clusters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Primary Keywords */}
          {clusters.primary && clusters.primary.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4 text-pink-400">Primary Keywords</div>
              <div className="flex flex-wrap gap-2">
                {clusters.primary.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 text-pink-300 rounded-lg text-sm font-semibold"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Keywords */}
          {clusters.secondary && clusters.secondary.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4 text-purple-400">Secondary Keywords</div>
              <div className="flex flex-wrap gap-2">
                {clusters.secondary.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-semibold"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Long-tail Keywords */}
          {clusters.long_tail && clusters.long_tail.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4 text-blue-400">Long-tail Keywords</div>
              <div className="space-y-2">
                {clusters.long_tail.map((keyword, i) => (
                  <div key={i} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <span className="text-blue-300">{keyword}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question Keywords */}
          {clusters.questions && clusters.questions.length > 0 && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-lg font-bold mb-4 text-green-400">Question Keywords (for FAQs)</div>
              <div className="space-y-2">
                {clusters.questions.map((question, i) => (
                  <div key={i} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-2">
                    <span className="text-green-400 text-xl">?</span>
                    <span className="text-green-300">{question}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-6">
            <div className="text-sm font-semibold text-pink-400 mb-2">💡 How to Use</div>
            <ul className="space-y-1 text-sm text-white/80">
              <li>• Use <strong>primary keywords</strong> in your title, H1, and first paragraph</li>
              <li>• Sprinkle <strong>secondary keywords</strong> throughout your content naturally</li>
              <li>• Target <strong>long-tail keywords</strong> in H2/H3 subheadings</li>
              <li>• Answer <strong>question keywords</strong> in your FAQ section</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}
