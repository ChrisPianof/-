import React from 'react';
import ReactDOM from 'react-dom/client';
import '@alfalab/core-components/themes/corp.css';
import './index.css';
import './corp-overrides.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
