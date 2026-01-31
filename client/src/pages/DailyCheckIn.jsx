import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJournal } from '../context/JournalContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import MoodSelector from '../components/journal/MoodSelector';
import EnergySelector from '../components/journal/EnergySelector';
import FoodEntryForm from '../components/journal/FoodEntryForm';
import { TIME_SLOTS } from '../utils/constants';
import { formatDisplayDate } from '../utils/dateUtils';
import './DailyCheckIn.css';

const DailyCheckIn = () => {
  const { dayNumber } = useParams();
  const navigate = useNavigate();
  const { getEntryByDay, addCheckIn, addFoodEntry } = useJournal();

  const [entry, setEntry] = useState(null);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [moodData, setMoodData] = useState({});
  const [energyData, setEnergyData] = useState({});

  useEffect(() => {
    const journalEntry = getEntryByDay(Number(dayNumber));
    if (journalEntry) {
      setEntry(journalEntry);
      if (!currentSlot) {
        setCurrentSlot(TIME_SLOTS[0]);
      }
    } else {
      navigate('/dashboard');
    }
  }, [dayNumber, getEntryByDay, navigate]);

  if (!entry) {
    return <div className="daily-checkin loading">Loading...</div>;
  }

  const existingCheckIn = entry.checkIns.find(c => c.timeSlot === currentSlot?.id);

  const handleSaveCheckIn = () => {
    const checkInData = {
      timeSlot: currentSlot.id
    };

    if (currentSlot.tracks.includes('mood')) {
      checkInData.mood = moodData;
    }

    if (currentSlot.tracks.includes('energy')) {
      checkInData.energy = energyData;
    }

    addCheckIn(entry.id, checkInData);

    // Move to next slot or go back to dashboard
    const currentIndex = TIME_SLOTS.findIndex(s => s.id === currentSlot.id);
    if (currentIndex < TIME_SLOTS.length - 1) {
      setCurrentSlot(TIME_SLOTS[currentIndex + 1]);
      setMoodData({});
      setEnergyData({});
    } else {
      navigate('/dashboard');
    }
  };

  const handleAddFood = (foodData) => {
    addFoodEntry(entry.id, foodData);
  };

  const handleBack = () => {
    const currentIndex = TIME_SLOTS.findIndex(s => s.id === currentSlot.id);
    if (currentIndex > 0) {
      setCurrentSlot(TIME_SLOTS[currentIndex - 1]);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    const currentIndex = TIME_SLOTS.findIndex(s => s.id === currentSlot.id);
    if (currentIndex < TIME_SLOTS.length - 1) {
      setCurrentSlot(TIME_SLOTS[currentIndex + 1]);
      setMoodData({});
      setEnergyData({});
    } else {
      navigate('/dashboard');
    }
  };

  const canSave = () => {
    if (currentSlot.tracks.includes('mood') && !moodData.score) {
      return false;
    }
    if (currentSlot.tracks.includes('energy') && !energyData.score) {
      return false;
    }
    return true;
  };

  return (
    <div className="daily-checkin">
      <div className="daily-checkin__container">
        <header className="daily-checkin__header">
          <div>
            <h1 className="daily-checkin__title">Day {entry.dayNumber}</h1>
            <p className="daily-checkin__subtitle">{formatDisplayDate(entry.date)}</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </header>

        <div className="daily-checkin__progress">
          {TIME_SLOTS.map((slot, index) => (
            <div
              key={slot.id}
              className={`progress-step ${slot.id === currentSlot?.id ? 'progress-step--active' : ''} ${
                entry.checkIns.find(c => c.timeSlot === slot.id) ? 'progress-step--completed' : ''
              }`}
              onClick={() => setCurrentSlot(slot)}
            >
              <div className="progress-step__number">{index + 1}</div>
              <div className="progress-step__label">{slot.label}</div>
            </div>
          ))}
        </div>

        {currentSlot && (
          <Card className="daily-checkin__main">
            <div className="checkin-header">
              <h2 className="checkin-header__title">{currentSlot.label}</h2>
              <p className="checkin-header__description">{currentSlot.description}</p>
              {existingCheckIn && (
                <div className="checkin-header__notice">
                  ✓ You've already completed this check-in
                </div>
              )}
            </div>

            <div className="checkin-content">
              {currentSlot.tracks.includes('mood') && (
                <div className="checkin-section">
                  <h3 className="checkin-section__title">Mood</h3>
                  <MoodSelector value={moodData} onChange={setMoodData} />
                </div>
              )}

              {currentSlot.tracks.includes('energy') && (
                <div className="checkin-section">
                  <h3 className="checkin-section__title">Energy</h3>
                  <EnergySelector value={energyData} onChange={setEnergyData} />
                </div>
              )}

              {currentSlot.tracks.includes('food') && (
                <div className="checkin-section">
                  <h3 className="checkin-section__title">Food Entry</h3>
                  <FoodEntryForm onSubmit={handleAddFood} />
                  {entry.foodEntries.length > 0 && (
                    <div className="food-list">
                      <h4 className="food-list__title">Today's Food Entries:</h4>
                      {entry.foodEntries.map((food) => (
                        <div key={food.id} className="food-item">
                          <div className="food-item__foods">
                            {food.foods.join(', ')}
                          </div>
                          {food.notes && (
                            <div className="food-item__notes">{food.notes}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="checkin-actions">
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
              <div className="checkin-actions__right">
                <Button variant="outline" onClick={handleSkip}>
                  Skip
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveCheckIn}
                  disabled={!canSave()}
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyCheckIn;
