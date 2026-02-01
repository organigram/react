import React from 'react'
import { RecoilRoot } from 'recoil'

import {
  createTheme,
  CssBaseline,
  ThemeOptions,
  ThemeProvider
} from '@mui/material'

import { theme } from '../src/theme'
import { ModalProvider } from './Modal'

const _theme = createTheme(theme as ThemeOptions)

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecoilRoot>
    <ModalProvider>
      <ThemeProvider theme={_theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ModalProvider>
  </RecoilRoot>
)

export default Wrapper
