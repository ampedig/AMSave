import { defineEventHandler, readBody } from 'h3'
import { igdl, ttdl, fbdown } from 'btch-downloader'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { url, platform } = body

    if (!url) {
      return {
        status: false,
        message: 'Silakan berikan URL yang valid'
      }
    }

    let downloadUrl = ''
    let audioUrl = ''
    let title = `${platform.charAt(0).toUpperCase() + platform.slice(1)} Media`
    let thumbnail = ''
    let type = 'video'

    if (platform === 'instagram') {
      const res = await igdl(url)
      const dataArr = Array.isArray(res) ? res : res.result || []
      
      if (dataArr && dataArr.length > 0) {
        downloadUrl = dataArr[0].url || dataArr[0].download
        thumbnail = dataArr[0].thumbnail || 'https://placehold.co/400x600/6366f1/ffffff?text=Instagram'
        type = downloadUrl.includes('jpg') || downloadUrl.includes('webp') ? 'image' : 'video'
      } else {
         return { status: false, message: 'Tidak dapat menemukan media di link IG tersebut.' }
      }
    } else if (platform === 'tiktok') {
      const res = await ttdl(url)
      if (res && (res.video || res.audio)) {
        downloadUrl = res.video?.[0] || ''
        audioUrl = res.audio?.[0] || ''
        
        // Use TikTok's provided native thumbnail or cover
        thumbnail = res.thumbnail || res.cover || 'https://placehold.co/400x600/000000/00f2ea?text=Video+tanpa+Cover'
        
        // Clean up title
        title = res.title || title
      } else {
         return { status: false, message: 'Tidak dapat menemukan video TikTok tersebut.' }
      }
    } else if (platform === 'facebook') {
      const res = await fbdown(url)
      if (res && (res.Normal_video || res.HD)) {
        downloadUrl = res.HD || res.Normal_video
        thumbnail = 'https://placehold.co/400x600/1877f2/ffffff?text=Facebook'
      } else {
        return { status: false, message: 'Tidak dapat menemukan video Facebook tersebut.' }
      }
    } else {
      return { status: false, message: 'Platform tidak didukung' }
    }

    if (!downloadUrl) {
      return { status: false, message: 'Gagal mengambil link download media.' }
    }

    return {
      status: true,
      data: {
        title,
        thumbnail,
        downloadUrl,
        audioUrl,
        platform,
        type
      }
    }
  } catch (error) {
    console.error('Download Error:', error)
    return {
      status: false,
      message: 'Terjadi kesalahan sistem saat mengambil data.'
    }
  }
})
