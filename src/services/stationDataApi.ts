import type { StationFacilities, InventoryItem } from '@/types'

const FACILITY_MAP: Array<{ key: keyof StationFacilities; label: string; icon: string; type: string }> = [
  { key: 'hasParking', label: 'Parkplatz', icon: '🚗', type: 'parking' },
  { key: 'hasBicycleParking', label: 'Fahrradstellplätze', icon: '🚲', type: 'bicycle_parking' },
  { key: 'hasPublicFacilities', label: 'Toiletten', icon: '🚻', type: 'toilets' },
  { key: 'hasLockerSystem', label: 'Schließfächer', icon: '🔒', type: 'lockers' },
  { key: 'hasTaxiRank', label: 'Taxistand', icon: '🚕', type: 'taxi' },
  { key: 'hasTravelNecessities', label: 'Reisebedarf', icon: '🛍️', type: 'travel_needs' },
  { key: 'hasRailwayMission', label: 'Bahnhofsmission', icon: '🤝', type: 'railway_mission' },
  { key: 'hasDBLounge', label: 'DB Lounge', icon: '💼', type: 'db_lounge' },
  { key: 'hasLostAndFound', label: 'Fundbüro', icon: '📦', type: 'lost_found' },
  { key: 'hasMobilityService', label: 'Mobilitätsservice', icon: '♿', type: 'mobility' },
  { key: 'hasStepFreeAccess', label: 'Stufenfreier Zugang', icon: '🛗', type: 'step_free' },
  { key: 'hasWiFi', label: 'WLAN', icon: '📶', type: 'wifi' },
  { key: 'hasTravelCenter', label: 'Reisezentrum', icon: '🎫', type: 'travel_center' },
  { key: 'hasCarRental', label: 'Mietwagen', icon: '🚙', type: 'car_rental' },
]

export function facilitiesToInventoryItems(stationId: string, facilities: StationFacilities): InventoryItem[] {
  const now = new Date().toISOString()
  return FACILITY_MAP.map(({ key, label, icon, type }) => ({
    id: `${stationId}_${type}`,
    stationId,
    type,
    label,
    icon,
    available: facilities[key] as boolean,
    images: [],
    verifications: 0,
    feedbacks: [],
    lastUpdated: now,
  }))
}

