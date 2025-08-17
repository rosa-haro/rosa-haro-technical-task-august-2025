import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {     
        svgo: true,
        svgoConfig: {
          plugins: [
            { name: 'removeDimensions' },            
            { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } }, 
          ],
        },
      },
    }),
    react(),
  ],
})
