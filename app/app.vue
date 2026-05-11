<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

const url = ref("");
const isLoading = ref(false);
const downloadResult = ref<null | {
  title: string;
  thumbnail: string;
  downloadUrl: string;
  audioUrl?: string;
  platform: string;
  type: "video" | "image";
}>(null);
const error = ref("");

const platforms = [
  { id: "instagram", name: "Instagram", icon: "fa-brands fa-instagram" },
  { id: "tiktok", name: "TikTok", icon: "fa-brands fa-tiktok" },
  { id: "facebook", name: "Facebook", icon: "fa-brands fa-facebook" },
  { id: "youtube", name: "YouTube", icon: "fa-brands fa-youtube" },
  { id: "threads", name: "Threads", icon: "fa-brands fa-threads" },
];

const selectedPlatform = ref("instagram");

// Auto-detect platform using Regex
watch(url, (newUrl) => {
  if (!newUrl) return;
  const lowerUrl = newUrl.toLowerCase();
  if (/tiktok\.com/i.test(lowerUrl) || /vt\.tiktok\.com/i.test(lowerUrl)) {
    selectedPlatform.value = "tiktok";
  } else if (/instagram\.com/i.test(lowerUrl)) {
    selectedPlatform.value = "instagram";
  } else if (/facebook\.com/i.test(lowerUrl) || /fb\.watch/i.test(lowerUrl)) {
    selectedPlatform.value = "facebook";
  } else if (/youtube\.com/i.test(lowerUrl) || /youtu\.be/i.test(lowerUrl)) {
    selectedPlatform.value = "youtube";
  } else if (/threads\.(net|com)/i.test(lowerUrl)) {
    selectedPlatform.value = "threads";
  }
});

const handleDownload = async () => {
  if (!url.value) {
    error.value = "Silakan masukkan link terlebih dahulu";
    return;
  }

  error.value = "";
  isLoading.value = true;
  downloadResult.value = null;

  try {
    const res = await $fetch("/api/download", {
      method: "POST",
      body: { url: url.value, platform: selectedPlatform.value },
    });
    if (res && res.status) {
      downloadResult.value = res.data;
    } else {
      error.value =
        res.message ||
        "Gagal mengambil media. Link mungkin private atau tidak valid.";
    }
  } catch (err) {
    error.value = "Gagal memproses. Cek koneksi atau coba beberapa saat lagi.";
  } finally {
    isLoading.value = false;
  }
};

const clearInput = () => {
  url.value = "";
  downloadResult.value = null;
  error.value = "";
};

const getProxyUrl = (mediaUrl: string, type: string) => {
  if (!mediaUrl) return "#";
  const uniqueId = Math.floor(1000 + Math.random() * 9000);
  return `/api/proxy-download?url=${encodeURIComponent(mediaUrl)}&name=AMSave-${type}-${uniqueId}`;
};

const platformLabel = (id: string) => {
  return platforms.find((p) => p.id === id)?.name || "Media";
};

// Banner Slider
import banner1 from "~/assets/img/1.webp";
import ogImage from "~/assets/img/og-imaga.webp";

const bannerSlides = [
  {
    id: 1,
    imgUrl: banner1,
    alt: "TOPUPMAS - Top Up Game Dan PPOB",
    link: "https://topupmas.com",
  },
  {
    id: 2,
    imgUrl: banner1,
    alt: "AMSave Banner 2",
    link: "https://ampedig.id",
  },
  {
    id: 3,
    imgUrl: banner1,
    alt: "AMSave Banner 3",
    link: "https://ampedig.id",
  },
];
const activeBanner = ref(0);

useSeoMeta({
  title: "AMSave - Unduh Media Tanpa Batas",
  ogTitle: "AMSave - Unduh Media Tanpa Batas",
  description: "Download video dan foto dari Instagram, TikTok, Facebook, dan YouTube secara gratis. Cepat, aman, dan tanpa watermark.",
  ogDescription: "Download video dan foto dari Instagram, TikTok, Facebook, dan YouTube secara gratis. Cepat, aman, dan tanpa watermark.",
  ogImage: `https://amsave.ampedig.id${ogImage}`,
  ogUrl: "https://amsave.ampedig.id/",
  twitterCard: "summary_large_image",
  twitterTitle: "AMSave - Unduh Media Tanpa Batas",
  twitterDescription: "Download video dan foto dari Instagram, TikTok, Facebook, dan YouTube secara gratis. Cepat, aman, dan tanpa watermark.",
  twitterImage: `https://amsave.ampedig.id${ogImage}`,
});

useHead({
  htmlAttrs: {
    lang: "id",
  },
});

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const swiperModules = [Autoplay, Pagination];
</script>

<template>
  <div class="app-container">
    <VitePwaManifest />
    <!-- Header -->
    <header class="header animate-fade-in">
      <div class="logo-area">
        <div class="logo-box">
          <i class="fa-solid fa-cloud-arrow-down"></i>
        </div>
        <div>
          <h1 class="title-gradient">AMSave</h1>
          <p class="tagline">Media Downloader</p>
        </div>
      </div>
      <a href="https://ampedig.id" target="_blank" class="powered-badge">
        by Ampedig
      </a>
    </header>

    <main>
      <!-- hero section -->
      <section
        class="desc-section animate-fade-in text-center"
        style="animation-delay: 0.08s"
      >
        <h2 class="hero-title">
          Unduh Media <span class="text-primary">Tanpa Batas</span>
        </h2>
        <p class="desc-text">
          <strong>AMSave</strong> adalah platform download video & foto gratis
          dari media sosial populer. Simpan konten dari
          <strong>Instagram</strong>, <strong>TikTok</strong>,
          <strong>Facebook</strong>, dan <strong>YouTube</strong> dengan mudah
          tanpa login, tanpa watermark.
        </p>
      </section>

      <!-- Platform Selector -->
      <section class="platforms animate-fade-in" style="animation-delay: 0.1s">
        <div
          v-for="p in platforms"
          :key="p.id"
          class="platform-pill"
          :class="{ active: selectedPlatform === p.id }"
          @click="
            selectedPlatform = p.id;
            clearInput();
          "
        >
          <i :class="p.icon"></i>
          {{ p.name }}
        </div>
      </section>

      <!-- Input Area -->
      <section
        class="input-section animate-fade-in"
        style="animation-delay: 0.15s"
      >
        <div class="input-card">
          <div class="input-wrapper">
            <input
              v-model="url"
              type="text"
              :placeholder="`Contoh: https://www.${selectedPlatform === 'youtube' ? 'youtube.com/watch?v=...' : selectedPlatform + '.com/...'}`"
              @keyup.enter="handleDownload"
            />
            <button v-if="url" class="clear-btn" @click="clearInput">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <p v-if="error" class="error-msg">
            <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
          </p>

          <button
            class="btn-primary w-full mt-3"
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
        </div>
      </section>

      <!-- Result Area -->
      <section v-if="downloadResult" class="result-section animate-fade-in">
        <div class="result-card">
          <!-- Platform badge -->
          <div class="result-platform-badge">
            <i
              :class="
                platforms.find((p) => p.id === downloadResult.platform)?.icon
              "
            ></i>
            {{ platformLabel(downloadResult.platform) }}
          </div>

          <!-- Thumbnail -->
          <div class="thumbnail-wrapper">
            <img
              :src="downloadResult.thumbnail"
              alt="Preview Media"
              loading="lazy"
            />
            <div class="type-badge">
              <i
                :class="
                  downloadResult.type === 'image'
                    ? 'fa-solid fa-image'
                    : 'fa-solid fa-film'
                "
              ></i>
              {{ downloadResult.type === "image" ? "Foto" : "Video" }}
            </div>
          </div>

          <!-- Info -->
          <div class="result-info">
            <p class="result-ready-label">
              <i class="fa-solid fa-circle-check"></i> Siap diunduh
            </p>
            <h3 class="video-title">{{ downloadResult.title }}</h3>
          </div>

          <!-- Download Actions -->
          <div class="download-actions">
            <a
              v-if="downloadResult.downloadUrl"
              :href="
                getProxyUrl(downloadResult.downloadUrl, downloadResult.type)
              "
              class="btn-download"
              download
            >
              <span class="dl-icon">
                <i
                  :class="
                    downloadResult.type === 'image'
                      ? 'fa-solid fa-image'
                      : 'fa-solid fa-video'
                  "
                ></i>
              </span>
              <span class="dl-text">
                <strong>{{
                  downloadResult.type === "image"
                    ? "Simpan Gambar"
                    : "Simpan Video"
                }}</strong>
                <small>Kualitas terbaik</small>
              </span>
              <i class="fa-solid fa-arrow-down dl-arrow"></i>
            </a>

            <a
              v-if="downloadResult.audioUrl"
              :href="getProxyUrl(downloadResult.audioUrl, 'audio')"
              class="btn-download btn-download-audio"
              download
            >
              <span class="dl-icon">
                <i class="fa-solid fa-music"></i>
              </span>
              <span class="dl-text">
                <strong>Simpan Audio</strong>
                <small>Format M4A / MP3</small>
              </span>
              <i class="fa-solid fa-arrow-down dl-arrow"></i>
            </a>
          </div>
        </div>
      </section>

      <!-- Banner Slider -->
      <section
        class="banner-slider animate-fade-in"
        style="animation-delay: 0.2s"
      >
        <Swiper
          :modules="swiperModules"
          :slides-per-view="1"
          :loop="true"
          :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          class="banner-track"
        >
          <SwiperSlide
            v-for="slide in bannerSlides"
            :key="slide.id"
            class="banner-slide"
          >
            <a
              :href="slide.link"
              target="_blank"
              rel="noopener noreferrer"
              class="banner-link"
            >
              <img :src="slide.imgUrl" :alt="slide.alt" class="banner-img" />
            </a>
          </SwiperSlide>
        </Swiper>
      </section>

      <!-- How To Use -->
      <section class="howto animate-fade-in" style="animation-delay: 0.2s">
        <h3 class="section-title">Cara Pakai</h3>
        <div class="steps">
          <div class="step-item">
            <div class="step-num">1</div>
            <div class="step-text">
              <strong>Pilih Platform</strong>
              <span>Pilih IG, TikTok, FB, atau YouTube</span>
            </div>
          </div>
          <div class="step-item">
            <div class="step-num">2</div>
            <div class="step-text">
              <strong>Tempel Link</strong>
              <span>Copy link postingan & paste di kolom atas</span>
            </div>
          </div>
          <div class="step-item">
            <div class="step-num">3</div>
            <div class="step-text">
              <strong>Download!</strong>
              <span>Klik tombol & simpan ke galerimu</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>
        © 2026 <strong>AMSave</strong> · Powered by
        <a href="https://ampedig.id" target="_blank" class="footer-link"
          >Ampedig</a
        >
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* ── Header ─────────────────────────────── */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  width: 44px;
  height: 44px;
  background: var(--primary);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px var(--primary-shadow);
  flex-shrink: 0;
}

.logo-area h1 {
  font-size: 22px;
  letter-spacing: -0.5px;
  line-height: 1;
}

.tagline {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 1px;
  letter-spacing: 0.3px;
}

.powered-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-light);
  padding: 5px 12px;
  border-radius: 100px;
  letter-spacing: 0.3px;
  text-decoration: none;
}

/* ── Hero ────────────────────────────────── */
.hero {
  margin-bottom: 28px;
}

.hero-content {
  background: linear-gradient(135deg, var(--secondary) 0%, #2c4a6a 100%);
  border-radius: var(--radius-xl);
  padding: 30px 24px 28px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content::before {
  content: "";
  position: absolute;
  top: -40px;
  right: -40px;
  width: 160px;
  height: 160px;
  background: radial-gradient(
    circle,
    rgba(91, 132, 212, 0.4) 0%,
    transparent 70%
  );
  border-radius: 50%;
}

.hero-icons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
}

.hicon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
}

.hicon.ig {
  background: linear-gradient(45deg, #f09433, #bc1888);
}
.hicon.tt {
  background: #000000;
}
.hicon.yt {
  background: #ff0000;
}
.hicon.fb {
  background: #1877f2;
}

.hero-content h2 {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  margin-bottom: 10px;
}

.text-primary {
  color: #89aff0;
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.5px;
}

/* ── Description Text / Hero ────────────────────── */
.desc-section {
  margin-bottom: 24px;
}

.hero-title {
  font-size: 30px;
  font-weight: 900;
  line-height: 1.25;
  margin-bottom: 10px;
  color: var(--text);
  letter-spacing: -0.8px;
}

.text-primary {
  color: var(--primary);
}

.desc-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-muted);
  text-align: center;
  padding: 0 4px;
}

.desc-text strong {
  color: var(--text);
}

/* ── Banner Slider ────────────────────────── */
.banner-slider {
  margin-bottom: 22px;
}

.banner-track {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  padding-bottom: 30px; /* Space for pagination */
}

.banner-slide {
  width: 100%;
  height: auto;
}

.banner-link {
  display: block;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
}

.banner-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  border-radius: 16px;
  transition: opacity 0.2s ease;
}

.banner-img:hover {
  opacity: 0.92;
}

/* Override Swiper Pagination Dots */
:deep(.swiper-pagination-bullet) {
  width: 6px;
  height: 6px;
  background: var(--card-border);
  opacity: 1;
  transition: all 0.25s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--primary);
  width: 20px;
  border-radius: 100px;
}

/* ── Platforms ───────────────────────────── */
.platforms {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 0 2px;
}

/* ── Input Card ──────────────────────────── */
.input-section {
  margin-bottom: 24px;
}

.input-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--card-shadow);
}

.input-label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper {
  position: relative;
}

.clear-btn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--card-border);
  color: var(--text-muted);
  font-size: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-msg {
  color: var(--error);
  font-size: 13px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff1f2;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--error);
}

/* ── Result Card ─────────────────────────── */
.result-section {
  margin-bottom: 24px;
}

.result-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.result-platform-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  border-bottom: 1px solid var(--card-border);
  background: var(--primary-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.thumbnail-wrapper {
  position: relative;
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
  top: 10px;
  right: 10px;
  background: rgba(29, 42, 54, 0.75);
  backdrop-filter: blur(6px);
  color: #fff;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

.result-info {
  padding: 16px 16px 8px;
}

.result-ready-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--success);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.video-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

/* ── Download Buttons ────────────────────── */
.download-actions {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 8px 16px 16px;
}

.btn-download {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--primary);
  border-radius: var(--radius-md);
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.btn-download:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px var(--primary-shadow);
}

.btn-download-audio {
  background: var(--secondary);
}

.btn-download-audio:hover {
  background: #29404f;
  box-shadow: 0 6px 16px rgba(29, 42, 54, 0.25);
}

.dl-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.dl-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dl-text strong {
  font-size: 14px;
  font-weight: 700;
}

.dl-text small {
  font-size: 11px;
  opacity: 0.7;
}

.dl-arrow {
  font-size: 13px;
  opacity: 0.7;
}

/* ── How To Use ──────────────────────────── */
.howto {
  margin-bottom: 28px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 14px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
}

.step-num {
  width: 32px;
  height: 32px;
  background: var(--primary);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
}

.step-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-text strong {
  font-size: 14px;
  color: var(--text);
}

.step-text span {
  font-size: 12px;
  color: var(--text-muted);
}

/* ── Footer ──────────────────────────────── */
.footer {
  margin-top: auto;
  padding: 20px 0 10px;
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
}

.footer-link {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

/* ── Utilities ───────────────────────────── */
.w-full {
  width: 100%;
}
.mt-3 {
  margin-top: 14px;
}
.mt-4 {
  margin-top: 16px;
}
</style>
