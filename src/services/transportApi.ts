import axios from 'axios'
import type { Departure } from '@/types'

const BASE_URL = 'https://v5.db.transport.rest'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

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

