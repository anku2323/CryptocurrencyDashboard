import React, { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import SearchBar from "../SearchCrypto/SearchBar";
import "./Navbar.css";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".profile-container")
      ) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebarRef]);

  useEffect(() => {
    // Fetch Bitcoin data by default
    const fetchBitcoinData = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching Bitcoin data:', error);
      }
    };

    fetchBitcoinData();
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleSearchResults = (results) => {
    // If the API returns an array with data, set the first element
    if (Array.isArray(results) && results.length > 0) {
      setSearchResults(results);
    } else {
      setSearchResults([]); // Clear results if no valid data
    }
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
    </>
  );
};

export default Navbar;
