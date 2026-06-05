<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { createGameComment, fetchGameComments } from '../api/comments'

const props = defineProps({
  gameId: {
    type: [String, Number],
    required: true,
  },
  rawgId: {
    type: [String, Number],
    default: null,
  },
})

const comments = ref([])
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const success = ref('')
const form = reactive({
  nickname: '',
  rating: '',
  content: '',
})

const commentCount = computed(() => comments.value.length)
const canSubmit = computed(() => {
  return String(props.gameId || '').trim() && form.nickname.trim() && form.content.trim() && !submitting.value
})

function formatDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

async function loadComments() {
  if (!props.gameId) return
  loading.value = true
  error.value = ''
  try {
    comments.value = await fetchGameComments(props.gameId)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.nickname = ''
  form.rating = ''
  form.content = ''
}

async function submitComment() {
  error.value = ''
  success.value = ''

  const nickname = form.nickname.trim()
  const content = form.content.trim()
  if (!nickname) {
    error.value = '请填写昵称。'
    return
  }
  if (nickname.length > 20) {
    error.value = '昵称不能超过 20 个字。'
    return
  }
  if (!content) {
    error.value = '请写下留言内容。'
    return
  }
  if (content.length > 300) {
    error.value = '留言不能超过 300 个字。'
    return
  }

  submitting.value = true
  try {
    await createGameComment({
      game_id: String(props.gameId),
      rawg_id: props.rawgId || null,
      nickname,
      content,
      rating: form.rating ? Number(form.rating) : null,
    })
    resetForm()
    success.value = '留言已发布。'
    await loadComments()
  } catch (err) {
    error.value = err.message
  } finally {
    submitting.value = false
  }
}

watch(() => props.gameId, loadComments)
onMounted(loadComments)
</script>

<template>
  <section class="memory-wall panel">
    <header class="memory-header">
      <div>
        <p class="eyebrow">Memory Wall</p>
        <h2>游戏记忆墙</h2>
      </div>
      <span class="comment-count">{{ commentCount }} 条留言</span>
    </header>

    <form class="comment-form" @submit.prevent="submitComment">
      <div class="comment-fields">
        <label>
          昵称
          <input v-model="form.nickname" maxlength="20" type="text" placeholder="匿名玩家" />
        </label>

        <label>
          评分
          <select v-model="form.rating">
            <option value="">不评分</option>
            <option v-for="score in 10" :key="score" :value="score">{{ score }} 分</option>
          </select>
        </label>
      </div>

      <label>
        留言
        <textarea v-model="form.content" maxlength="300" rows="5" placeholder="留下这款游戏带给你的一个瞬间。" />
      </label>

      <div class="comment-actions">
        <span>{{ form.content.length }}/300</span>
        <button type="submit" :disabled="!canSubmit">{{ submitting ? '发布中...' : '发布留言' }}</button>
      </div>

      <p v-if="error" class="notice error">{{ error }}</p>
      <p v-else-if="success" class="notice success">{{ success }}</p>
    </form>

    <div class="comment-list">
      <p v-if="loading" class="muted-text">正在读取记忆墙...</p>
      <p v-else-if="!comments.length" class="empty-comments">还没有留言。成为第一个留下记忆的人吧。</p>

      <template v-else>
        <article v-for="comment in comments" :key="comment.id" class="comment-card">
          <div class="comment-meta">
            <strong>{{ comment.nickname }}</strong>
            <span v-if="comment.rating" class="comment-rating">{{ comment.rating }} / 10</span>
            <time>{{ formatDate(comment.created_at) }}</time>
          </div>
          <p>{{ comment.content }}</p>
        </article>
      </template>
    </div>
  </section>
</template>

<style scoped>
.memory-wall {
  margin-top: 28px;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(255, 207, 87, 0.08), transparent 34%),
    rgba(17, 24, 39, 0.82);
  backdrop-filter: blur(16px);
}

.memory-header,
.comment-actions,
.comment-meta,
.comment-fields {
  display: flex;
  align-items: center;
}

.memory-header {
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.memory-header h2 {
  margin: 0;
}

.comment-count,
.comment-rating {
  border: 1px solid rgba(255, 207, 87, 0.34);
  border-radius: 999px;
  color: #ffd766;
}

.comment-count {
  padding: 8px 14px;
  white-space: nowrap;
}

.comment-form {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.comment-fields {
  gap: 16px;
}

.comment-fields label:first-child {
  flex: 1.4;
}

.comment-fields label:last-child {
  flex: 0.6;
}

.comment-actions {
  justify-content: space-between;
  gap: 16px;
  color: #9fb2d2;
}

.comment-actions button {
  width: auto;
  min-width: 132px;
}

.comment-list {
  display: grid;
  gap: 14px;
}

.empty-comments {
  margin: 0;
  padding: 22px;
  border: 1px dashed rgba(255, 207, 87, 0.28);
  border-radius: 12px;
  color: #9fb2d2;
}

.comment-card {
  padding: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  background: rgba(8, 13, 24, 0.52);
}

.comment-meta {
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.comment-meta strong {
  color: #f7fbff;
}

.comment-meta time {
  margin-left: auto;
  color: #8090ad;
  font-size: 0.92rem;
}

.comment-rating {
  padding: 4px 9px;
  font-size: 0.86rem;
}

.comment-card p {
  margin: 0;
  color: #dce7f7;
  line-height: 1.7;
  white-space: pre-wrap;
}

@media (max-width: 720px) {
  .memory-header,
  .comment-fields,
  .comment-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .comment-meta time {
    margin-left: 0;
    width: 100%;
  }

  .comment-actions button {
    width: 100%;
  }
}
</style>
