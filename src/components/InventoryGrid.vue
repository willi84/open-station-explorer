<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">🏪 Inventar</h2>
      <div class="flex items-center gap-2">
        <span v-if="totalVerifications > 0" class="text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">
          ✓ {{ totalVerifications }} × verifiziert
        </span>
      </div>
    </div>

    <div v-if="items.length === 0" class="text-center py-8 text-gray-400">
      <p class="text-4xl mb-2">📋</p>
      <p>Keine Inventardaten verfügbar</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <InventoryItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @click="openImages"
        @feedback="openFeedback"
      />
    </div>

    <ImageUploadModal
      v-if="selectedItem"
      :item="selectedItem"
      @close="selectedItem = null"
    />
    <FeedbackModal
      v-if="feedbackItem"
      :item="feedbackItem"
      @close="feedbackItem = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { InventoryItem } from '@/types'
import InventoryItemCard from './InventoryItemCard.vue'
import ImageUploadModal from './ImageUploadModal.vue'
import FeedbackModal from './FeedbackModal.vue'

defineProps<{
  items: InventoryItem[]
  totalVerifications: number
}>()

const selectedItem = ref<InventoryItem | null>(null)
const feedbackItem = ref<InventoryItem | null>(null)

function openImages(item: InventoryItem) {
  selectedItem.value = item
}

function openFeedback(item: InventoryItem) {
  feedbackItem.value = item
}
</script>
