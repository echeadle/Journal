import React, { useState } from 'react';
import { MOOD_DESCRIPTORS, MOOD_SCALE } from '../../utils/constants';
import './MoodSelector.css';

const MoodSelector = ({ value = {}, onChange }) => {
  const [selectedDescriptors, setSelectedDescriptors] = useState(value.descriptors || []);
  const [score, setScore] = useState(value.score || 3);
  const [notes, setNotes] = useState(value.notes || '');

  const handleDescriptorToggle = (descriptorId) => {
    const updated = selectedDescriptors.includes(descriptorId)
      ? selectedDescriptors.filter(id => id !== descriptorId)
      : [...selectedDescriptors, descriptorId];

    setSelectedDescriptors(updated);
    onChange({
      descriptors: updated,
      score,
      notes
    });
  };

  const handleScoreChange = (newScore) => {
    setScore(newScore);
    onChange({
      descriptors: selectedDescriptors,
      score: newScore,
      notes
    });
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onChange({
      descriptors: selectedDescriptors,
      score,
      notes: newNotes
    });
  };

  return (
    <div className="mood-selector">
      <div className="mood-selector__section">
        <h3 className="mood-selector__title">How are you feeling?</h3>
        <div className="mood-descriptors">
          {MOOD_DESCRIPTORS.map((descriptor) => (
            <button
              key={descriptor.id}
              type="button"
              className={`mood-chip ${selectedDescriptors.includes(descriptor.id) ? 'mood-chip--active' : ''}`}
              style={{
                '--chip-color': descriptor.color
              }}
              onClick={() => handleDescriptorToggle(descriptor.id)}
            >
              <span className="mood-chip__emoji">{descriptor.emoji}</span>
              <span className="mood-chip__label">{descriptor.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mood-selector__section">
        <h3 className="mood-selector__title">
          Overall mood: {MOOD_SCALE[score].label} {MOOD_SCALE[score].emoji}
        </h3>
        <div className="mood-slider">
          <input
            type="range"
            min="1"
            max="5"
            value={score}
            onChange={(e) => handleScoreChange(Number(e.target.value))}
            className="mood-slider__input"
          />
          <div className="mood-slider__labels">
            {Object.entries(MOOD_SCALE).map(([key, value]) => (
              <span key={key} className="mood-slider__label">
                {value.emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mood-selector__section">
        <label className="mood-selector__label">
          Additional notes (optional)
        </label>
        <textarea
          className="mood-selector__textarea"
          placeholder="What's on your mind?"
          value={notes}
          onChange={handleNotesChange}
          rows={3}
        />
      </div>
    </div>
  );
};

export default MoodSelector;
