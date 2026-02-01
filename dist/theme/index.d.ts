import { palette } from './palette';
import { typography } from './typography';
import { breakpoints } from './breakpoints';
import * as components from './components';
export declare const theme: {
    palette: {
        primary: {
            main: string;
            light: string;
            light2: string;
            light3: string;
            light4: string;
        };
        secondary: {
            main: string;
            light: string;
            light2: string;
            light3: string;
        };
        error: {
            main: string;
        };
        white: string;
        grey: {
            main: string;
            light: string;
            light2: string;
            light3: string;
            light4: string;
            light5: string;
        };
        violet: {
            main: string;
            light: string;
            light2: string;
            light3: string;
            light4: string;
        };
        text: {
            primary: string;
            disabled: string;
        };
        background: {
            default: string;
            paper: string;
            secondary: string;
        };
        brickRed: {
            main: string;
        };
        gradient: {
            main: string;
            secondary: string;
            red: string;
            blue: string;
            violet: string;
        };
    };
    components: typeof components;
    shape: {
        borderRadius: number;
    };
    typography: {
        color: string;
        fontFamily: string;
        lineHeight: string;
        h1: {
            fontFamily: string;
            lineHeight: string;
            fontSize: string;
            letterSpacing: string;
        };
        h2: {
            fontSize: string;
            lineHeight: string;
            fontFamily: string;
            letterSpacing: string;
        };
        h3: {
            fontFamily: string;
            textTransform: string;
            letterSpacing: string;
            lineHeight: string;
        };
        subtitle1: {
            fontSize: string;
            fontWeight: number;
            lineHeight: string;
            letterSpacing: string;
            textTransform: string;
            color: string;
        };
        button: {
            textTransform: string;
            fontSize: string;
        };
        body1: {
            fontSize: string;
        };
    };
    breakpoints: {
        values: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
        };
    };
};
export declare const navHeight = 100;
export declare const mobileNavHeight = 50;
export declare const workspaceNavHeight = 60;
export { palette, components, typography, breakpoints };
