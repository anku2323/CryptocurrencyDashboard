import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import './CoinChart.css';

const CoinChart = ({ coinId = 'bitcoin', targetCoinId = 'dogecoin' }) => {
  const [marketData, setMarketData] = useState(null);
  const [currency, setCurrency] = useState('usd');
  const [timePeriod, setTimePeriod] = useState('1d');
  const [conversionRate, setConversionRate] = useState(0);
  
  const timeRanges = {
    '1d': 1,
    '1m': 30,
    '6m': 180,
    '1y': 365,
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const endDate = Math.floor(Date.now() / 1000); 
        const startDate = endDate - timeRanges[timePeriod] * 24 * 60 * 60; 

       
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range`,
          {
            params: {
              vs_currency: currency,
              from: startDate,
              to: endDate,
            },
          }
        );

        setMarketData(response.data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
  }, [coinId, currency, timePeriod]);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price`,
          {
            params: {
              ids: `${coinId},${targetCoinId}`,
              vs_currencies: currency,
            },
          }
        );

        if (response.data[coinId] && response.data[targetCoinId]) {
          setConversionRate(response.data[targetCoinId][currency] / response.data[coinId][currency]);
        }
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    fetchConversionRate();
  }, [coinId, targetCoinId, currency]);

  if (!marketData || !marketData.prices || marketData.prices.length === 0) {
    return <p>Loading chart...</p>;
  }

  const data = {
    labels: marketData.prices.map((price) => new Date(price[0]).toLocaleTimeString()),
    datasets: [
      {
        label: `Price in ${currency.toUpperCase()}`,
        data: marketData.prices.map((price) => price[1]),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${currency === 'usd' ? '$' : currency.toUpperCase()}${tooltipItem.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        ticks: {
          callback: (value) => `${currency === 'usd' ? '$' : currency.toUpperCase()}${value.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className="coin-chart">
      <div className="chart-controls">
        <div className="currency-selector">
          <label>
            Currency:
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="usd">USD</option>
              <option value="inr">INR</option>
              <option value="eur">EUR</option>
            </select>
          </label>
        </div>
        <div className="time-selector">
          <button onClick={() => setTimePeriod('1d')} className={timePeriod === '1d' ? 'active' : ''}>1 Day</button>
          <button onClick={() => setTimePeriod('1m')} className={timePeriod === '1m' ? 'active' : ''}>1 Month</button>
          <button onClick={() => setTimePeriod('6m')} className={timePeriod === '6m' ? 'active' : ''}>6 Months</button>
          <button onClick={() => setTimePeriod('1y')} className={timePeriod === '1y' ? 'active' : ''}>1 Year</button>
        </div>
      </div>
      <Line data={data} options={options} />
      <div className="conversion-info">
       
      </div>
    </div>
  );
};

export default CoinChart;
