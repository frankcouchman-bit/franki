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
  // Article Generation (using /api/draft from worker)
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

  // Template Generation (using /api/templates/generate from worker)
  generateFromTemplate: async (data) => {
    return apiCall('/api/templates/generate', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // Article Expansion (using /api/expand from worker)
  expandArticle: async (data) => {
    return apiCall('/api/expand', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        expand_only: true
      })
    })
  },

  // Section Rewrite/Expand (using /api/tools/section from worker)
  updateSection: async (instruction, section) => {
    return apiCall('/api/tools/section', {
      method: 'POST',
      body: JSON.stringify({ instruction, section })
    })
  },

  // Articles CRUD (using /api/articles from worker)
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

  // SEO Tools (using /api/tools/* from worker)
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

  // Auth (using /auth/* from worker)
  sendMagicLink: async (email, redirectUrl) => {
    return apiCall('/auth/magic-link', {
      method: 'POST',
      body: JSON.stringify({ email, redirect: redirectUrl })
    })
  },

  // Profile (using /api/profile from worker)
  getProfile: async () => {
    return apiCall('/api/profile')
  },

  updateProfile: async (data) => {
    return apiCall('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  // Stripe (using /api/stripe/* from worker)
  createCheckoutSession: async (successUrl, cancelUrl) => {
    return apiCall('/api/stripe/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ successUrl, cancelUrl })
    })
  },

  createPortalSession: async (returnUrl) => {
    return apiCall('/api/stripe/portal', {
      method: 'POST',
      body: JSON.stringify({ returnUrl })
    })
  }
}
