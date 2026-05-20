<template>
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <RouterLink to="/" class="hover:text-db-red transition-colors">🏠 Start</RouterLink>
      <span>›</span>
      <span class="text-gray-900 dark:text-gray-100 font-medium truncate">
        {{ store.currentStation?.name || 'Bahnhof' }}
      </span>
    </nav>

    <LoadingSpinner v-if="store.isLoading" label="Lade Bahnhofsdaten..." />

    <div v-else-if="store.error" class="card text-center py-8">
      <p class="text-4xl mb-3">⚠️</p>
      <p class="text-red-600 dark:text-red-400">{{ store.error }}</p>
      <RouterLink to="/" class="btn-primary inline-block mt-4">Zurück zur Startseite</RouterLink>
    </div>

    <template v-else-if="store.currentStation">
      <!-- Station Header -->
      <div class="card">
        <div class="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div class="flex items-center gap-3 flex-wrap mb-2">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {{ store.currentStation.name }}
              </h1>
              <span
                v-if="store.facilities?.category"
                class="text-sm font-bold px-3 py-1 rounded-full"
                :class="categoryBadgeClass"
              >
                Kategorie {{ store.facilities.category }}
              </span>
            </div>
            <div class="space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <p v-if="store.facilities?.federalState">🗺️ {{ store.facilities.federalState }}</p>
              <p v-if="store.facilities?.address">
                📮 {{ store.facilities.address.street }}, {{ store.facilities.address.zipcode }} {{ store.facilities.address.city }}
              </p>
            </div>
          </div>
          <div class="text-5xl">🚉</div>
        </div>
      </div>

      <!-- Verification -->
      <div class="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Community-Verifikation</h2>
          <VerificationBadge :count="communityStore.totalVerifications" />
        </div>
        <button
          @click="handleVerification"
          class="btn-primary flex items-center gap-2 whitespace-nowrap"
          :class="{ 'animate-pulse': justVerified }"
        >
          <span>✓</span>
          {{ justVerified ? 'Danke!' : 'Ich habe diese Daten verifiziert' }}
        </button>
      </div>

      <!-- Inventory -->
      <div class="card">
        <InventoryGrid
          :items="communityStore.inventoryItems"
          :total-verifications="communityStore.totalVerifications"
        />
      </div>

      <!-- Departures -->
      <div class="card">
        <DepartureBoard :station-id="id" />
      </div>
    </template>

    <div v-else class="text-center py-12 text-gray-400">
      <p class="text-4xl mb-3">🔍</p>
      <p>Bahnhof nicht gefunden</p>
      <RouterLink to="/" class="btn-primary inline-block mt-4">Zurück zur Startseite</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useStationsStore } from '@/stores/stationsStore'
import { useCommunityStore } from '@/stores/communityStore'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import VerificationBadge from '@/components/VerificationBadge.vue'
import InventoryGrid from '@/components/InventoryGrid.vue'
import DepartureBoard from '@/components/DepartureBoard.vue'

const props = defineProps<{ id: string }>()
const store = useStationsStore()
const communityStore = useCommunityStore()
const justVerified = ref(false)

const categoryBadgeClass = computed(() => {
  const cat = store.facilities?.category ?? 7
  if (cat <= 2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  if (cat <= 4) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
})

async function loadAll() {
  await store.loadStation(props.id)
  communityStore.loadCommunityData(props.id, store.facilities)
}

function handleVerification() {
  communityStore.addVerification()
  justVerified.value = true
  setTimeout(() => { justVerified.value = false }, 3000)
}

onMounted(loadAll)

watch(() => props.id, loadAll)
</script>
