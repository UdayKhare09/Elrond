// Login Component

import React, { useState } from 'react';
import { authApi, ApiError } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';
import { Alert, type AlertType } from '../Alert/Alert';
import type { LoginRequest } from '../../types/api.types';
import './Login.css';

export const Login: React.FC = () => {
  const { login, setMfaToken } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    usernameOrEmail: '',
    password: '',
    totpCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [alert, setAlert] = useState<{ type: AlertType; message: string; details?: string } | null>(
    null,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await authApi.login(formData);

      if (response.mfaRequired) {
        setMfaToken(response.token);
        setAlert({
          type: 'warning',
          message: '🔐 MFA Required',
          details:
            'Please enter your 6-digit MFA code in the field above and login again.\nYour MFA verification is pending.',
        });
      } else {
        login(formData.usernameOrEmail, response.token);
        setAlert({
          type: 'success',
          message: `✓ Welcome back, ${formData.usernameOrEmail}!`,
          details: 'Login successful',
        });
        setFailedAttempts(0);
        setFormData({ usernameOrEmail: '', password: '', totpCode: '' });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);

        const isLocked = error.errorResponse.message?.includes('locked');

        setAlert({
          type: 'error',
          message: isLocked ? '🔒 Account Locked' : 'Login failed',
          details: isLocked
            ? `${error.errorResponse.message}\n\nYour account will be automatically unlocked after 15 minutes.`
            : `${error.errorResponse.message}\n\nFailed attempts: ${newFailedAttempts}/5`,
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
    <div className="login-container">
      <h2>🔑 Login</h2>
      <div className="info-box">
        Login with your username or email. If MFA is enabled, provide the 6-digit code.
      </div>

      {failedAttempts >= 3 && (
        <div className="warning-box">
          ⚠️ Warning: Multiple failed login attempts will lock your account for 15 minutes.
        </div>
      )}

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          details={alert.details}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="usernameOrEmail">Username or Email *</label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            required
            placeholder="username or email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="totpCode">MFA Code (if enabled)</label>
          <input
            type="text"
            id="totpCode"
            name="totpCode"
            value={formData.totpCode}
            onChange={handleChange}
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder="123456"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

