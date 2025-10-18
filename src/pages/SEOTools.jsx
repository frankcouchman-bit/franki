import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Target, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle,
  Zap
} from 'lucide-react'
import HeadlineAnalyzer from '../components/tools/HeadlineAnalyzer'
import ReadabilityChecker from '../components/tools/ReadabilityChecker'
import SERPPreview from '../components/tools/SERPPreview'
import PlagiarismChecker from '../components/tools/PlagiarismChecker'
import CompetitorAnalysis from '../components/tools/CompetitorAnalysis'
import KeywordCluster from '../components/tools/KeywordCluster'
import ContentBrief from '../components/tools/ContentBrief'
import MetaGenerator from '../components/tools/MetaGenerator'
import ToolWrapper from '../components/tools/ToolWrapper'
import { useAuth } from '../hooks/useAuth'

export default function SEOTools() {
  const [activeTool, setActiveTool] = useState('headline')
  const [toolUsed, setToolUsed] = useState(false)
  const { plan, usage } = useAuth()

  const toolsUsed = usage?.today?.tools || 0
  const maxTools = (!useAuth.getState().user || plan === 'free') ? 1 : 10

  useEffect(() => {
    document.title = 'SEO Tools - Professional SEO Analysis | SEOScribe'
  }, [])

  const tools = [
    { 
      id: 'headline', 
      name: 'Headline Analyzer', 
      icon: Sparkles, 
      component: HeadlineAnalyzer,
      description: 'Analyze headline effectiveness',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'readability', 
      name: 'Readability Checker', 
      icon: BookOpen, 
      component: ReadabilityChecker,
      description: 'Check content readability',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'serp', 
      name: 'SERP Preview', 
      icon: Search, 
      component: SERPPreview,
      description: 'Preview Google search results',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'plagiarism', 
      name: 'Plagiarism Checker', 
      icon: CheckCircle, 
      component: PlagiarismChecker,
      description: 'Check content originality',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'competitors', 
      name: 'Competitor Analysis', 
      icon: TrendingUp, 
      component: CompetitorAnalysis,
      description: 'Analyze top competitors',
      color: 'from-red-500 to-pink-500'
    },
    { 
      id: 'keywords', 
      name: 'Keyword Clustering', 
      icon: Target, 
      component: KeywordCluster,
      description: 'Cluster related keywords',
      color: 'from-indigo-500 to-purple-500'
    },
    { 
      id: 'brief', 
      name: 'Content Brief', 
      icon: FileText, 
      component: ContentBrief,
      description: 'Generate content outlines',
      color: 'from-cyan-500 to-blue-500'
    },
    { 
      id: 'meta', 
      name: 'Meta Description', 
      icon: MessageSquare, 
      component: MetaGenerator,
      description: 'Generate meta descriptions',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  const ActiveComponent = tools.find(t => t.id === activeTool)?.component
  const activeTool Info = tools.find(t => t.id === activeTool)

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Professional SEO Tools Suite</span>
          </div>
          
          <h1 className="text-5xl font-black mb-4">
            <span className="gradient-text">SEO Tools</span> That Work
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-6">
            Professional-grade SEO analysis tools to optimize your content and dominate search rankings
          </p>
          
          {/* Usage Stats */}
          <div className="inline-flex items-center gap-3 px-6 py-3 glass-strong rounded-xl border border-white/20">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${toolsUsed >= maxTools ? 'bg-red-400' : 'bg-green-400'} animate-pulse`} />
              <span className="font-bold">
                {toolsUsed}/{maxTools} Tools Used Today
              </span>
            </div>
            {(plan === 'free' || !useAuth.getState().user) && (
              <span className="text-purple-400 text-sm">
                • Upgrade to Pro for 10/day
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Tool Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-2xl p-4 sticky top-24 border border-white/10">
              <h2 className="font-bold mb-4 px-2 text-lg">Select Tool</h2>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    onClick={() => {
                      setActiveTool(tool.id)
                      setToolUsed(false)
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all border ${
                      activeTool === tool.id
                        ? 'bg-gradient-to-r ' + tool.color + ' border-white/30 shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{tool.name}</div>
                      <div className="text-xs text-white/60 truncate">{tool.description}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Tool Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Tool Header */}
              <div className="mb-6 p-6 glass-strong rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${activeToolInfo?.color} rounded-xl flex items-center justify-center`}>
                    {activeToolInfo && <activeToolInfo.icon className="w-8 h-8" />}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{activeToolInfo?.name}</h2>
                    <p className="text-white/60">{activeToolInfo?.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black gradient-text">{toolsUsed}/{maxTools}</div>
                    <div className="text-xs text-white/60">Today</div>
                  </div>
                </div>
              </div>

              {/* Tool Component */}
              {!toolUsed ? (
                <ToolWrapper onUse={() => setToolUsed(true)}>
                  {ActiveComponent && <ActiveComponent />}
                </ToolWrapper>
              ) : (
                ActiveComponent && <ActiveComponent />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
