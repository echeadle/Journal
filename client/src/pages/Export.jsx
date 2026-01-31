import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './Export.css';

const Export = () => {
  const navigate = useNavigate();

  return (
    <div className="export">
      <div className="export__container">
        <header className="export__header">
          <h1 className="export__title">Export Your Journal</h1>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </header>

        <div className="export__placeholder">
          <p>Export functionality coming in Phase 5!</p>
          <p>You'll be able to generate PDF and Excel reports here.</p>
        </div>
      </div>
    </div>
  );
};

export default Export;
