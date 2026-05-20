<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="$emit('close')">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ item.icon }} {{ item.label }}</h3>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <!-- Status Badge -->
          <div class="mb-4">
            <span
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              :class="item.available
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
            >
              {{ item.available ? '✓ Vorhanden' : '✗ Nicht vorhanden' }}
            </span>
          </div>

          <!-- Existing Images Gallery -->
          <div v-if="item.images.length > 0" class="mb-6">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">📸 Community-Fotos ({{ item.images.length }})</h4>
            <div class="grid grid-cols-2 gap-2">
              <img
                v-for="img in item.images"
                :key="img.id"
                :src="img.url"
                :alt="item.label"
                class="w-full h-32 object-cover rounded-lg"
              />
            </div>
          </div>

          <!-- Upload -->
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
            <p class="text-gray-500 dark:text-gray-400 mb-3">📷 Foto hochladen</p>
            <input type="file" accept="image/*" @change="handleFileChange" class="hidden" ref="fileInput" />
            <button @click="fileInput?.click()" class="btn-secondary text-sm">Foto auswählen</button>
          </div>

          <!-- Preview -->
          <div v-if="preview" class="mt-4">
            <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Vorschau:</h4>
            <img :src="preview" alt="Vorschau" class="w-full max-h-48 object-contain rounded-lg border border-gray-200 dark:border-gray-700" />
            <div class="flex gap-2 mt-3">
              <button @click="preview = null" class="btn-secondary flex-1 text-sm">Verwerfen</button>
              <button @click="uploadImage" class="btn-primary flex-1 text-sm">Hochladen</button>
            </div>
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
const fileInput = ref<HTMLInputElement | null>(null)
const preview = ref<string | null>(null)

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => { preview.value = e.target?.result as string }
  reader.readAsDataURL(file)
}

function uploadImage() {
  if (!preview.value) return
  communityStore.addImage(props.item.type, preview.value)
  preview.value = null
}
</script>
