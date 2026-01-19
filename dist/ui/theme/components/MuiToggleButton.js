"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuiToggleButton = void 0;
const palette_1 = require("../palette");
exports.MuiToggleButton = {
    styleOverrides: {
        root: {
            background: 'rgba(255, 255, 255, 0.08)',
            color: palette_1.palette.text.primary,
            '&.Mui-selected': {
                background: palette_1.palette.gradient.blue
            }
        }
    }
};
