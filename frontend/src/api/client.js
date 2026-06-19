const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000/api')

function friendlyError(status, data) {
  if (data?.detail) return data.detail
  if (status === 400) return '提交内容有误，请检查后再试。'
  if (status === 404) return '没有找到对应的档案。'
  if (status === 429) return '操作太频繁了，请稍等片刻再试。'
  if (status === 502) return '外部游戏资料暂时不可用，请稍后再试。'
  if (status >= 500) return '服务暂时开小差了，请稍后再试。'
  return '请求失败，请稍后再试。'
}

export async function apiRequest(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch {
    throw new Error('网络连接失败，请检查网络后再试。')
  }

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(friendlyError(response.status, data))
  }

  return data
}
