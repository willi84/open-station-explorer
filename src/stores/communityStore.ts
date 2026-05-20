import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { InventoryItem, StationFacilities } from '@/types'
import { facilitiesToInventoryItems } from '@/services/stationDataApi'
import * as communityService from '@/services/communityService'

export const useCommunityStore = defineStore('community', () => {
  const inventoryItems = ref<InventoryItem[]>([])
  const totalVerifications = ref(0)
  const currentStationId = ref<string>('')

  function loadCommunityData(stationId: string, facilities: StationFacilities | null) {
    currentStationId.value = stationId
    const baseItems = facilities
      ? facilitiesToInventoryItems(stationId, facilities)
      : []
    inventoryItems.value = baseItems.map(item => ({
      ...item,
      images: communityService.getImages(stationId, item.type),
      feedbacks: communityService.getFeedbacks(stationId, item.type),
      verifications: communityService.getVerificationCount(stationId),
    }))
    totalVerifications.value = communityService.getVerificationCount(stationId)
  }

  function addImage(itemType: string, base64: string) {
    const stationId = currentStationId.value
    const image = communityService.addImage(stationId, itemType, base64)
    const item = inventoryItems.value.find(i => i.type === itemType)
    if (item) item.images.push(image)
  }

  function addFeedback(itemType: string, feedbackType: 'correct' | 'incorrect' | 'outdated' | 'missing', comment?: string) {
    const stationId = currentStationId.value
    const fb = communityService.addFeedback(stationId, itemType, feedbackType, comment)
    const item = inventoryItems.value.find(i => i.type === itemType)
    if (item) item.feedbacks.push(fb)
  }

  function addVerification() {
    const stationId = currentStationId.value
    const count = communityService.addVerification(stationId)
    totalVerifications.value = count
    inventoryItems.value.forEach(item => { item.verifications = count })
  }

  return {
    inventoryItems,
    totalVerifications,
    currentStationId,
    loadCommunityData,
    addImage,
    addFeedback,
    addVerification,
  }
})
