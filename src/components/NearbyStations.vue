<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">📍 In der Nähe</h2>
      <button
        @click="loadNearby"
        :disabled="geoLoading || store.isLoading"
        class="btn-secondary text-sm flex items-center gap-2"
      >
        <span :class="{ 'animate-spin': geoLoading }">📡</span>
        {{ geoLoading ? 'Ermittle...' : 'Aktualisieren' }}
      </button>
    </div>

    <div v-if="geoError" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm mb-4">
      ⚠️ {{ geoError }}
    </div>

    <LoadingSpinner v-if="store.isLoading && store.nearbyStations.length === 0" label="Lade Bahnhöfe..." />

    <div v-else-if="store.nearbyStations.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500">
      <p class="text-3xl mb-2">🗺️</p>
      <p class="text-sm">Klicke auf "Aktualisieren" um Bahnhöfe in der Nähe zu finden</p>
    </div>

    <div v-else class="space-y-3">
      <StationCard
        v-for="station in store.nearbyStations"
        :key="station.id"
        :station="station"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useStationsStore } from '@/stores/stationsStore'
import { useGeolocation } from '@/composables/useGeolocation'
import LoadingSpinner from './LoadingSpinner.vue'
import StationCard from './StationCard.vue'

const store = useStationsStore()
const { isLoading: geoLoading, error: geoError, getCurrentPosition } = useGeolocation()

async function loadNearby() {
  try {
    const { lat, lon } = await getCurrentPosition()
    await store.loadNearby(lat, lon)
  } catch (e) {
    console.error('Geolocation failed:', e)
  }
}

onMounted(() => {
  if (store.nearbyStations.length === 0) {
    loadNearby()
  }
})
</script>
