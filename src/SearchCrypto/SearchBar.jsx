import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    console.log('Searching for:', searchTerm);

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${searchTerm}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.id) {
        const graphResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${data.id}/market_chart?vs_currency=usd&days=7`);
        if (!graphResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const graphData = await graphResponse.json();
        console.log('Search Results:', { tableData: [data], graphData });
        onSearch({ tableData: [data], graphData });
      } else {
        onSearch({ tableData: [], graphData: null });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      onSearch({ tableData: [], graphData: null });
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
