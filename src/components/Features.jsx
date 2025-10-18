import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  Zap, 
  Shield, 
  Globe,
  BarChart3,
  FileText,
  Search
} from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Content',
      description: 'Advanced GPT-4 generates human-like, engaging content that resonates with your audience.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Perfect SEO Score',
      description: 'Every article is optimized for search engines with perfect keyword density and structure.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Rank Higher, Faster',
      description: 'Our AI analyzes top-ranking content to help you outrank competitors in weeks, not months.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Generate in 60 Seconds',
      description: 'What takes hours for human writers takes seconds with SEOScribe. 10x your content output.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: '100% Original Content',
      description: 'Every piece is unique and plagiarism-free. Safe for Google and your brand reputation.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Generate SEO content in 25+ languages. Expand your reach to global markets effortlessly.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track your content performance with built-in analytics and SEO scoring.',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: FileText,
      title: 'Multiple Formats',
      description: 'Blog posts, product reviews, listicles, how-to guides, and more. One tool, endless possibilities.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Search,
      title: 'SERP Analysis',
      description: 'Automatic analysis of top Google results to ensure your content beats the competition.',
      color: 'from-violet-500 to-purple-500'
    }
  ]

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Everything You Need to <span className="gradient-text">Dominate SEO</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Powerful features that make SEOScribe the #1 choice for content creators and businesses
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
