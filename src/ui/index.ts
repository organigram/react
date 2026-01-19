import { Breakpoint, useMediaQuery, useTheme } from '@mui/material'

export { theme } from './theme/theme'
export * as components from './theme/components'
export { palette } from './theme/palette'
export { typography } from './theme/typography'
export { breakpoints } from './theme/breakpoints'

export const useBreakpoint: (
  breakpoint: Breakpoint
) => boolean = breakpoint => {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.up(breakpoint))
}

export const navHeight = 100
export const mobileNavHeight = 50
export const workspaceNavHeight = 60
