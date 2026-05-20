<template>
  <div class="space-y-8">
    <!-- Hero -->
    <section class="text-center py-10 px-4">
      <div class="text-6xl mb-4">🚂</div>
      <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Open Station Explorer</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
        Erkunde deutsche Bahnhöfe – von Ausstattung über Abfahrten bis zu Community-Bewertungen.
      </p>
    </section>

    <!-- Search -->
    <section class="max-w-2xl mx-auto">
      <StationSearch @select="handleSelect" />
    </section>

    <!-- Nearby -->
    <section class="card">
      <NearbyStations />
    </section>

    <!-- How it works -->
    <section class="card">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">🗺️ So funktioniert's</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-4xl mb-3">🔍</div>
          <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Bahnhof suchen</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Name eingeben oder Standort verwenden</p>
        </div>
        <div class="text-center">
          <div class="text-4xl mb-3">🏪</div>
          <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Inventar erkunden</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Ausstattung, Fotos & Abfahrten ansehen</p>
        </div>
        <div class="text-center">
          <div class="text-4xl mb-3">✓</div>
          <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-2">Community beitragen</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Daten verifizieren & Fotos hochladen</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Location } from '@/types'
import StationSearch from '@/components/StationSearch.vue'
import NearbyStations from '@/components/NearbyStations.vue'

function handleSelect(_location: Location) {
  // Navigation is handled inside StationSearch
}
</script>
