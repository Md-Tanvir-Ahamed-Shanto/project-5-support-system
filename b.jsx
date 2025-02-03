import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SalesDashboard = () => {
  const [timeFrame, setTimeFrame] = useState('yearly');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sales Report Dashboard
        </h1>

        {/* Time Frame Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white shadow-md rounded-lg p-2 flex">
            {['daily', 'weekly', 'yearly'].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeFrame(frame)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeFrame === frame 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SalesLineChart timeFrame={timeFrame} />
          <CategoryPieChart />
          <RevenueLineChart timeFrame={timeFrame} />
          <UserReactionCard />
          <TopProductsCard />
          <RegionalSalesPieChart />
        </div>
      </div>
    </div>
  );
};

// Sales Line Chart
const SalesLineChart = ({ timeFrame }) => {
  const getData = () => {
    switch (timeFrame) {
      case 'daily':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [65, 59, 80, 81, 56, 55, 40]
        };
      case 'weekly':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [280, 320, 290, 350]
        };
      case 'yearly':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          data: [2800, 3200, 2900, 3500, 3800, 3600, 3900, 4000, 4200, 4400, 4600, 4800]
        };
      default:
        return { labels: [], data: [] };
    }
  };

  const chartData = getData();

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Sales',
        data: chartData.data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Sales Trend (${timeFrame})`
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Line data={data} options={options} />
    </div>
  );
};

// Category Pie Chart
const CategoryPieChart = () => {
  const data = {
    labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Others'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Sales by Category'
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Pie data={data} options={options} />
    </div>
  );
};

// Regional Sales Pie Chart
const RegionalSalesPieChart = () => {
  const data = {
    labels: ['North', 'South', 'East', 'West', 'Central'],
    datasets: [
      {
        data: [35, 20, 15, 20, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Regional Sales Distribution'
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Pie data={data} options={options} />
    </div>
  );
};

// Revenue Line Chart
const RevenueLineChart = ({ timeFrame }) => {
  const getData = () => {
    switch (timeFrame) {
      case 'daily':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [1200, 1900, 1500, 1800, 2000, 2200, 1800]
        };
      case 'weekly':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [8000, 9500, 8900, 9800]
        };
      case 'yearly':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          data: [95000, 98000, 102000, 105000, 108000, 110000, 112000, 115000, 118000, 120000, 122000, 125000]
        };
      default:
        return { labels: [], data: [] };
    }
  };

  const chartData = getData();

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: chartData.data,
        fill: false,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Revenue Trend (${timeFrame})`
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Line data={data} options={options} />
    </div>
  );
};

// User Reaction Card (from previous example)
const UserReactionCard = () => {
  const reactions = [
    { type: 'Like', count: 4567, color: 'bg-blue-500' },
    { type: 'Share', count: 2345, color: 'bg-green-500' },
    { type: 'Comment', count: 1890, color: 'bg-purple-500' }
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        User Reactions
      </h2>
      <div className="space-y-3">
        {reactions.map((reaction) => (
          <div key={reaction.type} className="flex items-center">
            <div className={`w-10 h-10 ${reaction.color} rounded-full mr-4 flex items-center justify-center text-white`}>
              {reaction.type[0]}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{reaction.type}</div>
              <div className="text-gray-500">{reaction.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Top Products Card
const TopProductsCard = () => {
  const products = [
    { name: 'Product A', sales: 1234, growth: '+15%' },
    { name: 'Product B', sales: 956, growth: '+12%' },
    { name: 'Product C', sales: 823, growth: '+8%' },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Top Products
      </h2>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.name} className="flex justify-between items-center">
            <span className="font-medium">{product.name}</span>
            <div className="text-right">
              <div className="text-gray-900">{product.sales} sales</div>
              <div className="text-green-500 text-sm">{product.growth}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesDashboard;