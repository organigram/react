"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaQueries = exports.breakpoints = void 0;
exports.breakpoints = {
    values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536
    }
};
exports.mediaQueries = {
    xsUp: `@media (min-width:${exports.breakpoints.values.xs}px)`,
    smUp: `@media (min-width:${exports.breakpoints.values.sm}px)`,
    mdUp: `@media (min-width:${exports.breakpoints.values.md}px)`,
    lgUp: `@media (min-width:${exports.breakpoints.values.lg}px)`,
    xlUp: `@media (min-width:${exports.breakpoints.values.xl}px)`
};
