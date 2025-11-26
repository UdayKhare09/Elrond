// Email Verification Component

import React, { useState } from 'react';
import { authApi, ApiError } from '../../services/api.service';
import { Alert, type AlertType } from '../Alert/Alert';
import './VerifyEmail.css';

export const VerifyEmail: React.FC = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; message: string; details?: string } | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setAlert({
        type: 'warning',
        message: 'Please enter a verification token',
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      await authApi.verifyEmail(token);
      setAlert({
        type: 'success',
        message: '✓ Email verified successfully!',
        details: 'Your account is now active. You can login using the form above.',
      });
      setToken('');
    } catch (error) {
      if (error instanceof ApiError) {
        setAlert({
          type: 'error',
          message: 'Verification failed',
          details: error.errorResponse.message,
        });
      } else {
        setAlert({
          type: 'error',
          message: 'Network error',
          details: 'Unable to connect to server',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <h2>✉️ Verify Email</h2>
      <div className="info-box">
        After registration, check your email (or server logs) for the verification token.
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          details={alert.details}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="verify-email-form">
        <div className="form-group">
          <label htmlFor="token">Verification Token *</label>
          <input
            type="text"
            id="token"
            name="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            placeholder="Enter verification token from email"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
};

