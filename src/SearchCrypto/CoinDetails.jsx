import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './CoinDetails.css';

const CoinDetails = () => {
  const { coinSymbol } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const localStorageCoinData = localStorage.getItem(`coinData-${coinSymbol}`);
        const localStorageHistoricalData = localStorage.getItem(`historicalData-${coinSymbol}`);

        if (localStorageCoinData && localStorageHistoricalData) {
          setCoinData(JSON.parse(localStorageCoinData));
          setHistoricalData(JSON.parse(localStorageHistoricalData));
        } else {
          const [coinResponse, historyResponse] = await Promise.all([
            axios.get(`https://api.coingecko.com/api/v3/coins/${coinSymbol}`, {
              params: { localization: 'false' },
            }),
            axios.get(`https://api.coingecko.com/api/v3/coins/${coinSymbol}/market_chart?vs_currency=usd&days=7`)
          ]);

          const coinData = coinResponse.data;
          const historicalData = historyResponse.data.prices.map(price => ({
            date: new Date(price[0]).toLocaleDateString(),
            price: price[1]
          }));

          setCoinData(coinData);
          setHistoricalData(historicalData);

          localStorage.setItem(`coinData-${coinSymbol}`, JSON.stringify(coinData));
          localStorage.setItem(`historicalData-${coinSymbol}`, JSON.stringify(historicalData));
        }
      } catch (error) {
        setError('Error fetching coin data');
        console.error('Error fetching coin data:', error);
      }
    };

    fetchCoinData();
  }, [coinSymbol]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!coinData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`coin-details ${coinSymbol}`}>
      <div className="coin-header">
        <img src={coinData.image.large} alt={coinData.name} className="coin-image" />
        <h1>{coinData.name} <span className="coin-symbol">({coinData.symbol.toUpperCase()})</span></h1>
      </div>
      
      <div className="price-info">
        <div className="price-card">
          <h3>Current Price</h3>
          <p className="price">${coinData.market_data.current_price.usd.toLocaleString()}</p>
        </div>
        <div className="price-card">
          <h3>Market Cap</h3>
          <p>${coinData.market_data.market_cap.usd.toLocaleString()}</p>
        </div>
        <div className="price-card">
          <h3>24h Change</h3>
          <p className={coinData.market_data.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
            {coinData.market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="price-details">
        <p><strong>24h High:</strong> ${coinData.market_data.high_24h.usd.toLocaleString()}</p>
        <p><strong>24h Low:</strong> ${coinData.market_data.low_24h.usd.toLocaleString()}</p>
      </div>
      
      <div className="chart-container">
        <h2>Price History (7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoinDetails;
