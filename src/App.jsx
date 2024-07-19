import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { CoinProvider } from './Header/CoinContext';
import Navbar from './Header/Navbar';
import News from './News/News';


const App = () => {
  return (
    
    <Auth0Provider
      domain="dev-hf4rmqjaiaaozo7s.us.auth0.com"
      clientId="LxnwN0hceNGhpWsJo4rp8aYjkbjXnvYz"
      redirectUri={window.location.origin}
    >
      <CoinProvider>
        <Navbar />
       <News />
      </CoinProvider>
    </Auth0Provider>
    
  );
};

export default App;
