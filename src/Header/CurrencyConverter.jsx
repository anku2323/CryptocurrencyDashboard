import React, { useState, useEffect } from 'react';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [cryptoRates, setCryptoRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('usd');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    console.log('CurrencyConverter component mounted');

    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch('https://pro-api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,inr', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-cg-pro-api-key': 'CG-QAemoKBvKKWT6byuC6WWtfdU'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Crypto Prices Data:', data); // Debugging
        setCryptoRates(data);
      } catch (error) {
        console.error('Error fetching cryptocurrency prices:', error);
      }
    };

    fetchCryptoPrices();
  }, []);

  useEffect(() => {
    console.log('Converting amount:', amount, 'from', fromCurrency, 'to', toCurrency);

    if (cryptoRates[fromCurrency] && cryptoRates[fromCurrency][toCurrency]) {
      const cryptoPrice = cryptoRates[fromCurrency][toCurrency];
      const converted = amount * cryptoPrice;
      setConvertedAmount(converted);
    }
  }, [cryptoRates, fromCurrency, toCurrency, amount]);

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <div className="currency-converter">
      <h2>Currency Converter</h2>
      <div className="converter-box">
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          className="amount-input"
        />
        <select
          value={fromCurrency}
          onChange={handleFromCurrencyChange}
          className="currency-select"
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
        </select>
        <span className="arrow">→</span>
        <select
          value={toCurrency}
          onChange={handleToCurrencyChange}
          className="currency-select"
        >
          <option value="usd">USD</option>
          <option value="inr">INR</option>
        </select>
      </div>
      {convertedAmount !== null && (
        <div className="converted-amount">
          Converted Amount: {convertedAmount.toFixed(2)} {toCurrency.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
