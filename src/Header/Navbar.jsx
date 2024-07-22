import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../SearchCrypto/SearchBar';
import CurrencyConverter from './CurrencyConverter';
import FundsOverview from './FundsOverview';
import './Navbar.css';
import News from '../News/News';
import CoinChart from './CoinChart';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [coinId, setCoinId] = useState('bitcoin');
  const [coinData, setCoinData] = useState({ market_data: {}, image: {} });
  const [currentIndex, setCurrentIndex] = useState(0);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current location

  const coinIds = [
    'bitcoin', 'ethereum', 'dogecoin', 'cardano', 'ripple', 'polkadot', 'litecoin', 'chainlink', 'stellar', 'uniswap',
    'solana', 'shiba-inu', 'cosmos', 'vechain', 'aave', 'algorand'
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest('.profile-container')) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const fetchCoinData = async (coinId) => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const data = await response.json();
        localStorage.setItem(coinId, JSON.stringify(data));
        setCoinData(data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    const loadData = () => {
      const savedData = localStorage.getItem(coinId);
      if (savedData) {
        setCoinData(JSON.parse(savedData));
      } else {
        fetchCoinData(coinId);
      }
    };

    loadData();
  }, [coinId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % coinIds.length;
        setCoinId(coinIds[nextIndex]);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [coinIds]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleCoinClick = (coinSymbol) => {
    navigate(`/coin/${coinSymbol}`);
  };

  const isCoinPage = location.pathname.startsWith('/coin/'); // Check if the current page is a coin details page

  return (
    <>
      <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="navbar-container">
          <img src="/logo.png" alt="Crypto Logo" className="logo" />
          <ul className={`navbar-menu ${isCoinPage ? 'hidden' : ''}`}>
            <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/exchange">Exchange</a></li>
          </ul>
          <div className={`search-and-profile ${isCoinPage ? 'hidden' : ''}`}>
            <SearchBar />
            <div className="nav-right">
              {isAuthenticated ? (
                <div className="profile-container" onClick={toggleSidebar}>
                  <img src={user.picture} alt="Profile" className="profile-image" />
                  <span className="profile-name">{user.name}</span>
                </div>
              ) : (
                <button className="login-button" onClick={() => loginWithRedirect()}>Login</button>
              )}
            </div>
          </div>
        </div>
        {showSidebar && (
          <div className={`sidebar ${showSidebar ? 'show-sidebar' : ''}`} ref={sidebarRef}>
            <div className="sidebar-content">
              <div className="user-details" onClick={toggleSidebar}>
                <img src={user.picture} alt="Profile" className="profile-image" />
                <p>{user.name}</p>
              </div>
              <hr />
              <ul className="sidebar-menu">
                <li><i className="fas fa-user"></i>Profile</li>
                <li><i className="fas fa-exchange-alt"></i>Exchange</li>
                <li><i className="fas fa-chart-line"></i>Prices</li>
                <li onClick={() => logout({ returnTo: window.location.origin })}>
                  <i className="fas fa-sign-out-alt"></i>Logout
                </li>
              </ul>
              <div className="theme-switch">
                <div className="theme-btn" onClick={toggleTheme}>
                  <span className="material-icons" style={{ color: isDarkMode ? 'white' : 'black' }}>
                    {isDarkMode ? 'dark_mode' : 'light_mode'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className={`grid-container ${isCoinPage ? 'hidden' : ''}`}>
        <div className="grid-item crypto-price-box">
          <img src={coinData.image?.small || '/default-logo.png'} alt={coinData.name || 'Crypto'} className="crypto-logo" />
          <div className="crypto-price-info">
            <span className="crypto-name">{coinData.name || 'Coin Name'}</span>
            <span className="crypto-price">${coinData.market_data?.current_price?.usd?.toFixed(2) || '0.00'}</span>
            <span className={`crypto-change ${coinData.market_data?.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
              {coinData.market_data?.price_change_percentage_24h >= 0 ? '+' : ''}{coinData.market_data?.price_change_percentage_24h?.toFixed(2) || '0.00'}%
            </span>
          </div>
        </div>
        <div className="grid-item">
          <CurrencyConverter />
        </div>
        <div className="grid-item">
          <FundsOverview />
        </div>
      </div>
      <div className={`searchResult ${isCoinPage ? 'hidden' : ''}`}>
        <div className="search-item">
          <CoinChart />
        </div>
        <div className="search-item">
          <News />
        </div>
      </div>
    </>
  );
};

export default Navbar;
