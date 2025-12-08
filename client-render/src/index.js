import React from 'react';
import ReactDOM from'react-dom/client';
import {BrowserRouter as Router, useLocation} from 'react-router-dom';
import './index.css';
import App from './App';
// import { Metamask } from './App';
import reportWebVitals from './reportWebVitals';

function AppWrapper() {
  const location = useLocation(); // Get the current location
  return <App location={location} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Router>
      <AppWrapper />
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
