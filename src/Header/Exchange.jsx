import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Exchange.css';

const ExchangeRates = () => {
  const [fromCurrency, setFromCurrency] = useState('ETH');
  const [toCurrency, setToCurrency] = useState('USDT');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency, amount]);

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/exchange_rates');
      const rate = response.data.rates[toCurrency.toLowerCase()].value;
      setExchangeRate(rate);
    } catch (error) {
      console.error('Error fetching exchange rates', error);
    }
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div className="exchange-rates-container">
      <h2>Current Exchange Rates</h2>
      <div className="exchange-rates-form">
        <div className="form-group">
          <label htmlFor="from-currency">From</label>
          <select id="from-currency" value={fromCurrency} onChange={handleFromCurrencyChange}>
            <option value="ETH">ETH</option>
            <option value="BTC">BTC</option>
           
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="to-currency">To</label>
          <select id="to-currency" value={toCurrency} onChange={handleToCurrencyChange}>
            <option value="USDT">USDT</option>
            <option value="USD">USD</option>
           
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input type="number" id="amount" value={amount} onChange={handleAmountChange} />
        </div>
      </div>
      <div className="exchange-rates-result">
        {exchangeRate !== null ? (
          <p>
            {amount} {fromCurrency} = {(amount * exchangeRate).toFixed(2)} {toCurrency}
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ExchangeRates;
