import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
import mediaPipePlugin from './mediaPipePlugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mediaPipePlugin()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/, /fcmv2/],
      exclude: ['mediaPipePlugin.ts'],
      extensions: ['.js', '.cjs', '.jsx']
    },
  }
})
