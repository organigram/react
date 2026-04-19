import React from 'react'
import { RecoilRoot } from 'recoil'

import createTheme, {
  type ThemeOptions
} from '@mui/material/styles/createTheme'
import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/material/styles/ThemeProvider'

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
