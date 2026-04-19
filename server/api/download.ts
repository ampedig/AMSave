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
        
        // Coba ekstrak Thumbnail asli & Judul dari Tag Facebook OpenGraph (Opsional)
        try {
          const fbResponse = await fetch(url)
          const fbHtml = await fbResponse.text()
          
          const titleMatch = fbHtml.match(/<title>([\s\S]*?)<\/title>/i)
          if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].replace(/&amp;/g, '&').replace(/\n/g, ' ').trim()
          }
          
          const imgMatch = fbHtml.match(/property="og:image"\s+content="([^"]+)"/i)
          if (imgMatch && imgMatch[1]) {
            thumbnail = imgMatch[1].replace(/&amp;/g, '&')
          }
        } catch (scrapeErr) {
          console.error("Gagal scrape Thumbnail FB:", scrapeErr)
        }
        
      } else {
        return { status: false, message: 'Tidak dapat menemukan video Facebook tersebut.' }
      }
    } else if (platform === 'youtube') {
      try {
        let videoId = ''
        const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/)
        if (ytMatch) videoId = ytMatch[1]
        
        if (!videoId) {
          return { status: false, message: 'URL YouTube tidak valid. Pastikan berisi link video yang benar.' }
        }

        try {
          const oembed = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`) // Get metadata
          if (oembed.ok) {
            const meta = await oembed.json()
            title = meta.title || title
          }
        } catch (_) {}

        thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

        try {
          // Gunakan Cobalt API tanpa dependensi binary yt-dlp
          const cobaltRes = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              url: `https://www.youtube.com/watch?v=${videoId}`,
              vCodec: 'h264',
              vQuality: '720',
              aFormat: 'mp3',
              isAudioOnly: false
            })
          })
          
          if (cobaltRes.ok) {
            const cobaltData = await cobaltRes.json()
            if (cobaltData.status === 'stream' || cobaltData.status === 'redirect') {
              downloadUrl = cobaltData.url || ''
            } else if (cobaltData.status === 'picker' && cobaltData.picker) {
              downloadUrl = cobaltData.picker[0]?.url || ''
            }
          }
        } catch (cobaltErr) {
          console.error('Cobalt API error:', cobaltErr)
        }

        if (!downloadUrl) {
          try {
            const audioRes = await fetch('https://api.cobalt.tools/api/json', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({
                url: `https://www.youtube.com/watch?v=${videoId}`,
                isAudioOnly: true,
                aFormat: 'mp3'
              })
            })
            if (audioRes.ok) {
              const audioData = await audioRes.json()
              if (audioData.url) {
                audioUrl = audioData.url
              }
            }
          } catch (_) {}
        }

        if (!downloadUrl && !audioUrl) {
          return { status: false, message: 'Maaf, video YouTube ini tidak dapat diunduh saat ini.' }
        }

      } catch (err) {
        console.error('YouTube Error:', err)
        return { status: false, message: 'Gagal memproses URL YouTube.' }
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
