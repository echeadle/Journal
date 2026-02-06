import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';
import './EatingWindowChart.css';

const formatTime = (decimalHours) => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__title">Day {data.dayNumber}</p>
        <p className="chart-tooltip__date">{data.date}</p>
        <div className="chart-tooltip__meals">
          <p>First meal: {formatTime(data.firstMealTime)}</p>
          <p>Last meal: {formatTime(data.lastMealTime)}</p>
        </div>
        <p className="chart-tooltip__value chart-tooltip__value--window">
          {data.windowHours} hour eating window
        </p>
        <p className="chart-tooltip__detail">
          {data.mealCount} meal{data.mealCount !== 1 ? 's' : ''} logged
        </p>
      </div>
    );
  }
  return null;
};

const EatingWindowChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No meal data available yet.</p>
        <p>Log your meals to see your eating window patterns!</p>
      </div>
    );
  }

  // Transform data for stacked bar visualization
  const chartData = data.map(d => ({
    ...d,
    beforeFirst: d.firstMealTime,
    eatingWindow: d.lastMealTime - d.firstMealTime,
    displayWindow: d.windowHours
  }));

  return (
    <div className="eating-window-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis
            type="number"
            domain={[0, 24]}
            ticks={[6, 9, 12, 15, 18, 21]}
            tickFormatter={(value) => {
              const period = value >= 12 ? 'PM' : 'AM';
              const displayHours = value > 12 ? value - 12 : (value === 0 ? 12 : value);
              return `${displayHours}${period}`;
            }}
            stroke="#6B6B6B"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="dayNumber"
            tickFormatter={(value) => `Day ${value}`}
            stroke="#6B6B6B"
            fontSize={12}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={12} stroke="#E5E5E5" strokeDasharray="5 5" />
          <Bar dataKey="beforeFirst" stackId="a" fill="transparent" />
          <Bar dataKey="eatingWindow" stackId="a" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#98D8C8" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="eating-window-chart__legend">
        <span className="legend-item">
          <span className="legend-color" style={{ background: '#98D8C8' }}></span>
          Eating Window
        </span>
      </div>
    </div>
  );
};

export default EatingWindowChart;
