import { create } from 'zustand'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'

export const useArticles = create((set, get) => ({
  articles: [],
  currentArticle: null,
  loading: false,
  generating: false,

  generateArticle: async (topic, websiteUrl = '', tone = 'professional', targetWordCount = 3000) => {
    set({ generating: true })
    try {
      console.log('[ARTICLES] Generating article:', topic)
      
      const article = await api.generateArticle(topic, websiteUrl, tone, targetWordCount)
      
      // Initialize expansion count
      const articleWithMeta = {
        ...article,
        expansion_count: 0,
        id: article.article_id || null
      }
      
      set({ 
        currentArticle: articleWithMeta,
        generating: false 
      })
      
      console.log('[ARTICLES] Article generated:', article.title)
      toast.success('Article generated successfully!')
      return articleWithMeta
    } catch (error) {
      console.error('[ARTICLES] Generation error:', error)
      set({ generating: false })
      
      // Handle specific errors
      if (error.message.includes('Quota exceeded')) {
        toast.error(error.message)
      } else if (error.message.includes('Demo limit')) {
        toast.error('Demo limit reached. Sign in to continue!')
      } else {
        toast.error(error.message || 'Generation failed')
      }
      
      throw error
    }
  },

  fetchArticles: async () => {
    set({ loading: true })
    try {
      const articles = await api.getArticles()
      set({ articles, loading: false })
    } catch (error) {
      console.error('Fetch articles error:', error)
      set({ loading: false })
      if (error.message !== 'Unauthorized') {
        toast.error('Failed to load articles')
      }
    }
  },

  loadArticle: async (id) => {
    try {
      const article = await api.getArticle(id)
      
      // Ensure expansion_count exists
      const articleWithMeta = {
        ...article,
        expansion_count: article.expansion_count || 0
      }
      
      set({ currentArticle: articleWithMeta })
      return articleWithMeta
    } catch (error) {
      console.error('Load article error:', error)
      toast.error('Failed to load article')
      throw error
    }
  },

  saveArticle: async (article) => {
    try {
      if (article.id) {
        // Update existing article
        await api.updateArticle(article.id, {
          title: article.title,
          data: article.data || article,
          word_count: article.word_count,
          reading_time_minutes: article.reading_time_minutes,
          expansion_count: article.expansion_count || 0
        })
        toast.success('Article updated!')
      } else {
        // Create new article
        const saved = await api.saveArticle({
          title: article.title,
          data: article.data || article,
          word_count: article.word_count,
          reading_time_minutes: article.reading_time_minutes,
          expansion_count: article.expansion_count || 0
        })
        
        set({ currentArticle: { ...article, id: saved.id } })
        toast.success('Article saved!')
      }
      
      // Refresh articles list
      await get().fetchArticles()
    } catch (error) {
      console.error('Save article error:', error)
      toast.error('Failed to save article')
      throw error
    }
  },

  deleteArticle: async (id) => {
    try {
      await api.deleteArticle(id)
      
      set({ 
        articles: get().articles.filter(a => a.id !== id),
        currentArticle: get().currentArticle?.id === id ? null : get().currentArticle
      })
      
      toast.success('Article deleted')
    } catch (error) {
      console.error('Delete article error:', error)
      toast.error('Failed to delete article')
      throw error
    }
  },

  setCurrentArticle: (article) => {
    set({ currentArticle: article })
  }
}))
