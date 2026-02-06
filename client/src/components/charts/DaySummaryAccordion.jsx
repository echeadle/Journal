import React, { useState } from 'react';
import { TIME_SLOTS, MOOD_SCALE, ENERGY_SCALE } from '../../utils/constants';
import './DaySummaryAccordion.css';

const DaySummaryCard = ({ summary, isExpanded, onToggle }) => {
  const { dayNumber, date, moodAvg, energyAvg, topDescriptors, foodCount, checkInCount, totalSlots } = summary;

  const getMoodEmoji = (score) => MOOD_SCALE[Math.round(score)]?.emoji || '';
  const getEnergyEmoji = (score) => ENERGY_SCALE[Math.round(score)]?.emoji || '';

  const completionPercent = Math.round((checkInCount / totalSlots) * 100);

  return (
    <div className={`day-summary-card ${isExpanded ? 'day-summary-card--expanded' : ''}`}>
      <button className="day-summary-card__header" onClick={onToggle}>
        <div className="day-summary-card__title">
          <span className="day-summary-card__day">Day {dayNumber}</span>
          <span className="day-summary-card__date">{date}</span>
        </div>

        <div className="day-summary-card__stats">
          {moodAvg && (
            <span className="day-summary-card__stat" title="Average Mood">
              {getMoodEmoji(moodAvg)} {moodAvg}
            </span>
          )}
          {energyAvg && (
            <span className="day-summary-card__stat" title="Average Energy">
              {getEnergyEmoji(energyAvg)} {energyAvg}
            </span>
          )}
          {foodCount > 0 && (
            <span className="day-summary-card__stat" title="Meals Logged">
              {foodCount}
            </span>
          )}
        </div>

        <div className="day-summary-card__progress">
          <div className="day-summary-card__progress-bar">
            <div
              className="day-summary-card__progress-fill"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="day-summary-card__progress-text">{completionPercent}%</span>
        </div>

        <span className={`day-summary-card__chevron ${isExpanded ? 'day-summary-card__chevron--up' : ''}`}>

        </span>
      </button>

      {isExpanded && (
        <div className="day-summary-card__content">
          {topDescriptors.length > 0 && (
            <div className="day-summary-card__descriptors">
              <span className="day-summary-card__label">Top moods:</span>
              <div className="day-summary-card__descriptor-list">
                {topDescriptors.map((desc, i) => (
                  <span key={i} className="day-summary-card__descriptor">
                    {desc.emoji} {desc.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="day-summary-card__checkins">
            <span className="day-summary-card__label">Check-ins:</span>
            <div className="day-summary-card__slots">
              {TIME_SLOTS.map(slot => {
                const checkIn = summary.checkIns.find(c => c.timeSlot === slot.id);
                return (
                  <div
                    key={slot.id}
                    className={`day-summary-card__slot ${checkIn ? 'day-summary-card__slot--complete' : ''}`}
                  >
                    <span className="day-summary-card__slot-label">{slot.label}</span>
                    {checkIn ? (
                      <div className="day-summary-card__slot-data">
                        {checkIn.mood?.score && (
                          <span>{getMoodEmoji(checkIn.mood.score)} {checkIn.mood.score}</span>
                        )}
                        {checkIn.energy?.score && (
                          <span>{getEnergyEmoji(checkIn.energy.score)} {checkIn.energy.score}</span>
                        )}
                      </div>
                    ) : (
                      <span className="day-summary-card__slot-empty">Not recorded</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {summary.foodEntries.length > 0 && (
            <div className="day-summary-card__food">
              <span className="day-summary-card__label">Meals:</span>
              <div className="day-summary-card__food-list">
                {summary.foodEntries.map((food, i) => (
                  <div key={i} className="day-summary-card__food-item">
                    <span className="day-summary-card__food-type">{food.type || 'Meal'}</span>
                    {food.foods && food.foods.length > 0 && (
                      <span className="day-summary-card__food-items">
                        {food.foods.join(', ')}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DaySummaryAccordion = ({ summaries }) => {
  const [expandedDay, setExpandedDay] = useState(null);

  if (!summaries || summaries.length === 0) {
    return (
      <div className="chart-empty">
        <p>No daily data available yet.</p>
        <p>Start tracking to see your daily summaries!</p>
      </div>
    );
  }

  const handleToggle = (dayNumber) => {
    setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
  };

  return (
    <div className="day-summary-accordion">
      {summaries.map(summary => (
        <DaySummaryCard
          key={summary.dayNumber}
          summary={summary}
          isExpanded={expandedDay === summary.dayNumber}
          onToggle={() => handleToggle(summary.dayNumber)}
        />
      ))}
    </div>
  );
};

export default DaySummaryAccordion;
