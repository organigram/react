import * as components from './components'
import { palette } from './palette'
import { typography } from './typography'
import { breakpoints } from './breakpoints'

/**
 * Default MUI theme primitives shared by Organigram React components.
 */
export const theme = {
  palette,
  components,
  shape: {
    borderRadius: 16
  },
  typography,
  breakpoints
}

/**
 * Desktop navigation height used by the hosted Organigram UI.
 */
export const navHeight = 100

/**
 * Mobile navigation height used by the hosted Organigram UI.
 */
export const mobileNavHeight = 50

/**
 * Workspace navigation height used inside authenticated screens.
 */
export const workspaceNavHeight = 60

export { palette, components, typography, breakpoints }
