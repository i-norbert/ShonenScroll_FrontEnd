import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MenuBar from './MenuBar.js';
import reportWebVitals from './reportWebVitals.js';
import {UserProvider} from "./UserContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <UserProvider>
          <MenuBar />
      </UserProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
