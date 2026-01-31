import React, { useState } from 'react';
import { ENERGY_SCALE } from '../../utils/constants';
import './EnergySelector.css';

const EnergySelector = ({ value = {}, onChange }) => {
  const [score, setScore] = useState(value.score || 3);
  const [notes, setNotes] = useState(value.notes || '');

  const handleScoreChange = (newScore) => {
    setScore(newScore);
    onChange({
      score: newScore,
      notes
    });
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onChange({
      score,
      notes: newNotes
    });
  };

  return (
    <div className="energy-selector">
      <div className="energy-selector__section">
        <h3 className="energy-selector__title">
          Energy level: {ENERGY_SCALE[score].label} {ENERGY_SCALE[score].emoji}
        </h3>
        <div className="energy-slider">
          <input
            type="range"
            min="1"
            max="5"
            value={score}
            onChange={(e) => handleScoreChange(Number(e.target.value))}
            className="energy-slider__input"
          />
          <div className="energy-slider__labels">
            {Object.entries(ENERGY_SCALE).map(([key, value]) => (
              <span key={key} className="energy-slider__label">
                {value.emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="energy-selector__section">
        <label className="energy-selector__label">
          Notes about your energy (optional)
        </label>
        <textarea
          className="energy-selector__textarea"
          placeholder="What affects your energy right now?"
          value={notes}
          onChange={handleNotesChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default EnergySelector;
