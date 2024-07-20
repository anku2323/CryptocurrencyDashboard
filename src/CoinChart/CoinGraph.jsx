import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './CoinChart.css';

const CoinChart = ({ marketData }) => {
  if (!marketData) {
    return <p>Loading chart...</p>;
  }

  const data = {
    labels: marketData.prices.map((price) => new Date(price[0]).toLocaleDateString()),
    datasets: [
      {
        label: 'Price in USD',
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
          label: (tooltipItem) => `$${tooltipItem.raw.toFixed(2)}`, 
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
          callback: (value) => `$${value.toFixed(2)}`, 
        },
      },
    },
  };

  return (
    <div className="coin-chart">
      <Line data={data} options={options} />
    </div>
  );
};

export default CoinChart;
