export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'AMSave - Download Video & Foto dari IG, TikTok, FB, YouTube & Threads',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Download video dan foto dari Instagram, TikTok, Facebook, YouTube, dan Threads secara gratis. Cepat, aman, tanpa watermark, tanpa perlu login!' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fa.masum.my.id/6.7.2/css/all.css' }
      ]
    }
  },

  modules: [
    '@vite-pwa/nuxt'
  ],

  pwa: {
    manifest: {
      name: 'AMSave Downloader',
      short_name: 'AMSave',
      description: 'Download Video & Foto dari IG, TikTok, FB, YT & Threads',
      theme_color: '#5B84d4',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  css: ['~/assets/css/main.css'],

  srcDir: 'app',

  future: {
    compatibilityVersion: 4
  },

  nitro: {
    // Tell Nitro to NOT bundle btch-downloader – treat it as a plain Node module.
    // This eliminates the 40-second cold-start caused by Rollup re-processing the ESM.
    externals: {
      external: ['btch-downloader', 'btch-http']
    }
  }
})
