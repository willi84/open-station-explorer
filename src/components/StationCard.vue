<template>
  <div
    @click="navigateToStation"
    class="card cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-gray-100 dark:border-gray-700"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ station.name }}</h3>
          <span
            v-if="facilities?.category"
            class="text-xs font-bold px-2 py-0.5 rounded-full"
            :class="categoryClass"
          >Kat. {{ facilities.category }}</span>
        </div>
        <p v-if="facilities?.federalState" class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {{ facilities.federalState }}
        </p>
        <p v-if="station.distance" class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          📍 {{ formatDistance(station.distance) }}
        </p>
      </div>
      <div class="flex flex-col items-end gap-1">
        <span class="text-2xl">🚉</span>
        <div v-if="station.products" class="flex gap-1 flex-wrap justify-end">
          <span v-for="(_, product) in activeProducts" :key="String(product)" class="text-sm" :title="String(product)">
            {{ productIcon(String(product)) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Location, StationFacilities } from '@/types'

const props = defineProps<{
  station: Location
  facilities?: StationFacilities | null
}>()

const router = useRouter()

function navigateToStation() {
  router.push(`/station/${props.station.id}`)
}

function formatDistance(meters: number) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`
}

const activeProducts = computed(() => {
  if (!props.station.products) return {}
  return Object.fromEntries(
    Object.entries(props.station.products).filter(([, v]) => v)
  )
})

function productIcon(product: string): string {
  const icons: Record<string, string> = {
    nationalExpress: '🚄', national: '🚂', regionalExp: '🚆', regional: '🚆',
    suburban: '🚊', bus: '🚌', ferry: '⛴️', subway: '🚇', tram: '🚋', taxi: '🚕'
  }
  return icons[product] || '🚉'
}

const categoryClass = computed(() => {
  const cat = props.facilities?.category ?? 7
  if (cat <= 2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  if (cat <= 4) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
})
</script>
