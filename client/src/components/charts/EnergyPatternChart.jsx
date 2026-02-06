import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ENERGY_SCALE } from '../../utils/constants';
import './EnergyPatternChart.css';

const getEnergyColor = (score) => {
  if (score >= 4) return '#32CD32';
  if (score >= 3) return '#87CEEB';
  if (score >= 2) return '#FFB347';
  return '#B0C4DE';
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const energyLabel = ENERGY_SCALE[Math.round(data.avgEnergyScore)]?.label || '';
    const energyEmoji = ENERGY_SCALE[Math.round(data.avgEnergyScore)]?.emoji || '';

    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__title">Day {data.dayNumber}</p>
        <p className="chart-tooltip__date">{data.date}</p>
        <p className="chart-tooltip__value chart-tooltip__value--energy">
          {energyEmoji} {data.avgEnergyScore} - {energyLabel}
        </p>
        <p className="chart-tooltip__detail">
          {data.checkInCount} check-in{data.checkInCount !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const EnergyPatternChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No energy data available yet.</p>
        <p>Complete some check-ins to see your energy patterns!</p>
      </div>
    );
  }

  return (
    <div className="energy-pattern-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis
            dataKey="dayNumber"
            tickFormatter={(value) => `Day ${value}`}
            stroke="#6B6B6B"
            fontSize={12}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value) => ENERGY_SCALE[value]?.emoji || value}
            stroke="#6B6B6B"
            fontSize={14}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avgEnergyScore" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getEnergyColor(entry.avgEnergyScore)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyPatternChart;
