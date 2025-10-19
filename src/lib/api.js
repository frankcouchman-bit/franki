const API_BASE = import.meta.env.VITE_API_URL || ''

const headers = (token = null) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
})

async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('supabase_token')
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...headers(token),
      ...options.headers
    }
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || error.message || 'Request failed')
  }

  return response.json()
}

export const api = {
  // Article Generation (uses /api/draft from worker)
  generateArticle: async (topic, websiteUrl = '', tone = 'professional', targetWordCount = 3000) => {
    return apiCall('/api/draft', {
      method: 'POST',
      body: JSON.stringify({
        topic,
        website_url: websiteUrl,
        tone,
        target_word_count: targetWordCount,
        generate_social: true,
        research: true,
        save: true
      })
    })
  },

  // Template Generation (uses /api/templates/generate from worker)
  generateFromTemplate: async (templateId, topic, websiteUrl = '') => {
    return apiCall('/api/templates/generate', {
      method: 'POST',
      body: JSON.stringify({
        template_id: templateId,
        topic,
        website_url: websiteUrl
      })
    })
  },

  // Article Expansion (uses /api/expand from worker)
  expandArticle: async (data) => {
    return apiCall('/api/expand', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Section Rewrite/Expand (uses /api/tools/section from worker)
  updateSection: async (instruction, section) => {
    return apiCall('/api/tools/section', {
      method: 'POST',
      body: JSON.stringify({ instruction, section })
    })
  },

  // Articles CRUD (uses /api/articles from worker)
  getArticles: async () => {
    return apiCall('/api/articles')
  },

  getArticle: async (id) => {
    return apiCall(`/api/articles/${id}`)
  },

  saveArticle: async (article) => {
    return apiCall('/api/articles', {
      method: 'POST',
      body: JSON.stringify(article)
    })
  },

  updateArticle: async (id, data) => {
    return apiCall(`/api/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  deleteArticle: async (id) => {
    return apiCall(`/api/articles/${id}`, {
      method: 'DELETE'
    })
  },

  // SEO Tools (uses /api/tools/* from worker)
  analyzeHeadline: async (headline) => {
    return apiCall('/api/tools/headline-analyzer', {
      method: 'POST',
      body: JSON.stringify({ headline })
    })
  },

  checkReadability: async (text) => {
    return apiCall('/api/tools/readability', {
      method: 'POST',
      body: JSON.stringify({ text })
    })
  },

  generateSERPPreview: async (title, description, url) => {
    return apiCall('/api/tools/serp-preview', {
      method: 'POST',
      body: JSON.stringify({ title, description, url })
    })
  },

  checkPlagiarism: async (text) => {
    return apiCall('/api/tools/plagiarism', {
      method: 'POST',
      body: JSON.stringify({ text })
    })
  },

  analyzeCompetitors: async (keyword) => {
    return apiCall('/api/tools/competitor-analysis', {
      method: 'POST',
      body: JSON.stringify({ keyword })
    })
  },

  clusterKeywords: async (topic, text = '') => {
    return apiCall('/api/tools/keywords', {
      method: 'POST',
      body: JSON.stringify({ topic, text })
    })
  },

  generateBrief: async (keyword) => {
    return apiCall('/api/tools/content-brief', {
      method: 'POST',
      body: JSON.stringify({ keyword })
    })
  },

  generateMeta: async (content) => {
    return apiCall('/api/tools/meta-description', {
      method: 'POST',
      body: JSON.stringify({ content })
    })
  },

  // Get templates list
  getTemplates: async () => {
    return apiCall('/api/templates')
  }
}
