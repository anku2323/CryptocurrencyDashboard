import React from 'react';
import './CoinTable.css';

const CoinTable = ({ coinData }) => {
  if (!coinData || coinData.length === 0) {
    return <p>No coin data available.</p>;
  }

  return (
    <div className="coin-table">
      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Current Price</th>
            <th>Market Cap</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {coinData.map((coin) => (
            <tr key={coin.id}>
              <td>
                <img src={coin.image} alt={coin.name} height="30" style={{ marginRight: '10px' }} />
                {coin.name}
              </td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td
                style={{
                  color: coin.price_change_percentage_24h < 0 ? 'red' : 'green',
                }}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
