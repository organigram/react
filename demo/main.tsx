import React from 'react'
import { createRoot } from 'react-dom/client'
import DemoApp from '../src/DemoApp'
import { ModalProvider } from './Modal'
import { RecoilRoot } from 'recoil'
import {
  createTheme,
  CssBaseline,
  ThemeOptions,
  ThemeProvider
} from '@mui/material'

import { theme } from '../src/theme'

const _theme = createTheme(theme as ThemeOptions)

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <ModalProvider>
        <ThemeProvider theme={_theme}>
          <CssBaseline />
          <DemoApp />
        </ThemeProvider>
      </ModalProvider>
    </RecoilRoot>
  </React.StrictMode>
)
