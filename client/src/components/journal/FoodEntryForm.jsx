import React, { useState } from 'react';
import { FOOD_TYPES } from '../../utils/constants';
import Button from '../common/Button';
import './FoodEntryForm.css';

const FoodEntryForm = ({ onSubmit, initialData = null }) => {
  const [type, setType] = useState(initialData?.type || 'FIRST_MEAL');
  const [foodsInput, setFoodsInput] = useState(
    initialData?.foods ? initialData.foods.join(', ') : ''
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isBreakingFast, setIsBreakingFast] = useState(initialData?.isBreakingFast || false);
  const [isLastMeal, setIsLastMeal] = useState(initialData?.isLastMeal || false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const foods = foodsInput
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (foods.length === 0) return;

    onSubmit({
      type,
      foods,
      notes,
      isBreakingFast,
      isLastMeal
    });

    // Reset form if no initial data (new entry)
    if (!initialData) {
      setFoodsInput('');
      setNotes('');
      setIsBreakingFast(false);
      setIsLastMeal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="food-entry-form">
      <div className="food-entry-form__field">
        <label className="food-entry-form__label">Meal type</label>
        <select
          className="food-entry-form__select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {Object.entries(FOOD_TYPES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="food-entry-form__field">
        <label className="food-entry-form__label">
          What did you eat? (separate with commas)
        </label>
        <input
          type="text"
          className="food-entry-form__input"
          placeholder="e.g., oatmeal, banana, coffee"
          value={foodsInput}
          onChange={(e) => setFoodsInput(e.target.value)}
          required
        />
      </div>

      <div className="food-entry-form__checkboxes">
        <label className="food-entry-form__checkbox">
          <input
            type="checkbox"
            checked={isBreakingFast}
            onChange={(e) => setIsBreakingFast(e.target.checked)}
          />
          <span>This is breaking my fast</span>
        </label>

        <label className="food-entry-form__checkbox">
          <input
            type="checkbox"
            checked={isLastMeal}
            onChange={(e) => setIsLastMeal(e.target.checked)}
          />
          <span>This is my last meal of the day</span>
        </label>
      </div>

      <div className="food-entry-form__field">
        <label className="food-entry-form__label">Notes (optional)</label>
        <textarea
          className="food-entry-form__textarea"
          placeholder="Any observations about this meal?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" variant="primary" fullWidth>
        {initialData ? 'Update Food Entry' : 'Add Food Entry'}
      </Button>
    </form>
  );
};

export default FoodEntryForm;
