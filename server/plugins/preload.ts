// Preload btch-downloader pada server startup agar tidak ada cold-start delay saat request pertama
import { igdl, ttdl, fbdown, youtube, threads } from 'btch-downloader'

export default defineNitroPlugin(() => {
  // Warm-up: module sudah ter-require dari saat server start,
  // jadi request pertama tidak perlu menunggu module loading
  console.log('[AMSave] ✓ btch-downloader module preloaded — siap tanpa cold-start')
})
