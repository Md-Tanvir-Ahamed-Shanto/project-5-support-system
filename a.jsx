import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  // Sales Data
  const dailySales = [
    { day: 'Mon', sales: 120 },
    { day: 'Tue', sales: 200 },
    { day: 'Wed', sales: 150 },
    { day: 'Thu', sales: 300 },
    { day: 'Fri', sales: 400 },
    { day: 'Sat', sales: 500 },
    { day: 'Sun', sales: 600 },
  ];

  const yearlySales = [
    { name: '2021', value: 15000 },
    { name: '2022', value: 18000 },
    { name: '2023', value: 20000 },
  ];

  // Colors for Pie Chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Sales Report Dashboard</h1>

      {/* Daily Sales (Line Chart) */}
      <div className="p-4 bg-blue-100 rounded shadow mb-6">
        <h2 className="font-semibold text-xl mb-4">Daily Sales</h2>
        <LineChart
          width={500}
          height={300}
          data={dailySales}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="day" />
          <YAxis />
          <CartesianGrid stroke="#f5f5f5" />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </div>

      {/* Yearly Sales (Pie Chart) */}
      <div className="p-4 bg-green-100 rounded shadow mb-6">
        <h2 className="font-semibold text-xl mb-4">Yearly Sales</h2>
        <PieChart width={500} height={300}>
          <Pie
            data={yearlySales}
            cx={200}
            cy={150}
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {yearlySales.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;



<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Line Chart */}
  <div className="p-4 bg-blue-100 rounded shadow">
    <h2 className="font-semibold text-xl mb-4">Daily Sales</h2>
    <LineChart
      width={400}
      height={250}
      data={dailySales}
      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
    >
      <XAxis dataKey="day" />
      <YAxis />
      <CartesianGrid stroke="#f5f5f5" />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  </div>

  {/* Pie Chart */}
  <div className="p-4 bg-green-100 rounded shadow">
    <h2 className="font-semibold text-xl mb-4">Yearly Sales</h2>
    <PieChart width={400} height={250}>
      <Pie
        data={yearlySales}
        cx={200}
        cy={125}
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {yearlySales.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </div>
</div>