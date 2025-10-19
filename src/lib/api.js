const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
function apiUrl(path){ const p = path.startsWith('/')?path:`/${path}`; return API_BASE?`${API_BASE}${p}`:p }
async function jfetch(path, options={}) {
  const res = await fetch(apiUrl(path), { headers:{'Content-Type':'application/json', ...(options.headers||{})}, credentials:'include', ...options })
  if(!res.ok){ let msg=`HTTP ${res.status}`; try{ const d=await res.json(); msg=d?.error||d?.message||msg }catch{}; throw new Error(msg) }
  const ct = res.headers.get('content-type')||''; return ct.includes('application/json')?res.json():res.text()
}
export const api = {
  generateSERPPreview(title, description, url){ return jfetch('/api/tools/serp-preview',{ method:'POST', body: JSON.stringify({ title, description, url }) }) },
}
