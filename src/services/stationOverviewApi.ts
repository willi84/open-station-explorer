import axios from 'axios'
import type { Location, StationFacilities } from '@/types'

const STATION_OVERVIEW_URL = 'https://bahn.dev/station-overview'

// Raw station format from bahn.dev/station-overview (db-stations full format)
export interface RawStation {
  type: string
  id: string
  ril100?: string
  nr?: number
  name: string
  weight?: number
  location: {
    type: string
    latitude: number
    longitude: number
  }
  operator?: { type: string; id: string; name: string }
  address?: {
    city: string
    zipcode: string
    street: string
  }
  category?: number
  priceCategory?: number
  hasParking?: boolean
  hasBicycleParking?: boolean
  hasLocalPublicTransport?: boolean
  hasPublicFacilities?: boolean
  hasLockerSystem?: boolean
  hasTaxiRank?: boolean
  hasTravelNecessities?: boolean
  /** 'yes' | 'partial' | 'no' or boolean depending on data source version */
  hasSteplessAccess?: 'yes' | 'partial' | 'no' | boolean
  /** 'yes' | 'partial' | 'no' or boolean depending on data source version */
  hasMobilityService?: 'yes' | 'partial' | 'no' | boolean
  hasWiFi?: boolean
  hasTravelCenter?: boolean
  hasRailwayMission?: boolean
  hasDBLounge?: boolean
  hasLostAndFound?: boolean
  hasCarRental?: boolean
  federalState?: string
}

let stationsCache: RawStation[] | null = null
let loadingPromise: Promise<RawStation[]> | null = null

async function loadStations(): Promise<RawStation[]> {
  if (stationsCache) return stationsCache
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      const response = await axios.get<string>(STATION_OVERVIEW_URL, {
        timeout: 30000,
        responseType: 'text',
        headers: { Accept: 'application/json, application/x-ndjson, text/plain' },
      })
      const text = response.data
      const trimmed = text.trim()

      // Support both JSON array and NDJSON (newline-delimited JSON)
      if (trimmed.startsWith('[')) {
        stationsCache = JSON.parse(trimmed) as RawStation[]
      } else {
        stationsCache = trimmed
          .split('\n')
          .filter(line => line.trim().length > 0)
          .map(line => JSON.parse(line) as RawStation)
      }
      return stationsCache
    } catch (e) {
      console.error('Failed to load station overview:', e)
      loadingPromise = null
      return []
    }
  })()

  return loadingPromise
}

/** Convert a raw station entry to the app's Location type */
export function rawToLocation(station: RawStation): Location {
  return {
    type: 'stop',
    id: station.id,
    name: station.name,
    latitude: station.location.latitude,
    longitude: station.location.longitude,
  }
}

/** Normalise 'yes'/'partial'/'no' or boolean to boolean */
function toBool(val: 'yes' | 'partial' | 'no' | boolean | undefined): boolean {
  if (typeof val === 'boolean') return val
  return val === 'yes' || val === 'partial'
}

/** Convert a raw station entry to the app's StationFacilities type */
export function rawToFacilities(station: RawStation): StationFacilities {
  return {
    hasParking: station.hasParking ?? false,
    hasBicycleParking: station.hasBicycleParking ?? false,
    hasPublicFacilities: station.hasPublicFacilities ?? false,
    hasLockerSystem: station.hasLockerSystem ?? false,
    hasTaxiRank: station.hasTaxiRank ?? false,
    hasTravelNecessities: station.hasTravelNecessities ?? false,
    hasRailwayMission: station.hasRailwayMission ?? false,
    hasDBLounge: station.hasDBLounge ?? false,
    hasLostAndFound: station.hasLostAndFound ?? false,
    hasMobilityService: toBool(station.hasMobilityService),
    hasStepFreeAccess: toBool(station.hasSteplessAccess),
    hasWiFi: station.hasWiFi ?? false,
    hasTravelCenter: station.hasTravelCenter ?? false,
    hasCarRental: station.hasCarRental ?? false,
    category: station.category ?? 7,
    federalState: station.federalState,
    address: station.address
      ? {
          street: station.address.street ?? '',
          city: station.address.city ?? '',
          zipcode: station.address.zipcode ?? '',
        }
      : undefined,
  }
}

/** Search stations by name (case-insensitive substring match, sorted by relevance) */
export async function searchStations(query: string): Promise<Location[]> {
  const stations = await loadStations()
  const q = query.toLowerCase().trim()
  if (!q) return []

  return stations
    .filter(s => s.name.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q)
      const bStarts = b.name.toLowerCase().startsWith(q)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return (b.weight ?? 0) - (a.weight ?? 0)
    })
    .slice(0, 10)
    .map(rawToLocation)
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6_371_000 // Earth radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Find stations within `distance` metres of the given coordinates */
export async function getNearbyStations(
  lat: number,
  lon: number,
  distance = 2000,
): Promise<Location[]> {
  const stations = await loadStations()

  return stations
    .map(s => ({
      station: s,
      dist: haversineDistance(lat, lon, s.location.latitude, s.location.longitude),
    }))
    .filter(({ dist }) => dist <= distance)
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 10)
    .map(({ station, dist }) => ({
      ...rawToLocation(station),
      distance: Math.round(dist),
    }))
}

/** Look up a station by its EVA ID and return location + facilities */
export async function getStationById(
  id: string,
): Promise<{ location: Location; facilities: StationFacilities } | null> {
  const stations = await loadStations()
  const station = stations.find(s => s.id === id)
  if (!station) return null

  return {
    location: rawToLocation(station),
    facilities: rawToFacilities(station),
  }
}
