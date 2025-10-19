import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlignLeft, Loader } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function MetaGenerator() {
  const [content, setContent] = useState('')
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateMeta = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content')
      return
    }

    setLoading(true)
    try {
      const result = await api.generateMeta(content)
      setMeta(result)
      toast.success('Meta description generated!')
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

  const copyToClipboard = () => {
    if (meta?.description) {
      navigator.clipboard.writeText(meta.description)
      toast.success('Copied to clipboard!')
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <AlignLeft className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Meta Description Generator</h3>
          <p className="text-white/60 text-sm">Create click-worthy meta descriptions</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Your Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article content or main points here..."
            rows={8}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 resize-none"
            maxLength={3000}
          />
          <p className="text-xs text-white/50 mt-2">
            {content.length}/3,000 characters
          </p>
        </div>

        <motion.button
          onClick={generateMeta}
          disabled={loading || !content.trim()}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <AlignLeft className="w-5 h-5" />
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
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-teal-400">Generated Meta Description</div>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-lg text-sm font-semibold transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-lg text-white/90 leading-relaxed">{meta.description}</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Character Count:</span>
                <span className={`font-bold ${
                  meta.description.length >= 140 && meta.description.length <= 160
                    ? 'text-green-400'
                    : 'text-yellow-400'
                }`}>
                  {meta.description.length}/160
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-6">
            <div className="text-sm font-semibold text-teal-400 mb-2">✓ Best Practices</div>
            <ul className="space-y-1 text-sm text-white/80">
              <li>• Keep it between 140-160 characters for optimal display</li>
              <li>• Include your primary keyword naturally</li>
              <li>• Make it compelling and click-worthy</li>
              <li>• Match the search intent accurately</li>
              <li>• Include a clear value proposition</li>
            </ul>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl p-6">
            <div className="text-sm text-gray-600 mb-1">Google SERP Preview</div>
            <h3 className="text-xl text-blue-600 font-medium mb-1 hover:underline cursor-pointer">
              Your Page Title Here
            </h3>
            <div className="text-sm text-green-700 mb-1">
              https://yoursite.com › page-url
            </div>
            <p className="text-sm text-gray-700">
              {meta.description}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
