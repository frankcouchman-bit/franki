import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function KeywordCluster() {
  const [topic, setTopic] = useState('')
  const [clusters, setClusters] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateClusters = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setLoading(true)
    try {
      const result = await api.clusterKeywords(topic, '')
      setClusters(result)
      toast.success('Keywords clustered!')
    } catch (error) {
      toast.error(error.message || 'Clustering failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Enter Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., digital marketing"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            onKeyPress={(e) => e.key === 'Enter' && generateClusters()}
          />
        </div>

        <motion.button
          onClick={generateClusters}
          disabled={loading || !topic.trim()}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Clustering...
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              Cluster Keywords
            </>
          )}
        </motion.button>
      </div>

      {clusters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4"
        >
          {(clusters.clusters || [
            { name: 'Main Topic', keywords: ['keyword 1', 'keyword 2', 'keyword 3'] },
            { name: 'Related Topics', keywords: ['related 1', 'related 2', 'related 3'] }
          ]).map((cluster, i) => (
            <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-bold mb-4 text-lg">{cluster.name}</h4>
              <div className="flex flex-wrap gap-2">
                {cluster.keywords.map((keyword, j) => (
                  <span 
                    key={j}
                    className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
