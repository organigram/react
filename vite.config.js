import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import dts from 'vite-plugin-dts'

export default defineConfig({
  logLevel: 'error',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: '@organigram/react',
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'index.mjs' : 'index.cjs')
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /@mui/,
        'recoil',
        'viem',
        '@organigram/js'
      ]
    }
  },
  optimizeDeps: {
    include: [
      '@mui/icons-material/Add',
      '@mui/icons-material/AttachFile',
      '@mui/icons-material/AutoAwesome',
      '@mui/icons-material/Close',
      '@mui/icons-material/Send',
      '@mui/material/Divider',
      '@mui/material/Drawer',
      '@mui/material/IconButton',
      '@mui/material/List',
      '@mui/material/ListItemButton',
      '@mui/material/Stack',
      '@mui/material/TextField'
    ]
  },
  test: {
    globals: true,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    }
  }
})
