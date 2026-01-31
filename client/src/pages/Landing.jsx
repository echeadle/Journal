import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { DEFAULT_JOURNAL_DURATION } from '../utils/constants';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { config, createJournal, loading } = useJournal();
  const [showConfig, setShowConfig] = useState(false);
  const [duration, setDuration] = useState(DEFAULT_JOURNAL_DURATION);

  useEffect(() => {
    if (config && !loading) {
      navigate('/dashboard');
    }
  }, [config, loading, navigate]);

  const handleStart = () => {
    setShowConfig(true);
  };

  const handleCreateJournal = () => {
    createJournal(duration);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="landing">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="landing">
      <div className="landing__hero">
        <div className="landing__hero-content">
          <h1 className="landing__title">
            Your Health Journey Starts Here 🌟
          </h1>
          <p className="landing__subtitle">
            Track your mood, energy, and meals with a cheerful companion.
            Generate professional reports to share with your healthcare provider.
          </p>

          {!showConfig ? (
            <Button
              variant="primary"
              size="large"
              onClick={handleStart}
              className="landing__cta"
            >
              Start My Journal
            </Button>
          ) : (
            <Card className="landing__config-card">
              <h3 className="landing__config-title">
                How many days would you like to track?
              </h3>
              <div className="landing__config-input">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="landing__days-input"
                />
                <span className="landing__days-label">days</span>
              </div>
              <div className="landing__config-actions">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfig(false)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateJournal}
                >
                  Create Journal
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="landing__features">
          <div className="landing__feature">
            <div className="landing__feature-icon">😊</div>
            <h3 className="landing__feature-title">Track Your Mood</h3>
            <p className="landing__feature-text">
              Record how you feel throughout the day with simple, visual tools
            </p>
          </div>

          <div className="landing__feature">
            <div className="landing__feature-icon">⚡</div>
            <h3 className="landing__feature-title">Monitor Energy</h3>
            <p className="landing__feature-text">
              Track your energy levels and identify patterns over time
            </p>
          </div>

          <div className="landing__feature">
            <div className="landing__feature-icon">🍽️</div>
            <h3 className="landing__feature-title">Log Your Meals</h3>
            <p className="landing__feature-text">
              Keep track of what and when you eat, including fasting periods
            </p>
          </div>

          <div className="landing__feature">
            <div className="landing__feature-icon">📊</div>
            <h3 className="landing__feature-title">Professional Reports</h3>
            <p className="landing__feature-text">
              Generate PDF and Excel reports to share with your doctor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
