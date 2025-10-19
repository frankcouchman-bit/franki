import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Shield, 
  TrendingUp,
  Check,
  Star,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import Features from '../components/Features'
import AuthModal from '../components/auth/AuthModal'

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      setShowAuth(true)
    }
  }

  const stats = [
    { label: 'Articles Generated', value: '50,000+' },
    { label: 'Active Users', value: '5,000+' },
    { label: 'Average SEO Score', value: '92/100' },
    { label: 'Time Saved', value: '10hrs/week' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Content Marketing Manager',
      image: '/images/feedback1.png',
      text: 'SEOScribe cut our content production time by 80%. The AI-generated articles rank on page 1 consistently!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'SEO Specialist',
      image: '/images/feedback2.png',
      text: 'The SEO tools are incredible. Especially love the competitor analysis and SERP preview features.',
      rating: 5
    }
  ]

  const blogPosts = [
    {
      title: 'How to Rank #1 on Google in 2025',
      image: '/images/blog1.png',
      excerpt: 'Learn the latest SEO strategies that actually work in 2025...',
      date: 'Jan 15, 2025'
    },
    {
      title: '10 AI Writing Tools Compared',
      image: '/images/blog2.png',
      excerpt: 'We tested every major AI writing tool. Here are the results...',
      date: 'Jan 10, 2025'
    }
  ]

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">AI-Powered SEO Content Generator</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Rank #1 on Google in{' '}
                <span className="gradient-text">60 Seconds</span>
              </h1>

              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Generate SEO-optimized, rank-ready articles with AI. Built-in research, fact-checking, 
                and optimization tools. Start ranking higher today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/50 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={() => navigate('/seo-tools')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-lg border border-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try SEO Tools
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Free forever plan</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative glass-strong rounded-2xl p-8 border border-white/10">
                <img 
                  src="/images/1.png" 
                  alt="SEOScribe Dashboard"
                  className="w-full h-auto rounded-xl shadow-2xl"
                />
                
                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8" />
                    <div>
                      <div className="text-2xl font-black">92/100</div>
                      <div className="text-xs opacity-90">SEO Score</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute -top-6 -right-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8" />
                    <div>
                      <div className="text-2xl font-black">60s</div>
                      <div className="text-xs opacity-90">Generation Time</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-black gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-white/70">
              From topic to published article in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Enter Your Topic',
                description: 'Type any topic and our AI researches top-ranking content automatically',
                image: '/images/2.png'
              },
              {
                step: '2',
                title: 'AI Generates Article',
                description: 'Get a complete SEO-optimized article with images, FAQs, and meta tags in 60 seconds',
                image: '/images/3.png'
              },
              {
                step: '3',
                title: 'Publish & Rank',
                description: 'Export to WordPress, Medium, or any CMS. Watch your rankings climb!',
                image: '/images/4.png'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-strong rounded-2xl p-6 border border-white/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-black mb-4">
                  {item.step}
                </div>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Loved by <span className="gradient-text">5,000+</span> Content Creators
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-strong rounded-2xl p-8 border border-white/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-lg">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Latest from Our <span className="gradient-text">Blog</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-strong rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
              >
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-6">
                  <div className="text-sm text-white/60 mb-2">{post.date}</div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-white/70">{post.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-2xl p-12 border border-white/10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 -z-10" />
            
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-purple-400" />
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Start Ranking Higher <span className="gradient-text">Today</span>
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join 5,000+ content creators who use SEOScribe to dominate search results.
              No credit card required.
            </p>

            <motion.button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/50 inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <div className="mt-6 text-sm text-white/60">
              Free forever • No credit card required • Cancel anytime
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-white/60">
          <p>© 2025 SEOScribe. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="mailto:support@seoscribe.pro" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  )
}
