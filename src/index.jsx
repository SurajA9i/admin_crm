import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.js';
import 'react-quill/dist/quill.snow.css'; // import the styles for Quill editor
import App from './App';

import { ConfigProvider } from './contexts/ConfigContext';

import './index.scss';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>
);

reportWebVitals();
