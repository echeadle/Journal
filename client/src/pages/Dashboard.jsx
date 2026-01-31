import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { formatDisplayDate, isToday, isPast } from '../utils/dateUtils';
import { TIME_SLOTS } from '../utils/constants';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { config, entries, loading, getCompletionStats } = useJournal();

  useEffect(() => {
    if (!config && !loading) {
      navigate('/');
    }
  }, [config, loading, navigate]);

  if (loading || !config) {
    return <div className="dashboard loading">Loading...</div>;
  }

  const stats = getCompletionStats();

  const getEntryProgress = (entry) => {
    const completedCheckIns = entry.checkIns.length;
    const totalCheckIns = TIME_SLOTS.length;
    return {
      completed: completedCheckIns,
      total: totalCheckIns,
      percentage: Math.round((completedCheckIns / totalCheckIns) * 100)
    };
  };

  const getEntryStatus = (entry) => {
    const progress = getEntryProgress(entry);
    if (progress.completed === 0) return 'not-started';
    if (progress.completed === progress.total) return 'completed';
    return 'in-progress';
  };

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <header className="dashboard__header">
          <div>
            <h1 className="dashboard__title">My Health Journal</h1>
            <p className="dashboard__subtitle">
              {formatDisplayDate(config.startDate)} - {formatDisplayDate(config.endDate)}
            </p>
          </div>
          <div className="dashboard__actions">
            <Button variant="outline" onClick={() => navigate('/review')}>
              Review
            </Button>
            <Button variant="primary" onClick={() => navigate('/export')}>
              Export
            </Button>
          </div>
        </header>

        <Card className="dashboard__stats">
          <div className="stats-grid">
            <div className="stat">
              <div className="stat__value">{stats.completedCheckIns}</div>
              <div className="stat__label">Check-ins</div>
            </div>
            <div className="stat">
              <div className="stat__value">{stats.completionPercentage}%</div>
              <div className="stat__label">Complete</div>
            </div>
            <div className="stat">
              <div className="stat__value">{stats.totalFoodEntries}</div>
              <div className="stat__label">Food Entries</div>
            </div>
            <div className="stat">
              <div className="stat__value">{stats.completedDays}/{stats.totalDays}</div>
              <div className="stat__label">Days</div>
            </div>
          </div>
        </Card>

        <div className="dashboard__days">
          {entries.map((entry) => {
            const progress = getEntryProgress(entry);
            const status = getEntryStatus(entry);
            const todayEntry = isToday(entry.date);
            const pastEntry = isPast(entry.date);

            return (
              <Card
                key={entry.id}
                className={`day-card day-card--${status} ${todayEntry ? 'day-card--today' : ''}`}
                onClick={() => navigate(`/checkin/${entry.dayNumber}`)}
              >
                <div className="day-card__header">
                  <div>
                    <h3 className="day-card__title">Day {entry.dayNumber}</h3>
                    <p className="day-card__date">{formatDisplayDate(entry.date)}</p>
                  </div>
                  {todayEntry && <span className="day-card__badge">Today</span>}
                </div>

                <div className="day-card__progress">
                  <div className="progress-bar">
                    <div
                      className="progress-bar__fill"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {progress.completed}/{progress.total} check-ins
                  </span>
                </div>

                <div className="day-card__checkins">
                  {TIME_SLOTS.map((slot) => {
                    const checkIn = entry.checkIns.find(c => c.timeSlot === slot.id);
                    return (
                      <div
                        key={slot.id}
                        className={`checkin-indicator ${checkIn ? 'checkin-indicator--completed' : ''}`}
                        title={slot.label}
                      >
                        {checkIn ? '✓' : '○'}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
