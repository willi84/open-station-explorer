import axios from 'axios'
import type { StationFacilities, InventoryItem } from '@/types'

const BASE_URL = '/api/station-data'

const api = axios.create({ timeout: 10000 })

export async function getStationFacilities(evaNumber: string): Promise<StationFacilities | null> {
  try {
    const response = await api.get(`${BASE_URL}/stations/${evaNumber}`)
    const d = response.data
    return {
      hasParking: d.hasParking ?? false,
      hasBicycleParking: d.hasBicycleParking ?? false,
      hasPublicFacilities: d.hasPublicFacilities ?? false,
      hasLockerSystem: d.hasLockerSystem ?? false,
      hasTaxiRank: d.hasTaxiRank ?? false,
      hasTravelNecessities: d.hasTravelNecessities ?? false,
      hasRailwayMission: d.hasRailwayMission ?? false,
      hasDBLounge: d.hasDBLounge ?? false,
      hasLostAndFound: d.hasLostAndFound ?? false,
      hasMobilityService: d.hasMobilityService ?? false,
      hasStepFreeAccess: d.hasStepFreeAccess ?? false,
      hasBoardingAid: d.hasBoardingAid ?? false,
      category: d.category ?? 7,
      federalState: d.federalState,
      address: d.address ? {
        street: d.address.street ?? '',
        city: d.address.city ?? '',
        zipcode: d.address.zipcode ?? '',
      } : undefined,
    }
  } catch (e) {
    console.error('getStationFacilities error:', e)
    return null
  }
}

const FACILITY_MAP: Array<{ key: keyof StationFacilities; label: string; icon: string; type: string }> = [
  { key: 'hasParking', label: 'Parkplatz', icon: '🚗', type: 'parking' },
  { key: 'hasBicycleParking', label: 'Fahrradstellplätze', icon: '🚲', type: 'bicycle_parking' },
  { key: 'hasPublicFacilities', label: 'Toiletten', icon: '🚻', type: 'toilets' },
  { key: 'hasLockerSystem', label: 'Schließfächer', icon: '🔒', type: 'lockers' },
  { key: 'hasTaxiRank', label: 'Taxistand', icon: '��', type: 'taxi' },
  { key: 'hasTravelNecessities', label: 'Reisebedarf', icon: '🛍️', type: 'travel_needs' },
  { key: 'hasRailwayMission', label: 'Bahnhofsmission', icon: '🤝', type: 'railway_mission' },
  { key: 'hasDBLounge', label: 'DB Lounge', icon: '💼', type: 'db_lounge' },
  { key: 'hasLostAndFound', label: 'Fundbüro', icon: '📦', type: 'lost_found' },
  { key: 'hasMobilityService', label: 'Mobilitätsservice', icon: '♿', type: 'mobility' },
  { key: 'hasStepFreeAccess', label: 'Stufenfreier Zugang', icon: '🛗', type: 'step_free' },
  { key: 'hasBoardingAid', label: 'Einstiegshilfe', icon: '🦽', type: 'boarding_aid' },
]

export function facilitiesToInventoryItems(stationId: string, facilities: StationFacilities): InventoryItem[] {
  const now = new Date().toISOString()
  const items: InventoryItem[] = FACILITY_MAP.map(({ key, label, icon, type }) => ({
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
  items.push({
    id: `${stationId}_ticket_machine`,
    stationId,
    type: 'ticket_machine',
    label: 'Fahrkartenautomat',
    icon: '🎫',
    available: true,
    images: [],
    verifications: 0,
    feedbacks: [],
    lastUpdated: now,
  })
  items.push({
    id: `${stationId}_info_counter`,
    stationId,
    type: 'info_counter',
    label: 'Informationsschalter',
    icon: 'ℹ️',
    available: true,
    images: [],
    verifications: 0,
    feedbacks: [],
    lastUpdated: now,
  })
  return items
}
