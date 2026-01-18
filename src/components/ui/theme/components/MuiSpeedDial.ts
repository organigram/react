import { palette } from '../palette'

export const MuiSpeedDial = {
  styleOverrides: {
    fab: {
      color: palette.text.primary,
      backgroundColor: palette.grey.light3,
      // '&:hover': {
      //   backgroundColor: palette.text.primary,
      //   color: palette.background.default
      // },
      borderRadius: '6px',
      width: 6 * 8,
      height: 6 * 8,
      boxShadow: 'none'
    }
  }
}
