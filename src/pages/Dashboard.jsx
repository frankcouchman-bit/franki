import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Stats from '../components/dashboard/Stats'
import ArticleGenerator from '../components/dashboard/ArticleGenerator'
import RecentArticles from '../components/dashboard/RecentArticles'
import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-white/60">Generate SEO-optimized articles in seconds</p>
        </motion.div>

        {/* Stats */}
        <Stats />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Article Generator - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ArticleGenerator />
          </div>

          {/* Recent Articles - Takes 1 column */}
          <div>
            <RecentArticles />
          </div>
        </div>
      </div>
    </div>
  )
}
