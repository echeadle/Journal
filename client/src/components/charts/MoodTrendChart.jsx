import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { MOOD_SCALE } from '../../utils/constants';
import './MoodTrendChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const moodLabel = MOOD_SCALE[Math.round(data.avgMoodScore)]?.label || '';
    const moodEmoji = MOOD_SCALE[Math.round(data.avgMoodScore)]?.emoji || '';

    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__title">Day {data.dayNumber}</p>
        <p className="chart-tooltip__date">{data.date}</p>
        <p className="chart-tooltip__value">
          {moodEmoji} {data.avgMoodScore} - {moodLabel}
        </p>
        <p className="chart-tooltip__detail">
          {data.checkInCount} check-in{data.checkInCount !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const MoodTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No mood data available yet.</p>
        <p>Complete some check-ins to see your mood trends!</p>
      </div>
    );
  }

  return (
    <div className="mood-trend-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
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
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tickFormatter={(value) => MOOD_SCALE[value]?.emoji || value}
            stroke="#6B6B6B"
            fontSize={14}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={3} stroke="#E5E5E5" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="avgMoodScore"
            stroke="#FFB347"
            strokeWidth={3}
            dot={{ fill: '#FFB347', strokeWidth: 2, r: 6 }}
            activeDot={{ fill: '#FFB347', strokeWidth: 2, r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTrendChart;
