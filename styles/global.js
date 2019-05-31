import {createGlobalStyle} from 'styled-components'
import theme from 'config/theme'
import * as colors from 'constants/colors'

export default createGlobalStyle`
  @font-face {
    font-family: 'Rubik';
    font-style: normal;
    font-weight: 400;
    src: local('Rubik'), local('Rubik-Regular'), url(https://fonts.gstatic.com/s/rubik/v8/iJWKBXyIfDnIV7nBrXyw023e.woff2) format('woff2');
  }

  @font-face {
    font-family: 'Rubik';
    font-style: normal;
    font-weight: 500;
    src: local('Rubik Medium'), local('Rubik-Medium'), url(https://fonts.gstatic.com/s/rubik/v8/iJWHBXyIfDnIV7Eyjmmd8WD07oB-.woff2) format('woff2');
  }

  html {
    color: ${colors.text};
    font-family: ${theme.fontFamily};
    font-size: 100%;
    -webkit-font-smoothing: antialiased;
  }

  body {
    margin: 0;
    padding: 0;
    width: 100%;
    font-size: 1rem;
    line-height: 1.5;
  }

  #__next {
     display: flex;
     flex-direction: column;
     width: 100%;
   }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* Make clicks pass-through */
  #nprogress {
    pointer-events: none;
  }

  #nprogress .bar {
    background: ${theme.colors.pink};

    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;

    width: 100%;
    height: 3px;
  }

  /* Fancy blur effect */
  #nprogress .peg {
    display: none;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 10px #29d, 0 0 5px #29d;
    opacity: 1;

    -webkit-transform: rotate(3deg) translate(0px, -4px);
    -ms-transform: rotate(3deg) translate(0px, -4px);
    transform: rotate(3deg) translate(0px, -4px);
  }

  /* Remove these to get rid of the spinner */
  #nprogress .spinner {
    display: none;
    position: fixed;
    z-index: 1031;
    top: 15px;
    right: 15px;
  }

  #nprogress .spinner-icon {
    width: 18px;
    height: 18px;
    box-sizing: border-box;

    border: solid 2px transparent;
    border-top-color: #29d;
    border-left-color: #29d;
    border-radius: 50%;

    -webkit-animation: nprogress-spinner 400ms linear infinite;
    animation: nprogress-spinner 400ms linear infinite;
  }

  .nprogress-custom-parent {
    overflow: hidden;
    position: relative;
  }

  .nprogress-custom-parent #nprogress .spinner,
  .nprogress-custom-parent #nprogress .bar {
    position: absolute;
  }

  @-webkit-keyframes nprogress-spinner {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes nprogress-spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  .js-no-scroll {
    overflow: hidden;
  }
  
  .js-no-scroll header {
    display: none !important;
  }
`
