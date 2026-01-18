"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuiTextField = void 0;
const palette_1 = require("../palette");
exports.MuiTextField = {
    defaultProps: {
        variant: 'standard',
        InputLabelProps: {
            disableAnimation: true,
            shrink: true
        }
    },
    styleOverrides: {
        root: {
            '.MuiOutlinedInput-root': {
                background: palette_1.palette.background.default
            }
        }
    }
};
