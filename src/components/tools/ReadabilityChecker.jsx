import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle } from 'lucide-react'
import { api } from '../../lib/api'
import { toast } from 'react-hot-toast'

export default function ReadabilityChecker() {
  const [text, setText] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const checkReadability = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }

    setLoading(true)
    try {
      const result = await api.checkReadability(text)
      setResults(result)
      toast.success('Readability analyzed!')
    } catch (error) {
      toast.error(error.message || 'Check failed')
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade) => {
    if (grade === 'A' || grade === 'A+') return 'text-green-400'
    if (grade === 'B' || grade === 'B+') return 'text-blue-400'
    if (grade === 'C' || grade === 'C+') return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="glass-strong rounded-2xl p-8 border border-white/10">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Paste Your Content</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your article content here..."
            rows={8}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 resize-none"
          />
          <p className="text-xs text-white/50 mt-2">
            Word count: {text.split(' ').filter(w => w.length > 0).length}
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
              <BookOpen className="w-5 h-5" />
              Check Readability
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
          {/* Grade */}
          <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
            <div className={`text-6xl font-black mb-2 ${getGradeColor(results.grade || 'B+')}`}>
              {results.grade || 'B+'}
            </div>
            <div className="text-white/60">Readability Grade</div>
            <div className="text-sm text-white/50 mt-2">
              {results.level || 'Easy to read for most audiences'}
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {results.sentences || Math.ceil(text.split('.').length - 1)}
              </div>
              <div className="text-sm text-white/60">Sentences</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {results.avg_words || 15}
              </div>
              <div className="text-sm text-white/60">Avg Words/Sentence</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {results.paragraphs || Math.ceil(text.split('\n\n').length)}
              </div>
              <div className="text-sm text-white/60">Paragraphs</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {results.reading_time || Math.ceil(text.split(' ').length / 200)}m
              </div>
              <div className="text-sm text-white/60">Reading Time</div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <h4 className="font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Recommendations
            </h4>
            {(results.recommendations || [
              'Great job! Your content is easy to read',
              'Sentence length is optimal for engagement',
              'Consider adding more subheadings for better scanability'
            ]).map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/80">{rec}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
