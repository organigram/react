"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuiButton = void 0;
const palette_1 = require("../palette");
const typography_1 = require("../typography");
exports.MuiButton = {
    styleOverrides: {
        root: {
            color: palette_1.palette.text.primary,
            boxShadow: 'none',
            borderRadius: '6px',
            padding: '10px 30px'
        },
        contained: {
            color: palette_1.palette.white,
            background: palette_1.palette.primary.main,
            '&:hover': { backgroundColor: palette_1.palette.primary.light }
        },
        containedPrimary: {
            color: palette_1.palette.white,
            background: palette_1.palette.primary.main
        },
        containedSecondary: {
            background: palette_1.palette.gradient.red,
            color: palette_1.palette.text.primary
        },
        outlined: {
            borderRadius: '30px',
            border: `1px solid ${palette_1.palette.text.primary}`,
            ...typography_1.typography.h3,
            padding: '8px 16px'
        },
        textPrimary: {
            '&:hover': { color: palette_1.palette.primary.main }
        },
        textSecondary: {
            '&:hover': { color: palette_1.palette.brickRed.main }
        },
        text: {
            color: palette_1.palette.text.primary,
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
};
