import axios from 'axios'
import type { Location, Departure } from '@/types'

const BASE_URL = 'https://v5.db.transport.rest'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export async function searchLocations(query: string): Promise<Location[]> {
  try {
    const response = await api.get('/locations', {
      params: {
        query,
        fuzzy: true,
        stops: true,
        addresses: false,
        poi: false,
        linesOfStops: false,
        language: 'de',
        results: 10,
      }
    })
    return (response.data || []).map((item: any) => ({
      type: item.type || 'stop',
      id: item.id,
      name: item.name,
      latitude: item.location?.latitude ?? item.latitude ?? 0,
      longitude: item.location?.longitude ?? item.longitude ?? 0,
      products: item.products,
    }))
  } catch (e) {
    console.error('searchLocations error:', e)
    return []
  }
}

export async function getNearbyStops(lat: number, lon: number, distance = 2000): Promise<Location[]> {
  try {
    const response = await api.get('/stops/nearby', {
      params: {
        latitude: lat,
        longitude: lon,
        distance,
        results: 10,
        linesOfStops: false,
        language: 'de',
      }
    })
    return (response.data || []).map((item: any) => ({
      type: 'stop' as const,
      id: item.id,
      name: item.name,
      latitude: item.location?.latitude ?? item.latitude ?? 0,
      longitude: item.location?.longitude ?? item.longitude ?? 0,
      distance: item.distance,
      products: item.products,
    }))
  } catch (e) {
    console.error('getNearbyStops error:', e)
    return []
  }
}

export async function getStopDetails(id: string): Promise<Location | null> {
  try {
    const response = await api.get(`/stops/${id}`, {
      params: { linesOfStops: false, language: 'de' }
    })
    const item = response.data
    return {
      type: item.type || 'stop',
      id: item.id,
      name: item.name,
      latitude: item.location?.latitude ?? item.latitude ?? 0,
      longitude: item.location?.longitude ?? item.longitude ?? 0,
      products: item.products,
    }
  } catch (e) {
    console.error('getStopDetails error:', e)
    return null
  }
}

export async function getDepartures(id: string): Promise<Departure[]> {
  try {
    const response = await api.get(`/stops/${id}/departures`, {
      params: { duration: 30, linesOfStops: false, language: 'de' }
    })
    const data = response.data
    const items = Array.isArray(data) ? data : (data?.departures || [])
    return items.map((d: any) => ({
      tripId: d.tripId,
      stop: { id: d.stop?.id ?? '', name: d.stop?.name ?? '' },
      when: d.when ?? null,
      plannedWhen: d.plannedWhen ?? d.when ?? '',
      delay: d.delay ?? null,
      platform: d.platform ?? null,
      plannedPlatform: d.plannedPlatform ?? null,
      direction: d.direction ?? '',
      line: {
        id: d.line?.id ?? '',
        name: d.line?.name ?? '',
        product: d.line?.product ?? '',
        mode: d.line?.mode ?? '',
        operator: d.line?.operator,
      },
      cancelled: d.cancelled ?? false,
      remarks: d.remarks ?? [],
    }))
  } catch (e) {
    console.error('getDepartures error:', e)
    return []
  }
}
