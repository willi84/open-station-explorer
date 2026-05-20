import type { CommunityImage, Feedback } from '@/types'

function key(prefix: string, stationId: string, itemType: string) {
  return `${prefix}_${stationId}_${itemType}`
}

export function getImages(stationId: string, itemType: string): CommunityImage[] {
  try {
    const raw = localStorage.getItem(key('community_images', stationId, itemType))
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addImage(stationId: string, itemType: string, base64: string): CommunityImage {
  const images = getImages(stationId, itemType)
  const image: CommunityImage = {
    id: `img_${Date.now()}`,
    url: base64,
    uploadedBy: 'community',
    timestamp: new Date().toISOString(),
    verified: false,
  }
  images.push(image)
  localStorage.setItem(key('community_images', stationId, itemType), JSON.stringify(images))
  return image
}

export function getFeedbacks(stationId: string, itemType: string): Feedback[] {
  try {
    const raw = localStorage.getItem(key('community_feedback', stationId, itemType))
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addFeedback(
  stationId: string,
  itemType: string,
  type: Feedback['type'],
  comment?: string
): Feedback {
  const feedbacks = getFeedbacks(stationId, itemType)
  const fb: Feedback = {
    id: `fb_${Date.now()}`,
    itemId: `${stationId}_${itemType}`,
    type,
    comment,
    timestamp: new Date().toISOString(),
    userId: 'anonymous',
  }
  feedbacks.push(fb)
  localStorage.setItem(key('community_feedback', stationId, itemType), JSON.stringify(feedbacks))
  return fb
}

export function getVerificationCount(stationId: string): number {
  try {
    const raw = localStorage.getItem(`community_verifications_${stationId}`)
    return raw ? parseInt(raw, 10) : 0
  } catch { return 0 }
}

export function addVerification(stationId: string): number {
  const count = getVerificationCount(stationId) + 1
  localStorage.setItem(`community_verifications_${stationId}`, String(count))
  return count
}
