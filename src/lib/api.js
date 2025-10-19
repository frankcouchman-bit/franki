// src/lib/api.js
const BASE_RAW = import.meta.env.VITE_API_URL || ''
const API_BASE = BASE_RAW.replace(/\/+$/, '') // remove trailing slashes

const headers = (token = null) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
})

function joinUrl(base, endpoint) {
  const ep = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return base ? `${base}${ep}` : ep
}

async function apiCall(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('supabase_token') : null

  const response = await fetch(joinUrl(API_BASE, endpoint), {
    ...options,
    headers: {
      ...headers(token),
      ...(options.headers || {})
    },
    credentials: options.credentials ?? 'include'
  })

  if (!response.ok) {
    let msg = `Request failed (HTTP ${response.status})`
    try {
      const err = await response.json()
      msg = err?.error || err?.message || msg
    } catch {}
    throw new Error(msg)
  }

  return response.json()
}

export const api = {
  // Article Generation (uses /api/draft from worker)
  generateArticle: (topic, websiteUrl = '', tone = 'professional', targetWordCount = 3000) =>
    apiCall('/api/draft', {
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
    }),

  // Template Generation (uses /api/templates/generate from worker)
  generateFromTemplate: (templateId, topic, websiteUrl = '') =>
    apiCall('/api/templates/generate', {
      method: 'POST',
      body: JSON.stringify({
        template_id: templateId,
        topic,
        website_url: websiteUrl
      })
    }),

  // Article Expansion (uses /api/expand from worker)
  expandArticle: (data) =>
    apiCall('/api/expand', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Section Rewrite/Expand (uses /api/tools/section from worker)
  updateSection: (instruction, section) =>
    apiCall('/api/tools/section', {
      method: 'POST',
      body: JSON.stringify({ instruction, section })
    }),

  // Articles CRUD (uses /api/articles from worker)
  getArticles: () => apiCall('/api/articles'),
  getArticle: (id) => apiCall(`/api/articles/${id}`),
  saveArticle: (article) =>
    apiCall('/api/articles', {
      method: 'POST',
      body: JSON.stringify(article)
    }),
  updateArticle: (id, data) =>
    apiCall(`/api/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  deleteArticle: (id) => apiCall(`/api/articles/${id}`, { method: 'DELETE' }),

  // SEO Tools (uses /api/tools/* from worker)
  analyzeHeadline: (headline) =>
    apiCall('/api/tools/headline-analyzer', {
      method: 'POST',
      body: JSON.stringify({ headline })
    }),

  checkReadability: (text) =>
    apiCall('/api/tools/readability', {
      method: 'POST',
      body: JSON.stringify({ text })
    }),

  generateSERPPreview: (title, description, url) =>
    apiCall('/api/tools/serp-preview', {
      method: 'POST',
      body: JSON.stringify({ title, description, url })
    }),

  checkPlagiarism: (text) =>
    apiCall('/api/tools/plagiarism', {
      method: 'POST',
      body: JSON.stringify({ text })
    }),

  analyzeCompetitors: (keyword) =>
    apiCall('/api/tools/competitor-analysis', {
      method: 'POST',
      body: JSON.stringify({ keyword })
    }),

  clusterKeywords: (topic, text = '') =>
    apiCall('/api/tools/keywords', {
      method: 'POST',
      body: JSON.stringify({ topic, text })
    }),

  generateBrief: (keyword) =>
    apiCall('/api/tools/content-brief', {
      method: 'POST',
      body: JSON.stringify({ keyword })
    }),

  generateMeta: (content) =>
    apiCall('/api/tools/meta-description', {
      method: 'POST',
      body: JSON.stringify({ content })
    }),

  // Get templates list
  getTemplates: () => apiCall('/api/templates'),
}
