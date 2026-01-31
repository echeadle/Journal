import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './Review.css';

const Review = () => {
  const navigate = useNavigate();

  return (
    <div className="review">
      <div className="review__container">
        <header className="review__header">
          <h1 className="review__title">Review & Visualizations</h1>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </header>

        <div className="review__placeholder">
          <p>Visualization and charts coming in Phase 4!</p>
          <p>This page will show mood trends, energy patterns, and timeline views.</p>
        </div>
      </div>
    </div>
  );
};

export default Review;
