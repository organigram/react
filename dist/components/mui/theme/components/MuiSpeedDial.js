"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuiSpeedDial = void 0;
const palette_1 = require("../palette");
exports.MuiSpeedDial = {
    styleOverrides: {
        fab: {
            color: palette_1.palette.text.primary,
            backgroundColor: palette_1.palette.grey.light3,
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
};
