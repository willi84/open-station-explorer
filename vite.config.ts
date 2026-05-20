import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Open Station Explorer',
        short_name: 'StationExplorer',
        description: 'Erkunde deutsche Bahnhöfe',
        theme_color: '#CC0000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/bahn\.dev\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'station-overview-cache',
              expiration: { maxEntries: 5, maxAgeSeconds: 86400 }
            }
          },
          {
            urlPattern: /^https:\/\/v5\.db\.transport\.rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'departures-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
