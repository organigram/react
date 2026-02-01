import Aspekta400 from '../fonts/Aspekta400.otf'
import Aspekta500 from '../fonts/Aspekta500.otf'
import Aspekta550 from '../fonts/Aspekta550.otf'
import RobotoRegular from '../fonts/RobotoRegular.ttf'

export const MuiCssBaseline = {
  styleOverrides:
    [
      ['Aspekta400', Aspekta400],
      ['Aspekta500', Aspekta500],
      ['Aspekta550', Aspekta550],
      ['RobotoRegular', RobotoRegular]
    ]
      .map(
        ([fontName, font]) => ` @font-face {
        font-family: '${fontName}';
        font-style: normal;
        font-weight: normal;
        src: local('${fontName}'), url(${font}) format('truetype');
      }
  `
      )
      .join('\n') +
    `
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
}
