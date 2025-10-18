import { motion, useInView } from 'framer-motion'
import { Sparkles, Zap, TrendingUp, CheckCircle, Target, BarChart3, Users, ArrowRight, Star } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { toast } from 'react-hot-toast'
import AuthModal from '../components/auth/AuthModal'
import Navbar from '../components/Navbar'

// Animated Counter Component
function AnimatedCounter({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    
    let startTime
    let animationFrame

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.floor(end * progress))
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

// SEO Score Meter Component
function SEOScoreMeter() {
  const [score, setScore] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setScore(92), 500)
    }
  }, [isInView])

  return (
    <div ref={ref} className="relative w-48 h-48 mx-auto">
      <svg className="transform -rotate-90" width="192" height="192">
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="96"
          cy="96"
          r="88"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={553}
          initial={{ strokeDashoffset: 553 }}
          animate={{ strokeDashoffset: isInView ? 553 - (553 * score) / 100 : 553 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <div className="text-5xl font-black gradient-text">{score}</div>
        <div className="text-sm text-white/60">SEO Score</div>
      </div>
    </div>
  )
}

// Ranking Growth Chart Component
function RankingChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const data = [
    { month: 'Jan', rank: 45 },
    { month: 'Feb', rank: 38 },
    { month: 'Mar', rank: 28 },
    { month: 'Apr', rank: 15 },
    { month: 'May', rank: 8 },
    { month: 'Jun', rank: 3 }
  ]

  return (
    <div ref={ref} className="relative h-64 flex items-end justify-around gap-4 p-6">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <motion.div
            className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg relative overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: isInView ? `${(50 - item.rank) * 4}px` : 0 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
          <div className="text-xs text-white/60">{item.month}</div>
          <div className="text-sm font-bold text-purple-400">#{item.rank}</div>
        </div>
      ))}
      <div className="absolute top-0 right-0 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-xs font-bold text-green-400">
        +93% Growth
      </div>
    </div>
  )
}

export default function Home() {
  const [demoTopic, setDemoTopic] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { generateArticle, generating } = useArticles()
  const navigate = useNavigate()

  const demoUsed = localStorage.getItem('demo_used') === 'true'
  const demoDate = localStorage.getItem('demo_date')
  
  const canUseDemo = () => {
    if (!demoUsed) return true
    if (demoDate) {
      const demoDateTime = new Date(demoDate).getTime()
      const now = new Date().getTime()
      const thirtyDays = 30 * 24 * 60 * 60 * 1000
      return (now - demoDateTime) >= thirtyDays
    }
    return false
  }

  const handleDemoGenerate = async (e) => {
    e.preventDefault()
    if (!demoTopic.trim()) {
      toast.error('Please enter a topic')
      return
    }
    if (!canUseDemo()) {
      setShowAuthModal(true)
      return
    }

    try {
      await generateArticle(demoTopic, '')
      const today = new Date().toISOString()
      localStorage.setItem('demo_used', 'true')
      localStorage.setItem('demo_date', today)
      setTimeout(() => navigate('/article/new'), 500)
    } catch (error) {
      toast.error(error.message || 'Generation failed')
    }
  }

  return (
    <>
      <Navbar />
      
      {/* HERO SECTION */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left Column */}
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">Trusted by 10,000+ Content Creators</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                  Rank #1 on Google
                </span>
                <br />
                <span className="text-white">with AI-Powered SEO</span>
              </h1>

              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Generate high-ranking, SEO-optimized articles in 60 seconds. 
                Our AI analyzes top-performing content and creates articles that dominate search results.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">No Credit Card</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20"
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">2,000+ Happy Users</span>
                </motion.div>
              </div>

              {/* Demo Generator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-strong rounded-2xl p-6 border-2 border-purple-500/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold text-lg">Try it Free - No Sign Up!</span>
                </div>
                
                <form onSubmit={handleDemoGenerate} className="space-y-3">
                  <input
                    type="text"
                    value={demoTopic}
                    onChange={(e) => setDemoTopic(e.target.value)}
                    placeholder="Enter your topic (e.g., Best AI Writing Tools 2025)"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                    disabled={generating || !canUseDemo()}
                  />
                  <motion.button
                    type="submit"
                    disabled={generating || !demoTopic.trim() || !canUseDemo()}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: generating || !canUseDemo() ? 1 : 1.02 }}
                    whileTap={{ scale: generating || !canUseDemo() ? 1 : 0.98 }}
                  >
                    {generating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : !canUseDemo() ? (
                      <span>Demo Used - Sign Up Free</span>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Free Article</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>

            {/* Right Column - SEO Score Meter */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-strong rounded-3xl p-8"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Real-Time SEO Analysis</h3>
                  <p className="text-white/60">Watch your content score improve</p>
                </div>
                <SEOScoreMeter />
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">98%</div>
                    <div className="text-xs text-white/60">Readability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">15+</div>
                    <div className="text-xs text-white/60">Keywords</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">A+</div>
                    <div className="text-xs text-white/60">Grade</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Image 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -top-10 -right-10 w-32 h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
              >
                <img src="/images/1.png" alt="SEO Rankings" className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {[
              { icon: Users, label: 'Active Users', value: 10000, suffix: '+' },
              { icon: FileText, label: 'Articles Generated', value: 50000, suffix: '+' },
              { icon: TrendingUp, label: 'Avg. Ranking Boost', value: 93, suffix: '%' },
              { icon: Star, label: 'User Satisfaction', value: 4.9, suffix: '/5' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-6 rounded-xl text-center"
              >
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-black gradient-text mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* RANKING GROWTH SECTION */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              See Real <span className="gradient-text">Ranking Growth</span>
            </h2>
            <p className="text-xl text-white/70">Our users see average 93% improvement in rankings within 90 days</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-strong rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4">Average Customer Journey</h3>
              <RankingChart />
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/80">Before SEOScribe</span>
                  <span className="font-bold text-red-400">#45</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                  <span className="text-white">After 6 Months</span>
                  <span className="font-bold text-green-400">#3</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img 
                src="/images/2.png" 
                alt="SEO Dashboard" 
                className="rounded-2xl shadow-2xl border border-white/20"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              How <span className="gradient-text">SEOScribe</span> Works
            </h2>
            <p className="text-xl text-white/70">Generate rank-worthy content in 3 simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Enter Your Topic',
                description: 'Simply type in your article topic or keyword. Our AI understands context and intent.',
                icon: Target,
                image: '/images/3.png'
              },
              {
                step: '02',
                title: 'AI Generates Content',
                description: 'Our AI analyzes top 10 Google results and creates SEO-optimized content in 60 seconds.',
                icon: Sparkles,
                image: '/images/4.png'
              },
              {
                step: '03',
                title: 'Publish & Rank',
                description: 'Get publication-ready content with perfect SEO score, meta descriptions, and more.',
                icon: TrendingUp,
                image: '/images/5.png'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="glass-strong rounded-2xl p-8 h-full border-2 border-transparent hover:border-purple-500/50 transition-all">
                  <div className="text-6xl font-black text-white/10 mb-4">{item.step}</div>
                  <item.icon className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/70 mb-6">{item.description}</p>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="rounded-lg border border-white/10 shadow-xl"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* BLOG SHOWCASE */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              See What <span className="gradient-text">You Get</span>
            </h2>
            <p className="text-xl text-white/70">Professional, SEO-optimized content ready to publish</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-strong rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Hero Image & Title</h3>
                  <p className="text-white/60 text-sm">AI-generated featured images</p>
                </div>
              </div>
              <img 
                src="/images/blog1.png" 
                alt="Generated Article Example"
                className="rounded-xl border border-white/20 shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">A/B Tested Headlines</h3>
                  <p className="text-white/60 text-sm">Multiple headline options</p>
                </div>
              </div>
              <img 
                src="/images/blog2.png" 
                alt="Alternative Headlines"
                className="rounded-xl border border-white/20 shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Loved by <span className="gradient-text">Creators & Businesses</span>
            </h2>
            <p className="text-xl text-white/70">See how SEOScribe transformed their content strategy</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-strong rounded-2xl p-8"
            >
              <div className="flex items-start gap-6 mb-6">
                <img 
                  src="/images/feedback1.png" 
                  alt="Michael Chen"
                  className="w-20 h-20 rounded-full object-cover border-4 border-purple-500/50"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold">Michael Chen</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">Content Creator & YouTuber</p>
                </div>
              </div>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                "SEOScribe completely transformed my content workflow. I went from spending 8 hours writing one article to generating 5 high-quality, SEO-optimized articles in the same time. My blog traffic increased by 340% in just 3 months!"
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-white/70">+340% Traffic Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-white/70">Rank #1 for 12 Keywords</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-strong rounded-2xl p-8"
            >
              <div className="flex items-start gap-6 mb-6">
                <img 
                  src="/images/feedback2.png" 
                  alt="David Rodriguez"
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-500/50"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold">David Rodriguez</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">E-commerce Business Owner</p>
                </div>
              </div>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                "As a business owner, I needed SEO content but couldn't afford to hire expensive writers. SEOScribe gives me agency-level content at a fraction of the cost. Our product pages now rank on page 1, and our organic sales have doubled!"
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <span className="text-white/70">2x Organic Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-white/70">Page 1 Rankings</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FINAL CTA WITH IMAGE */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
            <div className="relative z-10">
              <h2 className="text-5xl font-black mb-6">
                Ready to <span className="gradient-text">Dominate Google</span>?
              </h2>
              <p className="text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                Join 10,000+ content creators and businesses ranking #1 on Google
              </p>
              <motion.button
                onClick={() => !canUseDemo() ? setShowAuthModal(true) : null}
                className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-xl shadow-2xl inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-6 h-6" />
                Start Free - No Credit Card
                <ArrowRight className="w-6 h-6" />
              </motion.button>
              <p className="text-white/60 mt-4">1 free article per day • No credit card required</p>
              
              <div className="mt-12">
                <img 
                  src="/images/6.png" 
                  alt="SEOScribe Dashboard"
                  className="rounded-2xl shadow-2xl border border-white/20 mx-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
