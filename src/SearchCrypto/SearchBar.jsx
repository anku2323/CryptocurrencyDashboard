import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim()) {
        try {
          const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
          const filteredSuggestions = response.data.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSuggestions(filteredSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const handleSuggestionClick = (symbol) => {
    navigate(`/coin/${symbol.toLowerCase()}`);
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/coin/${searchTerm.toLowerCase()}`);
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-crypto">
      <input
        type="text"
        placeholder="Search Cryptocurrency..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay hiding suggestions to allow click
      />
      <button onClick={handleSearch}>Search</button>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion.symbol)}>
              {suggestion.name} ({suggestion.symbol.toUpperCase()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
