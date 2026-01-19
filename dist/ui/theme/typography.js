"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typography = void 0;
const palette_1 = require("./palette");
// import { mediaQueries } from './breakpoints'
exports.typography = {
    color: palette_1.palette.text.primary,
    fontFamily: 'RobotoRegular',
    lineHeight: '132%',
    h1: {
        fontFamily: 'Aspekta500',
        lineHeight: '100%',
        fontSize: '60px',
        letterSpacing: '-1.2px'
        // [mediaQueries.smUp]: {
        //   fontSize: '210px'
        // }
    },
    h2: {
        fontSize: '40px',
        lineHeight: '110%',
        fontFamily: 'Aspekta400',
        letterSpacing: '-0.4px'
    },
    h3: {
        fontFamily: 'Aspekta550',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        lineHeight: '130%'
    },
    subtitle1: {
        fontSize: '13px',
        fontWeight: 600,
        lineHeight: '25px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: palette_1.palette.primary.main
    },
    button: {
        textTransform: 'none',
        fontSize: '13px'
    },
    body1: {
        fontSize: '13px'
    }
};
