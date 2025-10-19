import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeadlineAnalyzer from '../components/tools/HeadlineAnalyzer'
import ReadabilityChecker from '../components/tools/ReadabilityChecker'
import SERPPreview from '../components/tools/SERPPreview'
import PlagiarismChecker from '../components/tools/PlagiarismChecker'
import CompetitorAnalysis from '../components/tools/CompetitorAnalysis'
import KeywordCluster from '../components/tools/KeywordCluster'
import ContentBrief from '../components/tools/ContentBrief'
import MetaGenerator from '../components/tools/MetaGenerator'
import ToolWrapper from '../components/tools/ToolWrapper'
import { 
  Sparkles, 
  BookOpen, 
  Eye, 
  Shield, 
  Target, 
  Tag, 
  FileText, 
  AlignLeft 
} from 'lucide-react'

export default function SEOTools() {
  const [activeTool, setActiveTool] = useState('headline')

  const tools = [
    { id: 'headline', name: 'Headline Analyzer', icon: Sparkles, component: HeadlineAnalyzer },
    { id: 'readability', name: 'Readability', icon: BookOpen, component: ReadabilityChecker },
    { id: 'serp', name: 'SERP Preview', icon: Eye, component: SERPPreview },
    { id: 'plagiarism', name: 'Plagiarism', icon: Shield, component: PlagiarismChecker },
    { id: 'competitors', name: 'Competitors', icon: Target, component: CompetitorAnalysis },
    { id: 'keywords', name: 'Keywords', icon: Tag, component: KeywordCluster },
    { id: 'brief', name: 'Content Brief', icon: FileText, component: ContentBrief },
    { id: 'meta', name: 'Meta Generator', icon: AlignLeft, component: MetaGenerator },
  ]

  const ActiveComponent = tools.find(t => t.id === activeTool)?.component

  return (
    <div className="min-h-screen pt-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2">
            SEO <span className="gradient-text">Tools</span>
          </h1>
          <p className="text-white/60">Professional-grade SEO tools to optimize your content</p>
        </motion.div>

        {/* Tool Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-4 border border-white/10 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`p-4 rounded-xl font-semibold transition-all ${
                  activeTool === tool.id
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                }`}
              >
                <tool.icon className={`w-6 h-6 mx-auto mb-2 ${
                  activeTool === tool.id ? 'text-purple-400' : 'text-white/60'
                }`} />
                <div className={`text-xs ${
                  activeTool === tool.id ? 'text-white' : 'text-white/60'
                }`}>
                  {tool.name}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Active Tool */}
        <ToolWrapper key={activeTool}>
          {ActiveComponent && <ActiveComponent />}
        </ToolWrapper>
      </div>
    </div>
  )
}
