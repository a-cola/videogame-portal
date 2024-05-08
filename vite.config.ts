import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name:'VideogamePortal',
        short_name:'VGP',
        theme_color: '#1e1e1e',
        icons: [
          {
            src: 'icons/VGP_Logo_512.png',
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: 'icons/VGP_Logo_192.png',
            sizes: "192x192",
            type: "image/png",
          },
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png}']
      }
    }),
  ],
})
