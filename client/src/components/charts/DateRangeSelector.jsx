import React from 'react';
import './DateRangeSelector.css';

const DateRangeSelector = ({ entries, selectedRange, onRangeChange }) => {
  if (!entries || entries.length === 0) return null;

  const allDates = entries.map(e => e.date);
  const minDate = allDates[0];
  const maxDate = allDates[allDates.length - 1];

  const handleReset = () => {
    onRangeChange({ startDate: null, endDate: null, preset: 'all' });
  };

  const handleCustomDateChange = (field, value) => {
    onRangeChange({
      ...selectedRange,
      [field]: value,
      preset: 'custom'
    });
  };

  const handleDateChange = (field, value) => {
    onRangeChange({
      ...selectedRange,
      [field]: value,
      preset: 'custom'
    });
  };

  const isFiltered = selectedRange.startDate || selectedRange.endDate;

  return (
    <div className="date-range-selector">
      <span className="date-range-selector__label-text">Filter by date:</span>

      <div className="date-range-selector__inputs">
        <label className="date-range-selector__label">
          From:
          <input
            type="date"
            className="date-range-selector__input"
            value={selectedRange.startDate || minDate}
            min={minDate}
            max={selectedRange.endDate || maxDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
          />
        </label>
        <label className="date-range-selector__label">
          To:
          <input
            type="date"
            className="date-range-selector__input"
            value={selectedRange.endDate || maxDate}
            min={selectedRange.startDate || minDate}
            max={maxDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
          />
        </label>

        {isFiltered && (
          <button
            className="date-range-selector__reset"
            onClick={handleReset}
            title="Show all days"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default DateRangeSelector;
