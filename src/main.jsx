import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { makeServer } from "./mirage/server.js";

// Always initialize MirageJS for both development and production
// This ensures login functionality works in deployed versions
console.log("Initializing MirageJS server...");
const server = makeServer();
console.log("MirageJS server initialized:", server);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)