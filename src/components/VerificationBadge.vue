<template>
  <div v-if="count > 0" class="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-sm font-medium">
    <span class="relative flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
    </span>
    ✓ {{ count }} verifiziert
  </div>
  <div v-else class="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full px-3 py-1 text-sm">
    Noch nicht verifiziert
  </div>
</template>

<script setup lang="ts">
defineProps<{ count: number }>()
</script>
