import { create } from 'zustand'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'

export const useArticles = create((set, get) => ({
  articles: [],
  currentArticle: null,
  loading: false,
  generating: false,

  generateArticle: async (topic, websiteUrl = '') => {
    set({ generating: true })
    try {
      console.log('[ARTICLES] Generating article:', topic)
      const article = await api.generateArticle(topic, websiteUrl)
      
      article.expansion_count = 0
      
      set({ 
        currentArticle: article,
        generating: false 
      })
      
      console.log('[ARTICLES] Article generated:', article.title)
      toast.success('Article generated successfully!')
      return article
    } catch (error) {
      console.error('[ARTICLES] Generation error:', error)
      set({ generating: false })
      toast.error(error.message || 'Generation failed')
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
      toast.error('Failed to load articles')
    }
  },

  loadArticle: async (id) => {
    try {
      const article = await api.getArticle(id)
      article.expansion_count = article.expansion_count || 0
      set({ currentArticle: article })
      return article
    } catch (error) {
      console.error('Load article error:', error)
      toast.error('Failed to load article')
      throw error
    }
  },

  saveArticle: async (article) => {
    try {
      if (article.id) {
        await api.updateArticle(article.id, {
          title: article.title,
          data: article,
          word_count: article.word_count,
          reading_time_minutes: article.reading_time_minutes
        })
        toast.success('Article updated!')
      } else {
        const saved = await api.saveArticle({
          title: article.title,
          data: article,
          word_count: article.word_count,
          reading_time_minutes: article.reading_time_minutes
        })
        set({ currentArticle: { ...article, id: saved.id } })
        toast.success('Article saved!')
      }
      
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
