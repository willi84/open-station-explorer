<template>
  <div
    class="relative rounded-xl p-4 border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
    :class="item.available
      ? 'border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 hover:border-green-400'
      : 'border-gray-200 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 hover:border-gray-400'"
    @click="$emit('click', item)"
  >
    <div class="text-center mb-2">
      <span class="text-3xl block mb-1">{{ item.icon }}</span>
      <p class="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{{ item.label }}</p>
    </div>

    <div class="flex items-center justify-between mt-3">
      <span
        class="text-xs font-semibold px-2 py-0.5 rounded-full"
        :class="item.available
          ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
      >
        {{ item.available ? '✓' : '✗' }}
      </span>
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <span v-if="item.images.length > 0" class="flex items-center gap-0.5">📷 {{ item.images.length }}</span>
        <span v-if="item.feedbacks.length > 0" class="flex items-center gap-0.5">💬 {{ item.feedbacks.length }}</span>
      </div>
    </div>

    <button
      @click.stop="$emit('feedback', item)"
      class="absolute top-2 right-2 text-gray-400 hover:text-db-red transition-colors text-xs"
      title="Feedback geben"
    >⚑</button>
  </div>
</template>

<script setup lang="ts">
import type { InventoryItem } from '@/types'

defineProps<{ item: InventoryItem }>()
defineEmits<{
  click: [item: InventoryItem]
  feedback: [item: InventoryItem]
}>()
</script>
