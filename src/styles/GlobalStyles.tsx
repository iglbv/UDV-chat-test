/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';

const globalStyles = css`
  :root {
    --primary-color: #2c3e50;
    --secondary-color: #34495e;
    --background-color: #ecf0f1;
    --text-color: #2c3e50;
    --border-color: #bdc3c7;
    --hover-color: #1abc9c;
    --transition-speed: 0.3s;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;