import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function SERPPreview() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const generatePreview = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required')
      return
    }

    setLoading(true)
    try {
      const result = await api.generateSERPPreview(title, description, url || 'https://example.com')
      setPreview(result)
      toast.success('Preview generated!')
    } catch (error) {
      toast.error(error.message || 'Preview failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Page Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your page title (50-60 characters)"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
            maxLength={60}
          />
          <p className="text-xs text-white/50 mt-2">
            {title.length}/60 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Meta Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Your meta description (140-160 characters)"
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
            maxLength={160}
          />
          <p className="text-xs text-white/50 mt-2">
            {description.length}/160 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Page URL <span className="text-white/50">(optional)</span>
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourwebsite.com/page"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
          />
        </div>

        <motion.button
          onClick={generatePreview}
          disabled={loading || !title.trim() || !description.trim()}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
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
              <Search className="w-5 h-5" />
              Generate SERP Preview
            </>
          )}
        </motion.button>
      </div>

      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Google Preview */}
          <div className="p-6 bg-white rounded-xl">
            <div className="mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <ExternalLink className="w-4 h-4" />
                <span>{preview.google?.url || 'example.com'}</span>
              </div>
              <h3 className="text-xl text-blue-600 font-medium hover:underline cursor-pointer">
                {preview.google?.title || title}
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {preview.google?.description || description}
            </p>
          </div>

          {/* Platform Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-sm text-white/60 mb-1">Twitter</div>
              <div className="text-white/80 text-sm">
                {preview.twitter?.title?.length || title.length} / 70 chars
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-sm text-white/60 mb-1">Facebook</div>
              <div className="text-white/80 text-sm">
                {preview.facebook?.title?.length || title.length} / 95 chars
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-sm text-white/60 mb-1">LinkedIn</div>
              <div className="text-white/80 text-sm">
                {preview.linkedin?.title?.length || title.length} / 200 chars
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
