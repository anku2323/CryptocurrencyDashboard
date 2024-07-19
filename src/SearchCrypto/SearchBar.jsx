import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const formattedSearchTerm = searchTerm.toLowerCase();
      const tableDataResponse = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${formattedSearchTerm}&order=market_cap_desc&per_page=1&page=1&sparkline=false`);
      if (!tableDataResponse.ok) throw new Error(`Error: ${tableDataResponse.statusText}`);
      const tableData = await tableDataResponse.json();
      console.log('Table Data:', tableData);

      if (tableData.length === 0) {
        console.error('No data found for the provided coin ID.');
        onSearch({ tableData: [], graphData: {} });
        return;
      }

      const graphDataResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${formattedSearchTerm}/market_chart?vs_currency=usd&days=7`);
      if (!graphDataResponse.ok) throw new Error(`Error: ${graphDataResponse.statusText}`);
      const graphData = await graphDataResponse.json();
      console.log('Graph Data:', graphData);

      onSearch({ tableData, graphData });
    } catch (error) {
      console.error('Error fetching data:', error);
      onSearch({ tableData: [], graphData: {} });
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
