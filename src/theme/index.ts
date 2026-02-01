import * as components from './components'
import { palette } from './palette'
import { typography } from './typography'
import { breakpoints } from './breakpoints'

export const theme = {
  palette,
  components,
  shape: {
    borderRadius: 16
  },
  typography,
  breakpoints
}

export const navHeight = 100
export const mobileNavHeight = 50
export const workspaceNavHeight = 60

export { palette, components, typography, breakpoints }
