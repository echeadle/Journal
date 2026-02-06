import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import './MoodDescriptorChart.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__title">
          {data.emoji} {data.label}
        </p>
        <p className="chart-tooltip__value" style={{ color: data.color }}>
          {data.count} time{data.count !== 1 ? 's' : ''} ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => {
  return (
    <div className="mood-descriptor-legend">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="mood-descriptor-legend__item">
          <span
            className="mood-descriptor-legend__color"
            style={{ background: entry.color }}
          />
          <span className="mood-descriptor-legend__emoji">{entry.payload.emoji}</span>
          <span className="mood-descriptor-legend__label">{entry.payload.label}</span>
          <span className="mood-descriptor-legend__count">{entry.payload.count}</span>
        </div>
      ))}
    </div>
  );
};

const MoodDescriptorChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No mood descriptor data available yet.</p>
        <p>Select mood descriptors during check-ins to see your patterns!</p>
      </div>
    );
  }

  return (
    <div className="mood-descriptor-chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodDescriptorChart;
