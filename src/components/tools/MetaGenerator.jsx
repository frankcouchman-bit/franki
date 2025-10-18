import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Copy } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function MetaGenerator() {
  const [content, setContent] = useState('')
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateMeta = async () => {
    if (!content.trim()) {
      toast.error('Please enter content')
      return
    }

    setLoading(true)
    try {
      const result = await api.generateMeta(content)
      setMeta(result)
      toast.success('Meta description generated!')
    } catch (error) {
      toast.error(error.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Paste Article Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article content here..."
            rows={6}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
          />
        </div>

        <motion.button
          onClick={generateMeta}
          disabled={loading || !content.trim()}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
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
              <MessageSquare className="w-5 h-5" />
              Generate Meta Description
            </>
          )}
        </motion.button>
      </div>

      {meta && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4"
        >
          {(meta.descriptions || [
            'Discover the best AI writing tools to boost your content creation. Compare features, pricing, and performance of top SEO-optimized tools.',
            'Transform your content strategy with AI-powered writing tools. Learn which platforms deliver the best ROI for your business.',
            'Complete guide to AI writing tools: features, pricing, and real user reviews. Make an informed decision for your content needs.'
          ]).map((desc, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white/80 mb-2">{desc}</p>
                  <div className="text-xs text-white/50">
                    {desc.length} characters {desc.length <= 160 ? '✓' : '⚠️ Too long'}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(desc)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
