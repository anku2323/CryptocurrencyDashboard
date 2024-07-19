import React, { createContext, useState } from 'react';

const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [currency, setCurrency] = useState({ name: 'usd', symbol: '$' });

  return (
    <CoinContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContext;
