export interface Location {
  type: 'stop' | 'location'
  id: string
  name: string
  latitude: number
  longitude: number
  distance?: number
  products?: Record<string, boolean>
}

export interface StationFacilities {
  hasParking: boolean
  hasBicycleParking: boolean
  hasPublicFacilities: boolean
  hasLockerSystem: boolean
  hasTaxiRank: boolean
  hasTravelNecessities: boolean
  hasRailwayMission: boolean
  hasDBLounge: boolean
  hasLostAndFound: boolean
  hasMobilityService: boolean
  hasStepFreeAccess: boolean
  hasBoardingAid: boolean
  category: number
  federalState?: string
  address?: {
    street: string
    city: string
    zipcode: string
  }
}

export interface InventoryItem {
  id: string
  stationId: string
  type: string
  label: string
  icon: string
  available: boolean
  images: CommunityImage[]
  verifications: number
  feedbacks: Feedback[]
  lastUpdated: string
}

export interface CommunityImage {
  id: string
  url: string
  uploadedBy: string
  timestamp: string
  verified: boolean
}

export interface Feedback {
  id: string
  itemId: string
  type: 'correct' | 'incorrect' | 'outdated' | 'missing'
  comment?: string
  timestamp: string
  userId: string
}

export interface Departure {
  tripId: string
  stop: { id: string; name: string }
  when: string | null
  plannedWhen: string
  delay: number | null
  platform: string | null
  plannedPlatform: string | null
  direction: string
  line: {
    id: string
    name: string
    product: string
    mode: string
    operator?: { id: string; name: string }
  }
  cancelled: boolean
  remarks?: Array<{ type: string; text: string }>
}
