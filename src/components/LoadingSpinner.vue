<template>
  <div class="flex items-center justify-center py-12">
    <div class="relative">
      <div class="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
      <div class="absolute top-0 left-0 w-12 h-12 border-4 border-db-red border-t-transparent rounded-full animate-spin"></div>
    </div>
    <span v-if="label" class="ml-4 text-gray-600 dark:text-gray-400">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label?: string }>()
</script>
