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
            urlPattern: /^https:\/\/v5\.db\.transport\.rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'transport-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 }
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
  },
  server: {
    proxy: {
      '/api/station-data': {
        target: 'https://stationservice.noncd.db.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/station-data/, '/ss')
      }
    }
  }
})
