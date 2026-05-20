import { ref } from 'vue'

export function useGeolocation() {
  const latitude = ref<number | null>(null)
  const longitude = ref<number | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  function getCurrentPosition(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolokalisierung wird nicht unterstützt'))
        return
      }
      isLoading.value = true
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          latitude.value = pos.coords.latitude
          longitude.value = pos.coords.longitude
          isLoading.value = false
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        },
        (err) => {
          error.value = err.message
          isLoading.value = false
          reject(err)
        },
        { timeout: 10000, maximumAge: 60000 }
      )
    })
  }

  return { latitude, longitude, error, isLoading, getCurrentPosition }
}
