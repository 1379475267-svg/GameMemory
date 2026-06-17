<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { createGameComment, fetchGameComments, uploadCommentImage } from '../api/comments'

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
const imageFile = ref(null)
const imagePreview = ref('')
const fileInput = ref(null)
const form = reactive({
  nickname: '',
  rating: '',
  content: '',
})

const maxImageSize = 2 * 1024 * 1024
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
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
  removeImage()
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('图片读取失败，请重新选择。'))
    reader.readAsDataURL(file)
  })
}

function chooseImage(event) {
  error.value = ''
  success.value = ''

  const file = event.target.files?.[0]
  if (!file) {
    removeImage()
    return
  }

  if (!allowedImageTypes.includes(file.type)) {
    error.value = '图片仅支持 JPG、PNG 或 WebP。'
    event.target.value = ''
    return
  }

  if (file.size > maxImageSize) {
    error.value = '图片不能超过 2MB。'
    event.target.value = ''
    return
  }

  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function removeImage() {
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value)
  imageFile.value = null
  imagePreview.value = ''
  if (fileInput.value) fileInput.value.value = ''
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
    let imageUrl = ''
    if (imageFile.value) {
      const data = await fileToDataUrl(imageFile.value)
      const uploaded = await uploadCommentImage({
        game_id: String(props.gameId),
        file_name: imageFile.value.name,
        content_type: imageFile.value.type,
        data,
      })
      imageUrl = uploaded.image_url
    }

    await createGameComment({
      game_id: String(props.gameId),
      rawg_id: props.rawgId || null,
      nickname,
      content,
      image_url: imageUrl,
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

      <div class="image-picker">
        <label class="image-input">
          记忆图片
          <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/webp" @change="chooseImage" />
          <span>可选，支持 JPG / PNG / WebP，最多 2MB</span>
        </label>

        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="留言图片预览" />
          <button type="button" class="ghost-button" @click="removeImage">移除图片</button>
        </div>
      </div>

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
          <a v-if="comment.image_url" class="comment-image" :href="comment.image_url" target="_blank" rel="noreferrer">
            <img :src="comment.image_url" alt="留言图片" loading="lazy" />
          </a>
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
.comment-fields,
.image-preview {
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

.comment-form,
.image-picker,
.comment-list {
  display: grid;
}

.comment-form {
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

.image-picker {
  gap: 12px;
}

.image-input input {
  padding: 14px;
}

.image-input span {
  display: block;
  margin-top: 8px;
  color: #8090ad;
  font-size: 0.92rem;
}

.image-preview {
  justify-content: space-between;
  gap: 14px;
  padding: 12px;
  border: 1px solid rgba(255, 207, 87, 0.24);
  border-radius: 14px;
  background: rgba(255, 207, 87, 0.06);
}

.image-preview img {
  width: 168px;
  height: 96px;
  object-fit: cover;
  border-radius: 10px;
}

.ghost-button {
  width: auto;
  border: 1px solid rgba(255, 207, 87, 0.28);
  background: transparent;
  color: #ffd766;
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

.comment-image {
  display: block;
  margin-bottom: 14px;
}

.comment-image img {
  width: min(420px, 100%);
  max-height: 260px;
  object-fit: cover;
  border: 1px solid rgba(255, 207, 87, 0.2);
  border-radius: 12px;
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
  .comment-actions,
  .image-preview {
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

  .image-preview img {
    width: 100%;
    height: auto;
    max-height: 220px;
  }
}
</style>
