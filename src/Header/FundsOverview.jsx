import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import './Portfolio.css';

const data = [
  { name: 'Bitcoin', value: 375 },
  { name: 'Dogecoin', value: 375 },
  { name: 'Ethereum', value: 250 },
];

const COLORS = ['#A0A0A0', '#0000FF', '#008000'];

const Portfolio = () => {
  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h2>Portfolio Overview</h2>
        <p className="total-value">Total Value: <span>$1000</span></p>
      </div>
      <div className="portfolio-chart-wrapper">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx={200}
            cy={200}
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `$${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend
            wrapperStyle={{
              bottom: -10,
              left: 0,
              right: 0,
              textAlign: 'center',
              width: '80px',
            }}
          />
        </PieChart>
      </div>
    </div>
  );
};

export default Portfolio;
