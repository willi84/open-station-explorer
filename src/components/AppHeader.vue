<template>
  <header class="bg-db-red text-white shadow-lg sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3 max-w-5xl flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity">
        <span class="text-2xl">🚂</span>
        <span class="hidden sm:inline">Open Station Explorer</span>
        <span class="sm:hidden">OSE</span>
      </RouterLink>
      <nav class="flex items-center gap-4">
        <RouterLink to="/" class="hover:opacity-80 transition-opacity text-sm font-medium" active-class="underline">
          Start
        </RouterLink>
        <span v-if="currentStationName" class="text-sm opacity-75 hidden md:block truncate max-w-xs">
          📍 {{ currentStationName }}
        </span>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStationsStore } from '@/stores/stationsStore'

const store = useStationsStore()
const currentStationName = computed(() => store.currentStation?.name)
</script>
