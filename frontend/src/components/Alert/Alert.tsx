// Reusable Alert Component

import React from 'react';
import './Alert.css';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  details?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type, message, details, onClose }) => {
  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">{icons[type]}</span>
        <div className="alert-text">
          <div className="alert-message">{message}</div>
          {details && <div className="alert-details">{details}</div>}
        </div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      )}
    </div>
  );
};

