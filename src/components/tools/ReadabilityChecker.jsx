import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, BarChart3 } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function ReadabilityChecker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkReadability = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }

    setLoading(true)
    try {
      const data = await api.checkReadability(text)
      setResult(data)
      toast.success('Readability analyzed!')
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

  const getScoreColor = (score) => {
    if (score >= 60) return 'from-green-500 to-emerald-500'
    if (score >= 30) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-rose-500'
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Readability Checker</h3>
          <p className="text-white/60 text-sm">Analyze content readability with Flesch-Kincaid</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Your Content</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here to analyze readability..."
            rows={8}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 resize-none"
            maxLength={50000}
          />
          <p className="text-xs text-white/50 mt-2">
            {text.length}/50,000 characters • {text.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        <motion.button
          onClick={checkReadability}
          disabled={loading || !text.trim()}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              Check Readability
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
          {/* Score Card */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-4">Flesch Reading Ease</div>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="transform -rotate-90" width="128" height="128">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="url(#readability-gradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={327}
                    strokeDashoffset={327 - (327 * result.score) / 100}
                  />
                  <defs>
                    <linearGradient id="readability-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl font-black gradient-text">
                    {Math.round(result.flesch_reading_ease)}
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-lg font-bold">{result.level}</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-sm text-white/60 mb-4">Flesch-Kincaid Grade</div>
              <div className="text-center">
                <div className="text-6xl font-black text-blue-400 mb-2">
                  {Math.round(result.flesch_kincaid_grade)}
                </div>
                <div className="text-sm text-white/60">Grade Level</div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="text-sm text-white/70">
                  <strong>Target:</strong> Aim for 8-10 grade level for best engagement
                </div>
              </div>
            </div>
          </div>

          {/* Interpretation Guide */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="text-lg font-bold mb-4">Score Guide</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span>90-100</span>
                <span className="text-white/60">Very Easy (5th grade)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span>80-90</span>
                <span className="text-white/60">Easy (6th grade)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span>70-80</span>
                <span className="text-white/60">Fairly Easy (7th grade)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span>60-70</span>
                <span className="text-white/60">Standard (8-9th grade) ⭐ Best for web</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span>50-60</span>
                <span className="text-white/60">Fairly Difficult (10-12th grade)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span>30-50</span>
                <span className="text-white/60">Difficult (College)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                <span>0-30</span>
                <span className="text-white/60">Very Difficult (Graduate)</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="text-lg font-bold mb-3 text-blue-400">💡 Tips to Improve</div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Use shorter sentences (15-20 words average)</li>
              <li>• Choose simpler words when possible</li>
              <li>• Break long paragraphs into smaller chunks</li>
              <li>• Use active voice instead of passive</li>
              <li>• Add bullet points and subheadings</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}
