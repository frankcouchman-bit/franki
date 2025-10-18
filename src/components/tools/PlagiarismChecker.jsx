import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function PlagiarismChecker() {
  const [text, setText] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkPlagiarism = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }

    setLoading(true)
    try {
      const result = await api.checkPlagiarism(text)
      setResults(result)
      toast.success('Plagiarism check complete!')
    } catch (error) {
      toast.error(error.message || 'Check failed')
    } finally {
      setLoading(false)
    }
  }

  const uniqueScore = results?.unique_score || 100

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Paste Content to Check</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here to check for plagiarism..."
            rows={8}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
          />
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
              <CheckCircle className="w-5 h-5" />
              Check for Plagiarism
            </>
          )}
        </motion.button>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
        >
          {/* Uniqueness Score */}
          <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
            <div className={`text-6xl font-black mb-2 ${uniqueScore >= 95 ? 'text-green-400' : uniqueScore >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
              {uniqueScore}%
            </div>
            <div className="text-white/60">Content Uniqueness</div>
            <div className="mt-4">
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${
                    uniqueScore >= 95 
                      ? 'from-green-400 to-emerald-400'
                      : uniqueScore >= 85
                      ? 'from-yellow-400 to-orange-400'
                      : 'from-red-400 to-pink-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${uniqueScore}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          {uniqueScore >= 95 ? (
            <div className="p-6 bg-green-500/20 border border-green-500/30 rounded-xl flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2 text-green-400">Content is Original</h4>
                <p className="text-white/70">
                  Great job! Your content is {uniqueScore}% unique and safe to publish. No plagiarism detected.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2 text-yellow-400">Review Needed</h4>
                <p className="text-white/70">
                  Your content is {uniqueScore}% unique. Consider rewriting sections that may match existing content.
                </p>
              </div>
            </div>
          )}

          {/* Details */}
          {results.matches && results.matches.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold">Potential Matches Found:</h4>
              {results.matches.map((match, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="font-semibold mb-2">{match.source}</div>
                  <div className="text-sm text-white/60">{match.similarity}% similar</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
