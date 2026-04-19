import { defineEventHandler, getQuery, setHeader, sendStream } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string
  const filename = (query.name as string) || 'AMSave-Media'

  if (!url) {
    return { status: false, message: 'URL tidak valid' }
  }

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`)
    }

    // Set headers for file download
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const extension = contentType.includes('image') ? 'jpg' : (contentType.includes('audio') ? 'mp3' : 'mp4')
    
    setHeader(event, 'Content-Disposition', `attachment; filename="${filename}.${extension}"`)
    setHeader(event, 'Content-Type', contentType)
    
    // Pipe the external stream directly to the client response
    return sendStream(event, response.body)

  } catch (error) {
    console.error('Proxy Download Error:', error)
    return {
      status: false,
      message: 'Gagal mengunduh file karena kesalahan jaringan atau CORS.'
    }
  }
})
