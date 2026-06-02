export const statusOptions = [
  { value: '', label: '全部' },
  { value: 'backlog', label: '想玩' },
  { value: 'playing', label: '游玩中' },
  { value: 'completed', label: '已通关' },
  { value: 'paused', label: '暂停' },
  { value: 'dropped', label: '弃坑' },
]

export const editableStatusOptions = statusOptions.filter((item) => item.value)

export const scoreFields = [
  { key: 'overall_score', label: '总评分' },
  { key: 'graphics_score', label: '画质' },
  { key: 'story_score', label: '剧情' },
  { key: 'gameplay_score', label: '玩法' },
  { key: 'immersion_score', label: '沉浸感' },
  { key: 'music_score', label: '音乐' },
]

export function statusLabel(value) {
  return statusOptions.find((item) => item.value === value)?.label || value || '未设置'
}
