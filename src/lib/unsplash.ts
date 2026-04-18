// Unsplash API wrapper
//
// Setup: Create .env file in project root with:
//   VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
//
// Get a free access key at: https://unsplash.com/developers

export interface UnsplashPhoto {
  id: string
  urls: {
    thumb: string
    small: string
    regular: string
    full: string
  }
  user: {
    name: string
    username: string
    links: { html: string }
  }
  alt_description: string | null
  description: string | null
  width: number
  height: number
  links: {
    download_location: string
  }
}

export interface UnsplashSearchResult {
  total: number
  total_pages: number
  results: UnsplashPhoto[]
}

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined

export function isUnsplashConfigured(): boolean {
  return typeof ACCESS_KEY === 'string' && ACCESS_KEY.length > 0
}

export async function searchUnsplash(
  query: string,
  page: number = 1,
  perPage: number = 20,
): Promise<UnsplashSearchResult> {
  if (!ACCESS_KEY) {
    throw new Error('UNSPLASH_NOT_CONFIGURED')
  }
  const url = new URL('https://api.unsplash.com/search/photos')
  url.searchParams.set('query', query)
  url.searchParams.set('page', String(page))
  url.searchParams.set('per_page', String(perPage))
  url.searchParams.set('content_filter', 'high') // family-friendly

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Client-ID ${ACCESS_KEY}`,
      'Accept-Version': 'v1',
    },
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error('UNSPLASH_AUTH_FAILED')
  }
  if (response.status === 429) {
    throw new Error('UNSPLASH_RATE_LIMITED')
  }
  if (!response.ok) {
    throw new Error(`UNSPLASH_API_ERROR_${response.status}`)
  }

  return response.json()
}

/**
 * Track a download per Unsplash API guidelines.
 * Call this whenever a user selects a photo to use.
 * Fires-and-forgets; errors are silently ignored.
 */
export function trackDownload(downloadLocation: string): void {
  if (!ACCESS_KEY || !downloadLocation) return
  fetch(downloadLocation, {
    headers: { 'Authorization': `Client-ID ${ACCESS_KEY}` },
  }).catch(() => {})
}

/**
 * Fetch an image and return it as a data URL (base64).
 * Used to convert Unsplash URLs into images that can be drawn on Fabric.js canvas
 * without CORS issues on export.
 */
export async function fetchImageAsDataUrl(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('FileReader failed'))
    reader.readAsDataURL(blob)
  })
}
