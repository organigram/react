"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuiCssBaseline = void 0;
exports.MuiCssBaseline = {
    styleOverrides: `
    .react-flow__attribution {
      display: none;
    }
    .ch-codeblock .ch-code-button {
      display: none;
    }
    .ch-codeblock:hover .ch-code-button {
      display: block;
    }
    .ch-codegroup .ch-editor-button {
      display: none;
    }
    .ch-codegroup:hover .ch-editor-button {
      display: block;
    }
    body {
      margin: 0;
      padding: 0;
      min-height: calc(100vh - calc(100vh - 100%));
      min-height: fill-available;
      min-height: -webkit-fill-available;
    }
    html {
      height: fill-available;
      height: -webkit-fill-available;
    }
    .notistack-SnackbarContainer {
      z-index: 9999
    }
  `
};
