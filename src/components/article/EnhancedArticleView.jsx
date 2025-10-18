import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, 
  Download, 
  Maximize2, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Calendar,
  Clock,
  BarChart3,
  Share2,
  Edit3,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function EnhancedArticleView({ article, onSave, onExpand, expansionInfo }) {
  const [expandedSections, setExpandedSections] = useState({})
  const [copied, setCopied] = useState(false)

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const copyToClipboard = async () => {
    const markdown = articleToMarkdown(article)
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadMarkdown = () => {
    const markdown = articleToMarkdown(article)
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${article.title || 'article'}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded!')
  }

  const downloadHTML = () => {
    const html = articleToHTML(article)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${article.title || 'article'}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded!')
  }

  const canExpand = expansionInfo?.canExpand && onExpand

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{article.reading_time_minutes || 1} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span>{article.word_count || 0} words</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onSave && (
              <motion.button
                onClick={() => onSave(article)}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-4 h-4" />
                Save
              </motion.button>
            )}

            <motion.button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>

            <div className="relative group">
              <motion.button
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={downloadMarkdown}
                  className="w-full px-4 py-2 text-left hover:bg-white/10 rounded-t-lg transition-colors"
                >
                  Download as Markdown
                </button>
                <button
                  onClick={downloadHTML}
                  className="w-full px-4 py-2 text-left hover:bg-white/10 rounded-b-lg transition-colors"
                >
                  Download as HTML
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expansion Controls */}
        {expansionInfo && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-sm text-white/60 mb-1">Article Expansion</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    {expansionInfo.count}/{expansionInfo.max}
                  </div>
                  <span className="text-white/60">expansions used</span>
                </div>
              </div>

              {canExpand ? (
                <motion.button
                  onClick={onExpand}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-5 h-5" />
                  Expand Article
                </motion.button>
              ) : (
                <div className="px-6 py-3 bg-white/10 rounded-xl font-bold flex items-center gap-2 opacity-50">
                  <AlertCircle className="w-5 h-5" />
                  Max Expansions Reached
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* SEO Score */}
      {article.seo_score && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold mb-4">SEO Score</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90" width="96" height="96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={251}
                  strokeDashoffset={251 - (251 * (article.seo_score.overall || 0)) / 100}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl font-black gradient-text">
                  {article.seo_score.overall || 0}
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-400">{article.word_count || 0}</div>
                <div className="text-sm text-white/60">Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{article.sections?.length || 0}</div>
                <div className="text-sm text-white/60">Sections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{article.seo_keywords?.length || 0}</div>
                <div className="text-sm text-white/60">Keywords</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{article.citations?.length || 0}</div>
                <div className="text-sm text-white/60">Citations</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Image */}
      {article.image && (article.image.image_url || article.image.image_b64) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-2xl overflow-hidden border border-white/10"
        >
          <img 
            src={article.image.image_url || article.image.image_b64} 
            alt={article.title}
            className="w-full h-auto"
          />
        </motion.div>
      )}

      {/* Article Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-strong rounded-2xl p-8 border border-white/10"
      >
        {/* Meta Description */}
        {article.meta?.description && (
          <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="text-sm text-blue-400 font-semibold mb-1">Meta Description</div>
            <p className="text-white/80">{article.meta.description}</p>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-6">
          {(article.sections || []).map((section, index) => (
            <div key={index} className="border-b border-white/10 pb-6 last:border-0">
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex items-center justify-between text-left group"
              >
                <h2 className="text-2xl font-bold group-hover:text-purple-400 transition-colors">
                  {section.heading}
                </h2>
                {expandedSections[index] ? (
                  <ChevronUp className="w-6 h-6 text-white/40" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-white/40" />
                )}
              </button>

              <AnimatePresence>
                {(expandedSections[index] || Object.keys(expandedSections).length === 0) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-4"
                  >
                    {(section.paragraphs || []).map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-white/80 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* FAQs */}
        {article.faqs && article.faqs.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {article.faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-xl">
                  <h3 className="text-lg font-bold mb-2 text-purple-400">{faq.q}</h3>
                  <p className="text-white/80">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Citations */}
        {article.citations && article.citations.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-6">Sources & Citations</h2>
            <div className="space-y-3">
              {article.citations.map((citation, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-bold text-purple-400">{index + 1}</span>
                  </div>
                  <div>
                    <a 
                      href={citation.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 hover:underline font-semibold"
                    >
                      {citation.title || citation.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Media Posts */}
        {article.social_media_posts && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-6">Social Media Posts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(article.social_media_posts).map(([platform, content]) => (
                content && (
                  <div key={platform} className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold capitalize text-purple-400">{platform}</div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(content)
                          toast.success(`${platform} post copied!`)
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-white/80 text-sm">{content}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// Helper functions
function articleToMarkdown(article) {
  let md = `# ${article.title}\n\n`
  
  if (article.meta?.description) {
    md += `> ${article.meta.description}\n\n`
  }
  
  if (article.sections) {
    article.sections.forEach(section => {
      md += `## ${section.heading}\n\n`
      section.paragraphs?.forEach(p => {
        md += `${p}\n\n`
      })
    })
  }
  
  if (article.faqs && article.faqs.length > 0) {
    md += `## FAQs\n\n`
    article.faqs.forEach(faq => {
      md += `### ${faq.q}\n\n${faq.a}\n\n`
    })
  }
  
  if (article.citations && article.citations.length > 0) {
    md += `## Sources\n\n`
    article.citations.forEach((citation, i) => {
      md += `${i + 1}. [${citation.title || citation.url}](${citation.url})\n`
    })
  }
  
  return md
}

function articleToHTML(article) {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <meta name="description" content="${article.meta?.description || ''}">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { font-size: 2.5em; margin-bottom: 0.5em; }
        h2 { font-size: 1.8em; margin-top: 1.5em; margin-bottom: 0.5em; }
        h3 { font-size: 1.3em; margin-top: 1em; }
        p { margin-bottom: 1em; }
        .meta { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 2em; }
    </style>
</head>
<body>
    <h1>${article.title}</h1>`
  
  if (article.meta?.description) {
    html += `\n    <div class="meta"><p>${article.meta.description}</p></div>`
  }
  
  if (article.sections) {
    article.sections.forEach(section => {
      html += `\n    <h2>${section.heading}</h2>`
      section.paragraphs?.forEach(p => {
        html += `\n    <p>${p}</p>`
      })
    })
  }
  
  if (article.faqs && article.faqs.length > 0) {
    html += `\n    <h2>FAQs</h2>`
    article.faqs.forEach(faq => {
      html += `\n    <h3>${faq.q}</h3>\n    <p>${faq.a}</p>`
    })
  }
  
  html += `\n</body>\n</html>`
  return html
}
