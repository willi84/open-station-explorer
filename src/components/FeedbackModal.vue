<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="$emit('close')">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">Feedback: {{ item.icon }} {{ item.label }}</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <button
              v-for="opt in options"
              :key="opt.type"
              @click="selectedType = opt.type"
              class="p-3 rounded-xl border-2 transition-all text-left"
              :class="selectedType === opt.type
                ? 'border-db-red bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'"
            >
              <span class="text-2xl block mb-1">{{ opt.icon }}</span>
              <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ opt.label }}</span>
            </button>
          </div>

          <textarea
            v-model="comment"
            placeholder="Optionaler Kommentar..."
            rows="3"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-db-red resize-none"
          />

          <div class="flex gap-3 mt-4">
            <button @click="$emit('close')" class="btn-secondary flex-1">Abbrechen</button>
            <button
              @click="submit"
              :disabled="!selectedType"
              class="btn-primary flex-1"
              :class="{ 'opacity-50 cursor-not-allowed': !selectedType }"
            >Senden</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { InventoryItem } from '@/types'
import { useCommunityStore } from '@/stores/communityStore'

const props = defineProps<{ item: InventoryItem }>()
const emit = defineEmits<{ close: [] }>()

const communityStore = useCommunityStore()
const selectedType = ref<'correct' | 'incorrect' | 'outdated' | 'missing' | null>(null)
const comment = ref('')

const options = [
  { type: 'correct' as const, icon: '✅', label: 'Korrekt' },
  { type: 'incorrect' as const, icon: '❌', label: 'Falsch' },
  { type: 'outdated' as const, icon: '⏰', label: 'Veraltet' },
  { type: 'missing' as const, icon: '➕', label: 'Fehlt' },
]

function submit() {
  if (!selectedType.value) return
  communityStore.addFeedback(props.item.type, selectedType.value, comment.value || undefined)
  emit('close')
}
</script>
