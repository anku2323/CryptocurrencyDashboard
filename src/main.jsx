import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx';
import './index.css';
import { CoinProvider } from './Header/CoinContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-hf4rmqjaiaaozo7s.us.auth0.com"
      clientId="LxnwN0hceNGhpWsJo4rp8aYjkbjXnvYz"
      redirectUri={window.location.origin}
    >
      <CoinProvider>
        <App />
      </CoinProvider>
    </Auth0Provider>
  </React.StrictMode>
);
