import { palette } from '../palette'

export const MuiButton = {
  styleOverrides: {
    root: {
      color: palette.text.primary,
      boxShadow: 'none',
      borderRadius: '6px',
      padding: '10px 30px'
    },
    contained: {
      color: palette.white,
      background: palette.primary.main,
      '&:hover': { backgroundColor: palette.primary.light }
    },
    containedPrimary: {
      color: palette.white,
      background: palette.primary.main
    },
    containedSecondary: {
      background: palette.gradient.red,
      color: palette.text.primary
    },
    textPrimary: {
      '&:hover': { color: palette.primary.main }
    },
    textSecondary: {
      '&:hover': { color: palette.brickRed.main }
    },
    text: {
      color: palette.text.primary,
      padding: 0,
      paddingLeft: 0,
      paddingRight: 0,
      minWidth: 0,
      textTransform: 'none',
      textAlign: 'left',
      borderRadius: '12px',
      '&:hover': {
        background: 'rgba(238, 255, 255, 0.01)'
      }
    }
  }
}
