import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { StorageProvider } from "./providers/StorageProvider";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StorageProvider>
      <App />
    </StorageProvider>
  </React.StrictMode>
);
