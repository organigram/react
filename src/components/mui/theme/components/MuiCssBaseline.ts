// import Averta from '../../fonts/averta.otf'
import Aspekta400 from '../../fonts/Aspekta-400.otf'
import Aspekta500 from '../../fonts/Aspekta-500.otf'
import Aspekta550 from '../../fonts/Aspekta-550.otf'
import RobotoRegular from '../../fonts/Roboto-Regular.ttf'

export const MuiCssBaseline = {
  styleOverrides: `
    @font-face {
      font-family: 'Aspekta400';
      font-style: normal;
      font-weight: normal;
      src: local('Aspekta400'), url(${Aspekta400 as string}) format('truetype');
    }
    @font-face {
      font-family: 'Aspekta500';
      font-style: normal;
      font-weight: normal;
      src: local('Aspekta500'), url(${Aspekta500 as string}) format('truetype');
    }
    @font-face {
      font-family: 'Aspekta550';
      font-style: normal;
      font-weight: normal;
      src: local('Aspekta550'), url(${Aspekta550 as string}) format('truetype');
    }
    @font-face {
      font-family: 'RobotoRegular';
      font-style: normal;
      font-weight: normal;
      src: local('RobotoRegular'), url(${RobotoRegular as string}) format('truetype');
    }
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
