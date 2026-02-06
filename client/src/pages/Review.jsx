import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import {
  MoodTrendChart,
  EnergyPatternChart,
  EatingWindowChart,
  MoodDescriptorChart,
  DaySummaryAccordion,
  DateRangeSelector
} from '../components/charts';
import {
  getMoodTrendData,
  getEnergyPatternData,
  getEatingWindowData,
  getMoodDescriptorFrequency,
  getDailySummaries,
  filterEntriesByDateRange,
  getOverallStats
} from '../utils/analyticsUtils';
import './Review.css';

const StatCard = ({ label, value, emoji }) => (
  <div className="review__stat-card">
    <span className="review__stat-emoji">{emoji}</span>
    <span className="review__stat-value">{value}</span>
    <span className="review__stat-label">{label}</span>
  </div>
);

const Review = () => {
  const navigate = useNavigate();
  const { entries, config, loading } = useJournal();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null, preset: 'all' });

  const filteredEntries = useMemo(() => {
    return filterEntriesByDateRange(entries, dateRange.startDate, dateRange.endDate);
  }, [entries, dateRange]);

  const moodTrendData = useMemo(() => getMoodTrendData(filteredEntries), [filteredEntries]);
  const energyPatternData = useMemo(() => getEnergyPatternData(filteredEntries), [filteredEntries]);
  const eatingWindowData = useMemo(() => getEatingWindowData(filteredEntries), [filteredEntries]);
  const moodDescriptorData = useMemo(() => getMoodDescriptorFrequency(filteredEntries), [filteredEntries]);
  const dailySummaries = useMemo(() => getDailySummaries(filteredEntries), [filteredEntries]);
  const overallStats = useMemo(() => getOverallStats(filteredEntries), [filteredEntries]);

  if (loading) {
    return (
      <div className="review">
        <div className="review__container">
          <div className="review__loading">Loading your data...</div>
        </div>
      </div>
    );
  }

  if (!config || !entries || entries.length === 0) {
    return (
      <div className="review">
        <div className="review__container">
          <header className="review__header">
            <h1 className="review__title">Review & Visualizations</h1>
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </header>
          <div className="review__empty">
            <p>No journal data available yet.</p>
            <p>Start tracking to see your visualizations!</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'mood', label: 'Mood' },
    { id: 'energy', label: 'Energy' },
    { id: 'eating', label: 'Eating' },
    { id: 'daily', label: 'Daily View' }
  ];

  return (
    <div className="review">
      <div className="review__container">
        <header className="review__header">
          <h1 className="review__title">Review & Visualizations</h1>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </header>

        <DateRangeSelector
          entries={entries}
          selectedRange={dateRange}
          onRangeChange={setDateRange}
        />

        <nav className="review__tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`review__tab ${activeTab === tab.id ? 'review__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="review__content">
          {activeTab === 'overview' && (
            <div className="review__overview">
              {overallStats && (
                <div className="review__stats-grid">
                  <StatCard
                    label="Avg Mood"
                    value={overallStats.avgMood || '-'}
                    emoji={overallStats.avgMood ? (overallStats.avgMood >= 4 ? '' : overallStats.avgMood >= 3 ? '' : '') : ''}
                  />
                  <StatCard
                    label="Avg Energy"
                    value={overallStats.avgEnergy || '-'}
                    emoji={overallStats.avgEnergy ? (overallStats.avgEnergy >= 4 ? '' : overallStats.avgEnergy >= 3 ? '' : '') : ''}
                  />
                  <StatCard
                    label="Check-ins"
                    value={overallStats.totalCheckIns}
                    emoji=""
                  />
                  <StatCard
                    label="Meals Logged"
                    value={overallStats.totalFoodEntries}
                    emoji=""
                  />
                </div>
              )}

              <div className="review__charts-grid">
                <Card className="review__chart-card">
                  <h3 className="review__chart-title">Mood Trend</h3>
                  <MoodTrendChart data={moodTrendData} />
                </Card>

                <Card className="review__chart-card">
                  <h3 className="review__chart-title">Energy Pattern</h3>
                  <EnergyPatternChart data={energyPatternData} />
                </Card>
              </div>

              <Card className="review__chart-card">
                <h3 className="review__chart-title">Mood Descriptors</h3>
                <MoodDescriptorChart data={moodDescriptorData} />
              </Card>
            </div>
          )}

          {activeTab === 'mood' && (
            <div className="review__mood">
              <Card className="review__chart-card">
                <h3 className="review__chart-title">Mood Over Time</h3>
                <p className="review__chart-description">
                  Track how your average daily mood has changed throughout your journal period.
                </p>
                <MoodTrendChart data={moodTrendData} />
              </Card>

              <Card className="review__chart-card">
                <h3 className="review__chart-title">Mood Descriptors</h3>
                <p className="review__chart-description">
                  See which mood descriptors you've selected most frequently.
                </p>
                <MoodDescriptorChart data={moodDescriptorData} />
              </Card>
            </div>
          )}

          {activeTab === 'energy' && (
            <div className="review__energy">
              <Card className="review__chart-card">
                <h3 className="review__chart-title">Daily Energy Levels</h3>
                <p className="review__chart-description">
                  View your average energy levels for each day of your journal.
                </p>
                <EnergyPatternChart data={energyPatternData} />
              </Card>
            </div>
          )}

          {activeTab === 'eating' && (
            <div className="review__eating">
              <Card className="review__chart-card">
                <h3 className="review__chart-title">Eating Window</h3>
                <p className="review__chart-description">
                  Visualize when you started and stopped eating each day. This helps identify your fasting patterns.
                </p>
                <EatingWindowChart data={eatingWindowData} />
              </Card>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="review__daily">
              <Card className="review__chart-card">
                <h3 className="review__chart-title">Day-by-Day Summary</h3>
                <p className="review__chart-description">
                  Expand each day to see detailed check-in information.
                </p>
                <DaySummaryAccordion summaries={dailySummaries} />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
