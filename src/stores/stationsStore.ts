import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Location, StationFacilities, Departure } from '@/types'
import { searchStations, getNearbyStations, getStationById } from '@/services/stationOverviewApi'
import { getDepartures } from '@/services/transportApi'

export const useStationsStore = defineStore('stations', () => {
  const currentStation = ref<Location | null>(null)
  const nearbyStations = ref<Location[]>([])
  const searchResults = ref<Location[]>([])
  const facilities = ref<StationFacilities | null>(null)
  const departures = ref<Departure[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function searchStationsAction(query: string) {
    if (!query.trim()) { searchResults.value = []; return }
    isLoading.value = true
    error.value = null
    try {
      searchResults.value = await searchStations(query)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function loadNearby(lat: number, lon: number) {
    isLoading.value = true
    error.value = null
    try {
      nearbyStations.value = await getNearbyStations(lat, lon)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function loadStation(id: string) {
    isLoading.value = true
    error.value = null
    facilities.value = null
    try {
      const result = await getStationById(id)
      if (result) {
        currentStation.value = result.location
        facilities.value = result.facilities
      }
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function loadDepartures(id: string) {
    try {
      departures.value = await getDepartures(id)
    } catch (e: any) {
      console.error('loadDepartures error:', e)
    }
  }

  function clearSearchResults() {
    searchResults.value = []
  }

  return {
    currentStation,
    nearbyStations,
    searchResults,
    facilities,
    departures,
    isLoading,
    error,
    searchStations: searchStationsAction,
    loadNearby,
    loadStation,
    loadDepartures,
    clearSearchResults,
  }
})
