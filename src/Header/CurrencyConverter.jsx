import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrencyConverter.css'; 

const CurrencyConverter = () => {
  const [value, setValue] = useState('');
  const [cryptoCurrency, setCryptoCurrency] = useState('bitcoin');
  const [targetCurrency, setTargetCurrency] = useState('usd');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cryptoList, setCryptoList] = useState([]);

  useEffect(() => {

    const fetchCryptoList = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        setCryptoList(response.data);
      } catch (error) {
        setError('Failed to fetch cryptocurrency list.');
      }
    };
    fetchCryptoList();
  }, []);

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoCurrency}`);
      const price = response.data.market_data.current_price[targetCurrency];
      const result = value * price;
      setConvertedAmount(result.toFixed(2));
    } catch (error) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="converter-container">
      <h2>Currency Converter</h2>
      <div className="form-group">
        <label>
          Enter Value:
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="input-field"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Select Cryptocurrency:
          <select
            value={cryptoCurrency}
            onChange={(e) => setCryptoCurrency(e.target.value)}
            className="select-field"
          >
            {cryptoList.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          Select Target Currency:
          <select
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            className="select-field"
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="inr">INR</option>
            {/* Add more options as needed */}
          </select>
        </label>
      </div>
      <button onClick={handleConvert} className="convert-button" disabled={loading}>
        {loading ? <span className="loading-spinner"></span> : 'Convert'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {convertedAmount !== null && !loading && (
        <div className="result">
          <h3>Converted Amount:</h3>
          <p>{convertedAmount} {targetCurrency.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
