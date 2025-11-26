// Register Component

import React, { useState } from 'react';
import { authApi, ApiError } from '../../services/api.service';
import { Alert, type AlertType } from '../Alert/Alert';
import type { RegisterRequest } from '../../types/api.types';
import './Register.css';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
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
      await authApi.register(formData);
      setAlert({
        type: 'success',
        message: 'Registration successful!',
        details:
          'Please check your email for the verification link. You can also find the token in the server logs for testing.',
      });
      setFormData({
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setAlert({
          type: 'error',
          message: 'Registration failed',
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
    <div className="register-container">
      <h2>📝 Register</h2>
      <div className="info-box">
        Create a new account. All fields are required except Last Name.
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          details={alert.details}
          onClose={() => setAlert(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={50}
            placeholder="username (3-50 characters)"
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
            minLength={8}
            placeholder="Strong password required"
          />
          <div className="password-requirements">
            <strong>Password Requirements:</strong>
            <ul>
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter (A-Z)</li>
              <li>At least one lowercase letter (a-z)</li>
              <li>At least one digit (0-9)</li>
              <li>At least one special character (!@#$%^&*)</li>
            </ul>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="First Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name (Optional)"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

