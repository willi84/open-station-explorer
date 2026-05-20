<template>
  <div class="relative">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          v-model="query"
          type="text"
          placeholder="Bahnhof suchen..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-db-red focus:border-transparent transition-colors"
          @focus="showDropdown = true"
          @blur="handleBlur"
        />
        <button
          v-if="query"
          @click="clearQuery"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >✕</button>
      </div>
      <button
        @click="handleLocationClick"
        :disabled="geoLoading"
        class="btn-primary flex items-center gap-2 whitespace-nowrap"
        :class="{ 'opacity-50 cursor-not-allowed': geoLoading }"
      >
        <span>📍</span>
        <span class="hidden sm:inline">{{ geoLoading ? 'Ermittle...' : 'Standort' }}</span>
      </button>
    </div>

    <!-- Dropdown Results -->
    <div
      v-if="showDropdown && (results.length > 0 || store.isLoading)"
      class="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden"
    >
      <LoadingSpinner v-if="store.isLoading && results.length === 0" label="Suche..." />
      <ul v-else>
        <li
          v-for="location in results"
          :key="location.id"
          @mousedown.prevent="selectLocation(location)"
          class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
        >
          <span class="text-lg">🚉</span>
          <div>
            <p class="font-medium text-gray-900 dark:text-gray-100">{{ location.name }}</p>
            <p v-if="location.distance" class="text-xs text-gray-500">{{ formatDistance(location.distance) }}</p>
          </div>
        </li>
      </ul>
    </div>

    <p v-if="geoError" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ geoError }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import type { Location } from '@/types'
import { useStationsStore } from '@/stores/stationsStore'
import { useGeolocation } from '@/composables/useGeolocation'
import LoadingSpinner from './LoadingSpinner.vue'

const emit = defineEmits<{ select: [location: Location] }>()

const store = useStationsStore()
const router = useRouter()
const { isLoading: geoLoading, error: geoError, getCurrentPosition } = useGeolocation()

const query = ref('')
const showDropdown = ref(false)
const results = computed(() => store.searchResults)

const debouncedSearch = useDebounceFn(async (q: string) => {
  if (q.trim().length >= 2) {
    await store.searchStations(q)
    showDropdown.value = true
  }
}, 300)

watch(query, (q) => {
  if (!q) { store.clearSearchResults(); showDropdown.value = false; return }
  debouncedSearch(q)
})

function handleBlur() {
  setTimeout(() => { showDropdown.value = false }, 150)
}

function clearQuery() {
  query.value = ''
  store.clearSearchResults()
  showDropdown.value = false
}

function selectLocation(location: Location) {
  query.value = location.name
  showDropdown.value = false
  emit('select', location)
  router.push(`/station/${location.id}`)
}

async function handleLocationClick() {
  try {
    const { lat, lon } = await getCurrentPosition()
    await store.loadNearby(lat, lon)
  } catch (e) {
    console.error('Geolocation failed:', e)
  }
}

function formatDistance(meters: number) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`
}
</script>
