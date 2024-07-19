import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import SearchBar from '../SearchCrypto/SearchBar';
import CoinTable from '../CoinTable/CoinTable';
import CoinChart from '../CoinChart/CoinGraph';
import './Navbar.css';

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [marketData, setMarketData] = useState(null);
  const sidebarRef = useRef(null);

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
  }, [sidebarRef]);

  useEffect(() => {
    const fetchDefaultData = async () => {
      try {
        const tableDataResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin');
        const tableData = await tableDataResponse.json();
        console.log('Default Table Data:', tableData);

        const graphDataResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7');
        const graphData = await graphDataResponse.json();
        console.log('Default Graph Data:', graphData);

        setSearchResults(tableData);
        setMarketData(graphData);
      } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
      }
    };

    fetchDefaultData();
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSearchResults = ({ tableData, graphData }) => {
    if (tableData.length === 0) {
      console.log('No data returned from search');
      setSearchResults([]);
      setMarketData(null);
      return;
    }

    setSearchResults(tableData);
    setMarketData(graphData);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <img src="/logo.png" alt="Crypto Logo" className="logo" />
          <ul className="navbar-menu">
            <li><a href="/">Home</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/exchange">Exchange</a></li>
          </ul>
          <div className="search-and-profile">
            <SearchBar onSearch={handleSearchResults} />
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
              <div className="user-details">
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
            </div>
          </div>
        )}
      </nav>
      <div className="search-results-container">
        {searchResults.length > 0 ? (
          <div className="search-results">
            {searchResults.map((coin) => (
              <div key={coin.id} className="search-result-item">
                <img src={coin.image} alt={coin.name} height="50" />
                <div>
                  <div><strong>{coin.name}</strong> ({coin.symbol.toUpperCase()})</div>
                  <div>Price: ${coin.current_price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found</p>
        )}
      </div>
      <div className="market-data-container">
        {searchResults.length > 0 && <CoinTable coinData={searchResults} />}
        {marketData && <CoinChart marketData={marketData} />}
      </div>
    </>
  );
};

export default Navbar;
