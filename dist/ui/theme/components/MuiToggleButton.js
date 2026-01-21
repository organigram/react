import { palette } from '../palette';
export const MuiToggleButton = {
    styleOverrides: {
        root: {
            background: 'rgba(255, 255, 255, 0.08)',
            color: palette.text.primary,
            '&.Mui-selected': {
                background: palette.gradient.blue
            }
        }
    }
};
