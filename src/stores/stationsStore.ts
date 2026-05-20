import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Location, StationFacilities, Departure } from '@/types'
import { searchLocations, getNearbyStops, getStopDetails, getDepartures } from '@/services/transportApi'
import { getStationFacilities } from '@/services/stationDataApi'

export const useStationsStore = defineStore('stations', () => {
  const currentStation = ref<Location | null>(null)
  const nearbyStations = ref<Location[]>([])
  const searchResults = ref<Location[]>([])
  const facilities = ref<StationFacilities | null>(null)
  const departures = ref<Departure[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function searchStations(query: string) {
    if (!query.trim()) { searchResults.value = []; return }
    isLoading.value = true
    error.value = null
    try {
      searchResults.value = await searchLocations(query)
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
      nearbyStations.value = await getNearbyStops(lat, lon)
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
      const station = await getStopDetails(id)
      if (station) {
        currentStation.value = station
        facilities.value = await getStationFacilities(id)
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
    searchStations,
    loadNearby,
    loadStation,
    loadDepartures,
    clearSearchResults,
  }
})
