"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuiOutlinedInput = void 0;
const palette_1 = require("../palette");
exports.MuiOutlinedInput = {
    styleOverrides: {
        root: {
            borderRadius: '4px'
        },
        input: {
            '&.MuiNativeSelect-select': {
                borderRadius: '4px',
                background: palette_1.palette.background.default
            }
        }
    }
};
