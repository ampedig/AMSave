<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const url = ref('')
const isLoading = ref(false)
const downloadResult = ref<null | {
  title: string,
  thumbnail: string,
  downloadUrl: string,
  audioUrl?: string,
  platform: string,
  type: 'video' | 'image'
}>(null)
const error = ref('')

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: 'fa-brands fa-instagram', color: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' },
  { id: 'tiktok', name: 'TikTok', icon: 'fa-brands fa-tiktok', color: 'linear-gradient(45deg, #00f2ea, #ff0050)' },
  { id: 'facebook', name: 'Facebook', icon: 'fa-brands fa-facebook', color: '#1877F2' }
]

const selectedPlatform = ref('instagram')

// Auto-detect platform using Regex
watch(url, (newUrl) => {
  if (!newUrl) return

  const lowerUrl = newUrl.toLowerCase()
  if (/tiktok\.com/i.test(lowerUrl) || /vt\.tiktok\.com/i.test(lowerUrl)) {
    selectedPlatform.value = 'tiktok'
  } else if (/instagram\.com/i.test(lowerUrl)) {
    selectedPlatform.value = 'instagram'
  } else if (/facebook\.com/i.test(lowerUrl) || /fb\.watch/i.test(lowerUrl)) {
    selectedPlatform.value = 'facebook'
  }
})

const handleDownload = async () => {
  if (!url.value) {
    error.value = 'Silakan masukkan link terlebih dahulu'
    return
  }

  error.value = ''
  isLoading.value = true
  downloadResult.value = null

  try {
    const res = await $fetch('/api/download', {
      method: 'POST',
      body: { 
        url: url.value, 
        platform: selectedPlatform.value 
      }
    })
    
    if (res && res.status) {
      downloadResult.value = res.data
    } else {
      error.value = res.message || 'Gagal mengambil informasi media. Link mungkin private.'
    }
  } catch (err) {
    error.value = 'Gagal memproses link. Pastikan link server berjalan dengan baik.'
  } finally {
    isLoading.value = false
  }
}

const clearInput = () => {
  url.value = ''
  downloadResult.value = null
  error.value = ''
}

const getProxyUrl = (mediaUrl: string, type: string) => {
  if (!mediaUrl) return '#'
  return `/api/proxy-download?url=${encodeURIComponent(mediaUrl)}&name=AMSave-${type}`
}
</script>

<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header animate-fade-in">
      <div class="logo-area">
        <div class="logo-box">
          <i class="fa-solid fa-cloud-arrow-down"></i>
        </div>
        <h1 class="title-gradient">AMSave</h1>
      </div>
      <button class="icon-btn">
        <i class="fa-solid fa-circle-info"></i>
      </button>
    </header>

    <main>
      <!-- Hero -->
      <section class="hero text-center animate-fade-in" style="animation-delay: 0.1s">
        <h2>Download Media <br />Tanpa Batas</h2>
        <p class="text-muted">Simpan video dan foto favoritmu dari media sosial dalam sekejap.</p>
      </section>

      <!-- Platform Selector -->
      <section class="platforms animate-fade-in" style="animation-delay: 0.2s">
        <div 
          v-for="p in platforms" 
          :key="p.id"
          class="platform-pill"
          :class="{ active: selectedPlatform === p.id }"
          @click="selectedPlatform = p.id"
        >
          <i :class="p.icon"></i>
          {{ p.name }}
        </div>
      </section>

      <!-- Input Area -->
      <section class="input-section animate-fade-in" style="animation-delay: 0.3s">
        <div class="input-wrapper">
          <input 
            v-model="url" 
            type="text" 
            placeholder="Tempel link di sini..."
            @keyup.enter="handleDownload"
          />
          <button v-if="url" class="clear-btn" @click="clearInput">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <p v-if="error" class="error-msg">{{ error }}</p>

        <button 
          class="btn-primary w-full mt-4" 
          :disabled="isLoading"
          @click="handleDownload"
        >
          <span v-if="!isLoading">
            <i class="fa-solid fa-download"></i> Download Sekarang
          </span>
          <span v-else>
            <i class="fa-solid fa-circle-notch fa-spin"></i> Memproses...
          </span>
        </button>
      </section>

      <!-- Result Area -->
      <section v-if="downloadResult" class="result-section animate-fade-in">
        <div class="glass-card result-card">
          <div class="thumbnail-wrapper">
            <img :src="downloadResult.thumbnail" alt="Preview" />
            <div class="type-badge">
              <i class="fa-solid fa-video"></i> {{ downloadResult.type.toUpperCase() }}
            </div>
          </div>
          <div class="result-info">
            <h3 class="video-title">{{ downloadResult.title }}</h3>
            <p class="text-muted">Siap untuk didownload</p>
            
            <div class="download-actions mt-4">
              <a 
                v-if="downloadResult.downloadUrl" 
                :href="getProxyUrl(downloadResult.downloadUrl, downloadResult.type)" 
                class="btn-primary w-full" 
                download
              >
                <i :class="downloadResult.type === 'image' ? 'fa-solid fa-image' : 'fa-solid fa-video'"></i> 
                {{ downloadResult.type === 'image' ? 'Simpan Gambar' : 'Simpan Video' }}
              </a>
              
              <a 
                v-if="downloadResult.audioUrl" 
                :href="getProxyUrl(downloadResult.audioUrl, 'audio')" 
                class="btn-primary btn-audio w-full mt-2" 
                download
              >
                <i class="fa-solid fa-music"></i> Simpan Audio / Musik
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features animate-fade-in" style="animation-delay: 0.4s">
        <div class="feature-item">
          <div class="feature-icon"><i class="fa-solid fa-bolt"></i></div>
          <div class="feature-text">
            <h4>Super Cepat</h4>
            <p>Proses download instan tanpa menunggu lama.</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <div class="feature-text">
            <h4>100% Aman</h4>
            <p>Data pribadimu tetap terjaga dan terlindungi.</p>
          </div>
        </div>
      </section>
    </main>

    <!-- PWA Install Banner (Basic Logic) -->
    <footer class="footer">
      <p class="text-muted">© 2026 AMSave Core. Mobile First PWA.</p>
    </footer>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.logo-area h1 {
  font-size: 24px;
  letter-spacing: -0.5px;
}

.icon-btn {
  background: var(--glass-bg);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero {
  margin-bottom: 40px;
}

.hero h2 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
  line-height: 1.2;
}

.hero p {
  font-size: 16px;
}

.platforms {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.input-section {
  margin-bottom: 40px;
}

.input-wrapper {
  position: relative;
}

.clear-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: var(--text-muted);
  font-size: 18px;
}

.error-msg {
  color: var(--error);
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
}

.result-section {
  margin-bottom: 40px;
}

.result-card {
  padding: 16px;
}

.thumbnail-wrapper {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 16px;
  width: 100%;
}

.thumbnail-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(4px);
}

.result-info h3.video-title {
  font-size: 16px;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  font-weight: 500;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.feature-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: var(--glass-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--glass-border);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 20px;
}

.feature-text h4 {
  font-size: 16px;
  margin-bottom: 2px;
}

.feature-text p {
  font-size: 14px;
  color: var(--text-muted);
}

.footer {
  margin-top: auto;
  padding: 40px 0 20px;
  text-align: center;
  font-size: 12px;
}

.text-center { text-align: center; }
.w-full { width: 100%; }
.mt-4 { margin-top: 16px; }
.mt-2 { margin-top: 12px; }
.text-muted { color: var(--text-muted); }
.download-actions { display: flex; flex-direction: column; gap: 4px; }

.btn-audio {
  background: linear-gradient(to right, #ec4899, #be185d);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
}

.btn-audio:hover {
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
}
</style>
