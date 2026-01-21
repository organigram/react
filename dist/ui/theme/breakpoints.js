export const breakpoints = {
    values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536
    }
};
export const mediaQueries = {
    xsUp: `@media (min-width:${breakpoints.values.xs}px)`,
    smUp: `@media (min-width:${breakpoints.values.sm}px)`,
    mdUp: `@media (min-width:${breakpoints.values.md}px)`,
    lgUp: `@media (min-width:${breakpoints.values.lg}px)`,
    xlUp: `@media (min-width:${breakpoints.values.xl}px)`
};
