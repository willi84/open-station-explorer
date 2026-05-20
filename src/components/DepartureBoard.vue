<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">🕐 Abfahrten</h2>
      <button @click="refresh" class="btn-secondary text-sm flex items-center gap-2">
        <span :class="{ 'animate-spin': isRefreshing }">🔄</span>
        Aktualisieren
      </button>
    </div>

    <LoadingSpinner v-if="isRefreshing && departures.length === 0" label="Lade Abfahrten..." />

    <div v-else-if="departures.length === 0" class="text-center py-8 text-gray-400">
      <p class="text-3xl mb-2">🚫</p>
      <p>Keine Abfahrten in den nächsten 30 Minuten</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b-2 border-gray-200 dark:border-gray-700 text-left">
            <th class="pb-2 pr-4 text-gray-600 dark:text-gray-400 font-semibold">Zeit</th>
            <th class="pb-2 pr-4 text-gray-600 dark:text-gray-400 font-semibold">Linie</th>
            <th class="pb-2 pr-4 text-gray-600 dark:text-gray-400 font-semibold">Richtung</th>
            <th class="pb-2 text-gray-600 dark:text-gray-400 font-semibold">Gleis</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
          <tr
            v-for="dep in departures"
            :key="dep.tripId"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            :class="{ 'opacity-50': dep.cancelled }"
          >
            <td class="py-2 pr-4">
              <div class="flex flex-col">
                <span class="font-mono font-semibold" :class="timeClass(dep)">
                  {{ formatTime(dep.when || dep.plannedWhen) }}
                </span>
                <span v-if="dep.delay && dep.delay > 0" class="text-xs" :class="delayClass(dep.delay)">
                  +{{ Math.round(dep.delay / 60) }} Min
                </span>
                <span v-if="dep.cancelled" class="text-xs text-red-600 dark:text-red-400 font-semibold">AUSFALL</span>
              </div>
            </td>
            <td class="py-2 pr-4">
              <span
                class="px-2 py-0.5 rounded font-bold text-white text-xs"
                :style="{ backgroundColor: lineColor(dep.line.product) }"
              >
                {{ dep.line.name }}
              </span>
            </td>
            <td class="py-2 pr-4">
              <span class="text-gray-900 dark:text-gray-100 truncate block max-w-[160px]">
                {{ dep.direction }}
              </span>
            </td>
            <td class="py-2">
              <span v-if="dep.platform || dep.plannedPlatform" class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">
                Gl. {{ dep.platform || dep.plannedPlatform }}
              </span>
              <span v-else class="text-gray-400">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Departure } from '@/types'
import { useStationsStore } from '@/stores/stationsStore'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps<{ stationId: string }>()
const store = useStationsStore()
const departures = ref<Departure[]>([])
const isRefreshing = ref(false)
let intervalId: ReturnType<typeof setInterval> | null = null

async function refresh() {
  isRefreshing.value = true
  await store.loadDepartures(props.stationId)
  departures.value = store.departures
  isRefreshing.value = false
}

function formatTime(isoString: string | null): string {
  if (!isoString) return '--:--'
  return new Date(isoString).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function timeClass(dep: Departure): string {
  if (dep.cancelled) return 'text-red-600 dark:text-red-400 line-through'
  if (dep.delay && dep.delay > 300) return 'text-red-600 dark:text-red-400'
  if (dep.delay && dep.delay > 0) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-gray-900 dark:text-gray-100'
}

function delayClass(delay: number): string {
  if (delay > 300) return 'text-red-500'
  return 'text-yellow-500'
}

function lineColor(product: string): string {
  const colors: Record<string, string> = {
    nationalExpress: '#CC0000',
    national: '#CC0000',
    regionalExp: '#CC3300',
    regional: '#CC6600',
    suburban: '#006600',
    subway: '#003399',
    tram: '#CC0066',
    bus: '#996633',
    ferry: '#006699',
  }
  return colors[product] || '#666666'
}

onMounted(async () => {
  await refresh()
  intervalId = setInterval(refresh, 60000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>
