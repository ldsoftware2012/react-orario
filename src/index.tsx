import React, { createContext, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App';

//all'interno di my-app lanciare "npm start"
//all'interno di data lanciare npx json-server data.json


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);



root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>  
);


reportWebVitals();
