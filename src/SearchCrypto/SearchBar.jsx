import React, { useState } from 'react';
import './SearchBar.css'; // Import the CSS file

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (!searchTerm) return; // Avoid empty searches

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${searchTerm}&order=market_cap_desc&per_page=1&page=1&sparkline=false`);
      const data = await response.json();
      onSearch(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="search-crypto">
      <input
        type="text"
        placeholder="Search Cryptocurrency..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
