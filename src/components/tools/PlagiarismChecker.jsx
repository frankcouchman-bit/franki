import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function PlagiarismChecker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkPlagiarism = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }

    setLoading(true)
    try {
      const data = await api.checkPlagiarism(text)
      setResult(data)
      toast.success('Originality checked!')
    } catch (error) {
      if (error.message.includes('Tool limit reached')) {
        toast.error('Daily tool limit reached. Upgrade to Pro for more!')
      } else if (error.message.includes('Sign in required')) {
        toast.error('Sign in to use SEO tools')
      } else {
        toast.error(error.message || 'Check failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'excellent': return 'from-green-500 to-emerald-500'
      case 'very_good': return 'from-blue-500 to-cyan-500'
      case 'good': return 'from-yellow-500 to-orange-500'
      default: return 'from-red-500 to-rose-500'
    }
  }

  const getStatusIcon = (status) => {
    if (status === 'excellent' || status === 'very_good') {
      return <CheckCircle className="w-8 h-8 text-green-400" />
    }
    return <AlertTriangle className="w-8 h-8 text-yellow-400" />
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Plagiarism Checker</h3>
          <p className="text-white/60 text-sm">Verify content originality</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Content to Check</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here to check for originality..."
            rows={8}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 resize-none"
            maxLength={50000}
          />
          <p className="text-xs text-white/50 mt-2">
            {text.length}/50,000 characters
          </p>
        </div>

        <motion.button
          onClick={checkPlagiarism}
          disabled={loading || !text.trim()}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Check Originality
            </>
          )}
        </motion.button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Status Card */}
          <div className={`bg-gradient-to-br ${getStatusColor(result.status)} p-6 rounded-2xl`}>
            <div className="flex items-center gap-4 mb-4">
              {getStatusIcon(result.status)}
              <div>
                <div className="text-2xl font-black">
                  {result.originality_score}/100
                </div>
                <div className="text-sm opacity-90">Originality Score</div>
              </div>
            </div>
            <p className="text-white/90">{result.message}</p>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Unique Word Ratio</div>
              <div className="text-3xl font-black text-green-400">
                {result.metrics?.unique_word_ratio || 0}%
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Complexity Score</div>
              <div className="text-3xl font-black text-blue-400">
                {result.metrics?.complexity_score || 0}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Total Words</div>
              <div className="text-3xl font-black text-purple-400">
                {result.metrics?.total_words || 0}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-2">Unique Words</div>
              <div className="text-3xl font-black text-pink-400">
                {result.metrics?.unique_words || 0}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-lg font-bold mb-4">Content Statistics</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Sentences:</span>
                <span className="font-bold">{result.metrics?.sentences || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Avg Sentence Length:</span>
                <span className="font-bold">{result.metrics?.avg_sentence_length || 0} words</span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="text-sm text-blue-400 font-semibold mb-2">ℹ️ Note</div>
            <p className="text-sm text-white/80">
              This is a basic originality check based on text analysis. For comprehensive plagiarism detection,
              use professional tools like Copyscape or Grammarly Premium.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
